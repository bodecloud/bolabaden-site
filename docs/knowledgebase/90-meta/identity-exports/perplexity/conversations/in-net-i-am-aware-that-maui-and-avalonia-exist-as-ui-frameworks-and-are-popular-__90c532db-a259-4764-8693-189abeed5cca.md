---
source_url: "https://www.perplexity.ai/search/5a41731e-dce3-48da-8f63-e423b3631f5e"
thread_uuid: "90c532db-a259-4764-8693-189abeed5cca"
slug: "5a41731e-dce3-48da-8f63-e423b3631f5e"
title: "in .net, i am aware that maui and avalonia exist as ui frameworks and are popular for cross-platform development. But since web technologies is taking off, how do I do that and create a ui with e.g. chromium or something? i require responses that are only widely adopted in .net"
extracted_at: "2026-06-29T16:30:54.347Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# in .net, i am aware that maui and avalonia exist as ui frameworks and are popular for cross-platform development. But since web technologies is taking off, how do I do that and create a ui with e.g. chromium or something? i require responses that are only widely adopted in .net

Source: [Perplexity thread](https://www.perplexity.ai/search/5a41731e-dce3-48da-8f63-e423b3631f5e)

## User

in .net, i am aware that maui and avalonia exist as ui frameworks and are popular for cross-platform development. But since web technologies is taking off, how do I do that and create a ui with e.g. chromium or something? i require responses that are only widely adopted in .net

## Assistant

In .NET, there are indeed options to create user interfaces using web technologies, leveraging components like Chromium. Two popular approaches for this are:

## 1. CefSharp (Chromium Embedded Framework for .NET)

CefSharp is a widely adopted solution for embedding a Chromium-based browser into .NET applications. It allows you to create desktop applications with web-based UIs using HTML, CSS, and JavaScript.[7][8]

Key features of CefSharp include:

- Support for WinForms, WPF, and OffScreen (headless) applications
- Full HTML5, CSS3, and JavaScript support
- Ability to execute JavaScript from .NET and expose .NET objects to JavaScript
- High performance and standards compliance

To use CefSharp in a WinForms application, you can follow these steps:

1. Install the CefSharp NuGet package for your project type (e.g., CefSharp.WinForms).

2. Initialize CefSharp in your application:

```csharp
public partial class MainForm : Form
{
    private ChromiumWebBrowser chromeBrowser;

    public MainForm()
    {
        InitializeComponent();
        InitializeChromium();
    }

    public void InitializeChromium()
    {
        CefSettings settings = new CefSettings();
        Cef.Initialize(settings);
        chromeBrowser = new ChromiumWebBrowser("https://example.com");
        this.Controls.Add(chromeBrowser);
        chromeBrowser.Dock = DockStyle.Fill;
    }
}
```

3. Clean up resources when the form closes:

```csharp
protected override void OnFormClosing(FormClosingEventArgs e)
{
    Cef.Shutdown();
    base.OnFormClosing(e);
}
```

## 2. DotNetBrowser

DotNetBrowser is another popular commercial solution for embedding a Chromium-based browser into .NET applications. It offers similar capabilities to CefSharp but with additional features and commercial support.[1][5][6]

Key features of DotNetBrowser include:

- Support for WPF, WinForms, and Avalonia UI
- Cross-platform support (Windows, macOS, Linux)
- DOM manipulation and JavaScript integration
- Built-in developer tools

To use DotNetBrowser in a WPF application:

1. Install the DotNetBrowser NuGet package.

2. Initialize and use DotNetBrowser in your XAML and code-behind:

```xaml
<Window x:Class="YourNamespace.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:wpf="clr-namespace:DotNetBrowser.Wpf;assembly=DotNetBrowser.Wpf">
    <Grid>
        <wpf:BrowserView x:Name="browserView" />
    </Grid>
</Window>
```

```csharp
public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
        InitializeBrowser();
    }

    private void InitializeBrowser()
    {
        browserView.Browser.Navigation.LoadUrl("https://example.com");
    }
}
```

Both CefSharp and DotNetBrowser allow you to create desktop applications with web-based UIs, leveraging the power and flexibility of web technologies while maintaining the benefits of .NET development. These solutions are widely adopted in the .NET ecosystem for creating hybrid desktop applications that combine native and web technologies.[8][1][7]

### Sources

- [Creating an HTML UI for Desktop .NET Applications - InfoQ](https://www.infoq.com/articles/html-desktop-net/)
- [.NET Multi-platform App UI (.NET MAUI) | .NET](https://dotnet.microsoft.com/en-us/apps/maui)
- [Leveraging Existing Web Content to Build Hybrid Apps with .NET ...](https://dev.to/dotnet/leveraging-existing-web-content-to-build-hybrid-apps-with-net-maui-48me)
- [Cefsharp.WPF.NET Core (How It Works For Developers) - IronPDF](https://ironpdf.com/blog/net-help/cefsharp-wpf-net-core/)
- [Documentation | DotNetBrowser - TeamDev](https://teamdev.com/dotnetbrowser/docs/)
- [DotNetBrowser | .NET web browser for WPF, Avalonia UI ... - TeamDev](https://teamdev.com/dotnetbrowser/)
- [How to use CefSharp (chromium embedded framework c#) in a ...](https://ourcodeworld.com/articles/read/173/how-to-use-cefsharp-chromium-embedded-framework-csharp-in-a-winforms-application)
- [CefSharp - Open Source web browser for WinForms and WPF Apps](https://cefsharp.github.io)
