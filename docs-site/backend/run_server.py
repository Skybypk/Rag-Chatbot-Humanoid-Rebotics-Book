#!/usr/bin/env python3
"""
Script to run the backend server for the Humanoid Robotics Book RAG API
"""
import uvicorn
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("Starting Humanoid Robotics Book RAG API server...")
    print("Server will be available at http://localhost:8000")
    print("Press Ctrl+C to stop the server")

    # Run the FastAPI application with uvicorn
    uvicorn.run(
        "main:app",  # Import the 'app' object from main.py
        host="0.0.0.0",  # Listen on all available network interfaces
        port=8000,       # Port 8000 to match the frontend configuration
        reload=True,     # Enable auto-reload on code changes (development)
        log_level="info" # Set log level to info
    )