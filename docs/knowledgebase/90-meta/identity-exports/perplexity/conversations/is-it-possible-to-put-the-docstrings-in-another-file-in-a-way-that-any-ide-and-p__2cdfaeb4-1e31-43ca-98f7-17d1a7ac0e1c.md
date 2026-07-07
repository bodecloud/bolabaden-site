---
source_url: "https://www.perplexity.ai/search/924a2617-a10a-476b-b48f-efda323c5579"
thread_uuid: "2cdfaeb4-1e31-43ca-98f7-17d1a7ac0e1c"
slug: "924a2617-a10a-476b-b48f-efda323c5579"
title: "is it possible to put the docstrings in another file in a way that any ide and python code relying on them can still make use of it? like they just bloat the files a bit."
extracted_at: "2026-06-29T16:18:51.534Z"
matched_keywords: []
export_suite: "identity"
entry_count: 3
provenance: perplexity-rest-api
---

# is it possible to put the docstrings in another file in a way that any ide and python code relying on them can still make use of it? like they just bloat the files a bit.

Source: [Perplexity thread](https://www.perplexity.ai/search/924a2617-a10a-476b-b48f-efda323c5579)

## User

is it possible to put the docstrings in another file in a way that any ide and python code relying on them can still make use of it? like they just bloat the files a bit.

## Assistant

Yes, it is possible to store docstrings in separate files while still allowing IDEs and Python code to utilize them effectively. However, this approach requires some additional setup and may not be as straightforward as having docstrings directly in the code. Here are a few methods to achieve this:

## 1. Using a Decorator

You can create a decorator that reads docstrings from external files and attaches them to functions or classes. This method allows you to keep your docstrings separate while still making them accessible through the `__doc__` attribute.[7]

```python
import functools

def external_docstring(filename):
    def decorator(func):
        with open(filename, 'r') as f:
            func.__doc__ = f.read()
        return func
    return decorator

@external_docstring('my_function_doc.txt')
def my_function():
    pass
```

This approach works well with IDEs and tools that rely on `__doc__` attributes. However, it requires you to manually decorate each function or class.

## 2. Custom Import Hook

You can create a custom import hook that automatically reads and attaches docstrings from external files when modules are imported. This method is more complex but provides a more seamless integration.[1]

```python
import sys
from importlib.abc import MetaPathFinder, Loader
from importlib.util import spec_from_file_location

class DocstringLoader(Loader):
    def __init__(self, fullname, path):
        self.fullname = fullname
        self.path = path

    def create_module(self, spec):
        return None

    def exec_module(self, module):
        with open(self.path, 'rb') as f:
            exec(f.read(), module.__dict__)
        
        # Load external docstrings
        docstring_file = self.path.replace('.py', '_doc.txt')
        try:
            with open(docstring_file, 'r') as f:
                module.__doc__ = f.read()
        except FileNotFoundError:
            pass

class DocstringFinder(MetaPathFinder):
    def find_spec(self, fullname, path, target=None):
        if path is None:
            path = sys.path
        for entry in path:
            if entry == '':
                entry = '.'
            try:
                filename = f"{fullname.split('.')[-1]}.py"
                filepath = os.path.join(entry, filename)
                if os.path.isfile(filepath):
                    return spec_from_file_location(
                        fullname, filepath, loader=DocstringLoader(fullname, filepath)
                    )
            except Exception:
                continue
        return None

sys.meta_path.insert(0, DocstringFinder())
```

This method allows you to keep your docstrings in separate files (e.g., `module_doc.txt` for `module.py`) without modifying your existing code.

## 3. Sphinx Documentation

If your main goal is to generate documentation, you can use Sphinx with its autodoc extension. This allows you to write documentation separately and include docstrings from your code.[2][3]

In your Sphinx `conf.py`:

```python
extensions = ['sphinx.ext.autodoc']
```

Then in your documentation files:

```rst
.. automodule:: your_module
   :members:
```

This approach is particularly useful for generating comprehensive documentation but may not directly affect IDE functionality.

## Considerations

1. **IDE Support**: While these methods can work, some IDEs may not fully recognize docstrings that are not directly in the code. This could affect features like auto-completion and quick documentation lookup.[5][6]

2. **Maintenance**: Keeping docstrings in separate files can make maintenance more challenging, as you'll need to ensure the external files stay synchronized with your code.

3. **Performance**: Methods that dynamically load docstrings may have a slight performance impact, especially for large projects.

4. **Standard Practice**: It's worth noting that keeping docstrings directly in the code is the standard practice in Python. Deviating from this might make your code less familiar to other Python developers.

In conclusion, while it's possible to keep docstrings in separate files, it's generally recommended to keep them with the code unless you have a compelling reason to do otherwise. If you do choose to separate them, the decorator method or custom import hook can be effective solutions, depending on your specific needs and the scale of your project.

### Sources

- [Documenting Python Code: A Complete Guide](https://realpython.com/documenting-python-code/)
- [PEP 257 – Docstring Conventions | peps.python.org](https://peps.python.org/pep-0257/)
- [Python External Documentation | IntelliJ IDEA - JetBrains](https://www.jetbrains.com/help/idea/settings-tools-python-external-documentation.html)
- [Python Docstrings Tutorial : Examples & Format for Pydoc, Numpy ...](https://www.datacamp.com/tutorial/docstrings-python)
- [Is there a way to keep docstrings separate from the functions they ...](https://stackoverflow.com/questions/4732850/is-there-a-way-to-keep-docstrings-separate-from-the-functions-they-document)
- [External Documentation | PyCharm - JetBrains](https://www.jetbrains.com/help/pycharm/settings-tools-python-external-documentation.html)
- [Write python docstrings in a separate text file. - GitHub Gist](https://gist.github.com/polyrand/fb4d945c2ab94797484a1a5817e70325)

## User

nah i'm specifically looking for answers on how to not put docstrings directly under functions, but provide them in another file that's a widely adopted practice using .pyi

## Assistant

While storing docstrings in separate files is not a widely adopted practice in Python, there are a few approaches you can use to achieve this goal. Here are some methods that can help you keep docstrings separate from your main code while still making them accessible:

## 1. Using Stub Files (.pyi)

Stub files (.pyi) are primarily designed for type annotations, but they can also include docstrings. However, not all tools and IDEs fully support docstrings in stub files.[1]

```python
# mymodule.pyi
def my_function(arg: int) -> str:
    """
    This is the docstring for my_function.
    It describes what the function does.
    """
    ...
```

While this method works for type checking and some documentation generation tools, it may not be fully supported by all IDEs for features like auto-completion and quick documentation lookup.

## 2. Decorator Approach

You can create a decorator that reads docstrings from external files and attaches them to functions or classes.[2]

```python
# docd.py
def doc(f):
    with open("docs.txt") as d:
        docfile = d.read()
    if f.__doc__:
        prev_doc = f.__doc__
        f.__doc__ = prev_doc + "\n\n# Additional Documentation\n" + docfile
    else:
        f.__doc__ = docfile
    return f

# mymodule.py
@doc
def my_function():
    """Original docstring."""
    return 1

# docs.txt
This is additional documentation for my_function.
It provides more details about the function's behavior.
```

This approach allows you to keep some documentation in the code and supplement it with external content.

## 3. Custom Import Hook

You can create a custom import hook that automatically reads and attaches docstrings from external files when modules are imported. This is a more advanced technique and requires careful implementation.

```python
import sys
from importlib.abc import MetaPathFinder, Loader
from importlib.util import spec_from_file_location

class DocstringLoader(Loader):
    def __init__(self, fullname, path):
        self.fullname = fullname
        self.path = path

    def create_module(self, spec):
        return None

    def exec_module(self, module):
        with open(self.path, 'rb') as f:
            exec(f.read(), module.__dict__)
        
        docstring_file = self.path.replace('.py', '_doc.txt')
        try:
            with open(docstring_file, 'r') as f:
                module.__doc__ = f.read()
        except FileNotFoundError:
            pass

# Implement a custom finder and add it to sys.meta_path
```

This method allows you to keep your docstrings in separate files (e.g., `module_doc.txt` for `module.py`) without modifying your existing code.

## Considerations

1. **IDE Support**: These methods may not be fully supported by all IDEs, potentially affecting features like auto-completion and quick documentation lookup.

2. **Maintenance**: Keeping docstrings in separate files can make maintenance more challenging, as you'll need to ensure the external files stay synchronized with your code.

3. **Standard Practice**: It's important to note that keeping docstrings directly in the code is the standard practice in Python. Deviating from this might make your code less familiar to other Python developers.

4. **Documentation Tools**: Some documentation generation tools may not fully support these non-standard approaches to docstring management.

While these methods can help you separate docstrings from your main code, they are not widely adopted practices in the Python community. If you choose to use them, be aware of the potential limitations and ensure that your approach is well-documented for other developers who may work on your project.

### Sources

- [Stub files - mypy 1.13.0 documentation](https://mypy.readthedocs.io/en/stable/stubs.html)
- [Write python docstrings in a separate text file.](https://gist.github.com/polyrand/fb4d945c2ab94797484a1a5817e70325)
- [docstrings in python stub files (*.pyi) - Stack Overflow](https://stackoverflow.com/questions/68358551/docstrings-in-python-stub-files-pyi)

## User

is there any tool that'll create .pyi automatically? what's the easiest way to batch them all or what do people usually do for it?

## Assistant

Yes, there are several tools available to automatically generate .pyi stub files for Python modules. Based on the search results and common practices, here are some popular options:

1. stubgen (part of mypy):
stubgen is a built-in tool that comes with mypy, a popular static type checker for Python. It's widely used and can generate stubs for both Python and C extension modules.[5]

Usage example:
```
stubgen foo.py bar.py
```
or
```
stubgen -m module_name -p package_name
```

2. pygenstub:
pygenstub is a utility specifically designed for generating stub files from Python source files.[1]

Installation:
```
pip install pygenstub
```

Usage:
```
pygenstub foo.py
```

3. make-stub-files:
This is a script that creates .pyi files based on source files and allows for customization through configuration files.[4]

Usage:
```
make_stub_files foo.py
```

4. vtkmodules.generate_pyi:
While this is specific to VTK modules, it demonstrates that some libraries provide their own stub generation tools.[2]

5. stub-generator:
This is a runtime stub generator that can create stubs dynamically.[6]

For batching and what people usually do:

1. Batch processing: Most of these tools allow you to specify multiple files or directories. For example, with stubgen:
   ```
   stubgen my_package_directory
   ```

2. Integration with build processes: Many projects integrate stub generation into their build or CI/CD processes to automatically generate and update stubs.

3. Manual refinement: Automatically generated stubs often require some manual tweaking for optimal results. Developers typically generate stubs automatically and then refine them by hand.

4. Version control: Stub files are usually kept under version control along with the source code.

5. Using typeshed: For third-party libraries, many developers contribute stubs to the typeshed project, which is a collection of library stubs for the Python standard library and third-party packages.

The easiest approach for most projects would be to use stubgen from mypy, as it's widely adopted and well-maintained. For a typical workflow:

1. Generate initial stubs using stubgen.
2. Review and refine the generated stubs manually.
3. Include stub generation in your build process to keep stubs updated.
4. Commit the refined stubs to your version control system.

Remember, while these tools can save a lot of time, the automatically generated stubs may not be perfect and often benefit from manual review and enhancement.

### Sources

- [pygenstub · PyPI](https://pypi.org/project/pygenstub/1.0a6/)
- [vtkmodules.generate_pyi - VTK documentation](https://docs.vtk.org/en/latest/api/python/vtkmodules/vtkmodules.generate_pyi.html)
- [Stub files - mypy 1.13.0 documentation](https://mypy.readthedocs.io/en/stable/stubs.html)
- [edreamleo/make-stub-files: Script and config file that creates python ...](https://github.com/edreamleo/make-stub-files)
- [Automatic stub generation (stubgen) - mypy 1.13.0 documentation](https://mypy.readthedocs.io/en/stable/stubgen.html)
- [Python stub generator - PyPI](https://pypi.org/project/stub-generator/)
