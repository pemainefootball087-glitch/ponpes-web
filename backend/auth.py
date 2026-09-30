import os
import jwt
import bcrypt
import secrets
import hashlib
import logging
from datetime import datetime, timezone, timedelta
from html import escape
from urllib.parse import urlparse

import httpx
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Request, Response, BackgroundTasks
from pydantic import BaseModel, EmailStr

logger = logging.getLogger(__name__)

JWT_ALGORITHM = "HS256"
LOCKOUT_THRESHOLD = 5
LOCKOUT_MINUTES = 15
RESET_WINDOW_SECONDS = 900
RESET_MAX_PER_EMAIL = 5

EMAIL_BASE_URL = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip().rstrip("/") or "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME") or "Pondok Pesantren"


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str, token_version: int = 0) -> str:
    payload = {"sub": user_id, "email": email, "ver": token_version,
               "exp": datetime.now(timezone.utc) + timedelta(minutes=15), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str, token_version: int = 0) -> str:
    payload = {"sub": user_id, "ver": token_version,
               "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


def _set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=900, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")


async def get_current_user(request: Request, db) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        if payload.get("ver", 0) != user.get("token_version", 0):
            raise HTTPException(status_code=401, detail="Session expired")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


async def send_password_reset_email(to_email: str, token: str) -> bool:
    base = os.environ.get("FRONTEND_URL", "").rstrip("/")
    link = f"{base}/reset-password?token={token}"
    if not EMAIL_KEY or EMAIL_KEY.startswith("{") or not base.startswith("https://"):
        if urlparse(base).hostname in ("localhost", "127.0.0.1", "::1"):
            logger.warning("Email not configured; password reset link: %s", link)
        else:
            logger.error("Password reset email not configured (EMERGENT_EMAIL_KEY / FRONTEND_URL)")
        return False
    brand = escape(EMAIL_FROM_NAME)
    html = (
        f'<table role="presentation" width="100%"><tr><td style="padding:24px;font-family:Arial,sans-serif">'
        f'<p>Kami menerima permintaan reset kata sandi akun {brand} Anda.</p>'
        f'<p><a href="{escape(link)}">Reset kata sandi Anda</a></p>'
        f'<p>Tautan ini kedaluwarsa dalam 1 jam dan hanya dapat digunakan sekali. Abaikan email ini bila Anda tidak memintanya.</p>'
        f'<p style="font-size:12px;color:#888">Dikirim oleh {brand}.</p>'
        f'</td></tr></table>'
    )
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json={"to": [to_email], "subject": f"Reset kata sandi {EMAIL_FROM_NAME}",
                      "html": html, "from_name": EMAIL_FROM_NAME},
            )
        resp.raise_for_status()
        return True
    except Exception as e:
        logger.error(f"Password reset email failed: {e}")
        return False


class LoginBody(BaseModel):
    email: EmailStr
    password: str


class ForgotBody(BaseModel):
    email: EmailStr


class ResetBody(BaseModel):
    token: str
    password: str


GENERIC_RESET_MSG = {"message": "Jika email terdaftar, tautan reset telah dikirim."}


def build_auth_router(db) -> APIRouter:
    router = APIRouter(prefix="/auth")

    async def _locked_out(identifier: str) -> bool:
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=LOCKOUT_MINUTES)
        count = await db.login_attempts.count_documents(
            {"identifier": identifier, "created_at": {"$gt": cutoff.isoformat()}})
        return count >= LOCKOUT_THRESHOLD

    @router.post("/login")
    async def login(body: LoginBody, request: Request, response: Response):
        email = body.email.lower()
        ip = request.client.host if request.client else "unknown"
        identifier = f"{ip}:{email}"
        if await _locked_out(identifier):
            raise HTTPException(status_code=429, detail="Terlalu banyak percobaan. Coba lagi dalam 15 menit.")
        user = await db.users.find_one({"email": email})
        if not user or not verify_password(body.password, user["password_hash"]):
            await db.login_attempts.insert_one({"identifier": identifier, "email": email,
                                                "created_at": datetime.now(timezone.utc).isoformat()})
            raise HTTPException(status_code=401, detail="Email atau kata sandi salah.")
        await db.login_attempts.delete_many({"identifier": identifier})
        uid = str(user["_id"])
        ver = user.get("token_version", 0)
        _set_auth_cookies(response, create_access_token(uid, email, ver), create_refresh_token(uid, ver))
        return {"id": uid, "email": email, "name": user.get("name", "Admin"), "role": user.get("role", "admin")}

    @router.post("/logout")
    async def logout(response: Response):
        response.delete_cookie("access_token", path="/")
        response.delete_cookie("refresh_token", path="/")
        return {"message": "Logged out"}

    @router.get("/me")
    async def me(request: Request):
        user = await get_current_user(request, db)
        return {"id": user["_id"], "email": user["email"], "name": user.get("name", "Admin"),
                "role": user.get("role", "admin")}

    @router.post("/refresh")
    async def refresh(request: Request, response: Response):
        token = request.cookies.get("refresh_token")
        if not token:
            raise HTTPException(status_code=401, detail="Not authenticated")
        try:
            payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
            if payload.get("type") != "refresh":
                raise HTTPException(status_code=401, detail="Invalid token type")
            user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
            if not user or payload.get("ver", 0) != user.get("token_version", 0):
                raise HTTPException(status_code=401, detail="Session expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")
        uid = str(user["_id"])
        ver = user.get("token_version", 0)
        response.set_cookie("access_token", create_access_token(uid, user["email"], ver),
                            httponly=True, secure=True, samesite="none", max_age=900, path="/")
        return {"message": "refreshed"}

    @router.post("/forgot-password")
    async def forgot_password(body: ForgotBody, background_tasks: BackgroundTasks):
        email = body.email.lower()
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(seconds=RESET_WINDOW_SECONDS)
        await db.password_reset_requests.insert_one({"email": email, "created_at": now.isoformat()})
        recent = await db.password_reset_requests.count_documents(
            {"email": email, "created_at": {"$gt": cutoff.isoformat()}})
        if recent > RESET_MAX_PER_EMAIL:
            return GENERIC_RESET_MSG
        user = await db.users.find_one({"email": email})
        if not user:
            return GENERIC_RESET_MSG
        raw = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw.encode()).hexdigest()
        await db.password_reset_tokens.insert_one({
            "token_hash": token_hash, "user_id": str(user["_id"]), "email": email,
            "expires_at": (now + timedelta(hours=1)).isoformat(), "used": False})
        background_tasks.add_task(send_password_reset_email, user["email"], raw)
        return GENERIC_RESET_MSG

    @router.post("/reset-password")
    async def reset_password(body: ResetBody):
        token_hash = hashlib.sha256(body.token.encode()).hexdigest()
        now_iso = datetime.now(timezone.utc).isoformat()
        doc = await db.password_reset_tokens.find_one_and_update(
            {"token_hash": token_hash, "used": False, "expires_at": {"$gt": now_iso}},
            {"$set": {"used": True}})
        if not doc:
            raise HTTPException(status_code=400, detail="Tautan reset tidak valid atau kedaluwarsa.")
        email = doc["email"]
        await db.users.update_one({"_id": ObjectId(doc["user_id"])},
                                  {"$set": {"password_hash": hash_password(body.password)},
                                   "$inc": {"token_version": 1}})
        await db.password_reset_tokens.delete_many({"user_id": doc["user_id"], "used": False})
        await db.login_attempts.delete_many({"email": email})
        return {"message": "Kata sandi berhasil diperbarui."}

    return router


async def seed_admin(db):
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    admin_name = os.environ.get("ADMIN_NAME", "Admin")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({"email": admin_email, "password_hash": hash_password(admin_password),
                                   "name": admin_name, "role": "admin", "token_version": 0,
                                   "created_at": datetime.now(timezone.utc).isoformat()})
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email},
                                  {"$set": {"password_hash": hash_password(admin_password)}})


async def create_auth_indexes(db):
    await db.users.create_index("email", unique=True)
    await db.password_reset_tokens.create_index("expires_at")
    await db.password_reset_tokens.create_index("token_hash", unique=True)
    await db.login_attempts.create_index("email")
    await db.login_attempts.create_index("identifier")
    await db.password_reset_requests.create_index("email")
