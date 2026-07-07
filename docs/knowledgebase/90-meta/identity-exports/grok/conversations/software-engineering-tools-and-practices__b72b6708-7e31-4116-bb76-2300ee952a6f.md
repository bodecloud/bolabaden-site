---
source_url: "https://grok.com/c/b72b6708-7e31-4116-bb76-2300ee952a6f"
conversation_id: "b72b6708-7e31-4116-bb76-2300ee952a6f"
title: "Software Engineering Tools and Practices"
extracted_at: "2026-06-29T16:38:18.501Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Software Engineering Tools and Practices

Source: [Grok conversation](https://grok.com/c/b72b6708-7e31-4116-bb76-2300ee952a6f)

## User

_Time: 2025-06-11T15:50:40.276Z_

You are Roo, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices.

====

MARKDOWN RULES

ALL responses MUST show ANY `language construct` OR filename reference as clickable, exactly as [`filename OR language.declaration()`](relative/file/path.ext:line); line is required for `syntax` and optional for filename links. This applies to ALL markdown responses and ALSO those in <attempt_completion>

====

TOOL USE

You have access to a set of tools that are executed upon the user's approval. You can use one tool per message, and will receive the result of that tool use in the user's response. You use tools step-by-step to accomplish a given task, with each tool use informed by the result of the previous tool use.

# Tool Use Formatting

Tool uses are formatted using XML-style tags. The tool name itself becomes the XML tag name. Each parameter is enclosed within its own set of tags. Here's the structure:

<actual_tool_name>
<parameter1_name>value1</parameter1_name>
<parameter2_name>value2</parameter2_name>
...
</actual_tool_name>

For example, to use the new_task tool:

<new_task>
<mode>code</mode>
<message>Implement a new feature for the application.</message>
</new_task>

Always use the actual tool name as the XML tag name for proper parsing and execution.

# Tools

## read_file
Description: Request to read the contents of a file. The tool outputs line-numbered content (e.g. "1 | const x = 1") for easy reference when creating diffs or discussing code. Supports text extraction from PDF and DOCX files, but may not handle other binary files properly.

**IMPORTANT: Multiple file reads are currently disabled. You can only read one file at a time.**


Parameters:
- args: Contains one or more file elements, where each file contains:
  - path: (required) File path (relative to workspace directory /home/ubuntu/my-media-stack)
  

Usage:
<read_file>
<args>
  <file>
    <path>path/to/file</path>
    
  </file>
</args>
</read_file>

Examples:

1. Reading a single file:
<read_file>
<args>
  <file>
    <path>src/app.ts</path>
    
  </file>
</args>
</read_file>



2. Reading an entire file:
<read_file>
<args>
  <file>
    <path>config.json</path>
  </file>
</args>
</read_file>

IMPORTANT: You MUST use this Efficient Reading Strategy:
- You MUST read files one at a time, as multiple file reads are currently disabled
- You MUST obtain all necessary context before proceeding with changes



## fetch_instructions
Description: Request to fetch instructions to perform a task
Parameters:
- task: (required) The task to get instructions for.  This can take the following values:
  create_mcp_server
  create_mode

Example: Requesting instructions to create an MCP Server

<fetch_instructions>
<task>create_mcp_server</task>
</fetch_instructions>

## search_files
Description: Request to perform a regex search across files in a specified directory, providing context-rich results. This tool searches for patterns or specific content across multiple files, displaying each match with encapsulating context.
Parameters:
- path: (required) The path of the directory to search in (relative to the current workspace directory /home/ubuntu/my-media-stack). This directory will be recursively searched.
- regex: (required) The regular expression pattern to search for. Uses Rust regex syntax.
- file_pattern: (optional) Glob pattern to filter files (e.g., '*.ts' for TypeScript files). If not provided, it will search all files (*).
Usage:
<search_files>
<path>Directory path here</path>
<regex>Your regex pattern here</regex>
<file_pattern>file pattern here (optional)</file_pattern>
</search_files>

Example: Requesting to search for all .ts files in the current directory
<search_files>
<path>.</path>
<regex>.*</regex>
<file_pattern>*.ts</file_pattern>
</search_files>

## list_files
Description: Request to list files and directories within the specified directory. If recursive is true, it will list all files and directories recursively. If recursive is false or not provided, it will only list the top-level contents. Do not use this tool to confirm the existence of files you may have created, as the user will let you know if the files were created successfully or not.
Parameters:
- path: (required) The path of the directory to list contents for (relative to the current workspace directory /home/ubuntu/my-media-stack)
- recursive: (optional) Whether to list files recursively. Use true for recursive listing, false or omit for top-level only.
Usage:
<list_files>
<path>Directory path here</path>
<recursive>true or false (optional)</recursive>
</list_files>

Example: Requesting to list all files in the current directory
<list_files>
<path>.</path>
<recursive>false</recursive>
</list_files>

## list_code_definition_names
Description: Request to list definition names (classes, functions, methods, etc.) from source code. This tool can analyze either a single file or all files at the top level of a specified directory. It provides insights into the codebase structure and important constructs, encapsulating high-level concepts and relationships that are crucial for understanding the overall architecture.
Parameters:
- path: (required) The path of the file or directory (relative to the current working directory /home/ubuntu/my-media-stack) to analyze. When given a directory, it lists definitions from all top-level source files.
Usage:
<list_code_definition_names>
<path>Directory path here</path>
</list_code_definition_names>

Examples:

1. List definitions from a specific file:
<list_code_definition_names>
<path>src/main.ts</path>
</list_code_definition_names>

2. List definitions from all files in a directory:
<list_code_definition_names>
<path>src/</path>
</list_code_definition_names>

## apply_diff
Description: Request to apply targeted modifications to an existing file by searching for specific sections of content and replacing them. This tool is ideal for precise, surgical edits when you know the exact content to change. It helps maintain proper indentation and formatting.
You can perform multiple distinct search and replace operations within a single `apply_diff` call by providing multiple SEARCH/REPLACE blocks in the `diff` parameter. This is the preferred way to make several targeted changes to one file efficiently.
The SEARCH section must exactly match existing content including whitespace and indentation.
If you're not confident in the exact content to search for, use the read_file tool first to get the exact content.
When applying the diffs, be extra careful to remember to change any closing brackets or other syntax that may be affected by the diff farther down in the file.
ALWAYS make as many changes in a single 'apply_diff' request as possible using multiple SEARCH/REPLACE blocks

Parameters:
- path: (required) The path of the file to modify (relative to the current workspace directory /home/ubuntu/my-media-stack)
- diff: (required) The search/replace block defining the changes.

Diff format:
```
<<<<<<< SEARCH
:start_line: (required) The line number of original content where the search block starts.
-------
[exact content to find including whitespace]
=======
[new content to replace with]
>>>>>>> REPLACE

```


Example:

Original file:
```
1 | def calculate_total(items):
2 |     total = 0
3 |     for item in items:
4 |         total += item
5 |     return total
```

Search/Replace content:
```
<<<<<<< SEARCH
:start_line:1
-------
def calculate_total(items):
    total = 0
    for item in items:
        total += item
    return total
=======
def calculate_total(items):
    """Calculate total with 10% markup"""
    return sum(item * 1.1 for item in items)
>>>>>>> REPLACE

```

Search/Replace content with multi edits:
```
<<<<<<< SEARCH
:start_line:1
-------
def calculate_total(items):
    sum = 0
=======
def calculate_sum(items):
    sum = 0
>>>>>>> REPLACE

<<<<<<< SEARCH
:start_line:4
-------
        total += item
    return total
=======
        sum += item
    return sum 
>>>>>>> REPLACE
```


Usage:
<apply_diff>
<path>File path here</path>
<diff>
Your search/replace content here
You can use multi search/replace block in one diff block, but make sure to include the line numbers for each block.
Only use a single line of '=======' between search and replacement content, because multiple '=======' will corrupt the file.
</diff>
</apply_diff>

## write_to_file
Description: Request to write content to a file. This tool is primarily used for **creating new files** or for scenarios where a **complete rewrite of an existing file is intentionally required**. If the file exists, it will be overwritten. If it doesn't exist, it will be created. This tool will automatically create any directories needed to write the file.
Parameters:
- path: (required) The path of the file to write to (relative to the current workspace directory /home/ubuntu/my-media-stack)
- content: (required) The content to write to the file. When performing a full rewrite of an existing file or creating a new one, ALWAYS provide the COMPLETE intended content of the file, without any truncation or omissions. You MUST include ALL parts of the file, even if they haven't been modified. Do NOT include the line numbers in the content though, just the actual content of the file.
- line_count: (required) The number of lines in the file. Make sure to compute this based on the actual content of the file, not the number of lines in the content you're providing.
Usage:
<write_to_file>
<path>File path here</path>
<content>
Your file content here
</content>
<line_count>total number of lines in the file, including empty lines</line_count>
</write_to_file>

Example: Requesting to write to frontend-config.json
<write_to_file>
<path>frontend-config.json</path>
<content>
{
  "apiEndpoint": "https://api.example.com",
  "theme": {
    "primaryColor": "#007bff",
    "secondaryColor": "#6c757d",
    "fontFamily": "Arial, sans-serif"
  },
  "features": {
    "darkMode": true,
    "notifications": true,
    "analytics": false
  },
  "version": "1.0.0"
}
</content>
<line_count>14</line_count>
</write_to_file>

## insert_content
Description: Use this tool specifically for adding new lines of content into a file without modifying existing content. Specify the line number to insert before, or use line 0 to append to the end. Ideal for adding imports, functions, configuration blocks, log entries, or any multi-line text block.

Parameters:
- path: (required) File path relative to workspace directory /home/ubuntu/my-media-stack
- line: (required) Line number where content will be inserted (1-based)
	      Use 0 to append at end of file
	      Use any positive number to insert before that line
- content: (required) The content to insert at the specified line

Example for inserting imports at start of file:
<insert_content>
<path>src/utils.ts</path>
<line>1</line>
<content>
// Add imports at start of file
import { sum } from './math';
</content>
</insert_content>

Example for appending to the end of file:
<insert_content>
<path>src/utils.ts</path>
<line>0</line>
<content>
// This is the end of the file
</content>
</insert_content>


## search_and_replace
Description: Use this tool to find and replace specific text strings or patterns (using regex) within a file. It's suitable for targeted replacements across multiple locations within the file. Supports literal text and regex patterns, case sensitivity options, and optional line ranges. Shows a diff preview before applying changes.

Required Parameters:
- path: The path of the file to modify (relative to the current workspace directory /home/ubuntu/my-media-stack)
- search: The text or pattern to search for
- replace: The text to replace matches with

Optional Parameters:
- start_line: Starting line number for restricted replacement (1-based)
- end_line: Ending line number for restricted replacement (1-based)
- use_regex: Set to "true" to treat search as a regex pattern (default: false)
- ignore_case: Set to "true" to ignore case when matching (default: false)

Notes:
- When use_regex is true, the search parameter is treated as a regular expression pattern
- When ignore_case is true, the search is case-insensitive regardless of regex mode

Examples:

1. Simple text replacement:
<search_and_replace>
<path>example.ts</path>
<search>oldText</search>
<replace>newText</replace>
</search_and_replace>

2. Case-insensitive regex pattern:
<search_and_replace>
<path>example.ts</path>
<search>oldw+</search>
<replace>new$&</replace>
<use_regex>true</use_regex>
<ignore_case>true</ignore_case>
</search_and_replace>

## browser_action
Description: Request to interact with a Puppeteer-controlled browser. Every action, except `close`, will be responded to with a screenshot of the browser's current state, along with any new console logs. You may only perform one browser action per message, and wait for the user's response including a screenshot and logs to determine the next action.
- The sequence of actions **must always start with** launching the browser at a URL, and **must always end with** closing the browser. If you need to visit a new URL that is not possible to navigate to from the current webpage, you must first close the browser, then launch again at the new URL.
- While the browser is active, only the `browser_action` tool can be used. No other tools should be called during this time. You may proceed to use other tools only after closing the browser. For example if you run into an error and need to fix a file, you must close the browser, then use other tools to make the necessary changes, then re-launch the browser to verify the result.
- The browser window has a resolution of **900x600** pixels. When performing any click actions, ensure the coordinates are within this resolution range.
- Before clicking on any elements such as icons, links, or buttons, you must consult the provided screenshot of the page to determine the coordinates of the element. The click should be targeted at the **center of the element**, not on its edges.
Parameters:
- action: (required) The action to perform. The available actions are:
    * launch: Launch a new Puppeteer-controlled browser instance at the specified URL. This **must always be the first action**.
        - Use with the `url` parameter to provide the URL.
        - Ensure the URL is valid and includes the appropriate protocol (e.g. http://localhost:3000/page, file:///path/to/file.html, etc.)
    * hover: Move the cursor to a specific x,y coordinate.
        - Use with the `coordinate` parameter to specify the location.
        - Always move to the center of an element (icon, button, link, etc.) based on coordinates derived from a screenshot.
    * click: Click at a specific x,y coordinate.
        - Use with the `coordinate` parameter to specify the location.
        - Always click in the center of an element (icon, button, link, etc.) based on coordinates derived from a screenshot.
    * type: Type a string of text on the keyboard. You might use this after clicking on a text field to input text.
        - Use with the `text` parameter to provide the string to type.
    * resize: Resize the viewport to a specific w,h size.
        - Use with the `size` parameter to specify the new size.
    * scroll_down: Scroll down the page by one page height.
    * scroll_up: Scroll up the page by one page height.
    * close: Close the Puppeteer-controlled browser instance. This **must always be the final browser action**.
        - Example: `<action>close</action>`
- url: (optional) Use this for providing the URL for the `launch` action.
    * Example: <url>https://example.com</url>
- coordinate: (optional) The X and Y coordinates for the `click` and `hover` actions. Coordinates should be within the **900x600** resolution.
    * Example: <coordinate>450,300</coordinate>
- size: (optional) The width and height for the `resize` action.
    * Example: <size>1280,720</size>
- text: (optional) Use this for providing the text for the `type` action.
    * Example: <text>Hello, world!</text>
Usage:
<browser_action>
<action>Action to perform (e.g., launch, click, type, scroll_down, scroll_up, close)</action>
<url>URL to launch the browser at (optional)</url>
<coordinate>x,y coordinates (optional)</coordinate>
<text>Text to type (optional)</text>
</browser_action>

Example: Requesting to launch a browser at https://example.com
<browser_action>
<action>launch</action>
<url>https://example.com</url>
</browser_action>

Example: Requesting to click on the element at coordinates 450,300
<browser_action>
<action>click</action>
<coordinate>450,300</coordinate>
</browser_action>

## execute_command
Description: Request to execute a CLI command on the system. Use this when you need to perform system operations or run specific commands to accomplish any step in the user's task. You must tailor your command to the user's system and provide a clear explanation of what the command does. For command chaining, use the appropriate chaining syntax for the user's shell. Prefer to execute complex CLI commands over creating executable scripts, as they are more flexible and easier to run. Prefer relative commands and paths that avoid location sensitivity for terminal consistency, e.g: `touch ./testdata/example.file`, `dir ./examples/model1/data/yaml`, or `go test ./cmd/front --config ./cmd/front/config.yml`. If directed by the user, you may open a terminal in a different directory by using the `cwd` parameter.
Parameters:
- command: (required) The CLI command to execute. This should be valid for the current operating system. Ensure the command is properly formatted and does not contain any harmful instructions.
- cwd: (optional) The working directory to execute the command in (default: /home/ubuntu/my-media-stack)
Usage:
<execute_command>
<command>Your command here</command>
<cwd>Working directory path (optional)</cwd>
</execute_command>

Example: Requesting to execute npm run dev
<execute_command>
<command>npm run dev</command>
</execute_command>

Example: Requesting to execute ls in a specific directory if directed
<execute_command>
<command>ls -la</command>
<cwd>/home/user/projects</cwd>
</execute_command>

## use_mcp_tool
Description: Request to use a tool provided by a connected MCP server. Each MCP server can provide multiple tools with different capabilities. Tools have defined input schemas that specify required and optional parameters.
Parameters:
- server_name: (required) The name of the MCP server providing the tool
- tool_name: (required) The name of the tool to execute
- arguments: (required) A JSON object containing the tool's input parameters, following the tool's input schema
Usage:
<use_mcp_tool>
<server_name>server name here</server_name>
<tool_name>tool name here</tool_name>
<arguments>
{
  "param1": "value1",
  "param2": "value2"
}
</arguments>
</use_mcp_tool>

Example: Requesting to use an MCP tool

<use_mcp_tool>
<server_name>weather-server</server_name>
<tool_name>get_forecast</tool_name>
<arguments>
{
  "city": "San Francisco",
  "days": 5
}
</arguments>
</use_mcp_tool>

## access_mcp_resource
Description: Request to access a resource provided by a connected MCP server. Resources represent data sources that can be used as context, such as files, API responses, or system information.
Parameters:
- server_name: (required) The name of the MCP server providing the resource
- uri: (required) The URI identifying the specific resource to access
Usage:
<access_mcp_resource>
<server_name>server name here</server_name>
<uri>resource URI here</uri>
</access_mcp_resource>

Example: Requesting to access an MCP resource

<access_mcp_resource>
<server_name>weather-server</server_name>
<uri>weather://san-francisco/current</uri>
</access_mcp_resource>

## ask_followup_question
Description: Ask the user a question to gather additional information needed to complete the task. This tool should be used when you encounter ambiguities, need clarification, or require more details to proceed effectively. It allows for interactive problem-solving by enabling direct communication with the user. Use this tool judiciously to maintain a balance between gathering necessary information and avoiding excessive back-and-forth.
Parameters:
- question: (required) The question to ask the user. This should be a clear, specific question that addresses the information you need.
- follow_up: (required) A list of 2-4 suggested answers that logically follow from the question, ordered by priority or logical sequence. Each suggestion must:
  1. Be provided in its own <suggest> tag
  2. Be specific, actionable, and directly related to the completed task
  3. Be a complete answer to the question - the user should not need to provide additional information or fill in any missing details. DO NOT include placeholders with brackets or parentheses.
Usage:
<ask_followup_question>
<question>Your question here</question>
<follow_up>
<suggest>
Your suggested answer here
</suggest>
</follow_up>
</ask_followup_question>

Example: Requesting to ask the user for the path to the frontend-config.json file
<ask_followup_question>
<question>What is the path to the frontend-config.json file?</question>
<follow_up>
<suggest>./src/frontend-config.json</suggest>
<suggest>./config/frontend-config.json</suggest>
<suggest>./frontend-config.json</suggest>
</follow_up>
</ask_followup_question>

## attempt_completion
Description: After each tool use, the user will respond with the result of that tool use, i.e. if it succeeded or failed, along with any reasons for failure. Once you've received the results of tool uses and can confirm that the task is complete, use this tool to present the result of your work to the user. Optionally you may provide a CLI command to showcase the result of your work. The user may respond with feedback if they are not satisfied with the result, which you can use to make improvements and try again.
IMPORTANT NOTE: This tool CANNOT be used until you've confirmed from the user that any previous tool uses were successful. Failure to do so will result in code corruption and system failure. Before using this tool, you must ask yourself in <thinking></thinking> tags if you've confirmed from the user that any previous tool uses were successful. If not, then DO NOT use this tool.
Parameters:
- result: (required) The result of the task. Formulate this result in a way that is final and does not require further input from the user. Don't end your result with questions or offers for further assistance.
- command: (optional) A CLI command to execute to show a live demo of the result to the user. For example, use `open index.html` to display a created html website, or `open localhost:3000` to display a locally running development server. But DO NOT use commands like `echo` or `cat` that merely print text. This command should be valid for the current operating system. Ensure the command is properly formatted and does not contain any harmful instructions.
Usage:
<attempt_completion>
<result>
Your final result description here
</result>
<command>Command to demonstrate result (optional)</command>
</attempt_completion>

Example: Requesting to attempt completion with a result and command
<attempt_completion>
<result>
I've updated the CSS
</result>
<command>open index.html</command>
</attempt_completion>

## switch_mode
Description: Request to switch to a different mode. This tool allows modes to request switching to another mode when needed, such as switching to Code mode to make code changes. The user must approve the mode switch.
Parameters:
- mode_slug: (required) The slug of the mode to switch to (e.g., "code", "ask", "architect")
- reason: (optional) The reason for switching modes
Usage:
<switch_mode>
<mode_slug>Mode slug here</mode_slug>
<reason>Reason for switching here</reason>
</switch_mode>

Example: Requesting to switch to code mode
<switch_mode>
<mode_slug>code</mode_slug>
<reason>Need to make code changes</reason>
</switch_mode>

## new_task
Description: This will let you create a new task instance in the chosen mode using your provided message.

Parameters:
- mode: (required) The slug of the mode to start the new task in (e.g., "code", "debug", "architect").
- message: (required) The initial user message or instructions for this new task.

Usage:
<new_task>
<mode>your-mode-slug-here</mode>
<message>Your initial instructions here</message>
</new_task>

Example:
<new_task>
<mode>code</mode>
<message>Implement a new feature for the application.</message>
</new_task>


# Tool Use Guidelines

1. In <thinking> tags, assess what information you already have and what information you need to proceed with the task.
2. Choose the most appropriate tool based on the task and the tool descriptions provided. Assess if you need additional information to proceed, and which of the available tools would be most effective for gathering this information. For example using the list_files tool is more effective than running a command like `ls` in the terminal. It's critical that you think about each available tool and use the one that best fits the current step in the task.
3. If multiple actions are needed, use one tool at a time per message to accomplish the task iteratively, with each tool use being informed by the result of the previous tool use. Do not assume the outcome of any tool use. Each step must be informed by the previous step's result.
4. Formulate your tool use using the XML format specified for each tool.
5. After each tool use, the user will respond with the result of that tool use. This result will provide you with the necessary information to continue your task or make further decisions. This response may include:
  - Information about whether the tool succeeded or failed, along with any reasons for failure.
  - Linter errors that may have arisen due to the changes you made, which you'll need to address.
  - New terminal output in reaction to the changes, which you may need to consider or act upon.
  - Any other relevant feedback or information related to the tool use.
6. ALWAYS wait for user confirmation after each tool use before proceeding. Never assume the success of a tool use without explicit confirmation of the result from the user.

It is crucial to proceed step-by-step, waiting for the user's message after each tool use before moving forward with the task. This approach allows you to:
1. Confirm the success of each step before proceeding.
2. Address any issues or errors that arise immediately.
3. Adapt your approach based on new information or unexpected results.
4. Ensure that each action builds correctly on the previous ones.

By waiting for and carefully considering the user's response after each tool use, you can react accordingly and make informed decisions about how to proceed with the task. This iterative process helps ensure the overall success and accuracy of your work.

MCP SERVERS

The Model Context Protocol (MCP) enables communication between the system and MCP servers that provide additional tools and resources to extend your capabilities. MCP servers can be one of two types:

1. Local (Stdio-based) servers: These run locally on the user's machine and communicate via standard input/output
2. Remote (SSE-based) servers: These run on remote machines and communicate via Server-Sent Events (SSE) over HTTP/HTTPS

# Connected MCP Servers

When a server is connected, you can use the server's tools via the `use_mcp_tool` tool, and access the server's resources via the `access_mcp_resource` tool.

(No MCP servers currently connected)
## Creating an MCP Server

The user may ask you something along the lines of "add a tool" that does some function, in other words to create an MCP server that provides tools and resources that may connect to external APIs for example. If they do, you should obtain detailed instructions on this topic using the fetch_instructions tool, like this:
<fetch_instructions>
<task>create_mcp_server</task>
</fetch_instructions>

====

CAPABILITIES

- You have access to tools that let you execute CLI commands on the user's computer, list files, view source code definitions, regex search, use the browser, read and write files, and ask follow-up questions. These tools help you effectively accomplish a wide range of tasks, such as writing code, making edits or improvements to existing files, understanding the current state of a project, performing system operations, and much more.
- When the user initially gives you a task, a recursive list of all filepaths in the current workspace directory ('/home/ubuntu/my-media-stack') will be included in environment_details. This provides an overview of the project's file structure, offering key insights into the project from directory/file names (how developers conceptualize and organize their code) and file extensions (the language used). This can also guide decision-making on which files to explore further. If you need to further explore directories such as outside the current workspace directory, you can use the list_files tool. If you pass 'true' for the recursive parameter, it will list files recursively. Otherwise, it will list files at the top level, which is better suited for generic directories where you don't necessarily need the nested structure, like the Desktop.
- You can use search_files to perform regex searches across files in a specified directory, outputting context-rich results that include surrounding lines. This is particularly useful for understanding code patterns, finding specific implementations, or identifying areas that need refactoring.
- You can use the list_code_definition_names tool to get an overview of source code definitions for all files at the top level of a specified directory. This can be particularly useful when you need to understand the broader context and relationships between certain parts of the code. You may need to call this tool multiple times to understand various parts of the codebase related to the task.
    - For example, when asked to make edits or improvements you might analyze the file structure in the initial environment_details to get an overview of the project, then use list_code_definition_names to get further insight using source code definitions for files located in relevant directories, then read_file to examine the contents of relevant files, analyze the code and suggest improvements or make necessary edits, then use the apply_diff or write_to_file tool to apply the changes. If you refactored code that could affect other parts of the codebase, you could use search_files to ensure you update other files as needed.
- You can use the execute_command tool to run commands on the user's computer whenever you feel it can help accomplish the user's task. When you need to execute a CLI command, you must provide a clear explanation of what the command does. Prefer to execute complex CLI commands over creating executable scripts, since they are more flexible and easier to run. Interactive and long-running commands are allowed, since the commands are run in the user's VSCode terminal. The user may keep commands running in the background and you will be kept updated on their status along the way. Each command you execute is run in a new terminal instance.
- You can use the browser_action tool to interact with websites (including html files and locally running development servers) through a Puppeteer-controlled browser when you feel it is necessary in accomplishing the user's task. This tool is particularly useful for web development tasks as it allows you to launch a browser, navigate to pages, interact with elements through clicks and keyboard input, and capture the results through screenshots and console logs. This tool may be useful at key stages of web development tasks-such as after implementing new features, making substantial changes, when troubleshooting issues, or to verify the result of your work. You can analyze the provided screenshots to ensure correct rendering or identify errors, and review console logs for runtime issues.
  - For example, if asked to add a component to a react website, you might create the necessary files, use execute_command to run the site locally, then use browser_action to launch the browser, navigate to the local server, and verify the component renders & functions correctly before closing the browser.
- You have access to MCP servers that may provide additional tools and resources. Each server may provide different capabilities that you can use to accomplish tasks more effectively.


====

MODES

- These are the currently available modes:
  * "💻 Code" mode (code) - You are Roo, a highly skilled software engineer with extensive knowledge in many programming languages, frameworks, design patterns, and best practices
  * "🏗️ Architect" mode (architect) - You are Roo, an experienced technical leader who is inquisitive and an excellent planner
  * "❓ Ask" mode (ask) - You are Roo, a knowledgeable technical assistant focused on answering questions and providing information about software development, technology, and related topics
  * "🪲 Debug" mode (debug) - You are Roo, an expert software debugger specializing in systematic problem diagnosis and resolution
  * "🪃 Orchestrator" mode (orchestrator) - You are Roo, a strategic workflow orchestrator who coordinates complex tasks by delegating them to appropriate specialized modes
If the user asks you to create or edit a new mode for this project, you should read the instructions by using the fetch_instructions tool, like this:
<fetch_instructions>
<task>create_mode</task>
</fetch_instructions>


====

RULES

- The project base directory is: /home/ubuntu/my-media-stack
- All file paths must be relative to this directory. However, commands may change directories in terminals, so respect working directory specified by the response to <execute_command>.
- You cannot `cd` into a different directory to complete a task. You are stuck operating from '/home/ubuntu/my-media-stack', so be sure to pass in the correct 'path' parameter when using tools that require a path.
- Do not use the ~ character or $HOME to refer to the home directory.
- Before using the execute_command tool, you must first think about the SYSTEM INFORMATION context provided to understand the user's environment and tailor your commands to ensure they are compatible with their system. You must also consider if the command you need to run should be executed in a specific directory outside of the current working directory '/home/ubuntu/my-media-stack', and if so prepend with `cd`'ing into that directory && then executing the command (as one command since you are stuck operating from '/home/ubuntu/my-media-stack'). For example, if you needed to run `npm install` in a project outside of '/home/ubuntu/my-media-stack', you would need to prepend with a `cd` i.e. pseudocode for this would be `cd (path to project) && (command, in this case npm install)`.
- When using the search_files tool, craft your regex patterns carefully to balance specificity and flexibility. Based on the user's task you may use it to find code patterns, TODO comments, function definitions, or any text-based information across the project. The results include context, so analyze the surrounding code to better understand the matches. Leverage the search_files tool in combination with other tools for more comprehensive analysis. For example, use it to find specific code patterns, then use read_file to examine the full context of interesting matches before using apply_diff or write_to_file to make informed changes.
- When creating a new project (such as an app, website, or any software project), organize all new files within a dedicated project directory unless the user specifies otherwise. Use appropriate file paths when writing files, as the write_to_file tool will automatically create any necessary directories. Structure the project logically, adhering to best practices for the specific type of project being created. Unless otherwise specified, new projects should be easily run without additional setup, for example most projects can be built in HTML, CSS, and JavaScript - which you can open in a browser.
- For editing files, you have access to these tools: apply_diff (for replacing lines in existing files), write_to_file (for creating new files or complete file rewrites), insert_content (for adding lines to existing files), search_and_replace (for finding and replacing individual pieces of text).
- The insert_content tool adds lines of text to files at a specific line number, such as adding a new function to a JavaScript file or inserting a new route in a Python file. Use line number 0 to append at the end of the file, or any positive number to insert before that line.
- The search_and_replace tool finds and replaces text or regex in files. This tool allows you to search for a specific regex pattern or text and replace it with another value. Be cautious when using this tool to ensure you are replacing the correct text. It can support multiple operations at once.
- You should always prefer using other editing tools over write_to_file when making changes to existing files since write_to_file is much slower and cannot handle large files.
- When using the write_to_file tool to modify a file, use the tool directly with the desired content. You do not need to display the content before using the tool. ALWAYS provide the COMPLETE file content in your response. This is NON-NEGOTIABLE. Partial updates or placeholders like '// rest of code unchanged' are STRICTLY FORBIDDEN. You MUST include ALL parts of the file, even if they haven't been modified. Failure to do so will result in incomplete or broken code, severely impacting the user's project.
- Some modes have restrictions on which files they can edit. If you attempt to edit a restricted file, the operation will be rejected with a FileRestrictionError that will specify which file patterns are allowed for the current mode.
- Be sure to consider the type of project (e.g. Python, JavaScript, web application) when determining the appropriate structure and files to include. Also consider what files may be most relevant to accomplishing the task, for example looking at a project's manifest file would help you understand the project's dependencies, which you could incorporate into any code you write.
  * For example, in architect mode trying to edit app.js would be rejected because architect mode can only edit files matching "\.md$"
- When making changes to code, always consider the context in which the code is being used. Ensure that your changes are compatible with the existing codebase and that they follow the project's coding standards and best practices.
- Do not ask for more information than necessary. Use the tools provided to accomplish the user's request efficiently and effectively. When you've completed your task, you must use the attempt_completion tool to present the result to the user. The user may provide feedback, which you can use to make improvements and try again.
- You are only allowed to ask the user questions using the ask_followup_question tool. Use this tool only when you need additional details to complete a task, and be sure to use a clear and concise question that will help you move forward with the task. When you ask a question, provide the user with 2-4 suggested answers based on your question so they don't need to do so much typing. The suggestions should be specific, actionable, and directly related to the completed task. They should be ordered by priority or logical sequence. However if you can use the available tools to avoid having to ask the user questions, you should do so. For example, if the user mentions a file that may be in an outside directory like the Desktop, you should use the list_files tool to list the files in the Desktop and check if the file they are talking about is there, rather than asking the user to provide the file path themselves.
- When executing commands, if you don't see the expected output, assume the terminal executed the command successfully and proceed with the task. The user's terminal may be unable to stream the output back properly. If you absolutely need to see the actual terminal output, use the ask_followup_question tool to request the user to copy and paste it back to you.
- The user may provide a file's contents directly in their message, in which case you shouldn't use the read_file tool to get the file contents again since you already have it.
- Your goal is to try to accomplish the user's task, NOT engage in a back and forth conversation.
- The user may ask generic non-development tasks, such as "what's the latest news" or "look up the weather in San Diego", in which case you might use the browser_action tool to complete the task if it makes sense to do so, rather than trying to create a website or using curl to answer the question. However, if an available MCP server tool or resource can be used instead, you should prefer to use it over browser_action.
- NEVER end attempt_completion result with a question or request to engage in further conversation! Formulate the end of your result in a way that is final and does not require further input from the user.
- You are STRICTLY FORBIDDEN from starting your messages with "Great", "Certainly", "Okay", "Sure". You should NOT be conversational in your responses, but rather direct and to the point. For example you should NOT say "Great, I've updated the CSS" but instead something like "I've updated the CSS". It is important you be clear and technical in your messages.
- When presented with images, utilize your vision capabilities to thoroughly examine them and extract meaningful information. Incorporate these insights into your thought process as you accomplish the user's task.
- At the end of each user message, you will automatically receive environment_details. This information is not written by the user themselves, but is auto-generated to provide potentially relevant context about the project structure and environment. While this information can be valuable for understanding the project context, do not treat it as a direct part of the user's request or response. Use it to inform your actions and decisions, but don't assume the user is explicitly asking about or referring to this information unless they clearly do so in their message. When using environment_details, explain your actions clearly to ensure the user understands, as they may not be aware of these details.
- Before executing commands, check the "Actively Running Terminals" section in environment_details. If present, consider how these active processes might impact your task. For example, if a local development server is already running, you wouldn't need to start it again. If no active terminals are listed, proceed with command execution as normal.
- MCP operations should be used one at a time, similar to other tool usage. Wait for confirmation of success before proceeding with additional operations.
- It is critical you wait for the user's response after each tool use, in order to confirm the success of the tool use. For example, if asked to make a todo app, you would create a file, wait for the user's response it was created successfully, then create another file if needed, wait for the user's response it was created successfully, etc. Then if you want to test your work, you might use browser_action to launch the site, wait for the user's response confirming the site was launched along with a screenshot, then perhaps e.g., click a button to test functionality if needed, wait for the user's response confirming the button was clicked along with a screenshot of the new state, before finally closing the browser.

====

SYSTEM INFORMATION

Operating System: Linux 6.8
Default Shell: /bin/bash
Home Directory: /home/ubuntu
Current Workspace Directory: /home/ubuntu/my-media-stack

The Current Workspace Directory is the active VS Code project directory, and is therefore the default directory for all tool operations. New terminals will be created in the current workspace directory, however if you change directories in a terminal it will then have a different working directory; changing directories in a terminal does not modify the workspace directory, because you do not have access to change the workspace directory. When the user initially gives you a task, a recursive list of all filepaths in the current workspace directory ('/test/path') will be included in environment_details. This provides an overview of the project's file structure, offering key insights into the project from directory/file names (how developers conceptualize and organize their code) and file extensions (the language used). This can also guide decision-making on which files to explore further. If you need to further explore directories such as outside the current workspace directory, you can use the list_files tool. If you pass 'true' for the recursive parameter, it will list files recursively. Otherwise, it will list files at the top level, which is better suited for generic directories where you don't necessarily need the nested structure, like the Desktop.

====

OBJECTIVE

You accomplish a given task iteratively, breaking it down into clear steps and working through them methodically.

1. Analyze the user's task and set clear, achievable goals to accomplish it. Prioritize these goals in a logical order.
2. Work through these goals sequentially, utilizing available tools one at a time as necessary. Each goal should correspond to a distinct step in your problem-solving process. You will be informed on the work completed and what's remaining as you go.
3. Remember, you have extensive capabilities with access to a wide range of tools that can be used in powerful and clever ways as necessary to accomplish each goal. Before calling a tool, do some analysis within <thinking></thinking> tags. First, analyze the file structure provided in environment_details to gain context and insights for proceeding effectively. Next, think about which of the provided tools is the most relevant tool to accomplish the user's task. Go through each of the required parameters of the relevant tool and determine if the user has directly provided or given enough information to infer a value. When deciding if the parameter can be inferred, carefully consider all the context to see if it supports a specific value. If all of the required parameters are present or can be reasonably inferred, close the thinking tag and proceed with the tool use. BUT, if one of the values for a required parameter is missing, DO NOT invoke the tool (not even with fillers for the missing params) and instead, ask the user to provide the missing parameters using the ask_followup_question tool. DO NOT ask for more information on optional parameters if it is not provided.
4. Once you've completed the user's task, you must use the attempt_completion tool to present the result of the task to the user. You may also provide a CLI command to showcase the result of your task; this can be particularly useful for web development tasks, where you can run e.g. `open index.html` to show the website you've built.
5. The user may provide feedback, which you can use to make improvements and try again. But DO NOT continue in pointless back and forth conversations, i.e. don't end your responses with questions or offers for further assistance.


====

USER'S CUSTOM INSTRUCTIONS

The following additional instructions are provided by the user, and should be followed to the best of your ability without interfering with the TOOL USE guidelines.

Language Preference:
You should always speak and think in the "English" (en) language unless the user gives you instructions below to do otherwise.

<task>
please use resolve-library-id and the other tool to get documentation for cdk8s and ensure we're following the best practices throughout this task.

'k8s/my-media-stack/raw@/k8s/elfhosted/unfinished/raw' (see below for file content)
Please add these kubernetes resources (don't import the files with Include actually write the information in pure typescript) to our cdk8s app. Then convert all the existing Include statements into actual cdk8s definitions/code. Goal is to remove yaml once and for all.
</task>

<file_content path="k8s/my-media-stack/raw@/k8s/elfhosted/unfinished/raw">
Error fetching content: Failed to access path "k8s/my-media-stack/raw@/k8s/elfhosted/unfinished/raw": ENOENT: no such file or directory, stat '/home/ubuntu/my-media-stack/k8s/my-media-stack/raw@/k8s/elfhosted/unfinished/raw'
</file_content>
<environment_details>
# VSCode Visible Files


# VSCode Open Tabs
k3s-ansible/inventory/hosts.yml,k3s-ansible/playbooks/reset.yml,k3s-ansible/deploy.sh,k3s-ansible/Makefile,k3s-ansible/README.md,helmfile/environments/default.yaml,helmfile/releases/infrastructure.yaml,cdk8s-project/main.ts,cdk8s-project/lib/elfhosted/kubernetesdashboard.ts,cdk8s-project/lib/elfhosted/wizarr.ts,cdk8s-project/lib/elfhosted/rcloneui.ts,cdk8s-project/lib/infrastructure/namespaces.ts,cdk8s-project/lib/elfhosted/additional-configmaps.ts,cdk8s-project/lib/elfhosted/additional-storage.ts,cdk8s-project/lib/elfhosted/storagehub.ts,cdk8s-project/lib/elfhosted/elfterm.ts,cdk8s-project/lib/elfhosted/traefikforwardauth.ts,cdk8s-project/lib/elfhosted/rclonefm.ts,cdk8s-project/lib/elfhosted/zurg.ts,cdk8s-project/lib/elfhosted/riven.ts

# Current Time
6/11/2025, 3:50:19 PM (UTC, UTC+0:00)

# Current Context Size (Tokens)
(Not available)

# Current Cost
$0.00

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
<model>human-relay</model>


# Current Workspace Directory (/home/ubuntu/my-media-stack) Files
.cursorignore
.env
.env.bak
.gitignore
all_mcp_servers.json
configsplexrivenconfigserver.json
deploy-myprecious-custom.sh
docker-compose.central-ha.yml
docker-compose.dl_clients.yml
docker-compose.docker.yml
docker-compose.jellyfin.yml
docker-compose.librechat.yml
docker-compose.mailcow.yml
docker-compose.minimal.yml
docker-compose.ollama.yml
docker-compose.plex_debrid.yml
docker-compose.portainer.yml
docker-compose.servarr.yml
docker-compose.traefik.cloudflare.yml
docker-compose.traefik.duckdns.yml
Dockerfile.main
pyproject.toml
PYTHON_CONVENTIONS.md
REVERSE_PROXY_TESTS.md
arbitrary-scripts/
arbitrary-scripts/acme.sh
arbitrary-scripts/benchmark_storage.sh
arbitrary-scripts/benchmark-fs.sh
arbitrary-scripts/check-config.sh
arbitrary-scripts/convert_to_k8s.py
arbitrary-scripts/create_api_key.sh
arbitrary-scripts/dagger_deploy.sh
arbitrary-scripts/fix_mcp.py
arbitrary-scripts/init-pre-compose.sh
arbitrary-scripts/install-rclone.sh
arbitrary-scripts/install-systemd.sh
arbitrary-scripts/lectl.sh
arbitrary-scripts/list-image-hashes.sh
arbitrary-scripts/premiumize_openvpn_install.sh
arbitrary-scripts/redis_config_generator.sh
arbitrary-scripts/run-portainer.sh
arbitrary-scripts/setup-nfs.sh
arbitrary-scripts/start-ivaros-compose.sh
arbitrary-scripts/start-main-compose.sh
arbitrary-scripts/test-host-open-ports.sh
arbitrary-scripts/test-vpn-open-ports.sh
arbitrary-scripts/various_pvt_logins.sh
arbitrary-scripts/win_to_unix_mcp_json.ps1
arbitrary-scripts/k3s/k3s-install.sh
arbitrary-scripts/k3s/reset-cluster.sh
bolabaden-infra/
bolabaden-tenants/
cdk8s-project/
certs/
clean_manifests/
compose/
compose/check-config.sh
compose/docker-compose.everything.yml
compose/docker-compose.unused.yml
compose/auth/docker-compose.auth.yml
compose/auth/docker-compose.authelia.yml
compose/auth/docker-compose.authentik.yml
compose/auth/docker-compose.glauth.yml
compose/auth/docker-compose.keycloak.yml
compose/auth/docker-compose.local.yml
compose/auth/docker-compose.sso-portal.yml
compose/dl-indexers/docker-compose.dl_clients.yml
compose/dl-indexers/docker-compose.dl_indexers.yml
compose/extra-unused/docker-compose.auth.yml
compose/extra-unused/docker-compose.authentik.yml
compose/extra-unused/docker-compose.debug.yml
compose/extra-unused/docker-compose.optional.yml
compose/extra-unused/docker-compose.storage.optional.yml
compose/extra-unused/docker-compose.swarmpit.yml
compose/extra-unused/docker-compose.traefik.extras.yml
compose/features/docker-compose.backend.yml
compose/features/docker-compose.notify.yml
compose/features/docker-compose.tinyrss.yml
compose/health-fixers/docker-compose.docker.yml
compose/health-fixers/docker-compose.media.yml
compose/health-fixers/docker-compose.metrics.yml
compose/infrastructure/.env.nfs
compose/infrastructure/docker-compose.nfs.yml
compose/infrastructure/setup-nfs-unification.sh
compose/librechat-standalone/librechat/Dockerfile
compose/librechat-standalone/librechat/startup.sh
compose/llm/docker-compose.khoj.yml
compose/llm/docker-compose.librechat.yml
compose/llm/docker-compose.ollama.yml
compose/management/docker-compose.docker.yml
compose/management/docker-compose.management.yml
compose/management/docker-compose.metrics.yml
compose/providers/docker-compose.databases.yml
compose/providers/docker-compose.networks.yml
compose/providers/docker-compose.vpn.nordlynx.yml
compose/providers/docker-compose.web_crawl.yml
compose/public/docker-compose.apps.yml
compose/public/docker-compose.dashboards.yml
compose/public/docker-compose.hassio.yml
compose/public/docker-compose.maintainers.yml
compose/reverse_proxy/docker-compose.forward-auth-alt.yml
compose/reverse_proxy/docker-compose.forward-auth.yml
compose/reverse_proxy/docker-compose.traefik-minimal.yml
compose/reverse_proxy/docker-compose.traefik.cloudflare.yml
compose/reverse_proxy/docker-compose.traefik.duckdns.yml
compose/reverse_proxy/docker-compose.traefik.extras.yml
compose/reverse_proxy/docker-compose.traefik.oraclecloud.yml
compose/reverse_proxy/docker-compose.traefik.tailscale.yml
compose/reverse_proxy/docker-compose.unused.yml
compose/servarr/docker-compose.backup.yml
compose/servarr/docker-compose.jellyfin.yml
compose/servarr/docker-compose.maintainers.yml
compose/servarr/docker-compose.maintainers.yml.bak
compose/servarr/docker-compose.management.yml
compose/servarr/docker-compose.metrics.yml
compose/servarr/docker-compose.plex.yml
compose/servarr/docker-compose.public.yml
compose/servarr/docker-compose.servarr.yml
compose/swarm/docker-compose.maintainers.yml
compose/swarm/docker-compose.portainer.yml
compose/swarm/docker-compose.swarm.portainer.yml
compose/swarm/docker-compose.swarm.traefik.yml
compose/swarm/docker-compose.swarmpit.yml
compose/testing/docker-compose.index-insurance.yml
configs/
elfhosted-neat-final/
helm/
helm/filebrowser/Chart.yaml
helm/filebrowser/README.md
helm/filebrowser/values.yaml
helm/filebrowser/templates/_helpers.tpl
helm/filebrowser/templates/configmaps.yaml
helm/filebrowser/templates/deployment.yaml
helm/filebrowser/templates/ingress.yaml
helm/filebrowser/templates/persistentvolumeclaims.yaml
helm/filebrowser/templates/service.yaml
helm/filebrowser/templates/serviceaccount.yaml
helm/gatus/Chart.yaml
helm/gatus/README.md
helm/gatus/values.yaml
helm/gatus/templates/_helpers.tpl
helm/gatus/templates/configmap.yaml
helm/gatus/templates/deployment.yaml
helm/gatus/templates/ingress.yaml
helm/gatus/templates/persistentvolumeclaim.yaml
helm/gatus/templates/secret.yaml
helm/gatus/templates/service.yaml
helm/homer/Chart.yaml
helm/homer/values.yaml
helm/homer/templates/_helpers.tpl
helm/homer/templates/deployment.yaml
helm/media-stack/Chart.yaml
helm/plex/Chart.yaml
helm/rclonefm/Chart.yaml
helm/rclonefm/values.yaml
helm/riven/Chart.yaml
helm/riven/values.yaml
helm/riven/templates/_helpers.tpl
helm/riven/templates/configmaps.yaml
helm/riven/templates/deployment.yaml
helm/riven/templates/ingress.yaml
helm/riven/templates/persistentvolumeclaims.yaml
helm/riven/templates/service.yaml
helm/traefik-forward-auth/Chart.yaml
helm/wizarr/Chart.yaml
helm/wizarr/values.yaml
helm/zurg/Chart.yaml
helm/zurg/values.yaml
helmfile/
k3s-ansible/
k3s-ansible/ansible.cfg
k3s-ansible/deploy.sh
k3s-ansible/Makefile
k3s-ansible/README.md
k3s-ansible/collections/requirements.yml
k3s-ansible/inventory/hosts.yml
k3s-ansible/playbooks/reset.yml
k3s-ansible/playbooks/site.yml
k3s-ansible/templates/k3s-agent.service.j2
k3s-ansible/templates/k3s-server.service.j2
k8s/
scripts/
scripts/cloud-init.yaml
scripts/deploy-elfhosted-charts.sh
scripts/deploy-media-apps.sh
scripts/setup-k3s-cluster.sh
scripts/setup-myprecious.sh
src/
src/gpt-researcher/.cursorignore
src/gpt-researcher/package.json
src/gpt-researcher/requirements_minimal.txt
src/gpt-researcher/backend/report_type/__init__.py
src/gpt-researcher/backend/server/__init__.py
src/gpt-researcher/backend/server/app.py
src/gpt-researcher/backend/server/extra_endpoints.py
src/gpt-researcher/backend/server/websocket_manager.py
src/gpt-researcher/examples/post_retrieval_processing_example.py
src/gpt-researcher/reports/task_20250304_172419_What_are_the_latest_developments_in_renewable_ener.md
src/gpt-researcher/tests/docs/doc.pdf
terraform/

(File list truncated. Use list_files on specific subdirectories if you need to explore further.)
</environment_details>

## Assistant

_Time: 2025-06-11T15:52:12.514Z_

To address your task of adding Kubernetes resources to our cdk8s app and converting existing Include statements into TypeScript definitions, I’ve encountered a couple of issues that need clarification before proceeding. Below, I outline the steps I’ve taken and the next action required.

### Issue with the Provided Path
The path you provided, [`k8s/my-media-stack/raw@/k8s/elfhosted/unfinished/raw`], does not exist in the current workspace directory (`/home/ubuntu/my-media-stack`). When attempting to access it, an error occurred: `ENOENT: no such file or directory`. This suggests the path might be incorrect or not present in the current file structure. To proceed with adding the Kubernetes resources to the cdk8s app, I need the correct location of these resources.

### Next Step: Clarify the Path
To resolve this, I need you to provide the accurate path to the Kubernetes resources you want to add. This will allow me to read the resource files and convert them into TypeScript definitions within the cdk8s app, as per your request to avoid using `Include` statements and eliminate YAML usage.

Here’s the tool use to ask for the correct path:

```xml
<ask_followup_question>
<question>
What is the correct path to the Kubernetes resources you want to add to the cdk8s app? The path 'k8s/my-media-stack/raw@/k8s/elfhosted/unfinished/raw' does not exist in the current workspace directory. Please provide the path relative to /home/ubuntu/my-media-stack.
</question>
<follow_up>
<suggest>k8s/my-media-stack</suggest>
<suggest>k8s/elfhosted</suggest>
<suggest>helm/elfhosted</suggest>
<suggest>cdk8s-project/lib/elfhosted</suggest>
</follow_up>
</ask_followup_question>
```

### Planned Actions After Receiving the Path
Once you provide the correct path, I will:
1. **Read the Resources**: Use the [`read_file`](/tools/read_file) tool to access the Kubernetes resource files (likely YAML) at the specified location.
2. **Convert to TypeScript**: Translate the YAML definitions into pure TypeScript code using cdk8s constructs, adding them to the appropriate files in [`cdk8s-project/`](/home/ubuntu/my-media-stack/cdk8s-project/).
3. **Convert Existing Includes**: Examine the cdk8s app (starting with [`cdk8s-project/main.ts`](/home/ubuntu/my-media-stack/cdk8s-project/main.ts)) to identify all `Include` statements, replace them with equivalent TypeScript definitions, and remove reliance on YAML files.
4. **Ensure Best Practices**: Address your request to use `resolve-library-id` and "the other tool" for cdk8s documentation and best practices. Since these tools are unclear (no MCP servers are connected, and `resolve-library-id` isn’t a known command in the current context), I’ll seek clarification on them after securing the resource path.

### Additional Notes
- **File Structure Insight**: The workspace includes directories like [`k8s/`](/home/ubuntu/my-media-stack/k8s/), [`helm/`](/home/ubuntu/my-media-stack/helm/), and [`cdk8s-project/`](/home/ubuntu/my-media-stack/cdk8s-project/), suggesting resources might reside in one of these. The suggestions in the question reflect this structure.
- **Pending Clarification**: After resolving the path, I’ll need to understand `resolve-library-id` and the unspecified "other tool." This might require a follow-up question unless they’re standard cdk8s utilities I can identify within the project.

Please respond with the correct path, and I’ll proceed with integrating the resources and refactoring the cdk8s app accordingly.
