from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from auth import router as auth_router
from dotenv import load_dotenv
import os
import uvicorn

# ✅ Load .env
load_dotenv()

app = FastAPI()

# ✅ Secret key from .env
SECRET_KEY = os.getenv("SECRET_KEY")

app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

app.include_router(auth_router)


@app.get("/")
def home():
    return {"message": "Backend running"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
