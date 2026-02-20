import os
import sys

# ensure the `backend` directory is on sys.path so `app` becomes a top-level package
sys.path.insert(0, os.path.join(os.getcwd(), "backend"))

# expose the FastAPI application for buildpacks that look for an 'app' symbol
from backend.app.main import app

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
