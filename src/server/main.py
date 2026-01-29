"""
Wrapper script for running FastAPI server
This will be the entry point for PyInstaller
"""
import sys
import uvicorn
from app import app

if __name__ == "__main__":
    # Parse command line arguments
    host = "0.0.0.0"
    port = 8000
    
    args = sys.argv[1:]
    for i, arg in enumerate(args):
        if arg == "--host" and i + 1 < len(args):
            host = args[i + 1]
        elif arg == "--port" and i + 1 < len(args):
            port = int(args[i + 1])
    
    print(f"Starting server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
