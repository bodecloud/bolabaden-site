---
source_url: "https://chatgpt.com/c/681bc8f7-f92c-8006-8fa4-ef4df9b44dea"
conversation_id: "681bc8f7-f92c-8006-8fa4-ef4df9b44dea"
title: "Red Hat Evolution Explained"
extracted_at: "2026-06-29T12:06:25.458Z"
message_count: 5
provenance: auth-ui
---

# Red Hat Evolution Explained

Source: [ChatGPT conversation](https://chatgpt.com/c/681bc8f7-f92c-8006-8fa4-ef4df9b44dea)

## Assistant

Yes—many people are still mad at Red Hat, especially in sysadmin, DevOps, and open-source circles. The CentOS situation in particular left a lasting scar. It wasn’t just a business decision—it broke trust with a massive user base that had come to rely on CentOS as the free, stable backbone of servers and production workloads.

Here’s how it shook out:

💥 The CentOS Fallout (2020–2021)

Red Hat announced CentOS Linux would be discontinued in favor of CentOS Stream, which is a preview of RHEL, not a clone.

This left users—who built infrastructure assuming a 10-year support cycle—scrambling.

It was widely seen as a bait-and-switch:

“We built on your platform for free, promoted it, and now you’re pulling the rug out from under us.”

Result:

Two community forks emerged: Rocky Linux (led by a CentOS co-founder) and AlmaLinux (from CloudLinux).

Many sysadmins swore off Red Hat for good.

The phrase “Red Hat screwed us” is still casually dropped in forums like r/sysadmin
 or r/linuxadmin
.

🏢 But Are There Bigger “Villains” Than Red Hat?

If you’re asking “Who’s selling out harder?” — yes, there are bigger offenders, depending on what grinds your gears:

🔵 Microsoft

Hugely influential in open source now, via GitHub and VSCode.

But many are skeptical of GitHub Copilot, licensing issues, and telemetry creep.

Buying GitHub and then monetizing community code felt exploitative to some.

🔴 Oracle

Infamously sued Google over Java.

Known for weaponizing open-source licensing (OpenJDK, MySQL, etc.).

Treats customers like they're renting oxygen.

🟡 Elastic / MongoDB / Redis Labs

Originally open-source, then relicensed under SSPL or similar to limit cloud providers.

Community felt cut out as projects were repurposed for commercial gain.

🧠 OpenAI

Started as a nonprofit, now largely closed-source.

Many devs feel burned after betting on their early mission and seeing the pivot toward enterprise + Microsoft integration.

🧭 TL;DR — So Who Deserves the Hate?
Company	Why People Are Mad	Are They Still Valuable?
Red Hat	CentOS betrayal, RHEL code lock-down, IBM influence	Yes, if you need stable Linux
Microsoft	Telemetry, GitHub Copilot, embrace/extend strategy	Yes, if you use Azure/VSCode
Oracle	Lawsuits, license abuse, customer hostility	Rarely worth it
Elastic/Mongo	Closed licensing after getting traction with open source	Depends on use case
OpenAI	Closed-source shift, Microsoft lock-in	Still top-tier LLM access

If you’re looking for ethical tech projects to support—or just want to know who’s not trying to lock you into a license—you can definitely steer clear of the worst offenders.

Want a short list of "open-source good guys" who haven’t sold out yet?

## User

💥 The CentOS Fallout (2020–2021)
Red Hat announced CentOS Linux would be discontinued in favor of CentOS Stream, which is a preview of RHEL, not a clone.

This left users—who built infrastructure assuming a 10-year support cycle—scrambling.

It was widely seen as a bait-and-switch:

“We built on your platform for free, promoted it, and now you’re pulling the rug out from under us.”

Result:

Two community forks emerged: Rocky Linux (led by a CentOS co-founder) and AlmaLinux (from CloudLinux).

Many sysadmins swore off Red Hat for good.

The phrase “Red Hat screwed us” is still casually dropped in forums like r/sysadmin or r/linuxadmin.


wdym 'sysadmins were upset' aren't they usually paid by whole ass companies which is exactly what centos stream was made for? Your comment implies that most sysadmins are FOSS
Show more

## Assistant

You bring up a great point—sysadmins are often paid professionals working for companies, and they might be seen as more pragmatic than ideological. But the backlash over CentOS Stream wasn’t just about the FOSS ideal; it was about trust, reliability, and predictability—which is absolutely critical in sysadmin work.

Here’s why sysadmins were particularly upset, even though they’re often employed by companies:

1. CentOS Was the “Free RHEL”

CentOS Linux was a stable, free alternative to RHEL, offering the same code base, without the cost, support, or certification of RHEL.

Many companies used CentOS for their production servers because it was a reliable, free option that had long-term support (like RHEL), and sysadmins had confidence in it.

2. Predictability Is Crucial for Sysadmins

Sysadmins live on predictability: They need long-term, stable systems. That means knowing updates won’t suddenly break things or change the landscape under them.

CentOS Stream is a rolling-release distro, which means it’s a preview of RHEL. It’s not as stable as CentOS Linux was—it’s a testing ground for RHEL’s future features.

Sysadmins rely on CentOS for stability, so with this change, their assumptions about long-term support and stability were shattered. Imagine a sysadmin's frustration when the free OS they rely on for stability suddenly becomes a moving target.

3. The Trust Factor

CentOS was built by the community and supported by Red Hat. Many sysadmins saw this as a good-faith collaboration. When Red Hat changed the model, it felt like a betrayal—especially for companies that had been using CentOS for years in mission-critical environments.

This wasn’t about a paid support package—it was about security updates, bug fixes, and long-term dependability that CentOS used to provide without the cost.

4. The “Bait and Switch” Feeling

Even though Red Hat clearly stated that CentOS Stream would replace CentOS Linux, many people felt blindsided. They assumed that Red Hat would keep CentOS Linux (or something very close to it) as the free RHEL alternative, especially since it had been an integral part of many small businesses and enterprises' infrastructure.

The shift to CentOS Stream felt like a “bait and switch”—not necessarily because sysadmins are FOSS purists, but because Red Hat was taking away a free, stable option and pushing people toward a product designed to benefit RHEL, not end users.

5. Why Sysadmins Felt the Pain

Sysadmins may be paid by companies, but they’re also the gatekeepers of infrastructure—and if you’re managing dozens or even hundreds of servers, having a stable and predictable OS is mission-critical.

Rocky Linux and AlmaLinux emerged as alternatives to CentOS because sysadmins and organizations needed something they could rely on—not just a preview of future RHEL features.

Sysadmins have to make choices based on practicality, not just ideology. When Red Hat removed a reliable, no-cost option, it forced them into difficult positions (migrating to a different distro, changing support models, etc.).

6. Did Red Hat Make the Right Move?

In business terms, CentOS Stream might make sense for Red Hat’s strategy: getting feedback on upcoming RHEL features, pushing people to RHEL for stable enterprise support, and reducing costs by consolidating resources.

But from the perspective of sysadmins, it was a huge inconvenience, especially for companies who weren’t ready to switch to paid RHEL or didn’t want the “beta-testing” feel of CentOS Stream.

TL;DR—Sysadmins Aren't Just FOSS Idealists

Sysadmins are pragmatists, but their job depends on stability and reliability. While they may not be pure FOSS advocates, they do need dependable tools. The CentOS Stream shift violated that trust, and many felt the rug was pulled out from under them after years of relying on CentOS as a stable, free alternative to RHEL.

It wasn’t just about money or open-source principles—it was about the reliability of the tools they used to keep their company’s systems running smoothly.

Does that help clarify why sysadmins, even if employed by companies, would have been so upset about the CentOS shift?

## User

in podman, what's the difference between the builders 'CentOS' and 'RHEL'?

## Assistant

In Podman, when you encounter builders labeled "CentOS" and "RHEL," you're typically dealing with different base images or configurations used for building container images. These builders determine the environment in which your container images are constructed, affecting aspects like available packages, system libraries, and compatibility.
The world's open source leader
+1

🏗️ Understanding Builders in Podman

Podman utilizes Buildah under the hood for building container images. Buildah allows for creating images from scratch or using existing base images like CentOS or RHEL. The choice between CentOS and RHEL builders influences the resulting image's compatibility, support, and licensing.
The world's open source leader
+2
Podman
+2

🔍 Differences Between CentOS and RHEL Builders

CentOS Builder:

Base Image: Uses CentOS, which is a community-supported distribution derived from RHEL sources.

Support: No official support from Red Hat; community-supported.

Use Case: Suitable for development, testing, or non-critical production environments where enterprise support isn't required.

Package Access: Access to CentOS repositories, which may not include the latest enterprise-grade packages.

RHEL Builder:

Base Image: Uses Red Hat Enterprise Linux (RHEL), a commercially supported distribution.

Support: Requires a valid Red Hat subscription to access official repositories and support.

Use Case: Ideal for enterprise environments needing stability, security updates, and vendor support.

Package Access: Access to RHEL repositories, providing certified and tested packages.

🧰 Practical Implications

Subscription Requirements: Using RHEL builders necessitates a Red Hat subscription to access repositories and receive updates. Without a subscription, you might encounter issues accessing necessary packages during the build process.

Compatibility: RHEL builders ensure compatibility with enterprise environments, especially if deploying to systems running RHEL. CentOS builders might introduce discrepancies due to differences in package versions or configurations.

Licensing and Compliance: Organizations with strict compliance requirements might prefer RHEL builders to ensure adherence to licensing and support agreements.

🔄 Alternatives and Considerations

If you're seeking a balance between community support and enterprise compatibility, consider using Universal Base Images (UBI) provided by Red Hat. UBIs are freely redistributable and can run without a subscription, but they offer a subset of RHEL's capabilities.
The world's open source leader

Additionally, be aware that Red Hat has restricted access to RHEL source code for non-subscribers, impacting the ability to build RHEL-compatible images without a subscription.

✅ Summary
Aspect	CentOS Builder	RHEL Builder
Base Image	CentOS (Community-supported)	RHEL (Commercially-supported)
Support	Community forums and resources	Official Red Hat support (with subscription)
Subscription Needed	No	Yes
Use Case	Development, testing, non-critical systems	Enterprise production environments
Repository Access	CentOS repositories	RHEL repositories (with subscription)

Choosing between CentOS and RHEL builders in Podman depends on your specific needs regarding support, compliance, and compatibility. For enterprise environments requiring official support and stability, RHEL builders are appropriate. For more flexible, community-driven projects, CentOS builders may suffice.
