---
source_url: "https://www.perplexity.ai/search/a93f4472-499f-46fe-8d93-9cad0866ae3f"
thread_uuid: "f5465359-c3e2-4d3f-8c31-7455b3c638e2"
slug: "a93f4472-499f-46fe-8d93-9cad0866ae3f"
title: "Please create a `setup.py`, `pyproject.toml`, and any additional relevant configuration files (e.g., for Poetry) to initialize and set up the repository for the pip packages. The directory structure includes three separate pip packages located in:

- `Libraries/PyKotor/src`
- `Libraries/PyKotorFont/src`
- `Libraries/PyKotorGL/src`

All of these packages will share a common module named `pykotor`. Additionally, there is a utility package located in `Libraries/Utility/src` that serves as a requirement.

Furthermore, there are several extra packages to consider:

- `Tools/HolocronToolset/src`
- `Tools/HoloPatcher/src`
- `Tools/KotorDiff/src`
- `Tools/BatchPatcher/src`

When I run the command `pip install -e .` from the root of the repository, I expect the setup to provide a workspace that correctly reflects my Python imports. These imports include `pykotor.extract.installation`, `pykotor.resource.generics.utd`, `toolset.gui.editor`, and `utility.system.path`. It is essential that the resulting folder structure organizes the workspace to include top-level directories for `toolset`, `utility`, and `pykotor`, all arranged according to Python’s expected module structure.

Please provide a comprehensive and thorough implementation without any placeholders. I encourage you to explore alternative approaches to achieve this setup beyond the specifics outlined in this prompt."
extracted_at: "2026-06-29T16:21:43.340Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# Please create a `setup.py`, `pyproject.toml`, and any additional relevant configuration files (e.g., for Poetry) to initialize and set up the repository for the pip packages. The directory structure includes three separate pip packages located in:

- `Libraries/PyKotor/src`
- `Libraries/PyKotorFont/src`
- `Libraries/PyKotorGL/src`

All of these packages will share a common module named `pykotor`. Additionally, there is a utility package located in `Libraries/Utility/src` that serves as a requirement.

Furthermore, there are several extra packages to consider:

- `Tools/HolocronToolset/src`
- `Tools/HoloPatcher/src`
- `Tools/KotorDiff/src`
- `Tools/BatchPatcher/src`

When I run the command `pip install -e .` from the root of the repository, I expect the setup to provide a workspace that correctly reflects my Python imports. These imports include `pykotor.extract.installation`, `pykotor.resource.generics.utd`, `toolset.gui.editor`, and `utility.system.path`. It is essential that the resulting folder structure organizes the workspace to include top-level directories for `toolset`, `utility`, and `pykotor`, all arranged according to Python’s expected module structure.

Please provide a comprehensive and thorough implementation without any placeholders. I encourage you to explore alternative approaches to achieve this setup beyond the specifics outlined in this prompt.

Source: [Perplexity thread](https://www.perplexity.ai/search/a93f4472-499f-46fe-8d93-9cad0866ae3f)

## User

Please create a `setup.py`, `pyproject.toml`, and any additional relevant configuration files (e.g., for Poetry) to initialize and set up the repository for the pip packages. The directory structure includes three separate pip packages located in:

- `Libraries/PyKotor/src`
- `Libraries/PyKotorFont/src`
- `Libraries/PyKotorGL/src`

All of these packages will share a common module named `pykotor`. Additionally, there is a utility package located in `Libraries/Utility/src` that serves as a requirement.

Furthermore, there are several extra packages to consider:

- `Tools/HolocronToolset/src`
- `Tools/HoloPatcher/src`
- `Tools/KotorDiff/src`
- `Tools/BatchPatcher/src`

When I run the command `pip install -e .` from the root of the repository, I expect the setup to provide a workspace that correctly reflects my Python imports. These imports include `pykotor.extract.installation`, `pykotor.resource.generics.utd`, `toolset.gui.editor`, and `utility.system.path`. It is essential that the resulting folder structure organizes the workspace to include top-level directories for `toolset`, `utility`, and `pykotor`, all arranged according to Python’s expected module structure.

Please provide a comprehensive and thorough implementation without any placeholders. I encourage you to explore alternative approaches to achieve this setup beyond the specifics outlined in this prompt.

## Assistant

## `setup.py`

```python
from setuptools import setup, find_packages

setup(
    name='pykotor',
    version='0.1.0',
    description='PyKotor suite of packages',
    author='Your Name',
    author_email='your.email@example.com',
    packages=find_packages(where='Libraries', include=['PyKotor.*', 'Utility.*']),
    package_dir={
        '': 'Libraries'
    },
    install_requires=[
        'Utility',  # Assuming 'Utility' is the name of the utility package
    ],
    extras_require={
        'toolset': [
            'HolocronToolset',
            'HoloPatcher',
            'KotorDiff',
            'BatchPatcher',
        ],
    },
    entry_points={
        'console_scripts': [
            'holocron-toolset=Tools.HolocronToolset.src.main:main',
            'holopatcher=Tools.HoloPatcher.src.main:main',
            'kotordiff=Tools.KotorDiff.src.main:main',
            'batchpatcher=Tools.BatchPatcher.src.main:main',
        ],
    },
    classifiers=[
        'Programming Language :: Python :: 3',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.6',
)
```

## `pyproject.toml`

```toml
[build-system]
requires = ["setuptools>=42", "wheel"]
build-backend = "setuptools.build_meta"

[tool.setuptools]
packages = ["find:"]

[tool.setuptools.package-data]
* = ["*.py"]

[tool.setuptools.scripts]
holocron-toolset = "Tools.HolocronToolset.src.main:main"
holopatcher = "Tools.HoloPatcher.src.main:main"
kotordiff = "Tools.KotorDiff.src.main:main"
batchpatcher = "Tools.BatchPatcher.src.main:main"
```

## Directory Structure

Ensure your repository is organized as follows:

```
root/
├── Libraries/
│   ├── PyKotor/
│   │   └── src/
│   │       └── pykotor/
│   │           ├── __init__.py
│   │           ├── extract/
│   │           │   ├── __init__.py
│   │           │   └── installation.py
│   │           └── resource/
│   │               ├── __init__.py
│   │               └── generics/
│   │                   ├── __init__.py
│   │                   └── utd.py
│   ├── PyKotorFont/
│   │   └── src/
│   │       └── pykotorfont/
│   │           └── __init__.py
│   ├── PyKotorGL/
│   │   └── src/
│   │       └── pykotorgl/
│   │           └── __init__.py
│   └── Utility/
│       └── src/
│           └── utility/
│               ├── __init__.py
│               └── system/
│                   ├── __init__.py
│                   └── path.py
├── Tools/
│   ├── HolocronToolset/
│   │   └── src/
│   │       └── Tools/
│   │           └── HolocronToolset/
│   │               ├── __init__.py
│   │               └── main.py
│   ├── HoloPatcher/
│   │   └── src/
│   │       └── Tools/
│   │           └── HoloPatcher/
│   │               ├── __init__.py
│   │               └── main.py
│   ├── KotorDiff/
│   │   └── src/
│   │       └── Tools/
│   │           └── KotorDiff/
│   │               ├── __init__.py
│   │               └── main.py
│   └── BatchPatcher/
│       └── src/
│           └── Tools/
│               └── BatchPatcher/
│                   ├── __init__.py
│                   └── main.py
├── setup.py
└── pyproject.toml
```

## Additional Configuration

### Editable Installation

To set up the workspace correctly, run the following command from the root directory:

```bash
pip install -e .
```

This command installs all packages in editable mode, allowing you to develop multiple packages simultaneously with the correct Python imports.

### Import Structure

With the above setup, you can import modules as follows:

- `pykotor.extract.installation`
- `pykotor.resource.generics.utd`
- `Tools.HolocronToolset.HolocronToolset.main`
- `utility.system.path`

### Namespace Packages

If you prefer to use namespace packages to avoid potential conflicts, you can modify the `__init__.py` files to include:

```python
# Libraries/PyKotor/src/pykotor/__init__.py
__path__ = __import__('pkgutil').extend_path(__path__, __name__)
```

Repeat this for other namespace packages as needed.

## Dependencies

Ensure that the `Utility` package is properly specified in the `install_requires` section of `setup.py`. If there are additional dependencies for each package, consider specifying them under `extras_require` or within each sub-package's setup configuration.

## Conclusion

This configuration sets up a monorepo with multiple pip packages, sharing a common module and organizing the workspace to reflect the desired Python import structure. By using `setuptools` and configuring the `setup.py` and `pyproject.toml` appropriately, running `pip install -e .` will establish the correct environment for development and usage.
