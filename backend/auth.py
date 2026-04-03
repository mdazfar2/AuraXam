from fastapi import APIRouter, Request
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
import os
from fastapi.responses import RedirectResponse

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Auth"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL")

oauth = OAuth()

oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

@router.get("/login")
async def login(request: Request):
    redirect_uri = "http://localhost:8000/auth/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback")
async def auth_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = token.get("userinfo")

    name = user["name"]
    email = user["email"]
    picture = user["picture"]

    # ✅ REDIRECT TO FRONTEND WITH DATA
    redirect_url = f"{FRONTEND_URL}/?name={name}&email={email}&picture={picture}"

    return RedirectResponse(url=redirect_url)
