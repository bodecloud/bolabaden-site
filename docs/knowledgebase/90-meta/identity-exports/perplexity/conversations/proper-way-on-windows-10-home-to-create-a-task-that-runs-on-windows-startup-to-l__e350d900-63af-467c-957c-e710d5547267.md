---
source_url: "https://www.perplexity.ai/search/7fa5c4c3-01bc-4e08-99f0-8989eb9b0dcc"
thread_uuid: "e350d900-63af-467c-957c-e710d5547267"
slug: "7fa5c4c3-01bc-4e08-99f0-8989eb9b0dcc"
title: "Proper way on windows 10 home to create a task that runs on windows startup to launch my application with elevated privileges without using uac"
extracted_at: "2026-06-29T16:20:56.823Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# Proper way on windows 10 home to create a task that runs on windows startup to launch my application with elevated privileges without using uac

Source: [Perplexity thread](https://www.perplexity.ai/search/7fa5c4c3-01bc-4e08-99f0-8989eb9b0dcc)

## User

Proper way on windows 10 home to create a task that runs on windows startup to launch my application with elevated privileges without using uac

## Assistant

To create a task that runs your application with elevated privileges on Windows 10 Home startup without using UAC, you can use the Task Scheduler. Here's a step-by-step guide to accomplish this:

## Creating an Elevated Task in Task Scheduler

1. Open Task Scheduler by pressing Win + R, typing "taskschd.msc", and pressing Enter.[2]

2. In Task Scheduler, click on "Create Task" in the Actions pane on the right.[2]

3. In the General tab of the Create Task window:
   - Give your task a name
   - Select "Run whether user is logged on or not"
   - Check "Run with highest privileges"
   - Choose "Windows 10" from the "Configure for" dropdown[3][2]

4. Switch to the Triggers tab and click "New":
   - Set "Begin the task" to "At startup"
   - Click OK to save the trigger[3]

5. Go to the Actions tab and click "New":
   - Set "Action" to "Start a program"
   - Browse and select your application's executable file
   - Click OK to save the action[2][3]

6. In the Conditions tab:
   - Uncheck "Start the task only if the computer is on AC power"[3][2]

7. In the Settings tab:
   - Ensure "Allow task to be run on demand" is checked
   - Select "Do not start a new instance" at the bottom[2]

8. Click OK to save the task. You'll be prompted to enter your account password.[3]

## Testing the Task

To test if the task runs correctly:

1. In Task Scheduler, find your newly created task.
2. Right-click on it and select "Run".[3]

Your application should launch with elevated privileges without a UAC prompt.

## Creating a Shortcut (Optional)

If you want to create a shortcut to run this task:

1. Right-click on your desktop and choose New > Shortcut.
2. In the location field, type: `schtasks.exe /run /tn "Task Name"`
   (Replace "Task Name" with the name you gave your task).[3]
3. Give the shortcut a name and finish creating it.

This shortcut will run your application with elevated privileges without a UAC prompt when double-clicked.[3]

Remember that running applications with elevated privileges without UAC prompts can pose security risks. Only use this method for trusted applications that you're certain require these privileges.[1][4]

### Sources

- [How to Auto Run any Program as Admin on Startup in Windows 10 ...](https://www.youtube.com/watch?v=_bTTdKi7Lvg)
  - In this video I will show you how to auto run any software with administrator permissions on startup in Windows 10. I go through 2 separate ways of starting a program as admin automatically without prompt when you log on to Windows. The first way to autorun an app with admin privileges on startup in windows is to change the properties of the program file and check "run this program as an administrator" under the compatibility tab, then creating a shortcut for that file in your windows startup...
- [Create Elevated Shortcut without UAC prompt in Windows 10](https://www.tenforums.com/tutorials/57690-create-elevated-shortcut-without-uac-prompt-windows-10-a.html)
  - How to Create Elevated App Shortcut without UAC Prompt in Windows 10 When you open an application file with Run as administrator, you will get a UACprompt for approval before the app is allowed to run with elevated rights. In addition, Windows will not allow elevated apps to run at startupby default. If you want to run an app as administrator (elevated) without getting a UAC prompt or at startup, then you can create an elevated task to run the application as a workaround to do so. This...
- [Use the Windows Task Scheduler to run apps without UAC prompts ...](https://www.digitalcitizen.life/use-task-scheduler-launch-programs-without-uac-prompts/)
  - Log in with a user that as administrator permissions. Then, run the *Task Scheduler*. If you do not know how we have published a separate guide on this subject: 9 ways to start the Task Scheduler in Windows (all versions). If you do not feel like reading another guide, a quick method is to search for *"task scheduler"* in Windows and click or tap the appropriate search result.... ## Step 2. Create a scheduled task for the app, game or file that you want to run without UAC prompts In the *Task...
- [How to Run Program without Admin Privileges and Bypass UAC ...](https://woshub.com/run-program-without-admin-password-and-bypass-uac-prompt/)
  - Earlier we described how to disable a UAC prompt for a specific program using the RunAsInvoker parameter. However, this method is not flexible enough. Let’s look at a simpler way to force any program to run without administrator privileges (without entering the admin password) and with UAC enabled (Level 4, 3, or 2 of the UAC slider). Let’s take the Registry Editor as an example — regedit.exe (it is located in the C:\Windows\ folder). Notice the UAC shield next to the app icon. This icon means...
- [Run an executable as Administrator without my approval](https://answers.microsoft.com/en-us/windows/forum/all/run-an-executable-as-administrator-without-my/3e87a65a-2daf-4ce2-8f27-a07f23cb8b67)
  - Hello! Is there a way to run at the Windows' startup a software as Admin without me clicking the "Yes" button (example image below of what I would like to remove)? October 14, 2024 Hello! Is there a way to run at the Windows' startup a software as Admin without me clicking the "Yes" button (example image below of what I would like to remove)? Reported content has been submitted Please delete your task and import this XML instead. Reported content has been submitted 1 person found this reply...
