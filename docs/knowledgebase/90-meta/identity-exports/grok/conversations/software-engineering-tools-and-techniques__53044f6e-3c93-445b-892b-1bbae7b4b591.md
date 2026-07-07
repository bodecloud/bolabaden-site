---
source_url: "https://grok.com/c/53044f6e-3c93-445b-892b-1bbae7b4b591"
conversation_id: "53044f6e-3c93-445b-892b-1bbae7b4b591"
title: "Software Engineering Tools and Techniques"
extracted_at: "2026-06-29T16:27:09.913Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Software Engineering Tools and Techniques

Source: [Grok conversation](https://grok.com/c/53044f6e-3c93-445b-892b-1bbae7b4b591)

## User

_Time: 2025-06-11T15:54:18.546Z_

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

'k8s/my-media-stack/raw' (see below for file content)
   
'k8s/elfhosted/unfinished/raw' (see below for file content)

Please add these kubernetes resources (don't import the files with Include actually write the information in pure typescript) to our cdk8s app. Then convert all the existing Include statements into actual cdk8s definitions/code. Goal is to remove yaml once and for all.
</task>

<file_content path="k8s/my-media-stack/raw">
├── 00-cert-manager-install.yml
├── 00-cert-manager-setup.yml
├── 00-namespaces.yml
├── 01-cluster-proxy-injector.yml
├── 02-cert-manager-setup.yml
├── 03-cluster-proxy-injector.yml
├── aiostreams-deployment.yml
├── aiostreams-expose.yml
├── apply-in-order.sh
├── auto-generated-ingressroutes.yml
├── code-demo-deployment.yml
├── code-demo-expose.yml
├── code-dev-deployment.yml
├── code-dev-expose.yml
├── comet-deployment.yml
├── comet-expose.yml
├── convert-to-pod-gateway.sh
├── convert-to-vpn-gateway.sh
├── crowdsec-deployment.yml
├── dash-deployment.yml
├── dash-expose.yml
├── ddns-updater-deployment.yml
├── default-network-policy.yml
├── deploy-ha-stack.sh
├── deunhealth-deployment.yml
├── dozzle-deployment.yml
├── dozzle-expose.yml
├── dynamic-ingress.yml
├── error-pages-deployment.yml
├── error-pages-expose.yml
├── fix-services.sh
├── flaresolverr-deployment.yml
├── flaresolverr-expose.yml
├── generate-ingressroutes.py
├── generate-ingressroutes.sh
├── generate-premiumize-deployments.sh
├── generate-vpn-gateways.py
├── homepage-deployment.yml
├── homepage-expose.yml
├── install-cert-manager.sh
├── jackett-deployment.yml
├── jackett-expose.yml
├── lobechat-deployment.yml
├── lobechat-expose.yml
├── mediafusion-deployment.yml
├── mediafusion-expose.yml
├── mongodb-deployment.yml
├── mongodb-expose.yml
├── netalertx-deployment.yml
├── nginx-auth-deployment.yml
├── nginx-auth-expose.yml
├── pod-gateway-client-config.yml
├── pod-gateway-client-converter.py
├── pod-gateway-client-converter.sh
├── prometheus-deployment.yml
├── prowlarr-deployment.yml
├── prowlarr-expose.yml
├── publicnet-network-policy.yml
├── redis-deployment.yml
├── redis-expose.yml
├── resource-quota.yml
├── searxng-deployment.yml
├── searxng-expose.yml
├── services-ingressroutes.yml
├── speedtest-deployment.yml
├── speedtest-expose.yml
├── stremio-deployment.yml
├── stremio-expose.yml
├── stremio-jackett-deployment.yml
├── stremio-jackett-expose.yml
├── tinyauth-deployment.yml
├── tinyauth-expose.yml
├── tinyauth-ingressroute.yml
├── tinyauth-service.yml
├── traefik-dashboard-ingressroute.yml
├── traefik-helmchartconfig.yml
├── validate-ha.sh
├── vpn-gateway-failover.yml
├── vpn-gateway-pod-gateway.yml
├── vpn-gateways-all.yml
├── warp-deployment.yml
├── warp-expose.yml
├── warp-fetch-proxy-deployment.yml
├── warp-fetch-proxy-expose.yml
├── warp-gateway-deployment.yml
├── warp-pod-gateway-deployment.yml
├── warp-service.yml
├── watchtower-deployment.yml
├── watchtower-expose.yml
├── whoami-deployment.yml
└── whoami-expose.yml

<file_content path="k8s/my-media-stack/raw/00-cert-manager-install.yml">
  1 | # Complete cert-manager installation and setup
  2 | # This file installs cert-manager and then creates the required issuers and certificates
  3 | 
  4 | ---
  5 | # Cert-manager namespace
  6 | apiVersion: v1
  7 | kind: Namespace
  8 | metadata:
  9 |   name: cert-manager
 10 |   labels:
 11 |     name: cert-manager
 12 | 
 13 | ---
 14 | # Cert-manager CustomResourceDefinitions
 15 | apiVersion: apiextensions.k8s.io/v1
 16 | kind: CustomResourceDefinition
 17 | metadata:
 18 |   name: certificaterequests.cert-manager.io
 19 |   labels:
 20 |     app: cert-manager
 21 |     app.kubernetes.io/name: cert-manager
 22 |     app.kubernetes.io/instance: cert-manager
 23 | spec:
 24 |   group: cert-manager.io
 25 |   versions:
 26 |     - name: v1
 27 |       served: true
 28 |       storage: true
 29 |       schema:
 30 |         openAPIV3Schema:
 31 |           type: object
 32 |           properties:
 33 |             spec:
 34 |               type: object
 35 |               properties:
 36 |                 request:
 37 |                   type: string
 38 |                   format: byte
 39 |                 issuerRef:
 40 |                   type: object
 41 |                   properties:
 42 |                     name:
 43 |                       type: string
 44 |                     kind:
 45 |                       type: string
 46 |                     group:
 47 |                       type: string
 48 |                 duration:
 49 |                   type: string
 50 |                 isCA:
 51 |                   type: boolean
 52 |                 usages:
 53 |                   type: array
 54 |                   items:
 55 |                     type: string
 56 |             status:
 57 |               type: object
 58 |               properties:
 59 |                 conditions:
 60 |                   type: array
 61 |                   items:
 62 |                     type: object
 63 |                     properties:
 64 |                       type:
 65 |                         type: string
 66 |                       status:
 67 |                         type: string
 68 |                       reason:
 69 |                         type: string
 70 |                       message:
 71 |                         type: string
 72 |                       lastTransitionTime:
 73 |                         type: string
 74 |                         format: date-time
 75 |                 certificate:
 76 |                   type: string
 77 |                   format: byte
 78 |                 ca:
 79 |                   type: string
 80 |                   format: byte
 81 |                 failureTime:
 82 |                   type: string
 83 |                   format: date-time
 84 |   scope: Namespaced
 85 |   names:
 86 |     plural: certificaterequests
 87 |     singular: certificaterequest
 88 |     kind: CertificateRequest
 89 |     listKind: CertificateRequestList
 90 | 
 91 | ---
 92 | apiVersion: apiextensions.k8s.io/v1
 93 | kind: CustomResourceDefinition
 94 | metadata:
 95 |   name: certificates.cert-manager.io
 96 |   labels:
 97 |     app: cert-manager
 98 |     app.kubernetes.io/name: cert-manager
 99 |     app.kubernetes.io/instance: cert-manager
100 | spec:
101 |   group: cert-manager.io
102 |   versions:
103 |     - name: v1
104 |       served: true
105 |       storage: true
106 |       schema:
107 |         openAPIV3Schema:
108 |           type: object
109 |           properties:
110 |             spec:
111 |               type: object
112 |               properties:
113 |                 secretName:
114 |                   type: string
115 |                 issuerRef:
116 |                   type: object
117 |                   properties:
118 |                     name:
119 |                       type: string
120 |                     kind:
121 |                       type: string
122 |                     group:
123 |                       type: string
124 |                 commonName:
125 |                   type: string
126 |                 dnsNames:
127 |                   type: array
128 |                   items:
129 |                     type: string
130 |                 duration:
131 |                   type: string
132 |                 renewBefore:
133 |                   type: string
134 |                 isCA:
135 |                   type: boolean
136 |                 keySize:
137 |                   type: integer
138 |                 keyAlgorithm:
139 |                   type: string
140 |                 keyEncoding:
141 |                   type: string
142 |                 usages:
143 |                   type: array
144 |                   items:
145 |                     type: string
146 |             status:
147 |               type: object
148 |               properties:
149 |                 conditions:
150 |                   type: array
151 |                   items:
152 |                     type: object
153 |                     properties:
154 |                       type:
155 |                         type: string
156 |                       status:
157 |                         type: string
158 |                       reason:
159 |                         type: string
160 |                       message:
161 |                         type: string
162 |                       lastTransitionTime:
163 |                         type: string
164 |                         format: date-time
165 |                 notBefore:
166 |                   type: string
167 |                   format: date-time
168 |                 notAfter:
169 |                   type: string
170 |                   format: date-time
171 |                 renewalTime:
172 |                   type: string
173 |                   format: date-time
174 |   scope: Namespaced
175 |   names:
176 |     plural: certificates
177 |     singular: certificate
178 |     kind: Certificate
179 |     listKind: CertificateList
180 | 
181 | ---
182 | apiVersion: apiextensions.k8s.io/v1
183 | kind: CustomResourceDefinition
184 | metadata:
185 |   name: clusterissuers.cert-manager.io
186 |   labels:
187 |     app: cert-manager
188 |     app.kubernetes.io/name: cert-manager
189 |     app.kubernetes.io/instance: cert-manager
190 | spec:
191 |   group: cert-manager.io
192 |   versions:
193 |     - name: v1
194 |       served: true
195 |       storage: true
196 |       schema:
197 |         openAPIV3Schema:
198 |           type: object
199 |           properties:
200 |             spec:
201 |               type: object
202 |               properties:
203 |                 selfSigned:
204 |                   type: object
205 |                 ca:
206 |                   type: object
207 |                   properties:
208 |                     secretName:
209 |                       type: string
210 |                 acme:
211 |                   type: object
212 |                   properties:
213 |                     server:
214 |                       type: string
215 |                     email:
216 |                       type: string
217 |                     privateKeySecretRef:
218 |                       type: object
219 |                       properties:
220 |                         name:
221 |                           type: string
222 |                     solvers:
223 |                       type: array
224 |                       items:
225 |                         type: object
226 |             status:
227 |               type: object
228 |               properties:
229 |                 conditions:
230 |                   type: array
231 |                   items:
232 |                     type: object
233 |                     properties:
234 |                       type:
235 |                         type: string
236 |                       status:
237 |                         type: string
238 |                       reason:
239 |                         type: string
240 |                       message:
241 |                         type: string
242 |                       lastTransitionTime:
243 |                         type: string
244 |                         format: date-time
245 |                 acme:
246 |                   type: object
247 |   scope: Cluster
248 |   names:
249 |     plural: clusterissuers
250 |     singular: clusterissuer
251 |     kind: ClusterIssuer
252 |     listKind: ClusterIssuerList
253 | 
254 | ---
255 | apiVersion: apiextensions.k8s.io/v1
256 | kind: CustomResourceDefinition
257 | metadata:
258 |   name: issuers.cert-manager.io
259 |   labels:
260 |     app: cert-manager
261 |     app.kubernetes.io/name: cert-manager
262 |     app.kubernetes.io/instance: cert-manager
263 | spec:
264 |   group: cert-manager.io
265 |   versions:
266 |     - name: v1
267 |       served: true
268 |       storage: true
269 |       schema:
270 |         openAPIV3Schema:
271 |           type: object
272 |           properties:
273 |             spec:
274 |               type: object
275 |               properties:
276 |                 selfSigned:
277 |                   type: object
278 |                 ca:
279 |                   type: object
280 |                   properties:
281 |                     secretName:
282 |                       type: string
283 |                 acme:
284 |                   type: object
285 |                   properties:
286 |                     server:
287 |                       type: string
288 |                     email:
289 |                       type: string
290 |                     privateKeySecretRef:
291 |                       type: object
292 |                       properties:
293 |                         name:
294 |                           type: string
295 |                     solvers:
296 |                       type: array
297 |                       items:
298 |                         type: object
299 |             status:
300 |               type: object
301 |               properties:
302 |                 conditions:
303 |                   type: array
304 |                   items:
305 |                     type: object
306 |                     properties:
307 |                       type:
308 |                         type: string
309 |                       status:
310 |                         type: string
311 |                       reason:
312 |                         type: string
313 |                       message:
314 |                         type: string
315 |                       lastTransitionTime:
316 |                         type: string
317 |                         format: date-time
318 |                 acme:
319 |                   type: object
320 |   scope: Namespaced
321 |   names:
322 |     plural: issuers
323 |     singular: issuer
324 |     kind: Issuer
325 |     listKind: IssuerList
326 | 
327 | ---
328 | # Cert-manager ServiceAccount
329 | apiVersion: v1
330 | kind: ServiceAccount
331 | metadata:
332 |   name: cert-manager
333 |   namespace: cert-manager
334 |   labels:
335 |     app: cert-manager
336 |     app.kubernetes.io/name: cert-manager
337 |     app.kubernetes.io/instance: cert-manager
338 | 
339 | ---
340 | # Cert-manager ClusterRoles
341 | apiVersion: rbac.authorization.k8s.io/v1
342 | kind: ClusterRole
343 | metadata:
344 |   name: cert-manager-controller-issuers
345 |   labels:
346 |     app: cert-manager
347 |     app.kubernetes.io/name: cert-manager
348 |     app.kubernetes.io/instance: cert-manager
349 | rules:
350 |   - apiGroups: ["cert-manager.io"]
351 |     resources: ["issuers", "issuers/status"]
352 |     verbs: ["update", "patch"]
353 |   - apiGroups: ["cert-manager.io"]
354 |     resources: ["issuers"]
355 |     verbs: ["get", "list", "watch"]
356 |   - apiGroups: [""]
357 |     resources: ["secrets"]
358 |     verbs: ["get", "list", "watch", "create", "update", "delete", "patch"]
359 |   - apiGroups: [""]
360 |     resources: ["events"]
361 |     verbs: ["create", "patch"]
362 | 
363 | ---
364 | apiVersion: rbac.authorization.k8s.io/v1
365 | kind: ClusterRole
366 | metadata:
367 |   name: cert-manager-controller-clusterissuers
368 |   labels:
369 |     app: cert-manager
370 |     app.kubernetes.io/name: cert-manager
371 |     app.kubernetes.io/instance: cert-manager
372 | rules:
373 |   - apiGroups: ["cert-manager.io"]
374 |     resources: ["clusterissuers", "clusterissuers/status"]
375 |     verbs: ["update", "patch"]
376 |   - apiGroups: ["cert-manager.io"]
377 |     resources: ["clusterissuers"]
378 |     verbs: ["get", "list", "watch"]
379 |   - apiGroups: [""]
380 |     resources: ["secrets"]
381 |     verbs: ["get", "list", "watch", "create", "update", "delete", "patch"]
382 |   - apiGroups: [""]
383 |     resources: ["events"]
384 |     verbs: ["create", "patch"]
385 | 
386 | ---
387 | apiVersion: rbac.authorization.k8s.io/v1
388 | kind: ClusterRole
389 | metadata:
390 |   name: cert-manager-controller-certificates
391 |   labels:
392 |     app: cert-manager
393 |     app.kubernetes.io/name: cert-manager
394 |     app.kubernetes.io/instance: cert-manager
395 | rules:
396 |   - apiGroups: ["cert-manager.io"]
397 |     resources:
398 |       [
399 |         "certificates",
400 |         "certificates/status",
401 |         "certificaterequests",
402 |         "certificaterequests/status",
403 |       ]
404 |     verbs: ["update", "patch"]
405 |   - apiGroups: ["cert-manager.io"]
406 |     resources:
407 |       ["certificates", "certificaterequests", "clusterissuers", "issuers"]
408 |     verbs: ["get", "list", "watch"]
409 |   - apiGroups: ["cert-manager.io"]
410 |     resources: ["certificates/finalizers", "certificaterequests/finalizers"]
411 |     verbs: ["update"]
412 |   - apiGroups: ["acme.cert-manager.io"]
413 |     resources: ["orders"]
414 |     verbs: ["create", "delete", "get", "list", "watch"]
415 |   - apiGroups: [""]
416 |     resources: ["secrets"]
417 |     verbs: ["get", "list", "watch", "create", "update", "delete", "patch"]
418 |   - apiGroups: [""]
419 |     resources: ["events"]
420 |     verbs: ["create", "patch"]
421 | 
422 | ---
423 | # Cert-manager ClusterRoleBindings
424 | apiVersion: rbac.authorization.k8s.io/v1
425 | kind: ClusterRoleBinding
426 | metadata:
427 |   name: cert-manager-controller-issuers
428 |   labels:
429 |     app: cert-manager
430 |     app.kubernetes.io/name: cert-manager
431 |     app.kubernetes.io/instance: cert-manager
432 | roleRef:
433 |   apiGroup: rbac.authorization.k8s.io
434 |   kind: ClusterRole
435 |   name: cert-manager-controller-issuers
436 | subjects:
437 |   - name: cert-manager
438 |     namespace: cert-manager
439 |     kind: ServiceAccount
440 | 
441 | ---
442 | apiVersion: rbac.authorization.k8s.io/v1
443 | kind: ClusterRoleBinding
444 | metadata:
445 |   name: cert-manager-controller-clusterissuers
446 |   labels:
447 |     app: cert-manager
448 |     app.kubernetes.io/name: cert-manager
449 |     app.kubernetes.io/instance: cert-manager
450 | roleRef:
451 |   apiGroup: rbac.authorization.k8s.io
452 |   kind: ClusterRole
453 |   name: cert-manager-controller-clusterissuers
454 | subjects:
455 |   - name: cert-manager
456 |     namespace: cert-manager
457 |     kind: ServiceAccount
458 | 
459 | ---
460 | apiVersion: rbac.authorization.k8s.io/v1
461 | kind: ClusterRoleBinding
462 | metadata:
463 |   name: cert-manager-controller-certificates
464 |   labels:
465 |     app: cert-manager
466 |     app.kubernetes.io/name: cert-manager
467 |     app.kubernetes.io/instance: cert-manager
468 | roleRef:
469 |   apiGroup: rbac.authorization.k8s.io
470 |   kind: ClusterRole
471 |   name: cert-manager-controller-certificates
472 | subjects:
473 |   - name: cert-manager
474 |     namespace: cert-manager
475 |     kind: ServiceAccount
476 | 
477 | ---
478 | # Cert-manager Deployment
479 | apiVersion: apps/v1
480 | kind: Deployment
481 | metadata:
482 |   name: cert-manager
483 |   namespace: cert-manager
484 |   labels:
485 |     app: cert-manager
486 |     app.kubernetes.io/name: cert-manager
487 |     app.kubernetes.io/instance: cert-manager
488 | spec:
489 |   replicas: 1
490 |   selector:
491 |     matchLabels:
492 |       app: cert-manager
493 |       app.kubernetes.io/name: cert-manager
494 |       app.kubernetes.io/instance: cert-manager
495 |   template:
496 |     metadata:
497 |       labels:
498 |         app: cert-manager
499 |         app.kubernetes.io/name: cert-manager
500 |         app.kubernetes.io/instance: cert-manager
501 |     spec:
502 |       serviceAccountName: cert-manager
503 |       containers:
504 |         - name: cert-manager
505 |           image: quay.io/jetstack/cert-manager-controller:v1.13.3
506 |           args:
507 |             - --v=2
508 |             - --cluster-resource-namespace=$(POD_NAMESPACE)
509 |             - --leader-election-namespace=kube-system
510 |             - --acme-http01-solver-image=quay.io/jetstack/cert-manager-acmesolver:v1.13.3
511 |             - --max-concurrent-challenges=60
512 |           ports:
513 |             - containerPort: 9402
514 |               name: http-metrics
515 |               protocol: TCP
516 |             - containerPort: 9403
517 |               name: http-healthz
518 |               protocol: TCP
519 |           env:
520 |             - name: POD_NAMESPACE
521 |               valueFrom:
522 |                 fieldRef:
523 |                   fieldPath: metadata.namespace
524 |           resources:
525 |             requests:
526 |               cpu: 10m
527 |               memory: 32Mi
528 |             limits:
529 |               cpu: 100m
530 |               memory: 128Mi
531 |           livenessProbe:
532 |             httpGet:
533 |               path: /livez
534 |               port: http-healthz
535 |               scheme: HTTP
536 |             initialDelaySeconds: 10
537 |             periodSeconds: 10
538 |             timeoutSeconds: 15
539 |             successThreshold: 1
540 |             failureThreshold: 8
541 |           readinessProbe:
542 |             httpGet:
543 |               path: /readyz
544 |               port: http-healthz
545 |               scheme: HTTP
546 |             initialDelaySeconds: 5
547 |             periodSeconds: 5
548 |             timeoutSeconds: 5
549 |             successThreshold: 1
550 |             failureThreshold: 3

</file_content>

<file_content path="k8s/my-media-stack/raw/00-cert-manager-setup.yml">
 1 | # Cert-manager setup Job
 2 | # This Job waits for cert-manager to be ready and then creates the ClusterIssuer and Certificate
 3 | # This ensures proper ordering when using kubectl apply -f .
 4 | 
 5 | ---
 6 | apiVersion: batch/v1
 7 | kind: Job
 8 | metadata:
 9 |   name: cert-manager-setup
10 |   namespace: cert-manager
11 |   labels:
12 |     app: cert-manager-setup
13 | spec:
14 |   template:
15 |     spec:
16 |       restartPolicy: OnFailure
17 |       serviceAccountName: cert-manager
18 |       containers:
19 |         - name: setup
20 |           image: bitnami/kubectl:latest
21 |           command:
22 |             - /bin/bash
23 |             - -c
24 |             - |
25 |               set -e
26 |               echo "Waiting for cert-manager to be ready..."
27 |               kubectl wait --for=condition=available deployment/cert-manager -n cert-manager --timeout=300s
28 | 
29 |               echo "Waiting for cert-manager CRDs to be established..."
30 |               kubectl wait --for condition=established --timeout=60s crd/clusterissuers.cert-manager.io
31 |               kubectl wait --for condition=established --timeout=60s crd/certificates.cert-manager.io
32 | 
33 |               echo "Creating vpn-gateway namespace if it doesn't exist..."
34 |               kubectl create namespace vpn-gateway --dry-run=client -o yaml | kubectl apply -f -
35 | 
36 |               echo "Creating self-signed ClusterIssuer..."
37 |               cat <<EOF | kubectl apply -f -
38 |               apiVersion: cert-manager.io/v1
39 |               kind: ClusterIssuer
40 |               metadata:
41 |                 name: selfsigned-issuer
42 |               spec:
43 |                 selfSigned: {}
44 |               EOF
45 | 
46 |               echo "Waiting for ClusterIssuer to be ready..."
47 |               sleep 5
48 | 
49 |               echo "Creating proxy-injector certificate..."
50 |               cat <<EOF | kubectl apply -f -
51 |               apiVersion: cert-manager.io/v1
52 |               kind: Certificate
53 |               metadata:
54 |                 name: proxy-injector-cert
55 |                 namespace: vpn-gateway
56 |               spec:
57 |                 secretName: proxy-injector-certs
58 |                 issuerRef:
59 |                   name: selfsigned-issuer
60 |                   kind: ClusterIssuer
61 |                 dnsNames:
62 |                 - proxy-injector.vpn-gateway.svc
63 |                 - proxy-injector.vpn-gateway.svc.cluster.local
64 |               EOF
65 | 
66 |               echo "Waiting for certificate to be ready..."
67 |               kubectl wait --for=condition=ready certificate/proxy-injector-cert -n vpn-gateway --timeout=120s
68 | 
69 |               echo "cert-manager setup completed successfully!"
70 |           resources:
71 |             requests:
72 |               cpu: 10m
73 |               memory: 32Mi
74 |             limits:
75 |               cpu: 100m
76 |               memory: 128Mi

</file_content>

<file_content path="k8s/my-media-stack/raw/00-namespaces.yml">
 1 | apiVersion: v1
 2 | kind: Namespace
 3 | metadata:
 4 |   name: my-media-stack
 5 |   labels:
 6 |     name: my-media-stack
 7 | ---
 8 | apiVersion: v1
 9 | kind: Namespace
10 | metadata:
11 |   name: vpn-gateway
12 |   labels:
13 |     name: vpn-gateway

</file_content>

<file_content path="k8s/my-media-stack/raw/01-cluster-proxy-injector.yml">
  1 | ---
  2 | # Cluster-wide Proxy Injector
  3 | # This mutating admission webhook automatically configures ALL pods to use the VPN gateway
  4 | # for external traffic without requiring individual pod modifications
  5 | 
  6 | apiVersion: v1
  7 | kind: ServiceAccount
  8 | metadata:
  9 |   name: proxy-injector
 10 |   namespace: vpn-gateway
 11 | 
 12 | ---
 13 | apiVersion: rbac.authorization.k8s.io/v1
 14 | kind: ClusterRole
 15 | metadata:
 16 |   name: proxy-injector
 17 | rules:
 18 |   - apiGroups: [""]
 19 |     resources: ["pods"]
 20 |     verbs: ["get", "list", "watch"]
 21 |   - apiGroups: ["apps"]
 22 |     resources: ["deployments", "replicasets"]
 23 |     verbs: ["get", "list", "watch"]
 24 |   - apiGroups: ["admissionregistration.k8s.io"]
 25 |     resources: ["mutatingadmissionconfigurations"]
 26 |     verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
 27 |   - apiGroups: ["cert-manager.io"]
 28 |     resources: ["certificates"]
 29 |     verbs: ["get", "list", "watch"]
 30 | 
 31 | ---
 32 | apiVersion: rbac.authorization.k8s.io/v1
 33 | kind: ClusterRoleBinding
 34 | metadata:
 35 |   name: proxy-injector
 36 | roleRef:
 37 |   apiGroup: rbac.authorization.k8s.io
 38 |   kind: ClusterRole
 39 |   name: proxy-injector
 40 | subjects:
 41 |   - kind: ServiceAccount
 42 |     name: proxy-injector
 43 |     namespace: vpn-gateway
 44 | 
 45 | ---
 46 | # ConfigMap with proxy injection logic
 47 | apiVersion: v1
 48 | kind: ConfigMap
 49 | metadata:
 50 |   name: proxy-injector-config
 51 |   namespace: vpn-gateway
 52 | data:
 53 |   inject.py: |
 54 |     #!/usr/bin/env python3
 55 |     import json
 56 |     import base64
 57 |     import random
 58 |     from http.server import HTTPServer, BaseHTTPRequestHandler
 59 |     import ssl
 60 | 
 61 |     # VPN Gateway endpoints
 62 |     VPN_GATEWAYS = [
 63 |         "http://gluetun-airvpn.vpn-gateway.svc.cluster.local:8888",
 64 |         "http://gluetun-premiumize-nl.vpn-gateway.svc.cluster.local:8888", 
 65 |         "http://gluetun-premiumize-us.vpn-gateway.svc.cluster.local:8888",
 66 |         "socks5://warp-gateway.vpn-gateway.svc.cluster.local:1080"
 67 |     ]
 68 | 
 69 |     # Namespaces that should use VPN (all except system namespaces)
 70 |     EXCLUDED_NAMESPACES = {
 71 |         "kube-system", "kube-public", "kube-node-lease", 
 72 |         "vpn-gateway", "metallb-system", "cert-manager"
 73 |     }
 74 | 
 75 |     class ProxyInjectorHandler(BaseHTTPRequestHandler):
 76 |         def do_GET(self):
 77 |             # Health check endpoint
 78 |             self.send_response(200)
 79 |             self.send_header('Content-Type', 'text/plain')
 80 |             self.end_headers()
 81 |             self.wfile.write(b'OK')
 82 |             
 83 |         def do_POST(self):
 84 |             content_length = int(self.headers['Content-Length'])
 85 |             body = self.rfile.read(content_length)
 86 |             
 87 |             try:
 88 |                 admission_review = json.loads(body.decode('utf-8'))
 89 |                 response = self.mutate(admission_review)
 90 |                 
 91 |                 self.send_response(200)
 92 |                 self.send_header('Content-Type', 'application/json')
 93 |                 self.end_headers()
 94 |                 self.wfile.write(json.dumps(response).encode('utf-8'))
 95 |                 
 96 |             except Exception as e:
 97 |                 print(f"Error processing admission review: {e}")
 98 |                 self.send_response(500)
 99 |                 self.end_headers()
100 | 
101 |         def mutate(self, admission_review):
102 |             request = admission_review["request"]
103 |             pod = request["object"]
104 |             namespace = pod.get("metadata", {}).get("namespace", "default")
105 |             
106 |             # Skip system namespaces
107 |             if namespace in EXCLUDED_NAMESPACES:
108 |                 return self.create_response(request["uid"], allowed=True)
109 |             
110 |             # Skip if pod already has proxy configuration
111 |             if self.has_proxy_config(pod):
112 |                 return self.create_response(request["uid"], allowed=True)
113 |             
114 |             # Create patches to inject proxy configuration
115 |             patches = self.create_proxy_patches(pod)
116 |             
117 |             if not patches:
118 |                 return self.create_response(request["uid"], allowed=True)
119 |             
120 |             return self.create_response(
121 |                 request["uid"], 
122 |                 allowed=True, 
123 |                 patches=patches
124 |             )
125 | 
126 |         def has_proxy_config(self, pod):
127 |             """Check if pod already has proxy configuration"""
128 |             containers = pod.get("spec", {}).get("containers", [])
129 |             for container in containers:
130 |                 env = container.get("env", [])
131 |                 for env_var in env:
132 |                     if env_var.get("name") in ["HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY"]:
133 |                         return True
134 |             return False
135 | 
136 |         def create_proxy_patches(self, pod):
137 |             """Create JSON patches to inject proxy configuration"""
138 |             patches = []
139 |             containers = pod.get("spec", {}).get("containers", [])
140 |             
141 |             # Select random VPN gateway
142 |             selected_gateway = random.choice(VPN_GATEWAYS)
143 |             
144 |             # Determine proxy URLs based on gateway type
145 |             if selected_gateway.startswith("socks5://"):
146 |                 http_proxy = selected_gateway
147 |                 https_proxy = selected_gateway
148 |                 all_proxy = selected_gateway
149 |             else:
150 |                 http_proxy = selected_gateway
151 |                 https_proxy = selected_gateway
152 |                 all_proxy = selected_gateway
153 |             
154 |             # Proxy environment variables
155 |             proxy_env_vars = [
156 |                 {"name": "HTTP_PROXY", "value": http_proxy},
157 |                 {"name": "HTTPS_PROXY", "value": https_proxy},
158 |                 {"name": "ALL_PROXY", "value": all_proxy},
159 |                 {"name": "NO_PROXY", "value": "localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.cluster.local,.svc"},
160 |                 {"name": "VPN_GATEWAY_SELECTED", "value": selected_gateway}
161 |             ]
162 |             
163 |             # Add proxy env vars to each container
164 |             for i, container in enumerate(containers):
165 |                 existing_env = container.get("env", [])
166 |                 
167 |                 # Add proxy environment variables
168 |                 for env_var in proxy_env_vars:
169 |                     patches.append({
170 |                         "op": "add",
171 |                         "path": f"/spec/containers/{i}/env/-",
172 |                         "value": env_var
173 |                     })
174 |                 
175 |                 # If no env exists, create it first
176 |                 if not existing_env:
177 |                     patches.insert(-len(proxy_env_vars), {
178 |                         "op": "add",
179 |                         "path": f"/spec/containers/{i}/env",
180 |                         "value": []
181 |                     })
182 |             
183 |             # Add init container for gateway health check
184 |             init_container = {
185 |                 "name": "vpn-gateway-check",
186 |                 "image": "alpine/curl:latest",
187 |                 "command": [
188 |                     "/bin/sh", "-c",
189 |                     f"""
190 |                     echo "Testing VPN gateway: {selected_gateway}"
191 |                     if echo "{selected_gateway}" | grep -q "socks5://"; then
192 |                         # Test SOCKS5 proxy
193 |                         timeout 30 curl -s --socks5-hostname {selected_gateway.replace('socks5://', '')} http://httpbin.org/ip
194 |                     else
195 |                         # Test HTTP proxy  
196 |                         timeout 30 curl -s --proxy {selected_gateway} http://httpbin.org/ip
197 |                     fi
198 |                     if [ $? -eq 0 ]; then
199 |                         echo "VPN gateway is healthy"
200 |                     else
201 |                         echo "VPN gateway failed, trying fallback..."
202 |                         # Try other gateways as fallback
203 |                         for gateway in {' '.join(VPN_GATEWAYS)}; do
204 |                             if [ "$gateway" != "{selected_gateway}" ]; then
205 |                                 echo "Testing fallback: $gateway"
206 |                                 if echo "$gateway" | grep -q "socks5://"; then
207 |                                     timeout 10 curl -s --socks5-hostname $(echo $gateway | sed 's|socks5://||') http://httpbin.org/ip && break
208 |                                 else
209 |                                     timeout 10 curl -s --proxy $gateway http://httpbin.org/ip && break
210 |                                 fi
211 |                             fi
212 |                         done
213 |                     fi
214 |                     """
215 |                 ],
216 |                 "resources": {
217 |                     "requests": {"memory": "32Mi", "cpu": "10m"},
218 |                     "limits": {"memory": "64Mi", "cpu": "50m"}
219 |                 }
220 |             }
221 |             
222 |             # Add init container
223 |             if not pod.get("spec", {}).get("initContainers"):
224 |                 patches.append({
225 |                     "op": "add",
226 |                     "path": "/spec/initContainers",
227 |                     "value": [init_container]
228 |                 })
229 |             else:
230 |                 patches.append({
231 |                     "op": "add", 
232 |                     "path": "/spec/initContainers/-",
233 |                     "value": init_container
234 |                 })
235 |             
236 |             return patches
237 | 
238 |         def create_response(self, uid, allowed=True, patches=None):
239 |             """Create admission response"""
240 |             response = {
241 |                 "apiVersion": "admission.k8s.io/v1",
242 |                 "kind": "AdmissionReview",
243 |                 "response": {
244 |                     "uid": uid,
245 |                     "allowed": allowed
246 |                 }
247 |             }
248 |             
249 |             if patches:
250 |                 response["response"]["patchType"] = "JSONPatch"
251 |                 response["response"]["patch"] = base64.b64encode(
252 |                     json.dumps(patches).encode('utf-8')
253 |                 ).decode('utf-8')
254 |             
255 |             return response
256 | 
257 |     if __name__ == "__main__":
258 |         server = HTTPServer(('0.0.0.0', 8443), ProxyInjectorHandler)
259 |         
260 |         # Configure TLS with error handling
261 |         try:
262 |             context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
263 |             context.load_cert_chain('/etc/certs/tls.crt', '/etc/certs/tls.key')
264 |             server.socket = context.wrap_socket(server.socket, server_side=True)
265 |             print("Proxy injector webhook server starting on port 8443 with TLS...")
266 |         except ssl.SSLError as e:
267 |             print(f"SSL Certificate error: {e}")
268 |             print("Waiting for cert-manager to generate certificates...")
269 |             import time
270 |             time.sleep(30)  # Wait for cert-manager to generate certs
271 |             try:
272 |                 context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
273 |                 context.load_cert_chain('/etc/certs/tls.crt', '/etc/certs/tls.key')
274 |                 server.socket = context.wrap_socket(server.socket, server_side=True)
275 |                 print("TLS certificates loaded successfully on retry")
276 |             except Exception as retry_error:
277 |                 print(f"Failed to load certificates after retry: {retry_error}")
278 |                 print("Please check cert-manager installation and certificate generation")
279 |                 exit(1)
280 |         except Exception as e:
281 |             print(f"Failed to configure TLS: {e}")
282 |             exit(1)
283 |         
284 |         server.serve_forever()
285 | 
286 | ---
287 | # Proxy Injector Deployment
288 | apiVersion: apps/v1
289 | kind: Deployment
290 | metadata:
291 |   name: proxy-injector
292 |   namespace: vpn-gateway
293 |   labels:
294 |     app: proxy-injector
295 | spec:
296 |   replicas: 2
297 |   selector:
298 |     matchLabels:
299 |       app: proxy-injector
300 |   template:
301 |     metadata:
302 |       labels:
303 |         app: proxy-injector
304 |     spec:
305 |       serviceAccountName: proxy-injector
306 |       initContainers:
307 |         - name: wait-for-cert
308 |           image: bitnami/kubectl:latest
309 |           command:
310 |             - /bin/bash
311 |             - -c
312 |             - |
313 |               echo "Waiting for proxy-injector certificate to be ready..."
314 |               kubectl wait --for=condition=ready certificate/proxy-injector-cert -n vpn-gateway --timeout=300s
315 |               echo "Certificate is ready!"
316 |           resources:
317 |             requests:
318 |               cpu: 10m
319 |               memory: 32Mi
320 |             limits:
321 |               cpu: 50m
322 |               memory: 64Mi
323 |       containers:
324 |         - name: proxy-injector
325 |           image: python:3.9-alpine
326 |           command:
327 |             - python3
328 |             - /app/inject.py
329 |           ports:
330 |             - containerPort: 8443
331 |               name: webhook
332 |           volumeMounts:
333 |             - name: config
334 |               mountPath: /app
335 |             - name: certs
336 |               mountPath: /etc/certs
337 |               readOnly: true
338 |           resources:
339 |             requests:
340 |               memory: "64Mi"
341 |               cpu: "10m"
342 |             limits:
343 |               memory: "128Mi"
344 |               cpu: "50m"
345 |           livenessProbe:
346 |             httpGet:
347 |               path: /
348 |               port: 8443
349 |               scheme: HTTPS
350 |             initialDelaySeconds: 60
351 |             periodSeconds: 10
352 |             failureThreshold: 5
353 |           readinessProbe:
354 |             httpGet:
355 |               path: /
356 |               port: 8443
357 |               scheme: HTTPS
358 |             initialDelaySeconds: 45
359 |             periodSeconds: 5
360 |             failureThreshold: 10
361 |       volumes:
362 |         - name: config
363 |           configMap:
364 |             name: proxy-injector-config
365 |             defaultMode: 0755
366 |         - name: certs
367 |           secret:
368 |             secretName: proxy-injector-certs
369 | 
370 | ---
371 | # Proxy Injector Service
372 | apiVersion: v1
373 | kind: Service
374 | metadata:
375 |   name: proxy-injector
376 |   namespace: vpn-gateway
377 |   labels:
378 |     app: proxy-injector
379 | spec:
380 |   selector:
381 |     app: proxy-injector
382 |   ports:
383 |     - name: webhook
384 |       port: 443
385 |       targetPort: 8443
386 |   type: ClusterIP
387 | 
388 | ---
389 | # Mutating Admission Webhook Configuration
390 | apiVersion: admissionregistration.k8s.io/v1
391 | kind: MutatingWebhookConfiguration
392 | metadata:
393 |   name: proxy-injector
394 | webhooks:
395 |   - name: proxy-injector.vpn-gateway.svc.cluster.local
396 |     clientConfig:
397 |       service:
398 |         name: proxy-injector
399 |         namespace: vpn-gateway
400 |         path: /
401 |     rules:
402 |       - operations: ["CREATE", "UPDATE"]
403 |         apiGroups: [""]
404 |         apiVersions: ["v1"]
405 |         resources: ["pods"]
406 |     admissionReviewVersions: ["v1", "v1beta1"]
407 |     sideEffects: None
408 |     failurePolicy: Ignore # Don't block pod creation if webhook fails
409 |     namespaceSelector:
410 |       matchExpressions:
411 |         - key: name
412 |           operator: NotIn
413 |           values:
414 |             [
415 |               "kube-system",
416 |               "kube-public",
417 |               "kube-node-lease",
418 |               "vpn-gateway",
419 |               "metallb-system",
420 |               "cert-manager",
421 |             ]

</file_content>

<file_content path="k8s/my-media-stack/raw/02-cert-manager-setup.yml">
 1 | # Cert-manager setup - ClusterIssuer and Certificate
 2 | # This file creates the required issuers and certificates
 3 | # The proxy injector will wait for these to be ready using init containers
 4 | 
 5 | ---
 6 | # Self-signed ClusterIssuer for internal certificates
 7 | apiVersion: cert-manager.io/v1
 8 | kind: ClusterIssuer
 9 | metadata:
10 |   name: selfsigned-issuer
11 |   labels:
12 |     app: cert-manager-setup
13 | spec:
14 |   selfSigned: {}
15 | 
16 | ---
17 | # Certificate for the webhook
18 | apiVersion: cert-manager.io/v1
19 | kind: Certificate
20 | metadata:
21 |   name: proxy-injector-cert
22 |   namespace: vpn-gateway
23 |   labels:
24 |     app: cert-manager-setup
25 | spec:
26 |   secretName: proxy-injector-certs
27 |   issuerRef:
28 |     name: selfsigned-issuer
29 |     kind: ClusterIssuer
30 |   dnsNames:
31 |     - proxy-injector.vpn-gateway.svc
32 |     - proxy-injector.vpn-gateway.svc.cluster.local

</file_content>

<file_content path="k8s/my-media-stack/raw/03-cluster-proxy-injector.yml">
  1 | ---
  2 | # Cluster-wide Proxy Injector
  3 | # This mutating admission webhook automatically configures ALL pods to use the VPN gateway
  4 | # for external traffic without requiring individual pod modifications
  5 | 
  6 | apiVersion: v1
  7 | kind: ServiceAccount
  8 | metadata:
  9 |   name: proxy-injector
 10 |   namespace: vpn-gateway
 11 | 
 12 | ---
 13 | apiVersion: rbac.authorization.k8s.io/v1
 14 | kind: ClusterRole
 15 | metadata:
 16 |   name: proxy-injector
 17 | rules:
 18 |   - apiGroups: [""]
 19 |     resources: ["pods"]
 20 |     verbs: ["get", "list", "watch"]
 21 |   - apiGroups: ["apps"]
 22 |     resources: ["deployments", "replicasets"]
 23 |     verbs: ["get", "list", "watch"]
 24 |   - apiGroups: ["admissionregistration.k8s.io"]
 25 |     resources: ["mutatingadmissionconfigurations"]
 26 |     verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
 27 |   - apiGroups: ["cert-manager.io"]
 28 |     resources: ["certificates"]
 29 |     verbs: ["get", "list", "watch"]
 30 | 
 31 | ---
 32 | apiVersion: rbac.authorization.k8s.io/v1
 33 | kind: ClusterRoleBinding
 34 | metadata:
 35 |   name: proxy-injector
 36 | roleRef:
 37 |   apiGroup: rbac.authorization.k8s.io
 38 |   kind: ClusterRole
 39 |   name: proxy-injector
 40 | subjects:
 41 |   - kind: ServiceAccount
 42 |     name: proxy-injector
 43 |     namespace: vpn-gateway
 44 | 
 45 | ---
 46 | # ConfigMap with proxy injection logic
 47 | apiVersion: v1
 48 | kind: ConfigMap
 49 | metadata:
 50 |   name: proxy-injector-config
 51 |   namespace: vpn-gateway
 52 | data:
 53 |   inject.py: |
 54 |     #!/usr/bin/env python3
 55 |     import json
 56 |     import base64
 57 |     import random
 58 |     from http.server import HTTPServer, BaseHTTPRequestHandler
 59 |     import ssl
 60 | 
 61 |     # VPN Gateway endpoints
 62 |     VPN_GATEWAYS = [
 63 |         "http://gluetun-airvpn.vpn-gateway.svc.cluster.local:8888",
 64 |         "http://gluetun-premiumize-nl.vpn-gateway.svc.cluster.local:8888", 
 65 |         "http://gluetun-premiumize-us.vpn-gateway.svc.cluster.local:8888",
 66 |         "socks5://warp-gateway.vpn-gateway.svc.cluster.local:1080"
 67 |     ]
 68 | 
 69 |     # Namespaces that should use VPN (all except system namespaces)
 70 |     EXCLUDED_NAMESPACES = {
 71 |         "kube-system", "kube-public", "kube-node-lease", 
 72 |         "vpn-gateway", "metallb-system", "cert-manager"
 73 |     }
 74 | 
 75 |     class ProxyInjectorHandler(BaseHTTPRequestHandler):
 76 |         def do_GET(self):
 77 |             # Health check endpoint
 78 |             self.send_response(200)
 79 |             self.send_header('Content-Type', 'text/plain')
 80 |             self.end_headers()
 81 |             self.wfile.write(b'OK')
 82 |             
 83 |         def do_POST(self):
 84 |             content_length = int(self.headers['Content-Length'])
 85 |             body = self.rfile.read(content_length)
 86 |             
 87 |             try:
 88 |                 admission_review = json.loads(body.decode('utf-8'))
 89 |                 response = self.mutate(admission_review)
 90 |                 
 91 |                 self.send_response(200)
 92 |                 self.send_header('Content-Type', 'application/json')
 93 |                 self.end_headers()
 94 |                 self.wfile.write(json.dumps(response).encode('utf-8'))
 95 |                 
 96 |             except Exception as e:
 97 |                 print(f"Error processing admission review: {e}")
 98 |                 self.send_response(500)
 99 |                 self.end_headers()
100 | 
101 |         def mutate(self, admission_review):
102 |             request = admission_review["request"]
103 |             pod = request["object"]
104 |             namespace = pod.get("metadata", {}).get("namespace", "default")
105 |             
106 |             # Skip system namespaces
107 |             if namespace in EXCLUDED_NAMESPACES:
108 |                 return self.create_response(request["uid"], allowed=True)
109 |             
110 |             # Skip if pod already has proxy configuration
111 |             if self.has_proxy_config(pod):
112 |                 return self.create_response(request["uid"], allowed=True)
113 |             
114 |             # Create patches to inject proxy configuration
115 |             patches = self.create_proxy_patches(pod)
116 |             
117 |             if not patches:
118 |                 return self.create_response(request["uid"], allowed=True)
119 |             
120 |             return self.create_response(
121 |                 request["uid"], 
122 |                 allowed=True, 
123 |                 patches=patches
124 |             )
125 | 
126 |         def has_proxy_config(self, pod):
127 |             """Check if pod already has proxy configuration"""
128 |             containers = pod.get("spec", {}).get("containers", [])
129 |             for container in containers:
130 |                 env = container.get("env", [])
131 |                 for env_var in env:
132 |                     if env_var.get("name") in ["HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY"]:
133 |                         return True
134 |             return False
135 | 
136 |         def create_proxy_patches(self, pod):
137 |             """Create JSON patches to inject proxy configuration"""
138 |             patches = []
139 |             containers = pod.get("spec", {}).get("containers", [])
140 |             
141 |             # Select random VPN gateway
142 |             selected_gateway = random.choice(VPN_GATEWAYS)
143 |             
144 |             # Determine proxy URLs based on gateway type
145 |             if selected_gateway.startswith("socks5://"):
146 |                 http_proxy = selected_gateway
147 |                 https_proxy = selected_gateway
148 |                 all_proxy = selected_gateway
149 |             else:
150 |                 http_proxy = selected_gateway
151 |                 https_proxy = selected_gateway
152 |                 all_proxy = selected_gateway
153 |             
154 |             # Proxy environment variables
155 |             proxy_env_vars = [
156 |                 {"name": "HTTP_PROXY", "value": http_proxy},
157 |                 {"name": "HTTPS_PROXY", "value": https_proxy},
158 |                 {"name": "ALL_PROXY", "value": all_proxy},
159 |                 {"name": "NO_PROXY", "value": "localhost,127.0.0.1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,.cluster.local,.svc"},
160 |                 {"name": "VPN_GATEWAY_SELECTED", "value": selected_gateway}
161 |             ]
162 |             
163 |             # Add proxy env vars to each container
164 |             for i, container in enumerate(containers):
165 |                 existing_env = container.get("env", [])
166 |                 
167 |                 # Add proxy environment variables
168 |                 for env_var in proxy_env_vars:
169 |                     patches.append({
170 |                         "op": "add",
171 |                         "path": f"/spec/containers/{i}/env/-",
172 |                         "value": env_var
173 |                     })
174 |                 
175 |                 # If no env exists, create it first
176 |                 if not existing_env:
177 |                     patches.insert(-len(proxy_env_vars), {
178 |                         "op": "add",
179 |                         "path": f"/spec/containers/{i}/env",
180 |                         "value": []
181 |                     })
182 |             
183 |             # Add init container for gateway health check
184 |             init_container = {
185 |                 "name": "vpn-gateway-check",
186 |                 "image": "alpine/curl:latest",
187 |                 "command": [
188 |                     "/bin/sh", "-c",
189 |                     f"""
190 |                     echo "Testing VPN gateway: {selected_gateway}"
191 |                     if echo "{selected_gateway}" | grep -q "socks5://"; then
192 |                         # Test SOCKS5 proxy
193 |                         timeout 30 curl -s --socks5-hostname {selected_gateway.replace('socks5://', '')} http://httpbin.org/ip
194 |                     else
195 |                         # Test HTTP proxy  
196 |                         timeout 30 curl -s --proxy {selected_gateway} http://httpbin.org/ip
197 |                     fi
198 |                     if [ $? -eq 0 ]; then
199 |                         echo "VPN gateway is healthy"
200 |                     else
201 |                         echo "VPN gateway failed, trying fallback..."
202 |                         # Try other gateways as fallback
203 |                         for gateway in {' '.join(VPN_GATEWAYS)}; do
204 |                             if [ "$gateway" != "{selected_gateway}" ]; then
205 |                                 echo "Testing fallback: $gateway"
206 |                                 if echo "$gateway" | grep -q "socks5://"; then
207 |                                     timeout 10 curl -s --socks5-hostname $(echo $gateway | sed 's|socks5://||') http://httpbin.org/ip && break
208 |                                 else
209 |                                     timeout 10 curl -s --proxy $gateway http://httpbin.org/ip && break
210 |                                 fi
211 |                             fi
212 |                         done
213 |                     fi
214 |                     """
215 |                 ],
216 |                 "resources": {
217 |                     "requests": {"memory": "32Mi", "cpu": "10m"},
218 |                     "limits": {"memory": "64Mi", "cpu": "50m"}
219 |                 }
220 |             }
221 |             
222 |             # Add init container
223 |             if not pod.get("spec", {}).get("initContainers"):
224 |                 patches.append({
225 |                     "op": "add",
226 |                     "path": "/spec/initContainers",
227 |                     "value": [init_container]
228 |                 })
229 |             else:
230 |                 patches.append({
231 |                     "op": "add", 
232 |                     "path": "/spec/initContainers/-",
233 |                     "value": init_container
234 |                 })
235 |             
236 |             return patches
237 | 
238 |         def create_response(self, uid, allowed=True, patches=None):
239 |             """Create admission response"""
240 |             response = {
241 |                 "apiVersion": "admission.k8s.io/v1",
242 |                 "kind": "AdmissionReview",
243 |                 "response": {
244 |                     "uid": uid,
245 |                     "allowed": allowed
246 |                 }
247 |             }
248 |             
249 |             if patches:
250 |                 response["response"]["patchType"] = "JSONPatch"
251 |                 response["response"]["patch"] = base64.b64encode(
252 |                     json.dumps(patches).encode('utf-8')
253 |                 ).decode('utf-8')
254 |             
255 |             return response
256 | 
257 |     if __name__ == "__main__":
258 |         server = HTTPServer(('0.0.0.0', 8443), ProxyInjectorHandler)
259 |         
260 |         # Configure TLS with error handling
261 |         try:
262 |             context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
263 |             context.load_cert_chain('/etc/certs/tls.crt', '/etc/certs/tls.key')
264 |             server.socket = context.wrap_socket(server.socket, server_side=True)
265 |             print("Proxy injector webhook server starting on port 8443 with TLS...")
266 |         except ssl.SSLError as e:
267 |             print(f"SSL Certificate error: {e}")
268 |             print("Waiting for cert-manager to generate certificates...")
269 |             import time
270 |             time.sleep(30)  # Wait for cert-manager to generate certs
271 |             try:
272 |                 context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
273 |                 context.load_cert_chain('/etc/certs/tls.crt', '/etc/certs/tls.key')
274 |                 server.socket = context.wrap_socket(server.socket, server_side=True)
275 |                 print("TLS certificates loaded successfully on retry")
276 |             except Exception as retry_error:
277 |                 print(f"Failed to load certificates after retry: {retry_error}")
278 |                 print("Please check cert-manager installation and certificate generation")
279 |                 exit(1)
280 |         except Exception as e:
281 |             print(f"Failed to configure TLS: {e}")
282 |             exit(1)
283 |         
284 |         server.serve_forever()
285 | 
286 | ---
287 | # Proxy Injector Deployment
288 | apiVersion: apps/v1
289 | kind: Deployment
290 | metadata:
291 |   name: proxy-injector
292 |   namespace: vpn-gateway
293 |   labels:
294 |     app: proxy-injector
295 | spec:
296 |   replicas: 2
297 |   selector:
298 |     matchLabels:
299 |       app: proxy-injector
300 |   template:
301 |     metadata:
302 |       labels:
303 |         app: proxy-injector
304 |     spec:
305 |       serviceAccountName: proxy-injector
306 |       initContainers:
307 |         - name: wait-for-cert
308 |           image: bitnami/kubectl:latest
309 |           command:
310 |             - /bin/bash
311 |             - -c
312 |             - |
313 |               set -e
314 |               echo "Waiting for cert-manager to be ready..."
315 | 
316 |               # Wait for cert-manager deployment
317 |               kubectl wait --for=condition=available deployment/cert-manager -n cert-manager --timeout=300s
318 | 
319 |               # Wait for cert-manager CRDs to be established
320 |               echo "Waiting for cert-manager CRDs..."
321 |               kubectl wait --for condition=established --timeout=60s crd/clusterissuers.cert-manager.io
322 |               kubectl wait --for condition=established --timeout=60s crd/certificates.cert-manager.io
323 | 
324 |               # Wait for ClusterIssuer to exist and be ready
325 |               echo "Waiting for ClusterIssuer to be ready..."
326 |               timeout=60
327 |               while [ $timeout -gt 0 ]; do
328 |                 if kubectl get clusterissuer selfsigned-issuer &>/dev/null; then
329 |                   echo "ClusterIssuer found"
330 |                   break
331 |                 fi
332 |                 echo "Waiting for ClusterIssuer... ($timeout seconds remaining)"
333 |                 sleep 5
334 |                 timeout=$((timeout - 5))
335 |               done
336 | 
337 |               # Wait for certificate to be ready
338 |               echo "Waiting for proxy-injector certificate to be ready..."
339 |               kubectl wait --for=condition=ready certificate/proxy-injector-cert -n vpn-gateway --timeout=300s
340 | 
341 |               # Verify the secret exists
342 |               echo "Verifying certificate secret exists..."
343 |               kubectl get secret proxy-injector-certs -n vpn-gateway
344 | 
345 |               echo "Certificate is ready!"
346 |           resources:
347 |             requests:
348 |               cpu: 10m
349 |               memory: 32Mi
350 |             limits:
351 |               cpu: 50m
352 |               memory: 64Mi
353 |       containers:
354 |         - name: proxy-injector
355 |           image: python:3.9-alpine
356 |           command:
357 |             - python3
358 |             - /app/inject.py
359 |           ports:
360 |             - containerPort: 8443
361 |               name: webhook
362 |           volumeMounts:
363 |             - name: config
364 |               mountPath: /app
365 |             - name: certs
366 |               mountPath: /etc/certs
367 |               readOnly: true
368 |           resources:
369 |             requests:
370 |               memory: "64Mi"
371 |               cpu: "10m"
372 |             limits:
373 |               memory: "128Mi"
374 |               cpu: "50m"
375 |           livenessProbe:
376 |             httpGet:
377 |               path: /
378 |               port: 8443
379 |               scheme: HTTPS
380 |             initialDelaySeconds: 60
381 |             periodSeconds: 10
382 |             failureThreshold: 5
383 |           readinessProbe:
384 |             httpGet:
385 |               path: /
386 |               port: 8443
387 |               scheme: HTTPS
388 |             initialDelaySeconds: 45
389 |             periodSeconds: 5
390 |             failureThreshold: 10
391 |       volumes:
392 |         - name: config
393 |           configMap:
394 |             name: proxy-injector-config
395 |             defaultMode: 0755
396 |         - name: certs
397 |           secret:
398 |             secretName: proxy-injector-certs
399 | 
400 | ---
401 | # Proxy Injector Service
402 | apiVersion: v1
403 | kind: Service
404 | metadata:
405 |   name: proxy-injector
406 |   namespace: vpn-gateway
407 |   labels:
408 |     app: proxy-injector
409 | spec:
410 |   selector:
411 |     app: proxy-injector
412 |   ports:
413 |     - name: webhook
414 |       port: 443
415 |       targetPort: 8443
416 |   type: ClusterIP
417 | 
418 | ---
419 | # Mutating Admission Webhook Configuration
420 | apiVersion: admissionregistration.k8s.io/v1
421 | kind: MutatingWebhookConfiguration
422 | metadata:
423 |   name: proxy-injector
424 | webhooks:
425 |   - name: proxy-injector.vpn-gateway.svc.cluster.local
426 |     clientConfig:
427 |       service:
428 |         name: proxy-injector
429 |         namespace: vpn-gateway
430 |         path: /
431 |     rules:
432 |       - operations: ["CREATE", "UPDATE"]
433 |         apiGroups: [""]
434 |         apiVersions: ["v1"]
435 |         resources: ["pods"]
436 |     admissionReviewVersions: ["v1", "v1beta1"]
437 |     sideEffects: None
438 |     failurePolicy: Ignore # Don't block pod creation if webhook fails
439 |     namespaceSelector:
440 |       matchExpressions:
441 |         - key: name
442 |           operator: NotIn
443 |           values:
444 |             [
445 |               "kube-system",
446 |               "kube-public",
447 |               "kube-node-lease",
448 |               "vpn-gateway",
449 |               "metallb-system",
450 |               "cert-manager",
451 |             ]

</file_content>

<file_content path="k8s/my-media-stack/raw/aiostreams-deployment.yml">
  1 | apiVersion: apps/v1
  2 | kind: Deployment
  3 | metadata:
  4 |   name: aiostreams
  5 |   namespace: my-media-stack
  6 |   labels:
  7 |     com.docker.compose.service: aiostreams
  8 | spec:
  9 |   replicas: 1
 10 |   selector:
 11 |     matchLabels:
 12 |       com.docker.compose.service: aiostreams
 13 |   template:
 14 |     metadata:
 15 |       labels:
 16 |         com.docker.compose.service: aiostreams
 17 |     spec:
 18 |       containers:
 19 |         - name: aiostreams
 20 |           image: ghcr.io/viren070/aiostreams:latest
 21 |           ports:
 22 |             - name: aiostreams-3005
 23 |               containerPort: 3005
 24 |           env:
 25 |             - name: TZ
 26 |               value: "America/Chicago"
 27 |             - name: ADDON_NAME
 28 |               value: "BadenAIO"
 29 |             - name: ADDON_ID
 30 |               value: "aiostreams.bolabaden.org"
 31 |             - name: DETERMINISTIC_ADDON_ID
 32 |               value: "false"
 33 |             - name: PORT
 34 |               value: "3005"
 35 |             - name: SECRET_KEY
 36 |               value: "1070c705d193441da9fce510d5977e824686d5d0a0ab44bc8d8cb006ff64ee82"
 37 |             - name: API_KEY
 38 |               value: "sk_4dc059c0399c43fd94c09baaf0b94da119fc526775914bf2b3a3fb6e073e26d9"
 39 |             - name: SHOW_DIE
 40 |               value: "false"
 41 |             - name: LOG_LEVEL
 42 |               value: "debug"
 43 |             - name: LOG_FORMAT
 44 |               value: "text"
 45 |             - name: LOG_SENSITIVE_INFO
 46 |               value: "true"
 47 |             - name: MAX_ADDONS
 48 |               value: "50"
 49 |             - name: MAX_KEYWORD_FILTERS
 50 |               value: "30"
 51 |             - name: MAX_REGEX_SORT_PATTERNS
 52 |               value: "30"
 53 |             - name: MAX_MOVIE_SIZE
 54 |               value: "161061273600"
 55 |             - name: MAX_EPISODE_SIZE
 56 |               value: "161061273600"
 57 |             - name: MAX_TIMEOUT
 58 |               value: "50000"
 59 |             - name: MIN_TIMEOUT
 60 |               value: "1000"
 61 |             - name: MEDIAFLOW_IP_TIMEOUT
 62 |               value: "30000"
 63 |             - name: ENCRYPT_MEDIAFLOW_URLS
 64 |               value: "true"
 65 |             - name: STREMTHRU_TIMEOUT
 66 |               value: "30000"
 67 |             - name: DEFAULT_STREMTHRU_URL
 68 |               value: "https://stremthru.bolabaden.org/"
 69 |             - name: DEFAULT_STREMTHRU_CREDENTIAL
 70 |               value: "YnJ1bm5lcjU2OmhiTG9tNFN0M1IzMjc="
 71 |             - name: ENCRYPT_STREMTHRU_URLS
 72 |               value: "true"
 73 |             - name: DEFAULT_TIMEOUT
 74 |               value: "15000"
 75 |             - name: COMET_URL
 76 |               value: "http://comet:2020/"
 77 |             - name: FORCE_COMET_HOSTNAME
 78 |               value: "comet.bolabaden.org"
 79 |             - name: FORCE_COMET_PORT
 80 |               value: "443"
 81 |             - name: FORCE_COMET_PROTOCOL
 82 |               value: "https"
 83 |             - name: MEDIAFUSION_URL
 84 |               value: "http://mediafusion:8000/"
 85 |             - name: MEDIAFUSION_CONFIG_TIMEOUT
 86 |               value: "5000"
 87 |             - name: MEDIAFUSION_API_PASSWORD
 88 |               value: "h4L0m4St3R327"
 89 |             - name: JACKETTIO_URL
 90 |               value: "https://jackettio.elfhosted.com/"
 91 |             - name: DEFAULT_JACKETTIO_INDEXERS
 92 |               value: '["1337x", "animetosho", "anirena", "limetorrents", "nyaasi", "solidtorrents", "thepiratebay", "torlock", "yts"]'
 93 |             - name: DEFAULT_JACKETTIO_STREMTHRU_URL
 94 |               value: "https://stremthru.bolabaden.org"
 95 |             - name: STREMIO_JACKETT_URL
 96 |               value: "https://stremio-jackett.elfhosted.com/"
 97 |             - name: DEFAULT_STREMIO_JACKETT_TMDB_API_KEY
 98 |               value: "cec876f852b9c15d2c1b436b1117dff7"
 99 |             - name: STREMIO_JACKETT_CACHE_ENABLED
100 |               value: "true"
101 |             - name: STREMTHRU_STORE_URL
102 |               value: "https://stremthru.bolabaden.org/stremio/store/"
103 |             - name: EASYNEWS_PLUS_URL
104 |               value: "https://b89262c192b0-stremio-easynews-addon.baby-beamup.club/"
105 |             - name: EASYNEWS_PLUS_PLUS_URL
106 |               value: "https://easynews-cloudflare-worker.jqrw92fchz.workers.dev/"
107 |             - name: TORRENTIO_URL
108 |               value: "https://torrentio.strem.fun/"
109 |             - name: ORION_STREMIO_ADDON_URL
110 |               value: "https://5a0d1888fa64-orion.baby-beamup.club/"
111 |             - name: PEERFLIX_URL
112 |               value: "https://peerflix-addon.onrender.com/"
113 |             - name: TORBOX_STREMIO_URL
114 |               value: "https://stremio.torbox.app/"
115 |             - name: EASYNEWS_URL
116 |               value: "https://ea627ddf0ee7-easynews.baby-beamup.club/"
117 |             - name: DEBRIDIO_URL
118 |               value: "https://debridio.adobotec.com/"
119 |           volumeMounts:
120 |             - name: aiostreams-config
121 |               mountPath: /app/config
122 |           resources:
123 |             requests:
124 |               memory: "256Mi"
125 |               cpu: "100m"
126 |             limits:
127 |               memory: "512Mi"
128 |               cpu: "500m"
129 |           livenessProbe:
130 |             httpGet:
131 |               path: /health
132 |               port: 3005
133 |             initialDelaySeconds: 60
134 |             periodSeconds: 30
135 |             timeoutSeconds: 10
136 |             failureThreshold: 5
137 |           readinessProbe:
138 |             httpGet:
139 |               path: /health
140 |               port: 3005
141 |             initialDelaySeconds: 10
142 |             periodSeconds: 10
143 |             timeoutSeconds: 5
144 |             failureThreshold: 3
145 |       volumes:
146 |         - name: aiostreams-config
147 |           hostPath:
148 |             path: /home/ubuntu/my-media-stack/configs/stremio/addons/aiostreams/config
149 |             type: DirectoryOrCreate

</file_content>

<file_content path="k8s/my-media-stack/raw/aiostreams-expose.yml">
 1 | apiVersion: v1
 2 | kind: Service
 3 | metadata:
 4 |     name: aiostreams
 5 |     namespace: my-media-stack
 6 |     labels:
 7 |         com.docker.compose.service: aiostreams
 8 | spec:
 9 |     selector:
10 |         com.docker.compose.service: aiostreams
11 |     ports:
12 |         - name: aiostreams-3005
13 |           port: 3005
14 |           targetPort: aiostreams-3005 

</file_content>

<file_content path="k8s/my-media-stack/raw/apply-in-order.sh">
  1 | #!/bin/bash
  2 | # Apply Kubernetes manifests in the correct order to avoid dependency issues
  3 | # This script ensures cert-manager is ready before applying dependent resources
  4 | 
  5 | set -euo pipefail
  6 | 
  7 | # Colors for output
  8 | RED='\033[0;31m'
  9 | GREEN='\033[0;32m'
 10 | YELLOW='\033[1;33m'
 11 | BLUE='\033[0;34m'
 12 | NC='\033[0m' # No Color
 13 | 
 14 | log() {
 15 |     echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
 16 | }
 17 | 
 18 | warn() {
 19 |     echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
 20 | }
 21 | 
 22 | error() {
 23 |     echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
 24 |     exit 1
 25 | }
 26 | 
 27 | # Check if kubectl is available
 28 | if ! command -v kubectl &> /dev/null; then
 29 |     error "kubectl is not installed or not in PATH"
 30 | fi
 31 | 
 32 | if ! kubectl cluster-info &> /dev/null; then
 33 |     error "Cannot connect to Kubernetes cluster"
 34 | fi
 35 | 
 36 | log "🚀 Starting ordered deployment of my-media-stack"
 37 | 
 38 | # Step 1: Apply namespaces first
 39 | log "📁 Step 1: Creating namespaces..."
 40 | kubectl apply -f 00-namespaces.yml
 41 | log "✅ Namespaces created"
 42 | 
 43 | # Step 2: Apply cert-manager installation
 44 | log "🔧 Step 2: Installing cert-manager..."
 45 | kubectl apply -f 00-cert-manager-install.yml
 46 | 
 47 | # Wait for cert-manager to be ready
 48 | log "⏳ Waiting for cert-manager to be ready..."
 49 | kubectl wait --for=condition=available deployment/cert-manager -n cert-manager --timeout=300s
 50 | log "✅ cert-manager is ready"
 51 | 
 52 | # Step 3: Apply cert-manager setup (ClusterIssuer and Certificate)
 53 | log "🔐 Step 3: Setting up cert-manager resources..."
 54 | kubectl apply -f 02-cert-manager-setup.yml
 55 | 
 56 | # Wait for the certificate to be ready
 57 | log "⏳ Waiting for certificate to be ready..."
 58 | kubectl wait --for=condition=ready certificate/proxy-injector-cert -n vpn-gateway --timeout=300s
 59 | log "✅ cert-manager setup completed"
 60 | 
 61 | # Step 4: Apply proxy injector
 62 | log "🔌 Step 4: Deploying cluster proxy injector..."
 63 | kubectl apply -f 03-cluster-proxy-injector.yml
 64 | 
 65 | # Wait for proxy injector to be ready
 66 | log "⏳ Waiting for proxy injector to be ready..."
 67 | kubectl wait --for=condition=available deployment/proxy-injector -n vpn-gateway --timeout=300s
 68 | log "✅ Proxy injector is ready"
 69 | 
 70 | # Step 5: Apply all other manifests
 71 | log "📦 Step 5: Applying remaining manifests..."
 72 | 
 73 | # Get all YAML files except the ones we've already applied
 74 | remaining_files=$(find . -name "*.yml" -o -name "*.yaml" | grep -v -E "(00-namespaces|00-cert-manager|02-cert-manager-setup|03-cluster-proxy-injector)" | sort)
 75 | 
 76 | if [ -n "$remaining_files" ]; then
 77 |     for file in $remaining_files; do
 78 |         log "📄 Applying $file..."
 79 |         kubectl apply -f "$file"
 80 |     done
 81 |     log "✅ All remaining manifests applied"
 82 | else
 83 |     log "ℹ️  No additional manifests to apply"
 84 | fi
 85 | 
 86 | log "🎉 Deployment completed successfully!"
 87 | echo
 88 | log "📋 Summary:"
 89 | log "  • Namespaces: Created"
 90 | log "  • cert-manager: Installed and configured"
 91 | log "  • Proxy injector: Deployed and ready"
 92 | log "  • All other resources: Applied"
 93 | echo
 94 | log "🔍 Useful commands:"
 95 | log "  • Check all pods: kubectl get pods -A"
 96 | log "  • Check cert-manager: kubectl get pods -n cert-manager"
 97 | log "  • Check proxy injector: kubectl get pods -n vpn-gateway"
 98 | log "  • Check certificates: kubectl get certificates -A"
 99 | echo
100 | log "✅ Your media stack is ready!" 

</file_content>

<file_content path="k8s/my-media-stack/raw/auto-generated-ingressroutes.yml">
  1 | ---
  2 | # Auto-generated IngressRoute for aiostreams
  3 | apiVersion: traefik.io/v1alpha1
  4 | kind: IngressRoute
  5 | metadata:
  6 |   name: aiostreams-auto-ingressroute
  7 |   namespace: my-media-stack
  8 |   labels:
  9 |     auto-generated: "true"
 10 | spec:
 11 |   entryPoints:
 12 |     - websecure
 13 |   routes:
 14 |     - match: "Host(`aiostreams.beatapostapita.duckdns.org`)"
 15 |       kind: Rule
 16 |       services:
 17 |         - name: aiostreams
 18 |           port: 3005
 19 |   tls:
 20 |     certResolver: beatapostapita_duckdns_letsencrypt
 21 | 
 22 | ---
 23 | # Auto-generated IngressRoute for code-demo
 24 | apiVersion: traefik.io/v1alpha1
 25 | kind: IngressRoute
 26 | metadata:
 27 |   name: code-demo-auto-ingressroute
 28 |   namespace: my-media-stack
 29 |   labels:
 30 |     auto-generated: "true"
 31 | spec:
 32 |   entryPoints:
 33 |     - websecure
 34 |   routes:
 35 |     - match: "Host(`code-demo.beatapostapita.duckdns.org`)"
 36 |       kind: Rule
 37 |       services:
 38 |         - name: code-demo
 39 |           port: 8443
 40 |   tls:
 41 |     certResolver: beatapostapita_duckdns_letsencrypt
 42 | 
 43 | ---
 44 | # Auto-generated IngressRoute for code-dev
 45 | apiVersion: traefik.io/v1alpha1
 46 | kind: IngressRoute
 47 | metadata:
 48 |   name: code-dev-auto-ingressroute
 49 |   namespace: my-media-stack
 50 |   labels:
 51 |     auto-generated: "true"
 52 | spec:
 53 |   entryPoints:
 54 |     - websecure
 55 |   routes:
 56 |     - match: "Host(`code-dev.beatapostapita.duckdns.org`)"
 57 |       kind: Rule
 58 |       services:
 59 |         - name: code-dev
 60 |           port: 8443
 61 |   tls:
 62 |     certResolver: beatapostapita_duckdns_letsencrypt
 63 | 
 64 | ---
 65 | # Auto-generated IngressRoute for comet
 66 | apiVersion: traefik.io/v1alpha1
 67 | kind: IngressRoute
 68 | metadata:
 69 |   name: comet-auto-ingressroute
 70 |   namespace: my-media-stack
 71 |   labels:
 72 |     auto-generated: "true"
 73 | spec:
 74 |   entryPoints:
 75 |     - websecure
 76 |   routes:
 77 |     - match: "Host(`comet.beatapostapita.duckdns.org`)"
 78 |       kind: Rule
 79 |       services:
 80 |         - name: comet
 81 |           port: 2020
 82 |   tls:
 83 |     certResolver: beatapostapita_duckdns_letsencrypt
 84 | 
 85 | ---
 86 | # Auto-generated IngressRoute for dash
 87 | apiVersion: traefik.io/v1alpha1
 88 | kind: IngressRoute
 89 | metadata:
 90 |   name: dash-auto-ingressroute
 91 |   namespace: my-media-stack
 92 |   labels:
 93 |     auto-generated: "true"
 94 | spec:
 95 |   entryPoints:
 96 |     - websecure
 97 |   routes:
 98 |     - match: "Host(`dash.beatapostapita.duckdns.org`)"
 99 |       kind: Rule
100 |       services:
101 |         - name: dash
102 |           port: 3001
103 |   tls:
104 |     certResolver: beatapostapita_duckdns_letsencrypt
105 | 
106 | ---
107 | # Auto-generated IngressRoute for dozzle
108 | apiVersion: traefik.io/v1alpha1
109 | kind: IngressRoute
110 | metadata:
111 |   name: dozzle-auto-ingressroute
112 |   namespace: my-media-stack
113 |   labels:
114 |     auto-generated: "true"
115 | spec:
116 |   entryPoints:
117 |     - websecure
118 |   routes:
119 |     - match: "Host(`dozzle.beatapostapita.duckdns.org`)"
120 |       kind: Rule
121 |       services:
122 |         - name: dozzle
123 |           port: 8080
124 |   tls:
125 |     certResolver: beatapostapita_duckdns_letsencrypt
126 | 
127 | ---
128 | # Auto-generated IngressRoute for error-pages
129 | apiVersion: traefik.io/v1alpha1
130 | kind: IngressRoute
131 | metadata:
132 |   name: error-pages-auto-ingressroute
133 |   namespace: my-media-stack
134 |   labels:
135 |     auto-generated: "true"
136 | spec:
137 |   entryPoints:
138 |     - websecure
139 |   routes:
140 |     - match: "Host(`error-pages.beatapostapita.duckdns.org`)"
141 |       kind: Rule
142 |       services:
143 |         - name: error-pages
144 |           port: 80
145 |   tls:
146 |     certResolver: beatapostapita_duckdns_letsencrypt
147 | 
148 | ---
149 | # Auto-generated IngressRoute for flaresolverr
150 | apiVersion: traefik.io/v1alpha1
151 | kind: IngressRoute
152 | metadata:
153 |   name: flaresolverr-auto-ingressroute
154 |   namespace: my-media-stack
155 |   labels:
156 |     auto-generated: "true"
157 | spec:
158 |   entryPoints:
159 |     - websecure
160 |   routes:
161 |     - match: "Host(`flaresolverr.beatapostapita.duckdns.org`)"
162 |       kind: Rule
163 |       services:
164 |         - name: flaresolverr
165 |           port: 8191
166 |   tls:
167 |     certResolver: beatapostapita_duckdns_letsencrypt
168 | 
169 | ---
170 | # Auto-generated IngressRoute for gluetun-airvpn
171 | apiVersion: traefik.io/v1alpha1
172 | kind: IngressRoute
173 | metadata:
174 |   name: gluetun-airvpn-auto-ingressroute
175 |   namespace: my-media-stack
176 |   labels:
177 |     auto-generated: "true"
178 | spec:
179 |   entryPoints:
180 |     - websecure
181 |   routes:
182 |     - match: "Host(`gluetun-airvpn.beatapostapita.duckdns.org`)"
183 |       kind: Rule
184 |       services:
185 |         - name: gluetun-airvpn
186 |           port: 8888
187 |   tls:
188 |     certResolver: beatapostapita_duckdns_letsencrypt
189 | 
190 | ---
191 | # Auto-generated IngressRoute for gluetun-premiumize-nl
192 | apiVersion: traefik.io/v1alpha1
193 | kind: IngressRoute
194 | metadata:
195 |   name: gluetun-premiumize-nl-auto-ingressroute
196 |   namespace: my-media-stack
197 |   labels:
198 |     auto-generated: "true"
199 | spec:
200 |   entryPoints:
201 |     - websecure
202 |   routes:
203 |     - match: "Host(`gluetun-premiumize-nl.beatapostapita.duckdns.org`)"
204 |       kind: Rule
205 |       services:
206 |         - name: gluetun-premiumize-nl
207 |           port: 1057
208 |   tls:
209 |     certResolver: beatapostapita_duckdns_letsencrypt
210 | 
211 | ---
212 | # Auto-generated IngressRoute for gluetun-premiumize-nl-published
213 | apiVersion: traefik.io/v1alpha1
214 | kind: IngressRoute
215 | metadata:
216 |   name: gluetun-premiumize-nl-published-auto-ingressroute
217 |   namespace: my-media-stack
218 |   labels:
219 |     auto-generated: "true"
220 | spec:
221 |   entryPoints:
222 |     - websecure
223 |   routes:
224 |     - match: "Host(`gluetun-premiumize-nl-published.beatapostapita.duckdns.org`)"
225 |       kind: Rule
226 |       services:
227 |         - name: gluetun-premiumize-nl-published
228 |           port: 8080
229 |   tls:
230 |     certResolver: beatapostapita_duckdns_letsencrypt
231 | 
232 | ---
233 | # Auto-generated IngressRoute for gluetun-premiumize-us
234 | apiVersion: traefik.io/v1alpha1
235 | kind: IngressRoute
236 | metadata:
237 |   name: gluetun-premiumize-us-auto-ingressroute
238 |   namespace: my-media-stack
239 |   labels:
240 |     auto-generated: "true"
241 | spec:
242 |   entryPoints:
243 |     - websecure
244 |   routes:
245 |     - match: "Host(`gluetun-premiumize-us.beatapostapita.duckdns.org`)"
246 |       kind: Rule
247 |       services:
248 |         - name: gluetun-premiumize-us
249 |           port: 11470
250 |   tls:
251 |     certResolver: beatapostapita_duckdns_letsencrypt
252 | 
253 | ---
254 | # Auto-generated IngressRoute for gluetun-premiumize-us-published
255 | apiVersion: traefik.io/v1alpha1
256 | kind: IngressRoute
257 | metadata:
258 |   name: gluetun-premiumize-us-published-auto-ingressroute
259 |   namespace: my-media-stack
260 |   labels:
261 |     auto-generated: "true"
262 | spec:
263 |   entryPoints:
264 |     - websecure
265 |   routes:
266 |     - match: "Host(`gluetun-premiumize-us-published.beatapostapita.duckdns.org`)"
267 |       kind: Rule
268 |       services:
269 |         - name: gluetun-premiumize-us-published
270 |           port: 8080
271 |   tls:
272 |     certResolver: beatapostapita_duckdns_letsencrypt
273 | 
274 | ---
275 | # Auto-generated IngressRoute for gptr
276 | apiVersion: traefik.io/v1alpha1
277 | kind: IngressRoute
278 | metadata:
279 |   name: gptr-auto-ingressroute
280 |   namespace: my-media-stack
281 |   labels:
282 |     auto-generated: "true"
283 | spec:
284 |   entryPoints:
285 |     - websecure
286 |   routes:
287 |     - match: "Host(`gptr.beatapostapita.duckdns.org`)"
288 |       kind: Rule
289 |       services:
290 |         - name: gptr
291 |           port: 8000
292 |   tls:
293 |     certResolver: beatapostapita_duckdns_letsencrypt
294 | 
295 | ---
296 | # Auto-generated IngressRoute for homepage
297 | apiVersion: traefik.io/v1alpha1
298 | kind: IngressRoute
299 | metadata:
300 |   name: homepage-auto-ingressroute
301 |   namespace: my-media-stack
302 |   labels:
303 |     auto-generated: "true"
304 | spec:
305 |   entryPoints:
306 |     - websecure
307 |   routes:
308 |     - match: "Host(`homepage.beatapostapita.duckdns.org`)"
309 |       kind: Rule
310 |       services:
311 |         - name: homepage
312 |           port: 3000
313 |   tls:
314 |     certResolver: beatapostapita_duckdns_letsencrypt
315 | 
316 | ---
317 | # Auto-generated IngressRoute for jackett
318 | apiVersion: traefik.io/v1alpha1
319 | kind: IngressRoute
320 | metadata:
321 |   name: jackett-auto-ingressroute
322 |   namespace: my-media-stack
323 |   labels:
324 |     auto-generated: "true"
325 | spec:
326 |   entryPoints:
327 |     - websecure
328 |   routes:
329 |     - match: "Host(`jackett.beatapostapita.duckdns.org`)"
330 |       kind: Rule
331 |       services:
332 |         - name: jackett
333 |           port: 9117
334 |   tls:
335 |     certResolver: beatapostapita_duckdns_letsencrypt
336 | 
337 | ---
338 | # Auto-generated IngressRoute for khoj-database
339 | apiVersion: traefik.io/v1alpha1
340 | kind: IngressRoute
341 | metadata:
342 |   name: khoj-database-auto-ingressroute
343 |   namespace: my-media-stack
344 |   labels:
345 |     auto-generated: "true"
346 | spec:
347 |   entryPoints:
348 |     - websecure
349 |   routes:
350 |     - match: "Host(`khoj-database.beatapostapita.duckdns.org`)"
351 |       kind: Rule
352 |       services:
353 |         - name: khoj-database
354 |           port: 5432
355 |   tls:
356 |     certResolver: beatapostapita_duckdns_letsencrypt
357 | 
358 | ---
359 | # Auto-generated IngressRoute for khoj-sandbox
360 | apiVersion: traefik.io/v1alpha1
361 | kind: IngressRoute
362 | metadata:
363 |   name: khoj-sandbox-auto-ingressroute
364 |   namespace: my-media-stack
365 |   labels:
366 |     auto-generated: "true"
367 | spec:
368 |   entryPoints:
369 |     - websecure
370 |   routes:
371 |     - match: "Host(`khoj-sandbox.beatapostapita.duckdns.org`)"
372 |       kind: Rule
373 |       services:
374 |         - name: khoj-sandbox
375 |           port: 8080
376 |   tls:
377 |     certResolver: beatapostapita_duckdns_letsencrypt
378 | 
379 | ---
380 | # Auto-generated IngressRoute for lobechat
381 | apiVersion: traefik.io/v1alpha1
382 | kind: IngressRoute
383 | metadata:
384 |   name: lobechat-auto-ingressroute
385 |   namespace: my-media-stack
386 |   labels:
387 |     auto-generated: "true"
388 | spec:
389 |   entryPoints:
390 |     - websecure
391 |   routes:
392 |     - match: "Host(`lobechat.beatapostapita.duckdns.org`)"
393 |       kind: Rule
394 |       services:
395 |         - name: lobechat
396 |           port: 3210
397 |   tls:
398 |     certResolver: beatapostapita_duckdns_letsencrypt
399 | 
400 | ---
401 | # Auto-generated IngressRoute for mediafusion
402 | apiVersion: traefik.io/v1alpha1
403 | kind: IngressRoute
404 | metadata:
405 |   name: mediafusion-auto-ingressroute
406 |   namespace: my-media-stack
407 |   labels:
408 |     auto-generated: "true"
409 | spec:
410 |   entryPoints:
411 |     - websecure
412 |   routes:
413 |     - match: "Host(`mediafusion.beatapostapita.duckdns.org`)"
414 |       kind: Rule
415 |       services:
416 |         - name: mediafusion
417 |           port: 8000
418 |   tls:
419 |     certResolver: beatapostapita_duckdns_letsencrypt
420 | 
421 | ---
422 | # Auto-generated IngressRoute for mongodb
423 | apiVersion: traefik.io/v1alpha1
424 | kind: IngressRoute
425 | metadata:
426 |   name: mongodb-auto-ingressroute
427 |   namespace: my-media-stack
428 |   labels:
429 |     auto-generated: "true"
430 | spec:
431 |   entryPoints:
432 |     - websecure
433 |   routes:
434 |     - match: "Host(`mongodb.beatapostapita.duckdns.org`)"
435 |       kind: Rule
436 |       services:
437 |         - name: mongodb
438 |           port: 27017
439 |   tls:
440 |     certResolver: beatapostapita_duckdns_letsencrypt
441 | 
442 | ---
443 | # Auto-generated IngressRoute for nginx-auth
444 | apiVersion: traefik.io/v1alpha1
445 | kind: IngressRoute
446 | metadata:
447 |   name: nginx-auth-auto-ingressroute
448 |   namespace: my-media-stack
449 |   labels:
450 |     auto-generated: "true"
451 | spec:
452 |   entryPoints:
453 |     - websecure
454 |   routes:
455 |     - match: "Host(`nginx-auth.beatapostapita.duckdns.org`)"
456 |       kind: Rule
457 |       services:
458 |         - name: nginx-auth
459 |           port: 80
460 |   tls:
461 |     certResolver: beatapostapita_duckdns_letsencrypt
462 | 
463 | ---
464 | # Auto-generated IngressRoute for prowlarr
465 | apiVersion: traefik.io/v1alpha1
466 | kind: IngressRoute
467 | metadata:
468 |   name: prowlarr-auto-ingressroute
469 |   namespace: my-media-stack
470 |   labels:
471 |     auto-generated: "true"
472 | spec:
473 |   entryPoints:
474 |     - websecure
475 |   routes:
476 |     - match: "Host(`prowlarr.beatapostapita.duckdns.org`)"
477 |       kind: Rule
478 |       services:
479 |         - name: prowlarr
480 |           port: 9696
481 |   tls:
482 |     certResolver: beatapostapita_duckdns_letsencrypt
483 | 
484 | ---
485 | # Auto-generated IngressRoute for redis
486 | apiVersion: traefik.io/v1alpha1
487 | kind: IngressRoute
488 | metadata:
489 |   name: redis-auto-ingressroute
490 |   namespace: my-media-stack
491 |   labels:
492 |     auto-generated: "true"
493 | spec:
494 |   entryPoints:
495 |     - websecure
496 |   routes:
497 |     - match: "Host(`redis.beatapostapita.duckdns.org`)"
498 |       kind: Rule
499 |       services:
500 |         - name: redis
501 |           port: 6379
502 |   tls:
503 |     certResolver: beatapostapita_duckdns_letsencrypt
504 | 
505 | ---
506 | # Auto-generated IngressRoute for searxng
507 | apiVersion: traefik.io/v1alpha1
508 | kind: IngressRoute
509 | metadata:
510 |   name: searxng-auto-ingressroute
511 |   namespace: my-media-stack
512 |   labels:
513 |     auto-generated: "true"
514 | spec:
515 |   entryPoints:
516 |     - websecure
517 |   routes:
518 |     - match: "Host(`searxng.beatapostapita.duckdns.org`)"
519 |       kind: Rule
520 |       services:
521 |         - name: searxng
522 |           port: 8080
523 |   tls:
524 |     certResolver: beatapostapita_duckdns_letsencrypt
525 | 
526 | ---
527 | # Auto-generated IngressRoute for speedtest
528 | apiVersion: traefik.io/v1alpha1
529 | kind: IngressRoute
530 | metadata:
531 |   name: speedtest-auto-ingressroute
532 |   namespace: my-media-stack
533 |   labels:
534 |     auto-generated: "true"
535 | spec:
536 |   entryPoints:
537 |     - websecure
538 |   routes:
539 |     - match: "Host(`speedtest.beatapostapita.duckdns.org`)"
540 |       kind: Rule
541 |       services:
542 |         - name: speedtest
543 |           port: 443
544 |   tls:
545 |     certResolver: beatapostapita_duckdns_letsencrypt
546 | 
547 | ---
548 | # Auto-generated IngressRoute for stremio
549 | apiVersion: traefik.io/v1alpha1
550 | kind: IngressRoute
551 | metadata:
552 |   name: stremio-auto-ingressroute
553 |   namespace: my-media-stack
554 |   labels:
555 |     auto-generated: "true"
556 | spec:
557 |   entryPoints:
558 |     - websecure
559 |   routes:
560 |     - match: "Host(`stremio.beatapostapita.duckdns.org`)"
561 |       kind: Rule
562 |       services:
563 |         - name: stremio
564 |           port: 11470
565 |   tls:
566 |     certResolver: beatapostapita_duckdns_letsencrypt
567 | 
568 | ---
569 | # Auto-generated IngressRoute for stremio-jackett
570 | apiVersion: traefik.io/v1alpha1
571 | kind: IngressRoute
572 | metadata:
573 |   name: stremio-jackett-auto-ingressroute
574 |   namespace: my-media-stack
575 |   labels:
576 |     auto-generated: "true"
577 | spec:
578 |   entryPoints:
579 |     - websecure
580 |   routes:
581 |     - match: "Host(`stremio-jackett.beatapostapita.duckdns.org`)"
582 |       kind: Rule
583 |       services:
584 |         - name: stremio-jackett
585 |           port: 3000
586 |   tls:
587 |     certResolver: beatapostapita_duckdns_letsencrypt
588 | 
589 | ---
590 | # Auto-generated IngressRoute for tailscale-airvpn
591 | apiVersion: traefik.io/v1alpha1
592 | kind: IngressRoute
593 | metadata:
594 |   name: tailscale-airvpn-auto-ingressroute
595 |   namespace: my-media-stack
596 |   labels:
597 |     auto-generated: "true"
598 | spec:
599 |   entryPoints:
600 |     - websecure
601 |   routes:
602 |     - match: "Host(`tailscale-airvpn.beatapostapita.duckdns.org`)"
603 |       kind: Rule
604 |       services:
605 |         - name: tailscale-airvpn
606 |           port: 41641
607 |   tls:
608 |     certResolver: beatapostapita_duckdns_letsencrypt
609 | 
610 | ---
611 | # Auto-generated IngressRoute for tailscale-premiumize-nl
612 | apiVersion: traefik.io/v1alpha1
613 | kind: IngressRoute
614 | metadata:
615 |   name: tailscale-premiumize-nl-auto-ingressroute
616 |   namespace: my-media-stack
617 |   labels:
618 |     auto-generated: "true"
619 | spec:
620 |   entryPoints:
621 |     - websecure
622 |   routes:
623 |     - match: "Host(`tailscale-premiumize-nl.beatapostapita.duckdns.org`)"
624 |       kind: Rule
625 |       services:
626 |         - name: tailscale-premiumize-nl
627 |           port: 41649
628 |   tls:
629 |     certResolver: beatapostapita_duckdns_letsencrypt
630 | 
631 | ---
632 | # Auto-generated IngressRoute for tailscale-premiumize-us
633 | apiVersion: traefik.io/v1alpha1
634 | kind: IngressRoute
635 | metadata:
636 |   name: tailscale-premiumize-us-auto-ingressroute
637 |   namespace: my-media-stack
638 |   labels:
639 |     auto-generated: "true"
640 | spec:
641 |   entryPoints:
642 |     - websecure
643 |   routes:
644 |     - match: "Host(`tailscale-premiumize-us.beatapostapita.duckdns.org`)"
645 |       kind: Rule
646 |       services:
647 |         - name: tailscale-premiumize-us
648 |           port: 41642
649 |   tls:
650 |     certResolver: beatapostapita_duckdns_letsencrypt
651 | 
652 | ---
653 | # Auto-generated IngressRoute for tailscale-warp
654 | apiVersion: traefik.io/v1alpha1
655 | kind: IngressRoute
656 | metadata:
657 |   name: tailscale-warp-auto-ingressroute
658 |   namespace: my-media-stack
659 |   labels:
660 |     auto-generated: "true"
661 | spec:
662 |   entryPoints:
663 |     - websecure
664 |   routes:
665 |     - match: "Host(`tailscale-warp.beatapostapita.duckdns.org`)"
666 |       kind: Rule
667 |       services:
668 |         - name: tailscale-warp
669 |           port: 41641
670 |   tls:
671 |     certResolver: beatapostapita_duckdns_letsencrypt
672 | 
673 | ---
674 | # Auto-generated IngressRoute for tinyauth
675 | apiVersion: traefik.io/v1alpha1
676 | kind: IngressRoute
677 | metadata:
678 |   name: tinyauth-auto-ingressroute
679 |   namespace: my-media-stack
680 |   labels:
681 |     auto-generated: "true"
682 | spec:
683 |   entryPoints:
684 |     - websecure
685 |   routes:
686 |     - match: "Host(`tinyauth.beatapostapita.duckdns.org`)"
687 |       kind: Rule
688 |       services:
689 |         - name: tinyauth
690 |           port: 3000
691 |   tls:
692 |     certResolver: beatapostapita_duckdns_letsencrypt
693 | 
694 | ---
695 | # Auto-generated IngressRoute for tinyauth-published
696 | apiVersion: traefik.io/v1alpha1
697 | kind: IngressRoute
698 | metadata:
699 |   name: tinyauth-published-auto-ingressroute
700 |   namespace: my-media-stack
701 |   labels:
702 |     auto-generated: "true"
703 | spec:
704 |   entryPoints:
705 |     - websecure
706 |   routes:
707 |     - match: "Host(`tinyauth-published.beatapostapita.duckdns.org`)"
708 |       kind: Rule
709 |       services:
710 |         - name: tinyauth-published
711 |           port: 3000
712 |   tls:
713 |     certResolver: beatapostapita_duckdns_letsencrypt
714 | 
715 | ---
716 | # Auto-generated IngressRoute for traefik
717 | apiVersion: traefik.io/v1alpha1
718 | kind: IngressRoute
719 | metadata:
720 |   name: traefik-auto-ingressroute
721 |   namespace: my-media-stack
722 |   labels:
723 |     auto-generated: "true"
724 | spec:
725 |   entryPoints:
726 |     - websecure
727 |   routes:
728 |     - match: "Host(`traefik.beatapostapita.duckdns.org`)"
729 |       kind: Rule
730 |       services:
731 |         - name: traefik
732 |           port: 80
733 |   tls:
734 |     certResolver: beatapostapita_duckdns_letsencrypt
735 | 
736 | ---
737 | # Auto-generated IngressRoute for traefik-dashboard
738 | apiVersion: traefik.io/v1alpha1
739 | kind: IngressRoute
740 | metadata:
741 |   name: traefik-dashboard-auto-ingressroute
742 |   namespace: my-media-stack
743 |   labels:
744 |     auto-generated: "true"
745 | spec:
746 |   entryPoints:
747 |     - websecure
748 |   routes:
749 |     - match: "Host(`traefik-dashboard.beatapostapita.duckdns.org`)"
750 |       kind: Rule
751 |       services:
752 |         - name: traefik-dashboard
753 |           port: 8080
754 |   tls:
755 |     certResolver: beatapostapita_duckdns_letsencrypt
756 | 
757 | ---
758 | # Auto-generated IngressRoute for warp
759 | apiVersion: traefik.io/v1alpha1
760 | kind: IngressRoute
761 | metadata:
762 |   name: warp-auto-ingressroute
763 |   namespace: my-media-stack
764 |   labels:
765 |     auto-generated: "true"
766 | spec:
767 |   entryPoints:
768 |     - websecure
769 |   routes:
770 |     - match: "Host(`warp.beatapostapita.duckdns.org`)"
771 |       kind: Rule
772 |       services:
773 |         - name: warp
774 |           port: 8888
775 |   tls:
776 |     certResolver: beatapostapita_duckdns_letsencrypt
777 | 
778 | ---
779 | # Auto-generated IngressRoute for warp-fetch-proxy
780 | apiVersion: traefik.io/v1alpha1
781 | kind: IngressRoute
782 | metadata:

(File list truncated. Use list_files on specific subdirectories if you need to explore further.)
</environment_details>

## Assistant

_Time: 2025-06-11T15:56:02.880Z_

<thinking>
To accomplish the task of adding Kubernetes resources to the cdk8s app and converting existing Include statements to pure TypeScript cdk8s definitions, I need to:

1. **Analyze the task requirements**:
   - Add resources from the provided YAML files in `k8s/my-media-stack/raw` to the cdk8s app.
   - Convert all existing Include statements in the cdk8s app to TypeScript definitions.
   - Remove YAML dependencies entirely.
   - Use `resolve-library-id` and another tool to get cdk8s documentation and follow best practices.

2. **Assess available information**:
   - The provided YAML files include:
     - `00-cert-manager-install.yml`: Defines cert-manager namespace, CRDs, ServiceAccount, ClusterRoles, ClusterRoleBindings, and Deployment.
     - `00-cert-manager-setup.yml`: Defines a Job for cert-manager setup, including ClusterIssuer and Certificate creation.
     - `00-namespaces.yml`: Defines namespaces `my-media-stack` and `vpn-gateway`.
     - `01-cluster-proxy-injector.yml` and `03-cluster-proxy-injector.yml`: Define a mutating webhook for proxy injection (appear identical; likely only one is needed).
     - `02-cert-manager-setup.yml`: Defines a self-signed ClusterIssuer and Certificate for the proxy injector.
     - `aiostreams-deployment.yml`: Defines a Deployment for the aiostreams application.
     - `aiostreams-expose.yml`: Defines a Service for aiostreams.
     - `apply-in-order.sh`: A script for applying manifests in order (not needed for cdk8s conversion).
     - `auto-generated-ingressroutes.yml`: Defines Traefik IngressRoutes (requires Traefik API support in cdk8s).
   - Environment details show a large number of additional YAML files in `k8s/my-media-stack/raw`, but only a subset is provided in full. I may need to read additional files if they are referenced in the cdk8s app’s Include statements.
   - The `k8s/elfhosted/unfinished/raw` directory is mentioned but no content is provided. I’ll need to confirm if resources from this directory are required.
   - The main cdk8s app file (likely `main.ts`) is not provided, so I need to check its contents to identify existing Include statements.
   - The `resolve-library-id` tool and another unspecified tool are mentioned for obtaining cdk8s documentation. Since no MCP servers are connected, I’ll assume `resolve-library-id` refers to a command-line tool or npm package, and the “other tool” might be related to cdk8s CLI or documentation lookup.

3. **Identify tools to use**:
   - **list_files**: To check for the main cdk8s app file (e.g., `main.ts`) and confirm the presence of files in `k8s/elfhosted/unfinished/raw`.
   - **read_file**: To read the main cdk8s app file to identify Include statements and other relevant code.
   - **search_files**: To find all files with Include statements if the app spans multiple files.
   - **execute_command**: To run `resolve-library-id` or cdk8s CLI commands to get documentation or initialize the project if needed.
   - **write_to_file**: To update the cdk8s app with new TypeScript definitions.
   - **apply_diff**: To modify existing files by replacing Include statements with TypeScript code.
   - **ask_followup_question**: If critical information is missing (e.g., path to `main.ts`, contents of `k8s/elfhosted/unfinished/raw`, or clarification on tools).

4. **Determine next steps**:
   - First, I need to locate the main cdk8s app file to understand its structure and identify Include statements.
   - The environment details don’t list project files explicitly, so I’ll use `list_files` to explore the project directory.
   - I’ll assume the cdk8s app is in a standard location like `src/main.ts` or `main.ts` unless otherwise indicated.
   - If `main.ts` is found, I’ll read it to check for Include statements.
   - If `k8s/elfhosted/unfinished/raw` contains relevant files, I’ll list them to determine what resources need to be added.
   - I’ll also attempt to run `resolve-library-id` to gather cdk8s documentation, assuming it’s a CLI tool available in the environment.

5. **Tool selection**:
   - I’ll start with `list_files` to explore the project directory and confirm the presence of the cdk8s app file and `k8s/elfhosted/unfinished/raw` contents.
   - Required parameters for `list_files`:
     - `path`: Relative path to the directory to list (e.g., `.` for the root or `k8s/elfhosted/unfinished/raw`).
     - `recursive`: Optional, but I’ll set to `true` to get a comprehensive view.
   - All required parameters are available, so I can proceed with the tool.

</thinking>

<list_files>
<path>.</path>
<recursive>true</recursive>
</list_files>
