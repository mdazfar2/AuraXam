import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("DATABASE_URL")

client = MongoClient(MONGO_URL)

db = client["auraxam"]  # database name
users_collection = db["users"]
