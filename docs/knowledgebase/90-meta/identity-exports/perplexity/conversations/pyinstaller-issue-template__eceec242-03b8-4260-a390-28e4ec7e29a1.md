---
source_url: "https://www.perplexity.ai/search/451b88ef-7c9a-4fc1-b02c-5be48fc5e0c5"
thread_uuid: "eceec242-03b8-4260-a390-28e4ec7e29a1"
slug: "451b88ef-7c9a-4fc1-b02c-5be48fc5e0c5"
title: "pyinstaller ISSUE_TEMPLATE"
extracted_at: "2026-06-29T16:15:00.915Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# pyinstaller ISSUE_TEMPLATE

Source: [Perplexity thread](https://www.perplexity.ai/search/451b88ef-7c9a-4fc1-b02c-5be48fc5e0c5)

## User

pyinstaller ISSUE_TEMPLATE

## Assistant

When using PyInstaller to create executables from Python scripts, users often encounter various issues, particularly related to missing templates or resources. Below is a structured overview of common problems and solutions associated with PyInstaller, particularly focusing on the "Template not found" issue.

## Common Issues with PyInstaller

### 1. **Template Not Found Error**
This error typically arises when a Flask application attempts to render a template that is not included in the executable bundle. The error message often looks like this:
```
TemplateNotFound: template.html
```
This indicates that the specified template file could not be located during execution.

#### **Solution**
To resolve this issue, ensure that your template files are included in the build process. You can do this by using the `--add-data` option when running PyInstaller. For example:
```bash
pyinstaller --onefile --add-data "templates:templates" your_script.py
```
This command tells PyInstaller to include the `templates` directory in the output, making it accessible at runtime.

### 2. **Directory Structure**
Make sure that your project directory is structured correctly. For example:
```
/your_project
    /templates
        template.html
    your_script.py
```
When you specify `template_folder='templates'` in your Flask app, it should match the location where you place your HTML files.

### 3. **Using Spec Files**
If you require more complex configurations, consider using a `.spec` file. This file allows you to customize how PyInstaller builds your application, including specifying additional data files and hidden imports. Here’s an example of how to modify a spec file to include data files:
```python
a = Analysis(['your_script.py'],
             pathex=['/path/to/your_project'],
             datas=[('templates', 'templates')],
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[])

pyz = PYZ(a.pure, a.zipped_data)
exe = EXE(pyz,
          a.scripts,
          [],
          name='your_executable',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=True)
coll = COLLECT(exe, a.binaries, a.zipfiles, a.datas)
```
You can then build your executable using:
```bash
pyinstaller your_script.spec
```

### 4. **Debugging Tips**
If you continue to experience issues:
- Use the `--debug` option to get more detailed output during the build process.
- Check the `build/your_script/warn-your_script.txt` file for warnings about missing modules or files that may need to be addressed.

### 5. **General Recommendations**
- Ensure you are using compatible versions of Python and PyInstaller.
- Regularly consult the [PyInstaller documentation](https://pyinstaller.org/en/stable/) for updates and best practices.
- Test your executable in an environment similar to your target deployment environment to catch any discrepancies early.

By following these guidelines and solutions, you should be able to effectively troubleshoot and resolve common issues encountered when using PyInstaller for packaging Python applications.

### Sources

- [python - pyinstaller Template not found - Stack Overflow](https://stackoverflow.com/questions/40538138/pyinstaller-template-not-found)
  - I used pyinstaller to create an executable, but I am getting these errors when I run the executable: Traceback (most recent call last): File "flask/app.py", ...
- [Using PyInstaller — PyInstaller 6.11.1 documentation](https://pyinstaller.org/en/stable/usage.html)
- [Using Spec Files — PyInstaller 6.11.1 documentation](https://pyinstaller.org/en/stable/spec-files.html)
- [Using PyInstaller](https://pyinstaller.org/en/v4.8/usage.html)
- [options - PyInstaller Manual](https://pyinstaller.org/en/stable/man/pyinstaller.html)
- [What PyInstaller Does and How It Does It](https://pyinstaller.org/en/stable/operating-mode.html)
- [When Things Go Wrong — PyInstaller 6.11.1 documentation](https://pyinstaller.org/en/stable/when-things-go-wrong.html)
- [pyinstaller · PyPI](https://pypi.org/project/pyinstaller/)
