---
source_url: "https://chatgpt.com/c/4aa009b1-cca1-4eda-bbf1-b94531fbfa17"
conversation_id: "4aa009b1-cca1-4eda-bbf1-b94531fbfa17"
title: "Tkinter Message Box Fallback"
extracted_at: "2026-06-29T15:36:39.547Z"
message_count: 5
provenance: auth-ui
---

# Tkinter Message Box Fallback

Source: [ChatGPT conversation](https://chatgpt.com/c/4aa009b1-cca1-4eda-bbf1-b94531fbfa17)

## Assistant

To name all of the Tkinter message box functions, we refer to the tkinter.messagebox module. Here are the main functions:

showinfo

showwarning

showerror

askquestion

askokcancel

askyesno

askretrycancel

Next, I'll define these functions to first attempt calling the Tkinter message box function, and if that fails (e.g., Tkinter is not available), it will fall back to zenity, yad, or gtk in that order. For simplicity, I'll assume the fallback tools are available on a Unix-like system.

Here is the Python code for the functions:

Python
Run
import subprocess
import tkinter as tk
from tkinter import messagebox

def showinfo(title, message):
    try:
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        messagebox.showinfo(title, message)
    except Exception:
        try:
            subprocess.run(['zenity', '--info', '--title', title, '--text', message])
        except Exception:
            try:
                subprocess.run(['yad', '--info', '--title', title, '--text', message])
            except Exception:
                subprocess.run(['gtk-message-dialog', '--type=info', '--title', title, '--text', message])

def showwarning(title, message):
    try:
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        messagebox.showwarning(title, message)
    except Exception:
        try:
            subprocess.run(['zenity', '--warning', '--title', title, '--text', message])
        except Exception:
            try:
                subprocess.run(['yad', '--warning', '--title', title, '--text', message])
            except Exception:
                subprocess.run(['gtk-message-dialog', '--type=warning', '--title', title, '--text', message])

def showerror(title, message):
    try:
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        messagebox.showerror(title, message)
    except Exception:
        try:
            subprocess.run(['zenity', '--error', '--title', title, '--text', message])
        except Exception:
            try:
                subprocess.run(['yad', '--error', '--title', title, '--text', message])
            except Exception:
                subprocess.run(['gtk-message-dialog', '--type=error', '--title', title, '--text', message])

def askquestion(title, message):
    try:
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        return messagebox.askquestion(title, message)
    except Exception:
        try:
            result = subprocess.run(['zenity', '--question', '--title', title, '--text', message], check=True)
            return 'yes' if result.returncode == 0 else 'no'
        except Exception:
            try:
                result = subprocess.run(['yad', '--question', '--title', title, '--text', message], check=True)
                return 'yes' if result.returncode == 0 else 'no'
            except Exception:
                result = subprocess.run(['gtk-message-dialog', '--type=question', '--title', title, '--text', message], check=True)
                return 'yes' if result.returncode == 0 else 'no'

def askokcancel(title, message):
    try:
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        return messagebox.askokcancel(title, message)
    except Exception:
        try:
            result = subprocess.run(['zenity', '--question', '--ok-label=OK', '--cancel-label=Cancel', '--title', title, '--text', message], check=True)
            return result.returncode == 0
        except Exception:
            try:
                result = subprocess.run(['yad', '--question', '--button=OK:0', '--button=Cancel:1', '--title', title, '--text', message], check=True)
                return result.returncode == 0
            except Exception:
                result = subprocess.run(['gtk-message-dialog', '--type=question', '--title', title, '--text', message], check=True)
                return result.returncode == 0

def askyesno(title, message):
    try:
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        return messagebox.askyesno(title, message)
    except Exception:
        try:
            result = subprocess.run(['zenity', '--question', '--title', title, '--text', message], check=True)
            return result.returncode == 0
        except Exception:
            try:
                result = subprocess.run(['yad', '--question', '--button=Yes:0', '--button=No:1', '--title', title, '--text', message], check=True)
                return result.returncode == 0
            except Exception:
                result = subprocess.run(['gtk-message-dialog', '--type=question', '--title', title, '--text', message], check=True)
                return result.returncode == 0

def askretrycancel(title, message):
    try:
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        return messagebox.askretrycancel(title, message)
    except Exception:
        try:
            result = subprocess.run(['zenity', '--question', '--ok-label=Retry', '--cancel-label=Cancel', '--title', title, '--text', message], check=True)
            return result.returncode == 0
        except Exception:
            try:
                result = subprocess.run(['yad', '--question', '--button=Retry:0', '--button=Cancel:1', '--title', title, '--text', message], check=True)
                return result.returncode == 0
            except Exception:
                result = subprocess.run(['gtk-message-dialog', '--type=question', '--title', title, '--text', message], check=True)
                return result.returncode == 0

This code defines functions that attempt to use tkinter.messagebox functions first. If it encounters any exception (such as Tkinter not being installed or an error with the display), it falls back to using zenity, yad, or gtk in that order. The fallback commands assume these tools are available on the system and accessible via the command line.

## User

Please do the same thing with the file/folder/save dialogs

## Assistant

Certainly! Here are the main tkinter.filedialog functions:

askopenfilename

askopenfilenames

asksaveasfilename

askdirectory

We will define these functions to first attempt calling the tkinter.filedialog functions, and if that fails, they will fall back to zenity, yad, or gtk in that order.

Here is the Python code for the functions:

Python
Run
import subprocess
import tkinter as tk
from tkinter import filedialog

def askopenfilename(**options):
    try:
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        return filedialog.askopenfilename(**options)
    except Exception:
        try:
            cmd = ['zenity', '--file-selection']
            if 'title' in options:
                cmd.extend(['--title', options['title']])
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            return result.stdout.strip()
        except Exception:
            try:
                cmd = ['yad', '--file-selection']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip()
            except Exception:
                cmd = ['gtk-file-chooser-dialog', '--action=open']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip()

def askopenfilenames(**options):
    try:
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        return filedialog.askopenfilenames(**options)
    except Exception:
        try:
            cmd = ['zenity', '--file-selection', '--multiple']
            if 'title' in options:
                cmd.extend(['--title', options['title']])
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            return result.stdout.strip().split('|')
        except Exception:
            try:
                cmd = ['yad', '--file-selection', '--multiple']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip().split('|')
            except Exception:
                cmd = ['gtk-file-chooser-dialog', '--action=open', '--multiple']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip().split('|')

def asksaveasfilename(**options):
    try:
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        return filedialog.asksaveasfilename(**options)
    except Exception:
        try:
            cmd = ['zenity', '--file-selection', '--save']
            if 'title' in options:
                cmd.extend(['--title', options['title']])
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            return result.stdout.strip()
        except Exception:
            try:
                cmd = ['yad', '--file-selection', '--save']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip()
            except Exception:
                cmd = ['gtk-file-chooser-dialog', '--action=save']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip()

def askdirectory(**options):
    try:
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        return filedialog.askdirectory(**options)
    except Exception:
        try:
            cmd = ['zenity', '--file-selection', '--directory']
            if 'title' in options:
                cmd.extend(['--title', options['title']])
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            return result.stdout.strip()
        except Exception:
            try:
                cmd = ['yad', '--file-selection', '--directory']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip

## User

You are importing tkinter and not even doing it in try-except, whole point is tkinter is optional

## Assistant

Got it! Here is the corrected code with tkinter being imported within a try-except block, and the fallback mechanisms properly implemented:

Python
Run
import subprocess

def askopenfilename(**options):
    try:
        import tkinter as tk
        from tkinter import filedialog
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        return filedialog.askopenfilename(**options)
    except ImportError:
        try:
            cmd = ['zenity', '--file-selection']
            if 'title' in options:
                cmd.extend(['--title', options['title']])
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            return result.stdout.strip()
        except Exception:
            try:
                cmd = ['yad', '--file-selection']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip()
            except Exception:
                cmd = ['gtk-file-chooser-dialog', '--action=open']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip()

def askopenfilenames(**options):
    try:
        import tkinter as tk
        from tkinter import filedialog
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        return filedialog.askopenfilenames(**options)
    except ImportError:
        try:
            cmd = ['zenity', '--file-selection', '--multiple']
            if 'title' in options:
                cmd.extend(['--title', options['title']])
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            return result.stdout.strip().split('|')
        except Exception:
            try:
                cmd = ['yad', '--file-selection', '--multiple']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip().split('|')
            except Exception:
                cmd = ['gtk-file-chooser-dialog', '--action=open', '--multiple']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip().split('|')

def asksaveasfilename(**options):
    try:
        import tkinter as tk
        from tkinter import filedialog
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        return filedialog.asksaveasfilename(**options)
    except ImportError:
        try:
            cmd = ['zenity', '--file-selection', '--save']
            if 'title' in options:
                cmd.extend(['--title', options['title']])
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            return result.stdout.strip()
        except Exception:
            try:
                cmd = ['yad', '--file-selection', '--save']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip()
            except Exception:
                cmd = ['gtk-file-chooser-dialog', '--action=save']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip()

def askdirectory(**options):
    try:
        import tkinter as tk
        from tkinter import filedialog
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        return filedialog.askdirectory(**options)
    except ImportError:
        try:
            cmd = ['zenity', '--file-selection', '--directory']
            if 'title' in options:
                cmd.extend(['--title', options['title']])
            result = subprocess.run(cmd, check=True, capture_output=True, text=True)
            return result.stdout.strip()
        except Exception:
            try:
                cmd = ['yad', '--file-selection', '--directory']
                if 'title' in options:
                    cmd.extend(['--title', options['title']])
                result = subprocess.run(cmd, check=True, capture_output=True, text=True)
                return result.stdout.strip()

In this code, tkinter is imported inside a try-except block to ensure it is optional. If tkinter is not available, the code falls back to using zenity, yad, or gtk in that order to provide the file dialog functionality.
