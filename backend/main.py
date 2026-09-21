from fastapi import FastAPI, HTTPException

from .database import check_database_connection

app = FastAPI(title="Receptbanken API")


@app.get("/health")
def health_check() -> dict[str, str]:
    try:
        check_database_connection()
    except Exception as error:
        raise HTTPException(status_code=503, detail="MongoDB is unavailable") from error

    return {"status": "ok", "database": "connected"}