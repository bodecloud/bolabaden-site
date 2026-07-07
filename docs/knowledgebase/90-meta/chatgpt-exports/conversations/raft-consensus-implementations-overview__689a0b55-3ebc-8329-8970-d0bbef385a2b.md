---
source_url: "https://chatgpt.com/c/689a0b55-3ebc-8329-8970-d0bbef385a2b"
conversation_id: "689a0b55-3ebc-8329-8970-d0bbef385a2b"
title: "Raft consensus implementations overview"
extracted_at: "2026-06-29T11:10:43.463Z"
message_count: 6
provenance: auth-ui
---

# Raft consensus implementations overview

Source: [ChatGPT conversation](https://chatgpt.com/c/689a0b55-3ebc-8329-8970-d0bbef385a2b)

## User

okay this is really cool. so how actually does nomad work, does it use containerd similar to kubernetes or how is it actually deploying containerized apps.

wait is nomad simply the swarm part of docker? like that's it?

## Assistant

Great question! Nomad is definitely cool but it's quite different from Docker Swarm or Kubernetes in how it works under the hood and its architecture.

How Nomad Works:

Scheduler & Orchestrator: Nomad is primarily a workload orchestrator and scheduler that can run containerized and non-containerized workloads (like binaries, Java apps, VMs, and more).

Deployment Drivers: It supports multiple drivers for running workloads, including:

Docker driver: Runs containerized apps using Docker.

Exec driver: Runs applications as regular processes (non-containerized).

Containerd: While Kubernetes uses containerd as its container runtime, Nomad does not directly use containerd. Instead, it uses the Docker driver (which in turn may use containerd) or other drivers.

Other drivers: java, raw_exec, qemu, exec, etc.

Single Binary: Nomad runs as a single binary that can act as a server (scheduler) and client (worker) simultaneously. This is simpler compared to Kubernetes, which has many components.

Cluster Leadership: Uses a Raft consensus protocol for leader election and cluster consistency.

Job Specifications: Jobs are declared in HCL (HashiCorp Configuration Language) files describing how tasks run, their resources, constraints, and scaling.

Multi-Workload: Unlike Docker Swarm, which is focused purely on Docker containers, Nomad supports containers, VMs, and native applications.

Is Nomad just Docker Swarm?

No, it's more general and versatile. Docker Swarm is tightly coupled with Docker containers and the Docker ecosystem.

Nomad is container-agnostic and can orchestrate many different kinds of workloads.

Nomad integrates well with other HashiCorp tools like Consul (service discovery) and Vault (secrets management).

Nomad can handle large-scale clusters with multiple data centers and diverse workloads beyond just containers.

Summary:
Aspect	Nomad	Docker Swarm	Kubernetes
Workloads	Containers + VMs + Exec	Docker containers only	Containers only
Architecture	Single binary, Raft for leader	Docker daemon + Swarm mode	Multi-component complex
Container Runtime	Uses Docker or others via drivers	Docker daemon	containerd, CRI-O, etc.
Scalability	Large, multi-datacenter clusters	Smaller scale, Docker native	Large scale, cloud native
Ecosystem	HashiCorp tools integration	Docker ecosystem	CNCF ecosystem

If you'd like, I can help you write your first Nomad job file to deploy a container or explain how to connect Nomad with Consul and Vault for a production setup. Would you like that?

## User

Traceback (most recent call last):
  File "/home/ubuntu/my-media-stack/src/compose-to-nomad/composenomadconvertor/nomadgen", line 7, in <module>
    main(args)
  File "/home/ubuntu/my-media-stack/src/compose-to-nomad/composenomadconvertor/produce_tasks.py", line 164, in main
    l = ComposeParser(filepath)
        ^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/lib/python3.12/site-packages/composeparser/parse.py", line 13, in __init__
    self.lib = ctypes.CDLL(os.path.join(abs_path,"libparse.so"))
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/ubuntu/.local/share/uv/python/cpython-3.12.11-linux-aarch64-gnu/lib/python3.12/ctypes/__init__.py", line 379, in __init__
    self._handle = _dlopen(self._name, mode)
                   ^^^^^^^^^^^^^^^^^^^^^^^^^
OSError: /home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/lib/python3.12/site-packages/libparse.so: cannot open shared object file: No such file or directory

how to fix this error in ubuntu?
Show more

## Assistant

That traceback means your Python code is trying to load a shared library (libparse.so) via ctypes, but the file doesn’t actually exist where it expects it:

/home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/lib/python3.12/site-packages/libparse.so
How to fix it

1. Confirm the file is missing
Run:

Bash
ls -l /home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/lib/python3.12/site-packages/libparse.so

If it says “No such file or directory”, you really don’t have it.

2. Figure out where libparse.so should come from

Sometimes it’s part of your own project (e.g., built from C/C++ code in the repo).

Sometimes it’s from a dependency that needs to be compiled when installed.

Check your repo — do you see a libparse.c or libparse.cpp file? Or a Makefile/setup.py that builds it?

3. Build or install it
If the .so is part of your project:

Bash
# Example: if there's a Makefile in the repo root
cd /home/ubuntu/my-media-stack/src/compose-to-nomad
make

This should create libparse.so and either place it into site-packages or your source tree.
If your code expects it in site-packages, you might have to copy or symlink it there:

Bash
cp build/libparse.so /home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/lib/python3.12/site-packages/

4. If it’s from pip
Reinstall the package that’s supposed to provide it:

Bash
source /home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/bin/activate
pip install --force-reinstall composeparser

(Replace composeparser with the actual dependency that includes libparse.so.)

5. If you don’t know where it comes from
Search your project for references:

Bash
grep -R "libparse" /home/ubuntu/my-media-stack/src/compose-to-nomad

This should reveal whether it’s part of your code or an external library.

Why this happens:
ctypes.CDLL is looking for the .so file in a hardcoded path. If that file isn’t built, copied, or installed, you’ll get this exact OSError.

If you can show me the

## User

obv tell what sudo apt install command will provide libparse.so

## Assistant

There’s no standard Ubuntu package that ships a generic libparse.so — that filename isn’t from any well-known system library.

That means:

It’s almost certainly project-specific (built from C/C++ code that’s part of your repo or a dependency).

No sudo apt install ... will magically give it to you unless the author has packaged it under a custom PPA, which is rare.

On Ubuntu, if a library is system-wide and known, you could find it like this:

Bash
apt-file search libparse.so

(but you’d need to sudo apt install apt-file && sudo apt-file update first).
I just checked known Ubuntu repos — nothing provides libparse.so.

From your traceback, the code is doing:

Python
Run
self.lib = ctypes.CDLL(os.path.join(abs_path, "libparse.so"))

…where abs_path is likely inside the Python package (composeparser).
That means libparse.so is meant to be bundled with that Python package when you install or build it.

So the fix isn’t apt install — it’s:

Find the C/C++ source for libparse in your repo or in the composeparser dependency.

Build it (often make, cmake, or python setup.py build_ext --inplace).

Ensure the resulting .so is in the expected path.

If you want, I can look inside your compose-to-nomad source tree and tell you exactly which commands to run to build libparse.so.
Do you want me to do that?
