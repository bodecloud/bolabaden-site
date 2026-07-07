---
source_url: "https://chatgpt.com/c/681074c1-5f30-8006-b164-a64a62686852"
conversation_id: "681074c1-5f30-8006-b164-a64a62686852"
title: "GitHub Actions Unused Potential"
extracted_at: "2026-06-29T11:57:53.867Z"
message_count: 5
provenance: auth-ui
---

# GitHub Actions Unused Potential

Source: [ChatGPT conversation](https://chatgpt.com/c/681074c1-5f30-8006-b164-a64a62686852)

## Assistant

Ah, great question — this gets to one of the key differences between Docker Swarm, Kubernetes, and the various ways they handle stateful services (like databases or apps with persistent storage).

🚨 The Stateful Service Dilemma: Docker Swarm vs Kubernetes
Docker Swarm

Docker Swarm doesn’t really have an elegant way to handle persistent state and failover across nodes for stateful services.

For stateful services (like databases or caching layers), you typically run into issues:

Volume Mounting: Volumes are local to the node, so if your container moves (due to failure or scaling), it’s disconnected from its state.

Swarm doesn't have a good shared storage solution out of the box for stateful containers. You can work around it with external storage (e.g., NFS, GlusterFS, etc.), but it’s fragile and complicated for failover.

Failover usually results in a big mess: Unless you're doing manual volume syncing, the container can’t access its data on the new node.

Kubernetes

Kubernetes, on the other hand, handles stateful workloads much better out of the box. However, even then, it’s not magic — it requires more infrastructure and tooling.

Here’s how Kubernetes improves on Swarm:

StatefulSets: Kubernetes has a StatefulSet resource designed specifically for stateful services (like databases). It maintains a stable identity for each pod, and it can create persistent volumes for each replica.

Persistent Volumes (PV) and Persistent Volume Claims (PVC): Kubernetes allows you to define shared storage or network-attached storage (NAS) for pods, and automatically manage those volumes. This ensures that data persists even when containers fail or move across nodes.

Storage Providers: Kubernetes supports dynamic provisioning of storage from multiple providers (e.g., NFS, GlusterFS, AWS EBS, GCE Persistent Disk, etc.), allowing your stateful containers to share storage across nodes.

Pod Anti-Affinity: You can configure Kubernetes to ensure that a given pod only runs on specific nodes with a corresponding volume, ensuring that your data lives on the right nodes.

Automatic Failover: With StatefulSets, Kubernetes automatically handles failover of stateful containers (restarts on another node) and syncs the persistent volume (if configured correctly).

🧐 Kubernetes for Failover: The File Sync Challenge

To unify and sync folders across nodes (for example, when failovers happen), you need:

A network-attached storage solution like NFS, GlusterFS, or cloud volumes (AWS EBS, Azure Disk, etc.).

Kubernetes will automatically mount these volumes onto the pods, and when the pod moves to another node due to failure, it will retain access to its data (because the storage is shared across nodes).

However, the challenge of true file sync comes when:

Your service is dealing with very high-volume writes and requires very high consistency between nodes.

Kubernetes itself doesn’t directly handle file syncing between nodes in a local sense — that’s left up to the persistent storage system.

If you want to manage this at a file system level:

Use a shared filesystem like NFS or Ceph, which Kubernetes can use for persistent volumes.

For example, you can mount an NFS share as a Persistent Volume in Kubernetes and create a StatefulSet that ensures each pod has the same volume, even across failovers.

📢 Is Kubernetes Stable for Stateful Services?

In a word: Yes, but it’s not a silver bullet.

Kubernetes is much more stable and sophisticated when it comes to stateful services compared to Docker Swarm.

However, reliable failover with stateful services is still complex and requires a solid understanding of how persistent storage works in a cloud-native environment.

🛠️ How to Make Failover Work in Kubernetes

Set up a StatefulSet with Persistent Volumes (PV) that are dynamically provisioned by cloud providers or self-hosted storage solutions.

Configure Storage Classes to define how storage is provisioned (e.g., fast SSD storage or NFS for shared access).

Leverage Pod Disruption Budgets (PDB) to ensure that only a certain number of replicas are affected by any failover.

Use StatefulSet’s headless service to ensure the DNS names stay consistent, even if the pod moves.

Optionally, use volume replication (in the case of NFS/GlusterFS) to sync storage across nodes.

🤔 So, Is Kubernetes the Right Tool for You?

If you're looking for true failover with stateful services, Kubernetes is a much more stable choice than Docker Swarm. But be prepared for a steeper learning curve and an understanding of how Kubernetes handles storage, network configurations, and failover.

If you don’t need the overhead of Kubernetes but want something relatively simple with less setup, you can still use Nomad + Consul (which is a lot easier than Kubernetes and still offers stateful failover). Or even just work with Docker Compose + shared NFS.

✨ Final Thought:

The "syncing state across nodes" problem is hard, no matter what platform you're on. But with Kubernetes, you’re at least on a solid foundation that’s built for this scenario.

If you want to test it out in Kubernetes, I can help you spin up a simple StatefulSet example for stateful services with failover. Let me know what your app's storage setup looks like, and I’ll show you how to make it work.

## User

is there ever a point where kubernetes will be like the back of my hand? JW if people ever get to that point even after hypothetically 20 years. Or if it's always just going to be complicated no matter what you're trying to do.

## Assistant

Ah, the classic Kubernetes paradox:

"Will Kubernetes ever feel like the back of my hand? Or is it always going to be a complicated maze of config files and YAML hell?"

The Kubernetes Journey: Always Evolving

The short answer is: yes, eventually — but with caveats.

Here’s the reality:

Kubernetes does have a steep learning curve. It requires a deep understanding of infrastructure, networking, storage, and a ton of configuration nuances.

Even after 20 years, Kubernetes will likely still be complex in some way, because it's designed to solve such a broad set of problems (highly distributed, multi-cloud, scaling, rolling updates, fault tolerance, etc.).

However, there are some interesting trends and insights that show how things might evolve:

🌱 Kubernetes Evolution: What’s Getting Better

Abstractions Are Improving: Tools like Helm, Operators, and Kustomize are providing higher-level abstractions that hide a lot of the manual work.

You don’t have to think as much about each low-level component (e.g., networking, pod placement) as you would have in the past.

Managed Kubernetes Services: Cloud providers (AWS EKS, Azure AKS, Google GKE) have done a lot of the heavy lifting for you in terms of setting up control planes, networking, security, and cluster management.

This means your focus can shift more to application management instead of cluster management.

Tools for Usability: Projects like K9s, Lens, and Rancher have created user-friendly interfaces that make managing Kubernetes less like wrestling an angry octopus and more like just… managing your services.

Operator Pattern: Kubernetes’ operator pattern is making custom controllers simpler, so developers can automate complex application lifecycle management — less YAML, more automated logic.

🧠 So Will Kubernetes Ever Feel Like "The Back of My Hand?"
In the Long Run:

It’s very likely that you'll get to a place where Kubernetes feels familiar — but the journey to get there can take a while:

The "Core" Concepts Will Get Easier: Once you’re past the basics (pods, services, deployments, namespaces), a lot of the complexity becomes "muscle memory" — things like scaling, creating deployments, or rolling updates are pretty straightforward.

The Ecosystem Will Mature: Kubernetes itself is very feature-complete, but the ecosystem surrounding it (CI/CD, monitoring, observability, etc.) is growing rapidly. As this matures, the operational overhead will likely decrease, making it easier to operate.

You’ll Learn to "Ignore" Stuff: Many people eventually learn to ignore the parts of Kubernetes they don’t need, focusing solely on what matters to them. You may never need to understand every single feature (e.g., networking layers, custom schedulers), but you'll get comfortable with the features that apply to your use cases.

The Tools Will Catch Up: There will probably be more "serverless"-like tools that abstract out Kubernetes’ complexity, so you’re not writing YAML or dealing with containers as much. Instead, you’ll interact with simple commands, and Kubernetes will work its magic behind the scenes.

⏳ Will It Always Be Complex?

For the next 10–20 years? Yes, Kubernetes will likely always have some complexity, but not in the same way it feels now. Here’s why:

The Domain Is Complex: Kubernetes tackles massive-scale challenges — multi-cloud, service discovery, fault tolerance, container orchestration, etc. The sheer scope means it will always have a certain level of complexity.

Evolving Use Cases: Kubernetes is still evolving and adapting to new use cases like edge computing, serverless, and AI/ML workloads. As this happens, complexity may shift to specialized use cases — but the general tools will likely become more streamlined.

Technology Gets More Complex: It’s not just Kubernetes — many technologies will get more complicated as they expand into different verticals (e.g., multi-cloud, hybrid cloud, networking across data centers). But as a whole, complexity will likely shift into more manageable, specialized pieces.

👩‍💻 What Happens in 20 Years?

Automated Infrastructure: It’s entirely possible that we’ll see more automated infrastructure in the future (maybe even via AI). You'll simply describe your app’s desired state (via high-level configuration), and the system will orchestrate everything for you.

Kubernetes’ Role Might Change: Kubernetes may not be as prominent in 20 years — or it could evolve into something far simpler than it is today, with abstraction layers that let you focus on just the application and business logic.

"Self-Healing" Infrastructure: AI-driven, self-healing systems may take over much of what Kubernetes does today. If infrastructure can self-optimize and deploy itself with minimal human intervention, Kubernetes may become just one part of a larger system.

In Summary:

Yes, Kubernetes can feel like the back of your hand eventually, but you’ll never stop learning. The tool will get easier to manage, and with better abstractions and more manageable complexity over time, you’ll likely hit a point where it’s smooth sailing.

But that might still take time — it’s like learning a new language: it’s hard at first, but eventually, it becomes part of your flow. And even after 20 years, there will be new paradigms that change the way you work with it.

Does this sound like the journey you're willing to take? Or would you rather opt for a simpler solution like Nomad or something else?

## User

so why it look good on resumes so much? if the infrastructure is done then why is it so high demand right now? what types of jobs are these recruiters targetting? my mom thinks i should be optimistic and more like i should be open to the fact that maybe recruiters will ask questions like 'what can you do for me?' allowing me to divulge some of my creativity in how i can improve whatever service they provide and take them to the next level with some good ideas and be able to high key *create* **fun and interesting** things to solve interesting and fun problems. While I'm just expecting the entry-level 'yeah we need some dudes to stay up all night maintaining our existing spaghetti code at the drop of a hat and that's why our last 7 guys left the position'
Show more

## Assistant

Ah, the resume paradox strikes again — especially in tech. You're asking a really insightful question, and I think you’re touching on something that a lot of people don't realize about the whole Kubernetes hype machine. Let’s unpack it:

🚀 Why Kubernetes Looks Good on Resumes

It’s the "New Hotness": Kubernetes represents modern infrastructure, and in the current job market, companies are aggressively moving to cloud-native architectures. It's viewed as the foundation of next-gen DevOps, cloud-native apps, and microservices.

Recruiters know this: They’ve heard all the buzzwords like containerization, scalability, and microservices, and Kubernetes is the tool that embodies all that. So, they associate it with technical excellence.

When a recruiter sees “Kubernetes experience” on a resume, they think cutting-edge technology and big, scalable systems, which looks good on a company’s brand, even if it’s just the infrastructure behind the scenes.

Kubernetes is Now “Standardized”: The job market values consistency. Kubernetes has effectively become a standard in container orchestration. If you're a hiring manager at a large tech company, you want your engineers to be ready to scale your systems in a cloud-native way without reinventing the wheel.

If you have Kubernetes on your resume, it means you understand how to operate large-scale, distributed systems. And that's valuable across many industries.

A Need for Unified Skillsets: Even if the infrastructure is handled via managed Kubernetes services, companies still need engineers who can:

Deploy and manage apps in Kubernetes

Optimize resource usage (CPU/memory management)

Create CI/CD pipelines to run on Kubernetes clusters

Automate infrastructure with tools like Helm, Terraform, or even Helm Operators

Troubleshoot problems across multiple containers in a large-scale system

Recruiters and hiring managers want someone who can get in and start working quickly. Even if the infrastructure is “done,” there’s still maintenance, optimization, and enhancement to do.

💼 What Types of Jobs Are These Recruiters Targeting?

The demand for Kubernetes is tied to companies who are either:

Already scaling rapidly and want to improve their infrastructure.

These could be cloud-native startups, tech companies, or even enterprise companies adopting modern architectures.

Transitioning to microservices: Moving away from monolithic apps means dealing with containers, orchestration, service discovery, etc., and Kubernetes is the best tool for this job.

High-growth companies: Companies scaling rapidly need infrastructure that's robust, scalable, and maintainable — hence why Kubernetes is key.

They need engineers who understand distributed systems, container orchestration, and cloud infrastructure to handle high traffic, automatic failover, service health, etc.

Companies with “legacy” infrastructure: Some companies still operate in the pre-container world (or with poor containerization), and they need Kubernetes engineers to help modernize or migrate existing apps to cloud-native, containerized services.

In essence, Kubernetes is not just a trend; it’s a foundation for operating complex and scalable applications in a modern world. Recruiters target engineers who can handle large-scale deployments, ensure uptime, automate operations, and scale efficiently. So even though Kubernetes itself may be abstracted away in many managed services, the need for engineers who understand how it works under the hood remains high.

💡 Your Mom's Advice: "Be Optimistic and Creative"

Your mom is onto something. 🤔

She’s got a point about being able to bring ideas to the table. Here's why that's a winning approach:

Tech jobs are not just about maintenance. In fact, the best positions at companies — the ones where people stay long-term — are where you can innovate, optimize, and create something new.

Even at large companies with “spaghetti code,” there’s room for innovation and improvement. If you can show you can take things to the next level, you won’t be stuck in maintenance mode forever.

Creativity and Problem Solving are highly valued skills: Companies love candidates who aren’t just “doing the job,” but thinking about how things can be better, more efficient, and more scalable. This is where you can stand out.

If you can suggest new ways of solving problems (e.g., by improving deployment pipelines, optimizing resource usage, or proposing new features that use existing infrastructure in new ways), you’ll show you’re thinking beyond just the current scope.

Don’t be afraid to pitch ideas: Even if the company is “just maintaining” legacy systems, if they’re hiring you to improve and expand their infrastructure, there’s an opportunity for you to inject your creativity into the process.

Ask the right questions in an interview — things like:

“How are you scaling your current infrastructure?”

“What challenges are you currently facing with your containerized apps?”

“How are you automating operations?”

These questions show that you're thinking beyond just maintaining their existing infrastructure; you're thinking about how to improve it, automate it, and scale it better.

🧨 The Optimism and Reality Check:

You’re right to not sugarcoat things, though. Many companies are still heavily reliant on legacy systems and could be looking for someone to manage existing infrastructure. And while that’s not always exciting, you can make a difference by bringing fresh ideas and better practices to the table.

Here’s how:

Acknowledge the reality: Sure, a lot of these roles might start with maintenance, but your attitude can transform that job into something that fuels your creativity and drive.

Leverage your creativity to improve things: Even if you’re maintaining a legacy system, you can suggest improvements like automation, smarter monitoring, more efficient workflows, or improving the overall developer experience.

Take ownership of projects: Instead of waiting for someone to hand you a task, propose new initiatives that you believe will improve the team’s workflows, the system’s performance, or the company’s scalability.

🎯 In the End:

Your skepticism is valid, but don’t let it hold you back. Whether it’s Kubernetes, legacy systems, or any technology stack, the way to stay motivated and engaged is to frame the challenges as opportunities to innovate.

What do you think? Would you feel comfortable pitching your ideas and trying to improve the system, even in a “maintenance” role?
