import subprocess
import sys
import time
import os

# Kill any existing Python HTTP server on port 8000
print("Stopping existing server on port 8000...")
try:
    # Windows command to find and kill process on port 8000
    if sys.platform == "win32":
        result = subprocess.run(
            'netstat -ano | findstr ":8000"',
            shell=True,
            capture_output=True,
            text=True
        )
        if result.stdout:
            # Extract PID and kill it
            lines = result.stdout.strip().split('\n')
            pids_killed = set()
            for line in lines:
                if 'LISTENING' in line:
                    parts = line.split()
                    if len(parts) >= 5:
                        pid = parts[-1]
                        if pid not in pids_killed:
                            try:
                                subprocess.run(["taskkill", "/F", "/PID", pid], capture_output=True)
                                print(f"Killed process {pid}")
                                pids_killed.add(pid)
                            except:
                                pass
            if not pids_killed:
                print("No processes found on port 8000")
    else:
        # Linux/Mac command
        result = subprocess.run(
            "lsof -ti:8000 | xargs kill -9",
            shell=True,
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print("Killed processes on port 8000")
except Exception as e:
    print(f"Error stopping server: {e}")

# Wait a moment for port to be released
time.sleep(1)

# Change to project root directory
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(project_root)

# Start the server
print("Starting server on port 8000...")
print(f"Project root: {project_root}")
print("Server running at http://localhost:8000")
print("Press Ctrl+C to stop the server")
process = subprocess.Popen(
    [sys.executable, "-m", "http.server", "8000"],
    cwd=project_root
)
print(f"Server started with PID: {process.pid}")

