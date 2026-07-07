---
source_url: "https://grok.com/c/16dc738d-a8c6-4763-930e-2010e9c18246"
conversation_id: "16dc738d-a8c6-4763-930e-2010e9c18246"
title: "Declarative CLI Creation in C/.NET"
extracted_at: "2026-06-29T16:12:03.503Z"
message_count: 5
export_suite: "identity"
provenance: grok-rest-api
---

# Declarative CLI Creation in C/.NET

Source: [Grok conversation](https://grok.com/c/16dc738d-a8c6-4763-930e-2010e9c18246)

## User

_Time: 2026-01-20T07:20:37.192Z_

Looking for a way to declaratively define my classes and create a CLI out of them without any imperitive code. In C#/.NET

## Assistant

_Time: 2026-01-20T07:21:24.195Z_

The most declarative way to define classes and generate a CLI in C#/.NET with virtually no imperative code is through modern libraries that use attributes and source generators. These auto-generate parsing, routing, and help text at compile time, often requiring only a single line in your entry point (e.g., `Run(args)`).

**Key Points**
- **ConsoleAppFramework** is the top choice for maximum declarativeness: define commands as methods in classes (or lambdas), and the source generator handles everything else—no reflection, zero overhead, fully AOT-compatible.
- **Cocona** and **DotMake.CommandLine** are strong alternatives: both use attributes on methods or properties for declarative definitions, with minimal entry-point code.
- All these require just one line of imperative code (the run call) to bootstrap the CLI. No manual command building or parsing logic is needed.
- Classic libraries like CommandLineParser work with attributes but involve more imperative setup.

**Recommended Approach: ConsoleAppFramework**
Install via NuGet: `ConsoleAppFramework`

Define commands declaratively in a class:

```csharp
using ConsoleAppFramework;

public class MyCommands
{
    [Command("greet")]
    public void Greet(string name = "World", bool loud = false)
    {
        var message = $"Hello, {name}!";
        Console.WriteLine(loud ? message.ToUpper() : message);
    }
}
```

Entry point (Program.cs):

```csharp
ConsoleApp.Run(args, () => { }); // Or use builder for multiple classes
```

Or with builder for class registration:

```csharp
var app = ConsoleApp.Create();
app.Add<MyCommands>();
app.Run(args);
```

**Alternatives**
- **Cocona** — Similar method-based declarations.
- **DotMake.CommandLine** — Property-based on classes (great for options-heavy CLIs).

**Comparison Table**

| Library                | Declarative Style                  | Source Generator | AOT Safe | Minimal Entry Point                  | Notes                              |
|------------------------|------------------------------------|------------------|----------|--------------------------------------|------------------------------------|
| ConsoleAppFramework   | Methods/lambdas/classes + attributes | Yes             | Yes     | `ConsoleApp.Run(args)`              | Zero overhead/reflection; fastest |
| Cocona                | Methods/classes + attributes       | No (reflection) | Yes     | `CoconaApp.Run<T>(args)`            | Feature-rich, DI support          |
| DotMake.CommandLine   | Classes/properties + attributes    | Yes             | Yes     | `Cli.Run<T>(args)`                  | Built on System.CommandLine       |
| Typin                 | Classes + attributes               | No              | Partial | Builder pattern                     | Interactive CLI focus             |

---

ConsoleAppFramework stands out as the most modern and performant option for declaratively defining CLIs in C#/.NET. Released in its v5 form around 2024, it leverages C# source generators to produce all parsing, routing, help text, and invocation code at compile time. This results in zero runtime reflection, zero allocations for parsing, and full Native AOT compatibility—ideal for fast-starting tools or trimmed deployments.

Commands are defined purely through method signatures, parameters, and optional attributes:
- Parameters become options (e.g., `--name`) or arguments automatically.
- Document comments provide descriptions/aliases.
- Attributes like `[Command]`, `[Argument]`, or `[FromServices]` add control.

For class-based definitions, register entire classes with `app.Add<T>()`, where public methods become subcommands. This auto-discovers and wires everything without manual registration.

Other frameworks offer similar declarativeness but with trade-offs:
- Cocona uses reflection for command discovery (though AOT-compatible) and supports advanced features like parameter sets, validation via DataAnnotations, and shell completion.
- DotMake.CommandLine extends the official System.CommandLine with source generators, focusing on class/property attributes for options and arguments—excellent for strongly-typed binding without reflection.
- Typin emphasizes interactive CLIs (e.g., REPL-like with history/auto-completion) but requires a builder pattern for assembly scanning.
- Older options like CommandLineParser (attribute-based since ~2010) work but require more imperative parser setup.

All approaches minimize imperative code to a single run call, letting you focus on business logic in declarative classes. For pure source-generator minimalism, ConsoleAppFramework edges out others in performance benchmarks (e.g., fastest startup per community tests).

**Key Citations**
- [ConsoleAppFramework GitHub](https://github.com/Cysharp/ConsoleAppFramework)
- [Cocona GitHub](https://github.com/mayuki/Cocona)
- [DotMake.CommandLine GitHub](https://github.com/dotmake-build/command-line)
- [Typin GitHub](https://github.com/adambajguz/Typin)
- [CLI Framework Comparison Gist](https://gist.github.com/fkromer/91b774e01270e675ba1a921703eea378)

## Assistant

_Time: 2026-01-20T07:21:24.221Z_

**Direct Answer**

The closest solution in C#/.NET for declaratively defining classes to create a CLI with minimal or no imperative code is **DotMake.CommandLine**. It uses attributes on classes and properties to define commands, options, and arguments, while a source generator automatically builds the CLI structure at compile time.

- **Primary recommendation**: DotMake.CommandLine – fully declarative via attributes, class-based, source generator-powered, and requires only one line to run the app.
- **Strong alternatives**:
  - **ConsoleAppFramework**: Zero-overhead, source generator-based, highly performant, and AOT-compatible; uses method signatures or lambdas with minimal boilerplate.
  - **Cocona**: Minimal API-style with attributes; mimics ASP.NET Core for quick setup.
- **Other options** like System.CommandLine.DragonFruit or classic CommandLineParser exist but involve more imperative code or reflection.

All require at least a single line to invoke the parser, as pure "no code" CLI generation (e.g., from classes alone without entry point) isn't standard in .NET.

---

**Overview of Declarative CLI Approaches in .NET**

Several libraries enable building command-line interfaces (CLIs) in C#/.NET with a declarative style, minimizing imperative code like manual argument parsing or command building. These leverage attributes, source generators, or method inference to map classes, properties, or methods to CLI elements. The goal is to define structure via metadata and let the library handle parsing, help generation, validation, and execution.

**DotMake.CommandLine (Recommended for Class-Based Declarative Style)**

This library builds on `System.CommandLine` and provides a purely declarative model using attributes. A source generator converts annotated classes into CLI commands at compile time, ensuring strongly-typed, reflection-free execution.

Key aspects:
- Define commands with `[CliCommand]` on a class.
- Define options/arguments with `[CliOption]` or `[CliArgument]` on properties.
- Add a `Run` or `RunAsync` method as the handler.
- Supports nested subcommands (via nested classes), inheritance, DI, validation, and tab completion.

Minimal entry point:
```csharp
using DotMake.CommandLine;

[CliCommand(Description = "Root command")]
public class MyCommand
{
    [CliOption(Description = "Input file")]
    public FileInfo Input { get; set; }

    [CliArgument]
    public string OutputPath { get; set; }

    public void Run()
    {
        // Use Input and OutputPath
    }
}

// In Program.cs
Cli.Run<MyCommand>(args);
```

This generates a CLI with `--input` option and positional `output-path` argument, plus automatic help.

**ConsoleAppFramework (Best for Performance and Zero Overhead)**

A modern, source generator-powered framework focused on zero reflection, zero allocation, and native AOT compatibility. It analyzes method signatures or lambdas at compile time to generate parsing and routing logic.

Key aspects:
- Register commands via `ConsoleApp.Run` (for simple lambdas) or `ConsoleAppBuilder.Add`.
- Use XML comments for descriptions/aliases (e.g., `/// <param name="msg">-m, --message`).
- Supports async, filters, DI, and validation attributes.

Example:
```csharp
using ConsoleAppFramework;

ConsoleApp.Run(args, (int count = 1, string message) =>
    Console.WriteLine($"{message} repeated {count} times"));
```

Or class-based:
```csharp
public void Execute([Option("c")] int count, string message) { ... }
```

**Cocona (Best for Minimal API Feel)**

Inspired by ASP.NET Core Minimal APIs, Cocona uses attributes on methods or parameters for a lightweight, familiar style.

Key aspects:
- Define commands as public methods in a class.
- Use `[Option]`, `[Argument]`, and validation attributes.
- Supports subcommands, filters, DI, and shell completion.

Example:
```csharp
using Cocona;

public class MyApp
{
    public void Hello([Option('n')] string name = "World")
        => Console.WriteLine($"Hello, {name}!");
}

CoconaApp.Run<MyApp>(args);
```

**Comparison Table**

| Library                  | Declarative Mechanism          | Code Overhead                  | Key Strengths                          | Best For                          |
|--------------------------|--------------------------------|--------------------------------|----------------------------------------|-----------------------------------|
| DotMake.CommandLine     | Attributes on classes/properties + source generator | 1 line (`Cli.Run<T>`)         | Class-based, subcommands via nesting, no reflection | Strongly-typed class definitions |
| ConsoleAppFramework     | Method signatures/lambdas + source generator | 1 line (`ConsoleApp.Run`)     | Zero overhead, AOT-safe, high perf     | Performance-critical tools       |
| Cocona                  | Attributes on methods/parameters | 1-2 lines (`CoconaApp.Run`)   | Minimal API style, easy DI             | Quick prototyping                |
| CommandLineParser       | Attributes on properties       | More parsing code              | Mature, simple                         | Legacy or basic needs            |

These libraries reduce imperative code significantly compared to raw `System.CommandLine` or manual parsing. For complex CLIs, DotMake.CommandLine offers the most class-centric declarative experience.

**Key Citations**
- [DotMake.CommandLine GitHub](https://github.com/dotmake-build/command-line)
- [DotMake.CommandLine Discussion on dotnet/command-line-api](https://github.com/dotnet/command-line-api/discussions/2310)
- [Cocona GitHub](https://github.com/mayuki/Cocona)
- [ConsoleAppFramework GitHub](https://github.com/Cysharp/ConsoleAppFramework)
- [System.CommandLine Documentation](https://learn.microsoft.com/en-us/dotnet/standard/commandline/)

## User

_Time: 2026-01-20T07:21:54.889Z_

Looking for a way to declaratively define my classes and create a CLI out of them without any imperitive code. In C#/.NET.

Specifically looking for a **well maintained** ***NUGET*** package that I can install as a dep to my project that will achieve the result. Do not recommend custom code. You MUST find it on github or something.

## Assistant

_Time: 2026-01-20T07:24:04.265Z_

- **ConsoleAppFramework** is a suitable NuGet package that enables declarative CLI creation from classes in .NET, using methods as commands and parameters as options/arguments.
- It leverages C# source generators for high performance and AOT compatibility, requiring only a single line in the Main method to run.
- The package is actively maintained with over 2.1k GitHub stars and commits as recent as December 2025.
- Available on GitHub at https://github.com/Cysharp/ConsoleAppFramework and installable via `dotnet add package ConsoleAppFramework`.

### Installation
Add the package to your .NET console project using the .NET CLI:  
`dotnet add package ConsoleAppFramework`  
This integrates it as a dependency, allowing you to build the CLI directly from your defined classes.

### Basic Usage
Define a class inheriting from `ConsoleAppBase` where public methods represent commands. Parameters in methods automatically become CLI options or arguments. For example:  
```csharp
using ConsoleAppFramework;

class MyCliApp : ConsoleAppBase
{
    /// <summary>Greets the user.</summary>
    public void Hello(string name = "World")
    {
        Console.WriteLine($"Hello, {name}!");
    }
}

class Program
{
    static void Main(string[] args) => ConsoleApp.Run<MyCliApp>(args);
}
```  
Run with `dotnet run -- hello --name Alice` to output "Hello, Alice!". Descriptions come from XML comments, and the framework handles parsing, validation, and help generation automatically.

### Advanced Features
For sub-commands, use attributes like `[Command("sub")]` on methods or nest via builder methods. It supports async methods, cancellation tokens, global options, filters, and integration with logging or DI without additional code in most cases. The source generator ensures zero reflection at runtime.

---
ConsoleAppFramework stands out as a zero-dependency, high-performance CLI framework for .NET, powered entirely by C# source generators. This approach ensures zero overhead, zero reflection, zero allocation, and full AOT safety, making it ideal for building efficient command-line tools. By inheriting from `ConsoleAppBase`, developers can define commands as simple methods within a class, with method parameters mapping directly to CLI arguments and options. This declarative style minimizes boilerplate, as the source generator analyzes the code at compile-time to produce optimized parsing and execution logic. For instance, a basic greeting command can be implemented as shown above, where the method signature alone dictates the CLI structure—no explicit attribute decorations are required unless customizing aliases or behaviors.

The framework supports a wide range of features out of the box, including asynchronous operations with `async` methods, built-in cancellation handling via `CancellationToken`, and automatic help generation. Global options can be configured declaratively through the builder, and filters (e.g., for logging or authentication) can be added with minimal setup. Hierarchical commands are handled by attributing methods with `[Command]` for naming or using the `ConsoleAppBuilder` to compose sub-commands explicitly, such as `app.AddSubCommand("group", subApp => subApp.Add("cmd", action))`. This allows nesting without imperative complexity in the core logic. Validation is inherent, with support for custom parsers via interfaces like `ISpanParsable<T>`, ensuring robust input handling.

While ConsoleAppFramework excels in simplicity and performance, other packages offer similar declarative capabilities with varying emphases. For example, DotMake.CommandLine builds on Microsoft's System.CommandLine by adding attribute-based declarations (`[CliCommand]`, `[CliOption]`, `[CliArgument]`) and a source generator for reflection-free operation. A root command class might look like:  
```csharp
[CliCommand(Description = "Root command")]
public class RootCommand
{
    [CliOption(Description = "An option")]
    public string Option { get; set; }

    public void Run() => Console.WriteLine(Option);
}
```  
Followed by `Cli.Run<RootCommand>(args);` in Main. This is highly declarative, with sub-commands defined via nested classes or attribute properties, and it integrates dependency injection seamlessly. However, it requires System.CommandLine as a base, adding a slight dependency overhead compared to ConsoleAppFramework's zero-deps design.

CliFx, another strong contender, emphasizes a class-first approach where each command implements `ICommand` with attributes for parameters and options. Setup involves `new CliApplicationBuilder().AddCommandsFromThisAssembly().Build().RunAsync();`, enabling automatic discovery of command classes in the assembly. This reduces manual registration, making it declarative for multi-command apps. Commands support custom converters, validation, and console interaction, with built-in testing utilities like `FakeConsole`. It's dependency-free and targets .NET Standard 2.0+, but the builder pattern introduces a touch more setup than a single `Run` call.

In contrast, Cocona (archived as of December 2025) and CommandDotNet (last major activity in 2021) are less recommended due to reduced maintenance, though they share similar declarative patterns using methods or lambdas as commands.

| Package | GitHub Stars | Last Commit | Open Issues (Approx.) | Key Strengths | Dependencies | Minimal Main Code Required |
|---------|--------------|-------------|-----------------------|---------------|--------------|----------------------------|
| ConsoleAppFramework | 2.1k | Dec 25, 2025 | Low (active resolutions) | Zero overhead, source generators, AOT-safe, lambda/class support | None | `ConsoleApp.Run<MyApp>(args);` |
| DotMake.CommandLine | 158 | Dec 9, 2025 | Moderate | Attribute-based, integrates with System.CommandLine, DI support | System.CommandLine | `Cli.Run<RootCommand>(args);` |
| CliFx | 1.6k | May 14, 2025 | Low | Auto-discovery, testing tools, custom bindings | None | Builder with `AddCommandsFromThisAssembly().RunAsync();` |
| CommandDotNet | 608 | ~2021 (stable) | Backlog exists | POSIX compliance, piping, extensive features | Minimal | `new AppRunner<Program>().Run(args);` |
| Cocona | 3.5k | June 23, 2024 | N/A (archived) | Minimal API style, DI/logging integration | Minimal | `CoconaApp.Run<Program>(args);` |

These packages prioritize declarative definitions, where the CLI structure emerges from class designs rather than explicit builder chains. ConsoleAppFramework is particularly recommended for its balance of performance, simplicity, and active development, ensuring long-term viability. If your project needs deeper integration with Microsoft's ecosystem, DotMake.CommandLine provides a seamless extension. Always verify the latest NuGet versions for compatibility with your .NET target (e.g., .NET 8+ for most).

**Key Citations:**
- [GitHub - dotmake-build/command-line: Declarative syntax for System.CommandLine via attributes...](https://github.com/dotmake-build/command-line) 
- [GitHub - Tyrrrz/CliFx: Class-first framework for building command-line interfaces](https://github.com/Tyrrrz/CliFx) 
- [GitHub - Cysharp/ConsoleAppFramework: Zero Dependency, Zero Overhead...](https://github.com/Cysharp/ConsoleAppFramework) 
- [GitHub - mayuki/Cocona: Micro-framework for .NET console application...](https://github.com/mayuki/Cocona) 
- [GitHub - bilal-fazlani/commanddotnet: A modern framework for building modern CLI apps](https://github.com/bilal-fazlani/commanddotnet) 
