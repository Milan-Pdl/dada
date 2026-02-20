import os

# expose the FastAPI application for buildpacks that look for an 'app' symbol
from backend.app.main import app

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
