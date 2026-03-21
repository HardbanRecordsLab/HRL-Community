from fastapi import FastAPI, HTTPException, Header, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import httpx
import os
import time

app = FastAPI(title="HRL Community API", version="1.0.0")

ACCESS_MANAGER_URL = os.getenv("ACCESS_MANAGER_URL", "http://hrl-webhook-hub-backend:9107")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "community", "arch": "Unified HRL"}

@app.post("/api/posts/create")
async def create_post(data: dict, authorization: str = Header(None)):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="User email required")

    # Community post might be free or cost very little (0 credits for now, just verification)
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{ACCESS_MANAGER_URL}/api/auth/profile", params={"email": email})
        if resp.status_code != 200:
            raise HTTPException(status_code=403, detail="HRL Account required for community posting")

    return {"status": "success", "message": "Post created in HRL Community"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=9106, reload=True)
