---
source_url: "https://www.perplexity.ai/search/623a3b2c-f48a-4c4e-aa11-e1d9c5f4808e"
thread_uuid: "a69fa359-f1f8-44ab-bed3-5b11cd8d65d8"
slug: "623a3b2c-f48a-4c4e-aa11-e1d9c5f4808e"
title: "Please tell me about jupyter's development, what language is it in and what ui framework does it use?"
extracted_at: "2026-06-29T16:13:01.700Z"
matched_keywords: []
export_suite: "identity"
entry_count: 4
provenance: perplexity-rest-api
---

# Please tell me about jupyter's development, what language is it in and what ui framework does it use?

Source: [Perplexity thread](https://www.perplexity.ai/search/623a3b2c-f48a-4c4e-aa11-e1d9c5f4808e)

## User

Please tell me about jupyter's development, what language is it in and what ui framework does it use?

## Assistant

Jupyter is an open-source project that originated from the IPython project in 2014, aiming to support interactive computing across multiple programming languages, including Python, Julia, and R. The name "Jupyter" is a reference to these three languages (Ju-lia, Py-thon, and R) and is also a homage to Galileo's discovery of Jupiter's moons, which were documented in notebooks.[1][3]

### **Development Language**
Jupyter is primarily written in **Python**, but it supports over 40 programming languages through its kernel system. The core components of Jupyter (such as Jupyter Notebook and JupyterLab) are developed using a combination of Python and JavaScript, with various libraries integrated for different functionalities.[2][1]

### **User Interface Framework**
Jupyter's user interfaces are built using several web technologies:
- **Jupyter Notebook**: The classic interface is web-based and relies on libraries such as **jQuery**, **Bootstrap**, and **MathJax** for rendering mathematical expressions. It uses **Tornado** for the web server and **ZeroMQ** for communication between the notebook interface and the kernels.[1]
- **JupyterLab**: The more modern interface of Jupyter, released in 2018, is built on top of the **Lumino** widget toolkit. Lumino provides a flexible layout system that allows users to arrange notebooks, consoles, terminals, and other components in a modular way. This framework supports a richer, more customizable environment compared to the classic notebook interface.[5][2]

Additionally, there are efforts like **Jupyter UI**, which provides React.js components for integrating Jupyter functionality into custom applications. This allows developers to build data products using React while maintaining compatibility with Jupyter's ecosystem.[5]

In summary:
- **Primary language**: Python
- **UI framework**: Lumino (for JupyterLab), jQuery/Bootstrap (for classic Jupyter Notebook), with some React.js components available for custom integrations.

### Sources

- [Project Jupyter - Wikipedia](https://en.wikipedia.org/wiki/Jupyter_Notebook)
  - Project Jupyter's name is a reference to the three core programming languages supported by Jupyter, which are Julia, Python and R. Its name and logo are an ...
- [Project Jupyter | Home](https://jupyter.org)
  - JupyterLab: A Next-Generation Notebook Interface. JupyterLab is the latest web-based interactive development environment for notebooks, code, and data.
- [History of Jupyter and the Differences between Jupyter Notebook ...](https://python.plainenglish.io/history-of-jupyter-and-the-differences-between-jupyter-notebook-jupyterlab-jupyterhub-and-voil%C3%A0-251d83372b00?gi=0c1d3ae2acef)
- [Project Jupyter | About Us](https://jupyter.org/about)
- [datalayer/jupyter-ui: ⚛️ React.js components ... - GitHub](https://github.com/datalayer/jupyter-ui)

## User

what license does it have and how is it's source code/underlying framework different from e.g. spyder ide

## Assistant

### **License of Jupyter**

Jupyter is licensed under the **3-Clause BSD License** (also known as the BSD-3-Clause license). This is a permissive open-source license that allows for redistribution and use in both source and binary forms, with or without modification, as long as certain conditions are met. These conditions include retaining the copyright notice, list of conditions, and disclaimers in redistributions. The license also disallows using the names of contributors to endorse derived products without permission.[2][5]

### **Comparison with Spyder IDE**

Jupyter and Spyder are both popular tools for Python development, but they differ significantly in terms of their underlying frameworks, design philosophy, and use cases.

#### **Underlying Framework**

- **Jupyter**: 
  - Jupyter is built on a combination of **Python** (for backend functionalities) and **JavaScript** (for frontend interfaces). It uses a web-based interface where code is executed in **cells**, allowing users to mix code, text (Markdown), and visualizations in one document. Jupyter's architecture revolves around a client-server model where the frontend (the notebook interface) communicates with various programming language kernels (e.g., IPython for Python execution) via **ZeroMQ** messaging.[1][3]
  - The primary UI framework for JupyterLab (the modern interface) is **Lumino**, which provides modular layout capabilities. The classic Jupyter Notebook interface uses libraries like **jQuery** and **Bootstrap**.[5]

- **Spyder**:
  - Spyder is a more traditional Integrated Development Environment (IDE), written primarily in **Python** and built using the **Qt framework** (via PyQt or PySide). This gives it a desktop application feel, similar to other IDEs like Visual Studio or PyCharm. Spyder offers features such as a variable explorer, integrated debugging tools, and code completion.[3][1]
  - Unlike Jupyter's browser-based UI, Spyder runs as a standalone desktop application with a script-based workflow. It integrates tightly with scientific libraries like NumPy and pandas, making it an excellent choice for Python developers working on larger projects.[4]

#### **Key Differences**
| Feature               | Jupyter                                  | Spyder                                |
|-----------------------|------------------------------------------|---------------------------------------|
| **Execution Model**    | Cell-based execution (code cells)        | Script-based execution                |
| **UI Framework**       | Web-based (Lumino/JQuery/Bootstrap)      | Desktop-based (Qt framework)          |
| **Primary Use Case**   | Data analysis, visualization, notebooks  | General Python development            |
| **Debugging**          | Limited debugging capabilities           | Full debugging support (breakpoints, step-through execution)[1][4] |
| **Language Support**   | Multi-language support via kernels       | Primarily focused on Python           |
| **License**            | BSD-3-Clause License                     | MIT License                           |

In summary:
- Jupyter is more suited for interactive data analysis and scientific computing across multiple languages.
- Spyder provides a more traditional IDE experience with rich debugging tools, making it better suited for structured Python development projects.

### Sources

- [What is the difference between Spyder and Jupyter? - Stack Overflow](https://stackoverflow.com/questions/53368253/what-is-the-difference-between-spyder-and-jupyter/64141469)
  - Jupyter is a very popular application used for data analysis. It's an IPython notebook ("interactive python"). You can run each block of code separately.
- [Licensing terms for Project Jupyter code](https://jupyter.org/governance/projectlicense.html)
- [Jupyter vs Spyder | What are the differences? - StackShare](https://stackshare.io/stackups/jupyter-vs-spyder)
- [Jupyter vs Spyder. Which One Is Better for Python Programming?](https://scrapingant.com/blog/jupyter-vs-spyder)
- [Project Jupyter](https://jupyter.org/about)

## User

hmm i was looking into specifically spyder integration into my project, because of mit license... what exactly would be different with 3-clause bsd?

## Assistant

The **MIT License** and the **3-Clause BSD License** are both permissive open-source licenses, but they have some key differences that could impact how you integrate them into your project.

### **MIT License**
The MIT License is extremely permissive and simple. It allows you to:
- Use, modify, distribute, and sublicense the software freely.
- Include the software in proprietary (closed-source) projects without needing to disclose your own source code.
- The only requirement is that you include the original copyright notice and license text in any substantial portions of the software.

In short, the MIT License gives you almost complete freedom to do whatever you want with the software, as long as you give credit to the original authors. There are no restrictions on using the software for commercial purposes or integrating it into closed-source projects. This makes it very attractive for projects where you want minimal legal overhead.[1][2]

### **3-Clause BSD License**
The 3-Clause BSD License is also permissive but adds a few more conditions compared to the MIT License:
- Like MIT, it allows for free use, modification, distribution, and sublicensing.
- It also requires that you include the original copyright notice and license text in any copies of the software.
- **Additional clause**: The 3-Clause BSD License includes a specific restriction that prohibits using the names of the original authors or contributors to endorse or promote derived products without written permission.

This extra clause can be important if you're concerned about attribution or endorsements. For example, if you're building a commercial product based on software licensed under BSD-3-Clause, you cannot use the name of the original project or its contributors in your marketing materials without explicit permission.[2][3]

### **Key Differences**
| Feature                          | MIT License                                | 3-Clause BSD License                     |
|-----------------------------------|--------------------------------------------|------------------------------------------|
| **Use in closed-source projects** | Allowed                                    | Allowed                                  |
| **Attribution requirement**       | Must include copyright notice              | Must include copyright notice            |
| **Endorsement restriction**       | No restriction                             | Cannot use original authors' names for promotion without permission[2] |
| **Patent rights**                 | Not explicitly addressed                   | Not explicitly addressed                 |

### **Implications for Your Project**
If you're considering integrating Spyder (which uses the MIT License) into your project because of its permissiveness, you'll find that both licenses allow similar freedoms when it comes to commercial use and closed-source integration. However, if you're also considering using Jupyter (which uses the 3-Clause BSD License), note that while both licenses are permissive, Jupyter's license includes that extra restriction about endorsements.

For most practical purposes, especially if you're not planning on using the original project's name in marketing or endorsements, either license will work similarly for your needs. However, if branding or promotional restrictions are a concern, you'll need to be mindful of the additional clause in the 3-Clause BSD License.

In summary:
- Both licenses allow commercial use and closed-source integration.
- The main difference is that the 3-Clause BSD License restricts using the original authors' names for promotion without permission.[4][2]

### Sources

- [MIT license question (commercial use + closed source?) - Reddit](https://www.reddit.com/r/learnprogramming/comments/m6du7u/mit_license_question_commercial_use_closed_source/)
  - The MIT license only applies to the 3rd party libraries you use. Basically they're telling you that you have to cite your sources. It does not ...
- [History of Open-Source Licenses: What License to Choose?](https://memgraph.com/blog/history-of-open-source-licenses-what-license-to-choose)
- [BSD vs MIT License - SOOS](https://soos.io/bsd-vs-mit-license)
- [A developer's guide to the most common open-source licenses (MIT ...](https://ghinda.com/blog/opensource/2020/open-source-licenses-apache-mit-bsd.html)

## User

i'm confused... wouldn't a normal person desire the free advertisement...? Why is there a lie saying they DO NOT want to be named?

In fact most src require you to explain where it came from, even mit. Like I can't say I created spyder ide just by forking it.

## Assistant

The confusion you're experiencing stems from a misunderstanding of what the **3-Clause BSD License** and **MIT License** aim to achieve with their attribution requirements.

### **Attribution in MIT and BSD Licenses**

1. **MIT License**:
   - The MIT License is permissive, allowing users to do almost anything with the software (use, modify, distribute, etc.), as long as they **retain the original copyright notice and license text** in any copies or substantial portions of the software.[2][5]
   - This means that while you can use the software freely, you **must not remove the original author’s copyright notice**. This is not considered "advertising" or "endorsement"; it's simply a legal requirement to acknowledge the original authorship.[3]

2. **3-Clause BSD License**:
   - Like the MIT License, the 3-Clause BSD License allows free use, modification, and distribution of the software. However, it adds an additional restriction: **you cannot use the name of the original project or its contributors to promote derivative works without permission**.[8]
   - This clause is specifically designed to prevent companies or individuals from implying that the original authors endorse their derivative products. The goal is not to avoid "free advertising," but rather to prevent misleading endorsements.[8]

### **Why Restrict Endorsement?**
The restriction on using the project's name in promotional materials (in BSD-3-Clause) is not about avoiding free publicity. Instead, it protects the reputation of the original authors and contributors. Here's why:
- **Avoiding Misrepresentation**: If someone forks an open-source project and builds a commercial product around it, they might want to claim that their product is endorsed by or affiliated with the original authors. This could mislead users into thinking that the original authors are responsible for or support the new product.
- **Maintaining Neutrality**: Open-source contributors often want their work to remain neutral and not be associated with specific commercial interests unless they explicitly agree to it.

### **Clarification on Attribution vs. Endorsement**
- **Attribution** (required by both MIT and BSD licenses) means you must give credit to the original authors by keeping their copyright notice intact in your project.
- **Endorsement** (restricted by BSD-3-Clause) means you cannot use the names of those authors or contributors in marketing or promotional materials without permission.

### **Why Wouldn't They Want Free Advertising?**
While it may seem counterintuitive that someone wouldn't want "free advertising," it's important to remember that:
- The concern isn't about being mentioned; it's about being misrepresented.
- The original project maintainers may not want their names tied to derivative works they haven't reviewed or approved, especially if those works diverge significantly from their vision or introduce bugs/issues.

In conclusion:
- Both licenses require you to retain attribution (i.e., crediting the original authors).
- The 3-Clause BSD License adds an extra layer of protection against using the original authors' names for promotion without permission, which helps avoid misrepresentation rather than avoiding publicity.

### Sources

- [License confusion: "No attribution required" vs. MIT #2339 - GitHub](https://github.com/shadcn-ui/ui/discussions/2339)
- [MIT License - Using Creative Commons and Open Software Licenses](https://pitt.libguides.com/openlicensing/MIT)
- [What is MIT License? - Memgraph](https://memgraph.com/blog/what-is-mit-license)
- [A developer’s guide to the most common open-source licenses (MIT, Apache 2.0, BSD)](https://ghinda.com/blog/opensource/2020/open-source-licenses-apache-mit-bsd.html)
- [MIT License - Wikipedia](https://en.wikipedia.org/wiki/MIT_License)
- [I contributet to an MIT-licensed project. Can I re-use that code in my ...](https://www.reddit.com/r/opensource/comments/u0g456/i_contributet_to_an_mitlicensed_project_can_i/)
- [History of Open-Source Licenses: What License to Choose?](https://memgraph.com/blog/history-of-open-source-licenses-what-license-to-choose)
- [BSD vs MIT License](https://soos.io/bsd-vs-mit-license)
