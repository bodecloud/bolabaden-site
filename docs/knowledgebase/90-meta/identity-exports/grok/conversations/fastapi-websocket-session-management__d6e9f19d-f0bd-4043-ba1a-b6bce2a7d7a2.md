---
source_url: "https://grok.com/c/d6e9f19d-f0bd-4043-ba1a-b6bce2a7d7a2"
conversation_id: "d6e9f19d-f0bd-4043-ba1a-b6bce2a7d7a2"
title: "FastAPI WebSocket Session Management"
extracted_at: "2026-06-29T16:33:16.411Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# FastAPI WebSocket Session Management

Source: [Grok conversation](https://grok.com/c/d6e9f19d-f0bd-4043-ba1a-b6bce2a7d7a2)

## User

_Time: 2025-09-07T12:52:17.284Z_

```python
import os
import random
import string
import subprocess
import time
import socket
import json
import threading
import asyncio
import io
import zipfile
import base64
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse, HTMLResponse, JSONResponse, StreamingResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from urllib.parse import quote
import httpx
import websockets

# Initialize FastAPI app
app = FastAPI()
templates = Jinja2Templates(directory="/tmp/templates")
MAX_SESSIONS = int(os.environ.get("MAX_SESSIONS", "5"))
INACTIVITY_TIMEOUT = int(os.environ.get("INACTIVITY_TIMEOUT", "3600"))

# Track last activity per session to avoid killing active sessions
LAST_ACTIVITY = {}
ACTIVITY_LOCK = threading.Lock()

def mark_activity(session_id: str):
    try:
        with ACTIVITY_LOCK:
            LAST_ACTIVITY[session_id] = time.time()
    except Exception:
        pass

def get_network_name(partial_name):
    output = subprocess.check_output(["docker", "network", "ls", "--format", "{{.Name}}"])
    networks = output.decode().splitlines()
    for net in networks:
        if partial_name in net:
            return net
    return None

def wait_for_port(host, port, timeout=30.0):
    """Wait until a TCP port is open on the given host."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection((host, port), timeout=2):
                return True
        except Exception:
            time.sleep(0.5)
    return False

def get_mapped_host_port(container_name, container_port="3000/tcp"):
    """Return the host port mapped to container_port for a container."""
    try:
        inspect_raw = subprocess.check_output(["docker", "inspect", container_name])
        data = json.loads(inspect_raw)[0]
        ports = data.get("NetworkSettings", {}).get("Ports", {})
        bindings = ports.get(container_port)
        if bindings and len(bindings) > 0:
            host_port = bindings[0].get("HostPort")
            if host_port:
                return int(host_port)
    except Exception:
        pass
    return None

def list_running_session_containers():
    try:
        output = subprocess.check_output([
            "docker", "ps", "-q", "-f", "name=^/kotorscript-"
        ])
        ids = output.decode().split()
        return ids
    except Exception:
        return []

def count_running_sessions():
    return len(list_running_session_containers())

def kill_container(container_name_or_id):
    try:
        subprocess.run(["docker", "rm", "-f", container_name_or_id], check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def parse_docker_time(ts):
    # Docker format examples: '2025-09-07T10:16:19.123456789Z' or '2025-09-07T10:16:19Z'
    if ts.endswith("Z"):
        ts = ts[:-1]
    # Trim nanoseconds to microseconds for Python
    if "." in ts:
        date_part, frac = ts.split(".", 1)
        frac = (frac + "000000")[:6]
        ts = f"{date_part}.{frac}"
        fmt = "%Y-%m-%dT%H:%M:%S.%f"
    else:
        fmt = "%Y-%m-%dT%H:%M:%S"
    try:
        return datetime.strptime(ts, fmt).replace(tzinfo=timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)

def cleanup_stale_sessions():
    try:
        output = subprocess.check_output(["docker", "ps", "-a", "--filter", "name=^/kotorscript-", "--format", "{{.ID}}"])
        ids = output.decode().split()
        now = datetime.now(timezone.utc)
        for cid in ids:
            try:
                inspect_raw = subprocess.check_output(["docker", "inspect", cid])
                data = json.loads(inspect_raw)[0]
                # Determine session_id from container name
                cname = (data.get("Name") or "").lstrip("/")
                sid = cname.replace("kotorscript-", "") if cname.startswith("kotorscript-") else None
                # Use last activity if known, else fall back to start time
                last_activity_ts = None
                if sid:
                    with ACTIVITY_LOCK:
                        last_activity_ts = LAST_ACTIVITY.get(sid)
                if last_activity_ts is None:
                    started_at = data.get("State", {}).get("StartedAt") or data.get("Created")
                    if started_at:
                        started_dt = parse_docker_time(started_at)
                        last_activity_ts = started_dt.timestamp()
                if last_activity_ts is not None:
                    age_sec = time.time() - last_activity_ts
                    if age_sec > INACTIVITY_TIMEOUT:
                        kill_container(cid)
            except Exception:
                continue
    except Exception:
        pass

def start_reaper_thread():
    def loop():
        while True:
            cleanup_stale_sessions()
            time.sleep(30)
    t = threading.Thread(target=loop, daemon=True)
    t.start()

async def proxy_http(request: Request, session_id: str, tail: str):
    # Preserve original subpath (/s/{session_id}/...) as base-path expected by backend
    path = request.url.path
    query = ("?" + request.url.query) if request.url.query else ""
    target = f"http://kotorscript-{session_id}:3000{path}{query}"
    # mark activity for this session
    mark_activity(session_id)
    headers = dict(request.headers)
    headers.pop("host", None)
    body = await request.body()
    async with httpx.AsyncClient(follow_redirects=False, timeout=30.0) as client:
        resp = await client.request(request.method, target, headers=headers, content=body)
        excluded = {"content-encoding", "transfer-encoding", "connection"}
        response_headers = [(k, v) for k, v in resp.headers.items() if k.lower() not in excluded]
        return Response(content=resp.content, status_code=resp.status_code, headers=dict(response_headers))

async def proxy_ws(websocket: WebSocket, session_id: str, tail: str):
    ws_path = websocket.url.path
    ws_query = ("?" + websocket.url.query) if websocket.url.query else ""
    target = f"ws://kotorscript-{session_id}:3000{ws_path}{ws_query}"
    extra_headers = []
    if cookie := websocket.headers.get("cookie"):
        extra_headers.append(("Cookie", cookie))
    if user_agent := websocket.headers.get("user-agent"):
        extra_headers.append(("User-Agent", user_agent))
    origin_hdr = websocket.headers.get("origin")
    subprotocols = None
    if sec_ws_proto := websocket.headers.get("sec-websocket-protocol"):
        subprotocols = [p.strip() for p in sec_ws_proto.split(',') if p.strip()]
    try:
        async with websockets.connect(
            target,
            max_size=None,
            extra_headers=extra_headers,
            subprotocols=subprotocols,
            origin=origin_hdr,
            ping_interval=20,  # Add ping to prevent timeouts
            ping_timeout=30
        ) as upstream:
            selected_subprotocol = upstream.subprotocol
            await websocket.accept(subprotocol=selected_subprotocol)
            mark_activity(session_id)
            async def client_to_upstream():
                try:
                    while True:
                        message = await websocket.receive()
                        data = message.get("bytes") if message.get("bytes") is not None else message.get("text")
                        if data is None:
                            continue
                        mark_activity(session_id)
                        await upstream.send(data)
                except WebSocketDisconnect:
                    pass
                except Exception:
                    pass
            async def upstream_to_client():
                try:
                    async for msg in upstream:
                        mark_activity(session_id)
                        if isinstance(msg, bytes):
                            await websocket.send_bytes(msg)
                        else:
                            await websocket.send_text(msg)
                except Exception:
                    pass
            await asyncio.gather(client_to_upstream(), upstream_to_client())
    except Exception:
        pass
    finally:
        try:
            await websocket.close()
        except Exception:
            pass

@app.get("/capacity")
async def capacity():
    cleanup_stale_sessions()
    current = count_running_sessions()
    return JSONResponse({"current": current, "max": MAX_SESSIONS, "available": current < MAX_SESSIONS})

@app.post("/new")
async def new_session(request: Request):
    # Clean up any stale sessions first
    cleanup_stale_sessions()

    # If user has an existing session cookie, kill that container (allow replacement)
    old_sid = request.cookies.get("ksid") if hasattr(request, 'cookies') else request.headers.get('cookie','').replace('ksid=','')
    if old_sid:
        kill_container(f"kotorscript-{old_sid}")

    # Enforce session limit with waiting room page (after possible self-replacement)
    if count_running_sessions() >= MAX_SESSIONS:
        # Get current session count for template
        current = count_running_sessions()
        
        # Render waiting room template
        return templates.TemplateResponse(
            "waiting.html",
            {
                "request": request,
                "current": current,
                "max": MAX_SESSIONS,
                "year": datetime.now().year
            }
        )

    session_id = "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
    container_name = f"kotorscript-{session_id}"
    connection_token = "".join(random.choices(string.ascii_letters + string.digits, k=24))
    network_name = get_network_name("publicnet") or "bridge"
    default_workspace = os.environ.get("DEFAULT_WORKSPACE", "/workspace")
    vsix_path = os.environ.get("VSIX_PATH", "")

    try:
        # Start container without exposing ports; we'll reverse-proxy internally
        cmd = [
            "docker", "run", "-d",
            "--name", container_name,
            "--network", network_name,
            "-l", "com.bolabaden.kotorscript=1",
            "-e", f"OPENVSCODE_SERVER_CONNECTION_TOKEN={connection_token}",
        ]
        
        # Mount VSIX file if it exists
        host_vsix_path = vsix_path.replace('/configs/', f'{os.environ.get("CONFIG_PATH", "./configs")}/')
        cmd.extend(["-v", f"{host_vsix_path}:/opt/holo-lsp.vsix:ro"])
        
        # Add image and command
        cmd.extend([
            "gitpod/openvscode-server:latest",
            "--server-base-path", f"/s/{session_id}"
        ])
        
        # Install extension if VSIX is mounted
        if os.path.isfile(host_vsix_path):
            cmd.append("--install-extension=/opt/holo-lsp.vsix")
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        return Response(content=f"Failed to start container: {e}", status_code=500)

    # Wait until the container port is reachable on the Docker network
    if not wait_for_port(container_name, 3000, timeout=60):
        subprocess.run(["docker", "rm", "-f", container_name], check=True)
        return Response(content="Session failed to start in time.", status_code=500)

    # Redirect browser to proxied path handled by Traefik
    forwarded_host = (request.headers.get("X-Forwarded-Host") or request.url.hostname or "").split(",")[0].strip()
    scheme = request.headers.get("X-Forwarded-Proto", request.url.scheme or "https")
    # Auto-load workspace folder to avoid "open folder" dialog
    redirect_url = f"{scheme}://{forwarded_host}/s/{session_id}/?tkn={connection_token}&folder={quote(default_workspace)}"
    resp = RedirectResponse(redirect_url, status_code=302)
    # initialize last activity now
    mark_activity(session_id)
    resp.set_cookie("ksid", session_id, max_age=INACTIVITY_TIMEOUT, httponly=True)
    return resp

@app.get("/")
async def index(request: Request):
    # Do NOT kill existing session on refresh; just render lobby
    sid = request.cookies.get("ksid") if hasattr(request, 'cookies') else None
    
    # Get current session count
    current = count_running_sessions()
    available = current < MAX_SESSIONS
    
    # Render template
    response = templates.TemplateResponse(
        "index.html", 
        {
            "request": request,
            "current": current,
            "max": MAX_SESSIONS,
            "available": available,
            "year": datetime.now().year
        }
    )
    
    # Clear session cookie if needed
    if sid:
        response.delete_cookie("ksid")
        
    return response

# Workspace download endpoint
@app.get("/s/{session_id}/download-workspace")
async def download_workspace(session_id: str):
    container_name = f"kotorscript-{session_id}"
    
    # Check if container exists
    try:
        output = subprocess.check_output(["docker", "inspect", container_name], stderr=subprocess.DEVNULL)
        container_data = json.loads(output)[0]
        if container_data.get("State", {}).get("Status") != "running":
            return JSONResponse({"error": "Session not running"}, status_code=404)
    except subprocess.CalledProcessError:
        return JSONResponse({"error": "Session not found"}, status_code=404)
    
    # Create a temporary directory for the workspace
    temp_dir = f"/tmp/workspace-{session_id}"
    os.makedirs(temp_dir, exist_ok=True)
    
    try:
        # Create a zip file in memory
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Execute command to export workspace files from container
            cmd = ["docker", "exec", container_name, "find", "/workspace", "-type", "f", "-not", "-path", "*/\\.*"]
            files_output = subprocess.check_output(cmd).decode().strip().split('\n')
            
            for file_path in files_output:
                if not file_path:  # Skip empty lines
                    continue
                    
                # Get file content from container
                try:
                    content = subprocess.check_output(["docker", "exec", container_name, "cat", file_path])
                    # Add file to zip (removing /workspace prefix)
                    zip_file.writestr(file_path.replace('/workspace/', ''), content)
                except subprocess.CalledProcessError:
                    continue  # Skip files that can't be read
        
        # Reset buffer position
        zip_buffer.seek(0)
        
        # Return the zip file
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename=workspace-{session_id}.zip"}
        )
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# HTTP proxy routes: /s/{session_id}/... and WebSocket
@app.api_route("/s/{session_id}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])
@app.api_route("/s/{session_id}/{tail:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])
async def http_proxy_route(session_id: str, tail: str = "", request: Request = None):
    # Skip proxying for our custom download endpoint
    if tail == "download-workspace":
        return await download_workspace(session_id)
    return await proxy_http(request, session_id, tail)

@app.websocket("/s/{session_id}")
@app.websocket("/s/{session_id}/{tail:path}")
async def ws_proxy_route(session_id: str, tail: str = "", websocket: WebSocket = None):
    await proxy_ws(websocket, session_id, tail)

if __name__ == "__main__":
    start_reaper_thread()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("SESSION_MANAGER_PORT", 8080)))
```

please rewrite this script to use code-server instead of openvscode

## Assistant

_Time: 2025-09-07T12:53:06.740Z_



## User

_Time: 2025-09-07T12:54:44.320Z_

```python
import os
import random
import string
import subprocess
import time
import socket
import json
import threading
import asyncio
import io
import zipfile
import base64
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse, HTMLResponse, JSONResponse, StreamingResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from urllib.parse import quote
import httpx
import websockets

# Initialize FastAPI app
app = FastAPI()
templates = Jinja2Templates(directory="/tmp/templates")
MAX_SESSIONS = int(os.environ.get("MAX_SESSIONS", "5"))
INACTIVITY_TIMEOUT = int(os.environ.get("INACTIVITY_TIMEOUT", "3600"))

# Track last activity per session to avoid killing active sessions
LAST_ACTIVITY = {}
ACTIVITY_LOCK = threading.Lock()

def mark_activity(session_id: str):
    try:
        with ACTIVITY_LOCK:
            LAST_ACTIVITY[session_id] = time.time()
    except Exception:
        pass

def get_network_name(partial_name):
    output = subprocess.check_output(["docker", "network", "ls", "--format", "{{.Name}}"])
    networks = output.decode().splitlines()
    for net in networks:
        if partial_name in net:
            return net
    return None

def wait_for_port(host, port, timeout=30.0):
    """Wait until a TCP port is open on the given host."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection((host, port), timeout=2):
                return True
        except Exception:
            time.sleep(0.5)
    return False

def get_mapped_host_port(container_name, container_port="3000/tcp"):
    """Return the host port mapped to container_port for a container."""
    try:
        inspect_raw = subprocess.check_output(["docker", "inspect", container_name])
        data = json.loads(inspect_raw)[0]
        ports = data.get("NetworkSettings", {}).get("Ports", {})
        bindings = ports.get(container_port)
        if bindings and len(bindings) > 0:
            host_port = bindings[0].get("HostPort")
            if host_port:
                return int(host_port)
    except Exception:
        pass
    return None

def list_running_session_containers():
    try:
        output = subprocess.check_output([
            "docker", "ps", "-q", "-f", "name=^/kotorscript-"
        ])
        ids = output.decode().split()
        return ids
    except Exception:
        return []

def count_running_sessions():
    return len(list_running_session_containers())

def kill_container(container_name_or_id):
    try:
        subprocess.run(["docker", "rm", "-f", container_name_or_id], check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def parse_docker_time(ts):
    # Docker format examples: '2025-09-07T10:16:19.123456789Z' or '2025-09-07T10:16:19Z'
    if ts.endswith("Z"):
        ts = ts[:-1]
    # Trim nanoseconds to microseconds for Python
    if "." in ts:
        date_part, frac = ts.split(".", 1)
        frac = (frac + "000000")[:6]
        ts = f"{date_part}.{frac}"
        fmt = "%Y-%m-%dT%H:%M:%S.%f"
    else:
        fmt = "%Y-%m-%dT%H:%M:%S"
    try:
        return datetime.strptime(ts, fmt).replace(tzinfo=timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)

def cleanup_stale_sessions():
    try:
        output = subprocess.check_output(["docker", "ps", "-a", "--filter", "name=^/kotorscript-", "--format", "{{.ID}}"])
        ids = output.decode().split()
        now = datetime.now(timezone.utc)
        for cid in ids:
            try:
                inspect_raw = subprocess.check_output(["docker", "inspect", cid])
                data = json.loads(inspect_raw)[0]
                # Determine session_id from container name
                cname = (data.get("Name") or "").lstrip("/")
                sid = cname.replace("kotorscript-", "") if cname.startswith("kotorscript-") else None
                # Use last activity if known, else fall back to start time
                last_activity_ts = None
                if sid:
                    with ACTIVITY_LOCK:
                        last_activity_ts = LAST_ACTIVITY.get(sid)
                if last_activity_ts is None:
                    started_at = data.get("State", {}).get("StartedAt") or data.get("Created")
                    if started_at:
                        started_dt = parse_docker_time(started_at)
                        last_activity_ts = started_dt.timestamp()
                if last_activity_ts is not None:
                    age_sec = time.time() - last_activity_ts
                    if age_sec > INACTIVITY_TIMEOUT:
                        kill_container(cid)
            except Exception:
                continue
    except Exception:
        pass

def start_reaper_thread():
    def loop():
        while True:
            cleanup_stale_sessions()
            time.sleep(30)
    t = threading.Thread(target=loop, daemon=True)
    t.start()

async def proxy_http(request: Request, session_id: str, tail: str):
    # Preserve original subpath (/s/{session_id}/...) as base-path expected by backend
    path = request.url.path
    query = ("?" + request.url.query) if request.url.query else ""
    target = f"http://kotorscript-{session_id}:3000{path}{query}"
    # mark activity for this session
    mark_activity(session_id)
    headers = dict(request.headers)
    headers.pop("host", None)
    body = await request.body()
    async with httpx.AsyncClient(follow_redirects=False, timeout=30.0) as client:
        resp = await client.request(request.method, target, headers=headers, content=body)
        excluded = {"content-encoding", "transfer-encoding", "connection"}
        response_headers = [(k, v) for k, v in resp.headers.items() if k.lower() not in excluded]
        return Response(content=resp.content, status_code=resp.status_code, headers=dict(response_headers))

async def proxy_ws(websocket: WebSocket, session_id: str, tail: str):
    ws_path = websocket.url.path
    ws_query = ("?" + websocket.url.query) if websocket.url.query else ""
    target = f"ws://kotorscript-{session_id}:3000{ws_path}{ws_query}"
    extra_headers = []
    if cookie := websocket.headers.get("cookie"):
        extra_headers.append(("Cookie", cookie))
    if user_agent := websocket.headers.get("user-agent"):
        extra_headers.append(("User-Agent", user_agent))
    origin_hdr = websocket.headers.get("origin")
    subprotocols = None
    if sec_ws_proto := websocket.headers.get("sec-websocket-protocol"):
        subprotocols = [p.strip() for p in sec_ws_proto.split(',') if p.strip()]
    try:
        async with websockets.connect(
            target,
            max_size=None,
            extra_headers=extra_headers,
            subprotocols=subprotocols,
            origin=origin_hdr,
            ping_interval=20,  # Add ping to prevent timeouts
            ping_timeout=30
        ) as upstream:
            selected_subprotocol = upstream.subprotocol
            await websocket.accept(subprotocol=selected_subprotocol)
            mark_activity(session_id)
            async def client_to_upstream():
                try:
                    while True:
                        message = await websocket.receive()
                        data = message.get("bytes") if message.get("bytes") is not None else message.get("text")
                        if data is None:
                            continue
                        mark_activity(session_id)
                        await upstream.send(data)
                except WebSocketDisconnect:
                    pass
                except Exception:
                    pass
            async def upstream_to_client():
                try:
                    async for msg in upstream:
                        mark_activity(session_id)
                        if isinstance(msg, bytes):
                            await websocket.send_bytes(msg)
                        else:
                            await websocket.send_text(msg)
                except Exception:
                    pass
            await asyncio.gather(client_to_upstream(), upstream_to_client())
    except Exception:
        pass
    finally:
        try:
            await websocket.close()
        except Exception:
            pass

@app.get("/capacity")
async def capacity():
    cleanup_stale_sessions()
    current = count_running_sessions()
    return JSONResponse({"current": current, "max": MAX_SESSIONS, "available": current < MAX_SESSIONS})

@app.post("/new")
async def new_session(request: Request):
    # Clean up any stale sessions first
    cleanup_stale_sessions()

    # If user has an existing session cookie, kill that container (allow replacement)
    old_sid = request.cookies.get("ksid") if hasattr(request, 'cookies') else request.headers.get('cookie','').replace('ksid=','')
    if old_sid:
        kill_container(f"kotorscript-{old_sid}")

    # Enforce session limit with waiting room page (after possible self-replacement)
    if count_running_sessions() >= MAX_SESSIONS:
        # Get current session count for template
        current = count_running_sessions()
        
        # Render waiting room template
        return templates.TemplateResponse(
            "waiting.html",
            {
                "request": request,
                "current": current,
                "max": MAX_SESSIONS,
                "year": datetime.now().year
            }
        )

    session_id = "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
    container_name = f"kotorscript-{session_id}"
    connection_token = "".join(random.choices(string.ascii_letters + string.digits, k=24))
    network_name = get_network_name("publicnet") or "bridge"
    default_workspace = os.environ.get("DEFAULT_WORKSPACE", "/workspace")
    vsix_path = os.environ.get("VSIX_PATH", "")

    try:
        # Start container without exposing ports; we'll reverse-proxy internally
        cmd = [
            "docker", "run", "-d",
            "--name", container_name,
            "--network", network_name,
            "-l", "com.bolabaden.kotorscript=1",
            "-e", f"OPENVSCODE_SERVER_CONNECTION_TOKEN={connection_token}",
        ]
        
        # Mount VSIX file if it exists
        host_vsix_path = vsix_path.replace('/configs/', f'{os.environ.get("CONFIG_PATH", "./configs")}/')
        cmd.extend(["-v", f"{host_vsix_path}:/opt/holo-lsp.vsix:ro"])
        
        # Add image and command
        cmd.extend([
            "gitpod/openvscode-server:latest",
            "--server-base-path", f"/s/{session_id}"
        ])
        
        # Install extension if VSIX is mounted
        if os.path.isfile(host_vsix_path):
            cmd.append("--install-extension=/opt/holo-lsp.vsix")
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        return Response(content=f"Failed to start container: {e}", status_code=500)

    # Wait until the container port is reachable on the Docker network
    if not wait_for_port(container_name, 3000, timeout=60):
        subprocess.run(["docker", "rm", "-f", container_name], check=True)
        return Response(content="Session failed to start in time.", status_code=500)

    # Redirect browser to proxied path handled by Traefik
    forwarded_host = (request.headers.get("X-Forwarded-Host") or request.url.hostname or "").split(",")[0].strip()
    scheme = request.headers.get("X-Forwarded-Proto", request.url.scheme or "https")
    # Auto-load workspace folder to avoid "open folder" dialog
    redirect_url = f"{scheme}://{forwarded_host}/s/{session_id}/?tkn={connection_token}&folder={quote(default_workspace)}"
    resp = RedirectResponse(redirect_url, status_code=302)
    # initialize last activity now
    mark_activity(session_id)
    resp.set_cookie("ksid", session_id, max_age=INACTIVITY_TIMEOUT, httponly=True)
    return resp

@app.get("/")
async def index(request: Request):
    # Do NOT kill existing session on refresh; just render lobby
    sid = request.cookies.get("ksid") if hasattr(request, 'cookies') else None
    
    # Get current session count
    current = count_running_sessions()
    available = current < MAX_SESSIONS
    
    # Render template
    response = templates.TemplateResponse(
        "index.html", 
        {
            "request": request,
            "current": current,
            "max": MAX_SESSIONS,
            "available": available,
            "year": datetime.now().year
        }
    )
    
    # Clear session cookie if needed
    if sid:
        response.delete_cookie("ksid")
        
    return response

# Workspace download endpoint
@app.get("/s/{session_id}/download-workspace")
async def download_workspace(session_id: str):
    container_name = f"kotorscript-{session_id}"
    
    # Check if container exists
    try:
        output = subprocess.check_output(["docker", "inspect", container_name], stderr=subprocess.DEVNULL)
        container_data = json.loads(output)[0]
        if container_data.get("State", {}).get("Status") != "running":
            return JSONResponse({"error": "Session not running"}, status_code=404)
    except subprocess.CalledProcessError:
        return JSONResponse({"error": "Session not found"}, status_code=404)
    
    # Create a temporary directory for the workspace
    temp_dir = f"/tmp/workspace-{session_id}"
    os.makedirs(temp_dir, exist_ok=True)
    
    try:
        # Create a zip file in memory
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Execute command to export workspace files from container
            cmd = ["docker", "exec", container_name, "find", "/workspace", "-type", "f", "-not", "-path", "*/\\.*"]
            files_output = subprocess.check_output(cmd).decode().strip().split('\n')
            
            for file_path in files_output:
                if not file_path:  # Skip empty lines
                    continue
                    
                # Get file content from container
                try:
                    content = subprocess.check_output(["docker", "exec", container_name, "cat", file_path])
                    # Add file to zip (removing /workspace prefix)
                    zip_file.writestr(file_path.replace('/workspace/', ''), content)
                except subprocess.CalledProcessError:
                    continue  # Skip files that can't be read
        
        # Reset buffer position
        zip_buffer.seek(0)
        
        # Return the zip file
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename=workspace-{session_id}.zip"}
        )
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# HTTP proxy routes: /s/{session_id}/... and WebSocket
@app.api_route("/s/{session_id}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])
@app.api_route("/s/{session_id}/{tail:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])
async def http_proxy_route(session_id: str, tail: str = "", request: Request = None):
    # Skip proxying for our custom download endpoint
    if tail == "download-workspace":
        return await download_workspace(session_id)
    return await proxy_http(request, session_id, tail)

@app.websocket("/s/{session_id}")
@app.websocket("/s/{session_id}/{tail:path}")
async def ws_proxy_route(session_id: str, tail: str = "", websocket: WebSocket = None):
    await proxy_ws(websocket, session_id, tail)

if __name__ == "__main__":
    start_reaper_thread()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("SESSION_MANAGER_PORT", 8080)))
```

please rewrite this script to use code-server instead of openvscode

Literally follow my sole exclusive requirements (should be simple to do for you):
- all sessions MUST be session-based and ran similar to above
- the basepath shown (/s/{session_id}) is a HARD requirement: the docker container for the session MUST be accessible and FULLY forwarded COMPLETELY to that path and proxied completely.
- presumably traefik is fine but add any required labels otherwise.

```


  session-manager:
    image: alpine:latest
    container_name: session-manager
    hostname: session-manager
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    configs:
      - source: kotorscript-index.html
        target: /tmp/templates/index.html
        mode: 0777
      - source: kotorscript-waiting.html
        target: /tmp/templates/waiting.html
        mode: 0777
      - source: session_manager.py
        target: /session_manager.py
        mode: 0777
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ${CONFIG_PATH:-./configs}/extensions:/configs/extensions
    environment:
      DOMAIN: ${DOMAIN}
      CONFIG_PATH: ${CONFIG_PATH:-./configs}
      SESSION_MANAGER_PORT: ${SESSION_MANAGER_PORT:-8080}
      INACTIVITY_TIMEOUT: 3600
      DEFAULT_WORKSPACE: /workspace
      VSIX_PATH: /configs/extensions/holo-lsp-1.0.0.vsix
    labels:
      traefik.enable: true
      traefik.http.routers.kotorscript.rule: (Host(`kotorscript.${DOMAIN}`) || Host(`kotorscript.${TS_HOSTNAME}.${DOMAIN}`))
      traefik.http.services.kotorscript.loadbalancer.server.port: ${SESSION_MANAGER_PORT:-8080}
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:${SESSION_MANAGER_PORT:-8080} > /dev/null 2>&1 || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
    restart: always
    command:
      - sh
      - -c
      - |
        apk add python3 py3-pip docker-cli zip unzip &&
        pip install fastapi uvicorn httpx websockets docker jinja2 python-multipart --break-system-packages --root-user-action=ignore &&
        mkdir -p /tmp/templates &&
        python3 session_manager.py
```

## Assistant

_Time: 2025-09-07T12:57:34.292Z_

```python
import os
import random
import string
import subprocess
import time
import socket
import json
import threading
import asyncio
import io
import zipfile
import base64
from datetime import datetime, timezone, timedelta
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse, HTMLResponse, JSONResponse, StreamingResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from urllib.parse import quote
import httpx
import websockets

# Initialize FastAPI app
app = FastAPI()
templates = Jinja2Templates(directory="/tmp/templates")
MAX_SESSIONS = int(os.environ.get("MAX_SESSIONS", "5"))
INACTIVITY_TIMEOUT = int(os.environ.get("INACTIVITY_TIMEOUT", "3600"))

# Track last activity per session to avoid killing active sessions
LAST_ACTIVITY = {}
ACTIVITY_LOCK = threading.Lock()

def mark_activity(session_id: str):
    try:
        with ACTIVITY_LOCK:
            LAST_ACTIVITY[session_id] = time.time()
    except Exception:
        pass

def get_network_name(partial_name):
    output = subprocess.check_output(["docker", "network", "ls", "--format", "{{.Name}}"])
    networks = output.decode().splitlines()
    for net in networks:
        if partial_name in net:
            return net
    return None

def wait_for_port(host, port, timeout=30.0):
    """Wait until a TCP port is open on the given host."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection((host, port), timeout=2):
                return True
        except Exception:
            time.sleep(0.5)
    return False

def get_mapped_host_port(container_name, container_port="8080/tcp"):
    """Return the host port mapped to container_port for a container."""
    try:
        inspect_raw = subprocess.check_output(["docker", "inspect", container_name])
        data = json.loads(inspect_raw)[0]
        ports = data.get("NetworkSettings", {}).get("Ports", {})
        bindings = ports.get(container_port)
        if bindings and len(bindings) > 0:
            host_port = bindings[0].get("HostPort")
            if host_port:
                return int(host_port)
    except Exception:
        pass
    return None

def list_running_session_containers():
    try:
        output = subprocess.check_output([
            "docker", "ps", "-q", "-f", "name=^/kotorscript-"
        ])
        ids = output.decode().split()
        return ids
    except Exception:
        return []

def count_running_sessions():
    return len(list_running_session_containers())

def kill_container(container_name_or_id):
    try:
        subprocess.run(["docker", "rm", "-f", container_name_or_id], check=True)
        return True
    except subprocess.CalledProcessError:
        return False

def parse_docker_time(ts):
    # Docker format examples: '2025-09-07T10:16:19.123456789Z' or '2025-09-07T10:16:19Z'
    if ts.endswith("Z"):
        ts = ts[:-1]
    # Trim nanoseconds to microseconds for Python
    if "." in ts:
        date_part, frac = ts.split(".", 1)
        frac = (frac + "000000")[:6]
        ts = f"{date_part}.{frac}"
        fmt = "%Y-%m-%dT%H:%M:%S.%f"
    else:
        fmt = "%Y-%m-%dT%H:%M:%S"
    try:
        return datetime.strptime(ts, fmt).replace(tzinfo=timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)

def cleanup_stale_sessions():
    try:
        output = subprocess.check_output(["docker", "ps", "-a", "--filter", "name=^/kotorscript-", "--format", "{{.ID}}"])
        ids = output.decode().split()
        now = datetime.now(timezone.utc)
        for cid in ids:
            try:
                inspect_raw = subprocess.check_output(["docker", "inspect", cid])
                data = json.loads(inspect_raw)[0]
                # Determine session_id from container name
                cname = (data.get("Name") or "").lstrip("/")
                sid = cname.replace("kotorscript-", "") if cname.startswith("kotorscript-") else None
                # Use last activity if known, else fall back to start time
                last_activity_ts = None
                if sid:
                    with ACTIVITY_LOCK:
                        last_activity_ts = LAST_ACTIVITY.get(sid)
                if last_activity_ts is None:
                    started_at = data.get("State", {}).get("StartedAt") or data.get("Created")
                    if started_at:
                        started_dt = parse_docker_time(started_at)
                        last_activity_ts = started_dt.timestamp()
                if last_activity_ts is not None:
                    age_sec = time.time() - last_activity_ts
                    if age_sec > INACTIVITY_TIMEOUT:
                        kill_container(cid)
            except Exception:
                continue
    except Exception:
        pass

def start_reaper_thread():
    def loop():
        while True:
            cleanup_stale_sessions()
            time.sleep(30)
    t = threading.Thread(target=loop, daemon=True)
    t.start()

async def proxy_http(request: Request, session_id: str, tail: str):
    # Construct forwarded path, stripping /s/{session_id}
    forwarded_path = f"/{tail}" if tail else "/"
    query = ("?" + request.url.query) if request.url.query else ""
    target = f"http://kotorscript-{session_id}:8080{forwarded_path}{query}"
    # mark activity for this session
    mark_activity(session_id)
    headers = dict(request.headers)
    headers.pop("host", None)
    body = await request.body()
    async with httpx.AsyncClient(follow_redirects=False, timeout=30.0) as client:
        resp = await client.request(request.method, target, headers=headers, content=body)
        excluded = {"content-encoding", "transfer-encoding", "connection"}
        response_headers = [(k, v) for k, v in resp.headers.items() if k.lower() not in excluded]
        return Response(content=resp.content, status_code=resp.status_code, headers=dict(response_headers))

async def proxy_ws(websocket: WebSocket, session_id: str, tail: str):
    forwarded_path = f"/{tail}" if tail else "/"
    ws_query = ("?" + websocket.url.query) if websocket.url.query else ""
    target = f"ws://kotorscript-{session_id}:8080{forwarded_path}{ws_query}"
    extra_headers = []
    if cookie := websocket.headers.get("cookie"):
        extra_headers.append(("Cookie", cookie))
    if user_agent := websocket.headers.get("user-agent"):
        extra_headers.append(("User-Agent", user_agent))
    origin_hdr = websocket.headers.get("origin")
    subprotocols = None
    if sec_ws_proto := websocket.headers.get("sec-websocket-protocol"):
        subprotocols = [p.strip() for p in sec_ws_proto.split(',') if p.strip()]
    try:
        async with websockets.connect(
            target,
            max_size=None,
            extra_headers=extra_headers,
            subprotocols=subprotocols,
            origin=origin_hdr,
            ping_interval=20,  # Add ping to prevent timeouts
            ping_timeout=30
        ) as upstream:
            selected_subprotocol = upstream.subprotocol
            await websocket.accept(subprotocol=selected_subprotocol)
            mark_activity(session_id)
            async def client_to_upstream():
                try:
                    while True:
                        message = await websocket.receive()
                        data = message.get("bytes") if message.get("bytes") is not None else message.get("text")
                        if data is None:
                            continue
                        mark_activity(session_id)
                        await upstream.send(data)
                except WebSocketDisconnect:
                    pass
                except Exception:
                    pass
            async def upstream_to_client():
                try:
                    async for msg in upstream:
                        mark_activity(session_id)
                        if isinstance(msg, bytes):
                            await websocket.send_bytes(msg)
                        else:
                            await websocket.send_text(msg)
                except Exception:
                    pass
            await asyncio.gather(client_to_upstream(), upstream_to_client())
    except Exception:
        pass
    finally:
        try:
            await websocket.close()
        except Exception:
            pass

@app.get("/capacity")
async def capacity():
    cleanup_stale_sessions()
    current = count_running_sessions()
    return JSONResponse({"current": current, "max": MAX_SESSIONS, "available": current < MAX_SESSIONS})

@app.post("/new")
async def new_session(request: Request):
    # Clean up any stale sessions first
    cleanup_stale_sessions()

    # If user has an existing session cookie, kill that container (allow replacement)
    old_sid = request.cookies.get("ksid") if hasattr(request, 'cookies') else request.headers.get('cookie','').replace('ksid=','')
    if old_sid:
        kill_container(f"kotorscript-{old_sid}")

    # Enforce session limit with waiting room page (after possible self-replacement)
    if count_running_sessions() >= MAX_SESSIONS:
        # Get current session count for template
        current = count_running_sessions()
        
        # Render waiting room template
        return templates.TemplateResponse(
            "waiting.html",
            {
                "request": request,
                "current": current,
                "max": MAX_SESSIONS,
                "year": datetime.now().year
            }
        )

    session_id = "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
    container_name = f"kotorscript-{session_id}"
    network_name = get_network_name("publicnet") or "bridge"
    default_workspace = os.environ.get("DEFAULT_WORKSPACE", "/workspace")
    vsix_path = os.environ.get("VSIX_PATH", "")

    try:
        # Start container without exposing ports; we'll reverse-proxy internally
        cmd = [
            "docker", "run", "-d",
            "--name", container_name,
            "--network", network_name,
            "-l", "com.bolabaden.kotorscript=1",
        ]
        
        # Mount VSIX file if it exists
        host_vsix_path = vsix_path.replace('/configs/', f'{os.environ.get("CONFIG_PATH", "./configs")}/')
        cmd.extend(["-v", f"{host_vsix_path}:/opt/holo-lsp.vsix:ro"])
        
        # Add image and command
        cmd.extend([
            "coder/code-server:latest",
            "--bind-addr", "0.0.0.0:8080",
            "--auth", "none"
        ])
        
        # Install extension if VSIX is mounted
        if os.path.isfile(host_vsix_path):
            cmd.append("--install-extension=/opt/holo-lsp.vsix")
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        return Response(content=f"Failed to start container: {e}", status_code=500)

    # Wait until the container port is reachable on the Docker network
    if not wait_for_port(container_name, 8080, timeout=60):
        subprocess.run(["docker", "rm", "-f", container_name], check=True)
        return Response(content="Session failed to start in time.", status_code=500)

    # Redirect browser to proxied path handled by Traefik
    forwarded_host = (request.headers.get("X-Forwarded-Host") or request.url.hostname or "").split(",")[0].strip()
    scheme = request.headers.get("X-Forwarded-Proto", request.url.scheme or "https")
    # Auto-load workspace folder to avoid "open folder" dialog
    redirect_url = f"{scheme}://{forwarded_host}/s/{session_id}/?folder={quote(default_workspace)}"
    resp = RedirectResponse(redirect_url, status_code=302)
    # initialize last activity now
    mark_activity(session_id)
    resp.set_cookie("ksid", session_id, max_age=INACTIVITY_TIMEOUT, httponly=True)
    return resp

@app.get("/")
async def index(request: Request):
    # Do NOT kill existing session on refresh; just render lobby
    sid = request.cookies.get("ksid") if hasattr(request, 'cookies') else None
    
    # Get current session count
    current = count_running_sessions()
    available = current < MAX_SESSIONS
    
    # Render template
    response = templates.TemplateResponse(
        "index.html", 
        {
            "request": request,
            "current": current,
            "max": MAX_SESSIONS,
            "available": available,
            "year": datetime.now().year
        }
    )
    
    # Clear session cookie if needed
    if sid:
        response.delete_cookie("ksid")
        
    return response

# Workspace download endpoint
@app.get("/s/{session_id}/download-workspace")
async def download_workspace(session_id: str):
    container_name = f"kotorscript-{session_id}"
    
    # Check if container exists
    try:
        output = subprocess.check_output(["docker", "inspect", container_name], stderr=subprocess.DEVNULL)
        container_data = json.loads(output)[0]
        if container_data.get("State", {}).get("Status") != "running":
            return JSONResponse({"error": "Session not running"}, status_code=404)
    except subprocess.CalledProcessError:
        return JSONResponse({"error": "Session not found"}, status_code=404)
    
    # Create a temporary directory for the workspace
    temp_dir = f"/tmp/workspace-{session_id}"
    os.makedirs(temp_dir, exist_ok=True)
    
    try:
        # Create a zip file in memory
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            # Execute command to export workspace files from container
            cmd = ["docker", "exec", container_name, "find", "/workspace", "-type", "f", "-not", "-path", "*/\\.*"]
            files_output = subprocess.check_output(cmd).decode().strip().split('\n')
            
            for file_path in files_output:
                if not file_path:  # Skip empty lines
                    continue
                    
                # Get file content from container
                try:
                    content = subprocess.check_output(["docker", "exec", container_name, "cat", file_path])
                    # Add file to zip (removing /workspace prefix)
                    zip_file.writestr(file_path.replace('/workspace/', ''), content)
                except subprocess.CalledProcessError:
                    continue  # Skip files that can't be read
        
        # Reset buffer position
        zip_buffer.seek(0)
        
        # Return the zip file
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename=workspace-{session_id}.zip"}
        )
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

# HTTP proxy routes: /s/{session_id}/... and WebSocket
@app.api_route("/s/{session_id}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])
@app.api_route("/s/{session_id}/{tail:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"])
async def http_proxy_route(session_id: str, tail: str = "", request: Request = None):
    # Skip proxying for our custom download endpoint
    if tail == "download-workspace":
        return await download_workspace(session_id)
    return await proxy_http(request, session_id, tail)

@app.websocket("/s/{session_id}")
@app.websocket("/s/{session_id}/{tail:path}")
async def ws_proxy_route(session_id: str, tail: str = "", websocket: WebSocket = None):
    await proxy_ws(websocket, session_id, tail)

if __name__ == "__main__":
    start_reaper_thread()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("SESSION_MANAGER_PORT", 8080)))
```
