---
source_url: "https://www.perplexity.ai/search/53940c20-1b8f-4191-a326-b0446b33b4ac"
thread_uuid: "61d3660d-3067-459f-b018-40cba8296d7f"
slug: "53940c20-1b8f-4191-a326-b0446b33b4ac"
title: "install perl windows locally to a specific project, is there virtual environment support? easiest way, be concise"
extracted_at: "2026-06-29T16:09:01.599Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# install perl windows locally to a specific project, is there virtual environment support? easiest way, be concise

Source: [Perplexity thread](https://www.perplexity.ai/search/53940c20-1b8f-4191-a326-b0446b33b4ac)

## User

install perl windows locally to a specific project, is there virtual environment support? easiest way, be concise

## Assistant

To install Perl locally to a specific project on Windows and support virtual environments, you have a couple of options. Here’s a concise guide:

## **Using ActiveState's State Tool**

ActiveState provides a convenient way to create virtual environments for Perl projects using their State Tool. This method allows you to manage Perl installations and dependencies per project.

1. **Install the State Tool**: Download and install the State Tool from ActiveState's website. This tool helps manage your Perl environment and dependencies.
   
2. **Create a Virtual Environment**:
   - Use the command `state activate --default <your-project>` to create a virtual environment for your project. This will set up a self-contained environment in your user directory, avoiding issues with write permissions in system directories.[1][3][5]
   - The State Tool automatically handles dependencies and configurations for your project, making it easy to switch between different environments.[4][5]

3. **Manage Dependencies**: You can add or remove Perl modules using the State Tool, which will ensure that all dependencies are resolved and installed correctly.[5]

## **Using Strawberry Perl**

Strawberry Perl is another popular option for installing Perl on Windows, but it does not natively support virtual environments like Python's `venv`. However, you can manually set up isolated environments:

1. **Install Strawberry Perl**: Download and install Strawberry Perl from its official website. It includes the Perl interpreter and essential modules.[2]

2. **Manual Setup for Project Isolation**:
   - Create a dedicated directory for your project.
   - Use `cpan` or `cpanm` (App::cpanminus) to install additional modules locally within this directory. You can configure the `PERL5LIB` environment variable to include this directory so that Perl uses these local modules instead of system-wide ones.[6][7]

3. **Use Anaconda (Optional)**: Alternatively, you can use Anaconda to create an isolated environment with its own Perl installation, which can be activated as needed.[7]

Both methods allow you to manage Perl installations specific to projects on Windows, with ActiveState’s State Tool providing more straightforward virtual environment support akin to Python's virtual environments.

### Sources

- [None of your installers work on Windows 10 - ActiveState Community](https://community.activestate.com/t/none-of-your-installers-work-on-windows-10/11203)
  - C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise>state activate --default ActiveState-Projects/ActiveState-Perl-5.36.0 █ Creating a Virtual Environment for your Project’s Packages █ Something Went Wrong x Could not figure out what path to use █ Need More Help? • Run → state activate --help for general help • Ask For Help → State Tool - ActiveState Community C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise>powershell -Command “& $([scriptblock]::Create((New-Obje...
- [How to Install Perl on Windows | Ultahost Knowledge Base](https://ultahost.com/knowledge-base/install-perl-on-windows/)
  - Learn to install Perl on Windows with our step-by-step guide. Easily set up Perl on your Windows machine for scripting and web development.
- [Error installing Perl 5.36 on Windows 10 - ActiveState Community](https://community.activestate.com/t/error-installing-perl-5-36-on-windows-10/9377)
  - When I copy and paste the given command to install the state tool and Perl, after the message “Creating a Virtual Environment for your Project’s Packages” I get the following error message: Something went Wrong x Could not figure out what path to use x Could not fetch details for project:
- [How to install and manage Perl 5.32 with the State Tool - YouTube](https://www.youtube.com/watch?v=Xxei_iUMwLw)
  - Get a step by step demo by the ActiveState Product Team and learn how you can use ActiveState's new Perl ecosystem. Use our command-line tool, the State Tool, to install and manage your new Perl. ActiveState introduced a new version of our Perl ecosystem with the release of Perl 5.32, which provides a new way to install, work with and even consume Perl from ActiveState. You can learn more and download your own version of ActiveState’s new Perl ecosystem for free from our Perl 5.32 page:...
- [The ActiveState Platform and Perl 5.32 - House Absolute(ly Pointless)](https://blog.urth.org/2020/12/10/the-activestate-platform-and-perl-5-32/)
  - Note: Technically, this post qualifies as paid promotion, because I work for ActiveState. But I volunteered to write about our new Platform and put it on my personal blog because I think what we’re doing is really cool and might be of interest to the Perl community at large. TLDR We have an entirely new system that supports Windows and Linux (macOS coming soon), providing you binary builds of the Perl core, Perl distros, and supporting C/C++ libraries1.
- [Installing Perl on Windows (32 and 64 bit)](https://learn.perl.org/installing/windows.html)
  - How to install Perl on Windows
- [Installing Perl modules - HCC-DOCS](https://hcc.unl.edu/docs/applications/user_software/installing_perl_modules/)

## User

obviously strawberry perl. How to virtualenv it. What's the standard solution

## Assistant

To set up a virtual environment for Perl using Strawberry Perl on Windows, you can use the `local::lib` module combined with `cpanm` to create an isolated environment within your project directory. Here's a step-by-step guide:

## **Setting Up a Perl Virtual Environment**

1. **Install Strawberry Perl**: Ensure that Strawberry Perl is installed on your system. It includes `cpan` and `cpanm` (App::cpanminus), which are essential for managing Perl modules.

2. **Create Project Directory**: Navigate to your project directory or create a new one where you want the virtual environment.

3. **Install `local::lib`**:
   - Use `cpan` or `cpanm` to install `local::lib`, which allows you to manage Perl module installations locally.
   ```bash
   cpanm --local-lib=local local::lib
   ```

4. **Set Environment Variables**:
   - Configure your shell to use the local library paths by setting the `PERL5LIB` and `PATH` environment variables. This ensures that Perl uses the modules installed in your local directory.
   ```bash
   export PERL5LIB=local/lib/perl5
   export PATH=local/bin:$PATH
   ```

5. **Activate the Virtual Environment**:
   - Create a script named `activate` in your project directory to easily set these environment variables whenever you start working on your project.
   ```bash
   echo 'export PERL5LIB=local/lib/perl5' > activate
   echo 'export PATH=local/bin:$PATH' >> activate
   ```

6. **Install Dependencies Locally**:
   - Use `cpanm` with the `-l` flag to install any Perl modules locally within your project directory.
   ```bash
   cpanm -l local Module::Name
   ```

7. **Using the Environment**:
   - Source the `activate` script whenever you start working on your project to ensure the correct environment is set up.
   ```bash
   source activate
   ```

This setup allows you to manage dependencies specific to your project without affecting system-wide Perl installations, similar to Python's virtual environments.[1][3][6]

### Sources

- [App::Virtualenv - Perl virtual environment - metacpan.org](https://metacpan.org/pod/App::Virtualenv)
  - Perl virtual environment
- [Using virtual env - MSU HPCC User Documentation](https://docs.icer.msu.edu/Using_Python_in_HPCC_with_virtualenv/)
- [A gentle introduction to Perl-dependency management](https://christopher.rasch-olsen.no/perl-dependency-management)
- [Perl Package Management Guide for Enterprise Developers](https://www.activestate.com/resources/white-papers/perl-package-management-guide-for-developers/)
  - Insightful white paper that compares various Perl package management solutions and presents a modern approach for enterprise Perl developers.
- [Scratchpad - Perl virtual environment - Google Sites](https://sites.google.com/a/palatin.fr/pierre/entries/perl-virtual-env)
  - While Python as the extremely useful virtualenv tool, I haven't found anything similar for Perl. What I want is quite simple: being able to test random perl tools. They usually depend on a various set of libraries, some of them either too old on my system or not even present. Most of the time, I
- [Virtualenv in Perl 5 - install 2 different versions of the same module](https://perlmaven.com/virtualenv-in-perl)
