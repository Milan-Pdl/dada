import os
import sys

# ensure backend is on path so `app` package imports work
sys.path.insert(0, os.path.join(os.getcwd(), "backend"))

from backend.app.main import app

# Vercel will automatically use the ASGI `app` object when this file is
# deployed as a Python Serverless Function.  No explicit handler is required.

# For AWS-style adapters you could wrap with Mangum, but Vercel's runtime
# is already ASGI‑compatible.
