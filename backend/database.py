import os

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

mongodb_uri = os.getenv("MONGODB_URI")
mongodb_database = os.getenv("MONGODB_DATABASE", "receptbanken")

if not mongodb_uri:
    raise RuntimeError("MONGODB_URI is not configured. Copy .env.example to .env.")

client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
database = client[mongodb_database]


def check_database_connection() -> bool:
    client.admin.command("ping")
    return True