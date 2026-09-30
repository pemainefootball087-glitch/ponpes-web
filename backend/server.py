from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, UploadFile, File, Header, Query, Depends
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import io
import csv
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, List

from pydantic import BaseModel, Field

import auth as auth_mod
import storage as storage_mod
from seed_data import seed_content

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Pulo Melati PSB API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

ALLOWED_EXT = {"jpg", "jpeg", "png", "pdf"}
ALLOWED_MIME = {"image/jpeg", "image/png", "application/pdf"}
MAGIC = {b"\xff\xd8\xff": "image/jpeg", b"\x89PNG": "image/png", b"%PDF": "application/pdf"}
MAX_SIZE = 5 * 1024 * 1024


async def require_admin(request: Request) -> dict:
    return await auth_mod.get_current_user(request, db)


def clean(doc: dict) -> dict:
    doc.pop("_id", None)
    return doc


def slugify(title: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return s or uuid.uuid4().hex[:8]


# ----------------- PUBLIC CONTENT -----------------
@api_router.get("/")
async def root():
    return {"message": "Pondok Pesantren Pulo Melati API"}


@api_router.get("/content/stats")
async def get_stats():
    return await db.stats.find({}, {"_id": 0}).to_list(100)


@api_router.get("/content/programs")
async def get_programs():
    return await db.programs.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api_router.get("/content/gallery")
async def get_gallery(category: Optional[str] = None):
    q = {} if not category or category == "Semua" else {"category": category}
    return await db.gallery.find(q, {"_id": 0}).sort("created_at", -1).to_list(1000)


@api_router.get("/content/teachers")
async def get_teachers():
    return await db.teachers.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api_router.get("/content/testimonials")
async def get_testimonials():
    return await db.testimonials.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api_router.get("/psb/settings")
async def get_psb_settings():
    doc = await db.settings.find_one({"key": "psb"}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Settings not found")
    return doc


@api_router.get("/news")
async def list_news():
    return await db.news.find({"published": True}, {"_id": 0, "content": 0}).sort("date", -1).to_list(1000)


@api_router.get("/news/{slug}")
async def get_news(slug: str):
    doc = await db.news.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Artikel tidak ditemukan")
    return doc


# ----------------- FILE UPLOAD (public, strict) -----------------
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    data = await file.read()
    if len(data) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="Ukuran file maksimal 5MB.")
    if len(data) == 0:
        raise HTTPException(status_code=400, detail="File kosong.")
    ext = (file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "")
    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail="Hanya file JPG, PNG, atau PDF yang diperbolehkan.")
    detected = next((m for magic, m in MAGIC.items() if data.startswith(magic)), None)
    if detected is None or detected not in ALLOWED_MIME:
        raise HTTPException(status_code=400, detail="Tipe file tidak valid atau rusak.")
    fid = str(uuid.uuid4())
    path = f"{storage_mod.APP_NAME}/psb-docs/{fid}.{ext}"
    try:
        result = storage_mod.put_object(path, data, detected)
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=502, detail="Gagal mengunggah file. Coba lagi.")
    await db.files.insert_one({
        "id": fid, "storage_path": result["path"], "original_filename": file.filename,
        "content_type": detected, "size": result.get("size", len(data)), "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat()})
    return {"id": fid, "path": result["path"], "filename": file.filename}


@api_router.get("/files/{path:path}")
async def download_file(path: str, request: Request, authorization: str = Header(None), auth: str = Query(None)):
    # Admin-only: applicant documents are private
    if auth and not authorization:
        request.scope["headers"].append((b"authorization", f"Bearer {auth}".encode()))
    await auth_mod.get_current_user(request, db)
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File tidak ditemukan")
    try:
        data, ct = storage_mod.get_object(path)
    except Exception as e:
        logger.error(f"Download failed: {e}")
        raise HTTPException(status_code=502, detail="Gagal mengambil file")
    return Response(content=data, media_type=record.get("content_type", ct))


# ----------------- PSB REGISTRATION (public) -----------------
class RegistrationBody(BaseModel):
    nama_lengkap: str
    nik: str
    jenis_kelamin: str
    tempat_tanggal_lahir: str
    program_tujuan: str
    asal_sekolah: str
    nama_wali: str
    nomor_whatsapp: str
    alamat_domisili: str
    hafalan_sekarang: str
    catatan_kesehatan: Optional[str] = ""
    documents: List[dict] = Field(default_factory=list)
    website: Optional[str] = ""  # honeypot


_rate: dict = {}


@api_router.post("/psb/register")
async def register_santri(body: RegistrationBody, request: Request):
    if body.website:
        raise HTTPException(status_code=400, detail="Pendaftaran tidak valid.")
    settings = await db.settings.find_one({"key": "psb"})
    if settings and not settings.get("registration_open", True):
        raise HTTPException(status_code=403, detail="Pendaftaran sedang ditutup untuk saat ini.")
    ip = request.client.host if request.client else "unknown"
    now = datetime.now(timezone.utc)
    recent = [t for t in _rate.get(ip, []) if (now - t).total_seconds() < 3600]
    if len(recent) >= 5:
        raise HTTPException(status_code=429, detail="Terlalu banyak pendaftaran dari perangkat ini. Coba lagi nanti.")
    recent.append(now)
    _rate[ip] = recent

    wa = re.sub(r"\D", "", body.nomor_whatsapp)
    dup = await db.registrations.find_one({"$or": [{"nomor_whatsapp": wa}, {"nama_lengkap": body.nama_lengkap}]})
    year = now.year
    ctr = await db.counters.find_one_and_update(
        {"_id": f"psb-{year}"}, {"$inc": {"seq": 1}},
        upsert=True, return_document=True)
    reg_no = f"PSB-{year}-{(ctr['seq'] + 88):03d}"
    doc = body.model_dump()
    doc.pop("website", None)
    doc.update({
        "id": str(uuid.uuid4()), "reg_no": reg_no, "nomor_whatsapp": wa, "status": "Pending",
        "is_duplicate": bool(dup), "created_at": now.isoformat()})
    await db.registrations.insert_one(doc)
    return {"reg_no": reg_no, "nama_lengkap": body.nama_lengkap, "is_duplicate": bool(dup),
            "whatsapp_number": (settings or {}).get("whatsapp_number", "6281234567890")}


# ----------------- ADMIN: REGISTRATIONS -----------------
@api_router.get("/admin/registrations")
async def admin_list_registrations(status: Optional[str] = None, q: Optional[str] = None,
                                    admin: dict = Depends(require_admin)):
    query = {}
    if status and status != "Semua":
        query["status"] = status
    if q:
        query["$or"] = [{"nama_lengkap": {"$regex": q, "$options": "i"}},
                        {"nomor_whatsapp": {"$regex": re.sub(r'\D', '', q)}},
                        {"reg_no": {"$regex": q, "$options": "i"}}]
    return await db.registrations.find(query, {"_id": 0}).sort("created_at", -1).to_list(2000)


class StatusBody(BaseModel):
    status: str


@api_router.patch("/admin/registrations/{reg_id}/status")
async def admin_update_status(reg_id: str, body: StatusBody, admin: dict = Depends(require_admin)):
    valid = {"Pending", "Terverifikasi", "Ujian Masuk", "Diterima", "Ditolak"}
    if body.status not in valid:
        raise HTTPException(status_code=400, detail="Status tidak valid")
    res = await db.registrations.update_one({"id": reg_id}, {"$set": {"status": body.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pendaftar tidak ditemukan")
    return {"message": "Status diperbarui"}


@api_router.delete("/admin/registrations/{reg_id}")
async def admin_delete_registration(reg_id: str, admin: dict = Depends(require_admin)):
    await db.registrations.delete_one({"id": reg_id})
    return {"message": "Pendaftar dihapus"}


@api_router.get("/admin/registrations/export")
async def admin_export(request: Request, auth: str = Query(None)):
    if auth:
        request.scope["headers"].append((b"authorization", f"Bearer {auth}".encode()))
    await auth_mod.get_current_user(request, db)
    rows = await db.registrations.find({}, {"_id": 0, "documents": 0}).sort("created_at", -1).to_list(5000)
    buf = io.StringIO()
    cols = ["reg_no", "nama_lengkap", "nik", "jenis_kelamin", "tempat_tanggal_lahir", "program_tujuan",
            "asal_sekolah", "nama_wali", "nomor_whatsapp", "alamat_domisili", "hafalan_sekarang",
            "catatan_kesehatan", "status", "created_at"]
    w = csv.DictWriter(buf, fieldnames=cols, extrasaction="ignore")
    w.writeheader()
    for r in rows:
        w.writerow(r)
    return Response(content=buf.getvalue(), media_type="text/csv",
                    headers={"Content-Disposition": "attachment; filename=pendaftar_psb.csv"})


# ----------------- ADMIN: GENERIC CRUD -----------------
def crud_routes(name: str, collection: str, sort_field: str = "order"):
    @api_router.post(f"/admin/{name}", name=f"create_{name}")
    async def create_item(request: Request, admin: dict = Depends(require_admin)):
        body = await request.json()
        body["id"] = str(uuid.uuid4())
        if name == "news":
            body["slug"] = slugify(body.get("title", "")) + "-" + body["id"][:6]
            body.setdefault("published", True)
            body.setdefault("date", datetime.now(timezone.utc).date().isoformat())
        body["created_at"] = datetime.now(timezone.utc).isoformat()
        await db[collection].insert_one(dict(body))
        return clean(body)

    @api_router.put(f"/admin/{name}/{{item_id}}", name=f"update_{name}")
    async def update_item(item_id: str, request: Request, admin: dict = Depends(require_admin)):
        body = await request.json()
        body.pop("_id", None)
        body.pop("id", None)
        res = await db[collection].update_one({"id": item_id}, {"$set": body})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Item tidak ditemukan")
        doc = await db[collection].find_one({"id": item_id}, {"_id": 0})
        return doc

    @api_router.delete(f"/admin/{name}/{{item_id}}", name=f"delete_{name}")
    async def delete_item(item_id: str, admin: dict = Depends(require_admin)):
        await db[collection].delete_one({"id": item_id})
        return {"message": "Item dihapus"}


crud_routes("news", "news")
crud_routes("gallery", "gallery")
crud_routes("programs", "programs")
crud_routes("teachers", "teachers")
crud_routes("testimonials", "testimonials")


# ----------------- ADMIN: STATS & PSB SETTINGS -----------------
@api_router.put("/admin/stats/{key}")
async def update_stat(key: str, request: Request, admin: dict = Depends(require_admin)):
    body = await request.json()
    body.pop("_id", None)
    await db.stats.update_one({"key": key}, {"$set": {"value": body.get("value"), "label": body.get("label")}})
    doc = await db.stats.find_one({"key": key}, {"_id": 0})
    return doc


@api_router.put("/admin/psb-settings")
async def update_psb_settings(request: Request, admin: dict = Depends(require_admin)):
    body = await request.json()
    body.pop("_id", None)
    body["key"] = "psb"
    await db.settings.update_one({"key": "psb"}, {"$set": body})
    return await db.settings.find_one({"key": "psb"}, {"_id": 0})


# ----------------- STARTUP -----------------
@app.on_event("startup")
async def startup():
    await auth_mod.create_auth_indexes(db)
    await auth_mod.seed_admin(db)
    await seed_content(db)
    try:
        storage_mod.init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


app.include_router(auth_mod.build_auth_router(db), prefix="/api")
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000"), "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
