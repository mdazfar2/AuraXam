import os
from fastapi import APIRouter, Request
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
from fastapi.responses import RedirectResponse
from jose import jwt
from database import users_collection

load_dotenv()

router = APIRouter()

oauth = OAuth()

oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

SECRET_KEY = os.getenv("SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL")


@router.get("/login")
async def login(request: Request):
    redirect_uri = request.url_for('auth_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback")
async def auth_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    email = user_info["email"]
    name = user_info["name"]
    picture = user_info["picture"]

    # 🔥 MongoDB me check
    user = users_collection.find_one({"email": email})

    if not user:
        users_collection.insert_one({
            "email": email,
            "name": name,
            "picture": picture
        })

    jwt_token = jwt.encode({"email": email}, SECRET_KEY, algorithm="HS256")

    return RedirectResponse(f"{FRONTEND_URL}/?token={jwt_token}")
