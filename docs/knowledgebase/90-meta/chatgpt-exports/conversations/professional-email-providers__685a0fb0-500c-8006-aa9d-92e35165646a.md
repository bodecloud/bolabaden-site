---
source_url: "https://chatgpt.com/c/685a0fb0-500c-8006-aa9d-92e35165646a"
conversation_id: "685a0fb0-500c-8006-aa9d-92e35165646a"
title: "Professional Email Providers"
extracted_at: "2026-06-29T11:55:00.930Z"
message_count: 5
provenance: auth-ui
---

# Professional Email Providers

Source: [ChatGPT conversation](https://chatgpt.com/c/685a0fb0-500c-8006-aa9d-92e35165646a)

## Assistant

Ah, now that’s a much more feasible idea! Deploying an SMTP server or mail-sending service on Google Cloud Run is definitely something you can do, with way more control than a Cloudflare Worker.

Why Google Cloud Run makes sense:

Runs containerized apps: You package your SMTP server or mail relay app in a container, and Cloud Run runs it on demand or continuously.

Supports TCP connections: Unlike Cloudflare Workers, Cloud Run can accept TCP connections (if you configure it correctly).

Scales automatically: It can scale down to zero when idle, which saves costs, and scale up when needed.

You manage the mail software: You can run lightweight SMTP relay servers or tools like MailHog
, Postfix
, or even custom Node.js mail sending apps.

But some caveats:

Cloud Run by default handles HTTP/HTTPS traffic, not raw TCP SMTP ports (25, 587)

You can’t expose raw SMTP ports directly on Cloud Run because it’s designed as a request-driven HTTP service.

So if you want to receive SMTP mail from the internet, Cloud Run is not suitable.

However, you can send emails by connecting outbound from Cloud Run to SMTP relay services or mail servers (e.g., Gmail SMTP, SendGrid SMTP).

If you want full mail server (inbound + outbound SMTP), Cloud Run alone won’t handle inbound SMTP traffic directly because of port restrictions and the need for persistent connections. You’d still need a proper inbound mail server or forwarding service.

So here’s what you can do with Cloud Run:

Build a mail sending microservice that your apps call via HTTP to send outbound email.

The service can send mail through SMTP relay providers (like Gmail SMTP, SendGrid, Mailgun).

Use Cloudflare Email Routing for incoming email forwarding.

This way, you get fully managed incoming email (free with Cloudflare), and you send mail via your Cloud Run service that acts as an API or SMTP client.

Summary:
Use Case	Cloud Run Feasible?	Notes
Outbound mail sending	✔ Yes	Use Cloud Run to send mail via SMTP relay API or SMTP server
Inbound mail receiving (SMTP)	✘ No	Cloud Run can't listen on SMTP ports, use Cloudflare Email Routing or another mail host
Full mail server hosting	✘ No	Needs raw TCP port access and persistent service
If you want to try this:

I can help you create a simple Node.js (or Python) mail sending app to deploy on Cloud Run.

Configure it to send mail through free SMTP relay providers (like Gmail SMTP or SendGrid free tier).

Connect Cloudflare Email Routing to forward incoming mail to your Gmail.

Would you like me to help you build that mail-sending microservice and set up Cloudflare Email Routing for incoming mail?

## User

on cloudflare i see this:

Email

Email Routing
Create custom email addresses to use whenever you do not want to share your primary email address.

Email routing documentation
Overview
Routing rules
Destination addresses
Email Workers
Settings
Email Workers
What’s an email worker
Email Workers allow you to create custom scripts and process your emails according to your specific requirements. Need more advanced features? Go to Cloudflare Workers.

Email Workers share the same
price plan
as Cloudflare Workers.
No email Workers available. Click Create to start.

Explore resources
Documentation
View Workers account


is this still for forwarding or is this what i need?
Show more

## Assistant

Great find! Let me clarify what Cloudflare Email Workers are and how they fit into your email setup:

What are Cloudflare Email Workers?

They are custom scripts that run on incoming email traffic (before forwarding).

Basically, they let you process, modify, filter, or route emails programmatically as they come into your domain.

Email Workers are like Cloudflare Workers but specifically for email flows.

But: Email Workers do NOT provide full mail hosting or mailbox services.

You still don’t get a mailbox on Cloudflare.

Incoming mail is still received and routed (forwarded) to your destination inboxes (like your Gmail or Outlook).

Email Workers just give you programmable control over that routing process—for example, to automatically filter certain emails, rewrite headers, or bounce unwanted mail before forwarding.

So in short:
Feature	Cloudflare Email Routing (basic)	Cloudflare Email Workers	Full Mail Hosting Provider
Receive email at your domain	✔	✔ (on top of routing)	✔
Forward email to another inbox	✔	✔ (with programmable control)	✔
Store emails / mailbox	✘	✘	✔
Send email as your domain	✘	✘	✔
Programmatic email processing	✘	✔	✘ (usually)
Do you need Cloudflare Email Workers?

Only if you want to customize how incoming emails are handled/forwarded.

For example, auto-replies, filtering, tagging, or rewriting headers before forwarding.

What you really need for your startup email:

Cloudflare Email Routing + Email Workers (optional, if you want custom processing) for free inbound forwarding

A full email hosting provider or SMTP relay for sending mail “from your domain”
(Google Workspace, Zoho Mail, or SMTP relay via Gmail/SendGrid/etc.)

Summary:

Cloudflare Email Workers extend your forwarding setup — they don’t replace mail hosting.

To have real mailboxes and sending capabilities, you still need a mail hosting service.

If you want, I can help you set up a simple forwarding + Email Worker script to customize incoming mail routing — or guide you through the best way to add outgoing mail sending on top.

Want to dive into that?

## User

as long as it looks like it comes from bolabaden.org and i can use it like a normal email address idc about the fowrarding. Can email workers do the second part since i already have the inbound forwarding to boden.crouch@gmail.com?

## Assistant

Good question! Here’s the clear answer:

What you want:

Send email from an address like you@bolabaden.org

Email appears to come from your domain (not just Gmail’s domain)

You don’t mind receiving forwarded emails to your Gmail inbox

Can Cloudflare Email Workers do sending?

No, Cloudflare Email Workers only process incoming emails as part of routing.
They cannot send or relay outgoing emails from your domain.

How sending email from your domain normally works:

You need an SMTP server or email provider authorized to send emails that claim to be from your domain (bolabaden.org).

This usually means Google Workspace, Zoho Mail, Microsoft 365, or an SMTP relay service (SendGrid, Mailgun, Amazon SES, Gmail SMTP, etc).

You configure your email client (e.g., Gmail web, Outlook, or a mail app) to use that SMTP server to send mail “as” your domain email.

What about your current setup with forwarding?

You get incoming emails forwarded to boden.crouch@gmail.com by Cloudflare Email Routing (great!).

But to send mail that looks like it’s from @bolabaden.org, you need to send it through an SMTP server authorized for bolabaden.org.

What you can do right now for free or nearly free:

Option 1: Use Gmail’s “Send mail as” with your domain

Add you@bolabaden.org as a “Send mail as” address in Gmail settings.

Use Gmail SMTP servers to send mail.

You will need to add SPF/DKIM records for bolabaden.org (Cloudflare lets you do this).

Gmail will send emails that look like they come from your domain.

Option 2: Use a free email hosting service like Zoho Mail

Create a free account for your domain.

Send and receive emails natively from their interface or configure your mail app.

No forwarding hacks needed.

TL;DR

Email Workers cannot send email from your domain.

For sending email that looks like @bolabaden.org, you need an SMTP server or full mail hosting.

Gmail’s SMTP (configured properly) or Zoho Mail free tier are the easiest free routes.

You can keep using Cloudflare Email Routing for forwarding incoming mail to your Gmail inbox.

If you want, I can help you configure Gmail “Send mail as” with your domain using Cloudflare DNS records, or set up Zoho Mail free tier for your domain. Which would you prefer?
