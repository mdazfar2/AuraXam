from fastapi import FastAPI
from auth import router as auth_router
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()

# 🔥 ADD THIS (MANDATORY FOR GOOGLE OAUTH)
app.add_middleware(
    SessionMiddleware,
    secret_key="supersecretkey"  # same as .env SECRET_KEY rakh sakte ho
)

app.include_router(auth_router, prefix="/auth")

@app.get("/")
def root():
    return {"message": "MongoDB Backend Running 🚀"}


# python main.py se run karne ke liye
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
