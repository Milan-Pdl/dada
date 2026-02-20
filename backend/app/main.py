from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, startups, talent, investors, matching

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NepLaunch API",
    description="Three-sided intelligent platform connecting Nepal's founders, investors, and talent",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(startups.router)
app.include_router(talent.router)
app.include_router(investors.router)
app.include_router(matching.router)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to NepLaunch API",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/api/health"
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "platform": "NepLaunch"}
