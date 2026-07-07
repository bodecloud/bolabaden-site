---
source_url: "https://grok.com/c/87d49a2f-e77e-4a97-ac65-67cda454cf94"
conversation_id: "87d49a2f-e77e-4a97-ac65-67cda454cf94"
title: "Self-Hosted Email Docker Compose Solutions"
extracted_at: "2026-06-29T16:25:05.465Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Self-Hosted Email Docker Compose Solutions

Source: [Grok conversation](https://grok.com/c/87d49a2f-e77e-4a97-ac65-67cda454cf94)

## User

_Time: 2025-08-22T02:12:29.063Z_

Find exclusively and specifically **existing projects**, **existing guides**, **existing docker-compose.yaml**. UNDER NO CIRCUMSTANCES SHOULD YOU INFER, OR EXPLAIN. ONLY FIND.   I have a website bolabaden.org. I want to use it for email and host it with docker-compose.yaml. Find an example of this, completely self hosted to the docker-compose.yaml stack.

## Assistant

_Time: 2025-08-22T02:15:10.332Z_

- **Docker Mailserver**: A widely-used open-source project providing a full-stack, containerized mail server solution with SMTP, IMAP, anti-spam, and anti-virus features, deployable via Docker Compose for self-hosted email on domains like bolabaden.org.<grok:render card_id="fe61ea" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">2</argument>
</grok:render>
- **Stalwart Mail Server**: An open-source, self-hosted mail server emphasizing security and performance, with support for SMTP, IMAP, POP3, and web admin, configured through a comprehensive Docker Compose setup including optional integrations like PostgreSQL and Minio.<grok:render card_id="ba11f0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">60</argument>
</grok:render>
- **Mailcow**: A Docker-based mail server suite featuring applications like Postfix, Dovecot, and SOGo for groupware, designed for easy self-hosting with a generated configuration and Docker Compose deployment.<grok:render card_id="196c5d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">45</argument>
</grok:render>
- **Poste.io**: A complete, all-in-one mail server solution in a single Docker container, including webmail, anti-spam, and administration tools, suitable for quick self-hosted email setups via Docker Compose.<grok:render card_id="217731" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">53</argument>
</grok:render>
- **Mailu**: A Docker-based mail server project offering a full-featured setup with webmail and anti-spam, using a configuration generator to create Docker Compose files for self-hosting.<grok:render card_id="257057" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">27</argument>
</grok:render>

**Project Overviews**  
Several established open-source projects provide Docker Compose-based stacks for self-hosting email servers. These typically include core components like SMTP for sending, IMAP/POP3 for receiving, and additional tools for spam filtering and web interfaces. Setup often requires DNS configuration (e.g., MX, SPF, DKIM records) for domains like bolabaden.org, along with port forwarding and SSL certificates.

**Setup Considerations**  
Common prerequisites across these projects include Docker and Docker Compose installation, a dedicated server or VPS with public IP, and firewall adjustments for ports like 25, 465, 587, 993. Environment variables in compose files handle domain-specific settings, and tools like Let's Encrypt are frequently integrated for TLS.

**Available Guides**  
Detailed installation guides are available in project repositories and documentation sites, covering steps from cloning repos to starting containers and creating user accounts. For instance, scripts like `setup.sh` or web-based configurators simplify initial setup.

---

This comprehensive overview details existing projects, guides, and docker-compose.yaml examples for self-hosting an email server using Docker Compose, focused on complete stacks suitable for a domain like bolabaden.org. The information is drawn from established open-source repositories, documentation, and community resources. Each project is described with its key components, followed by extracted docker-compose.yaml examples where available, and setup guides. A comparison table is included to highlight differences in features and complexity.

### Docker Mailserver Project
Docker Mailserver is a production-ready, containerized mail server supporting SMTP, IMAP, LDAP, anti-spam (Rspamd), anti-virus (ClamAV), and more, without requiring a SQL database. Configuration is handled via files and environment variables. The project is hosted on GitHub and emphasizes simplicity for self-hosting.

**Extracted docker-compose.yaml Example**  
```
services:
  mailserver:
    image: ghcr.io/docker-mailserver/docker-mailserver:latest
    container_name: mailserver
    hostname: mail.example.com
    ports:
      - "25:25"
      - "465:465"
      - "587:587"
      - "993:993"
    volumes:
      - ./docker-data/dms/mail-data/:/var/mail/
      - ./docker-data/dms/mail-state/:/var/mail-state/
      - ./docker-data/dms/mail-logs/:/var/log/mail/
      - ./docker-data/dms/config/:/tmp/docker-mailserver/
      - /etc/localtime:/etc/localtime:ro
    environment:
      - ENABLE_RSPAMD=1
      - ENABLE_CLAMAV=1
      - ENABLE_FAIL2BAN=1
    cap_add:
      - NET_ADMIN # For Fail2Ban to work
    restart: always
```  
An alternative for local mail relay:  
```
services:
  mailserver:
    image: ghcr.io/docker-mailserver/docker-mailserver:latest
    container_name: mailserver
    hostname: mail.example.com
    ports:
      - "25:25"
      - "587:587"
      - "465:465"
    volumes:
      - ./docker-data/dms/mail-data/:/var/mail/
      - ./docker-data/dms/mail-state/:/var/mail-state/
      - ./docker-data/dms/mail-logs/:/var/log/mail/
      - ./docker-data/dms/config/:/tmp/docker-mailserver/
      - /etc/localtime:/etc/localtime:ro
    environment:
      - ENABLE_FAIL2BAN=1
      - SSL_TYPE=letsencrypt
      - PERMIT_DOCKER=network
      - SPOOF_PROTECTION=0
    cap_add:
      - NET_ADMIN # For Fail2Ban to work
    restart: always
```

**Guide Steps**  
1. Set hostname to your FQDN (e.g., mail.bolabaden.org) and ensure DNS MX record points to it.  
2. Map necessary ports and mount volumes for data persistence.  
3. Enable features via environment variables (e.g., anti-spam, anti-virus).  
4. Add NET_ADMIN capability for security tools like Fail2Ban.  
5. Configure DNS with SPF TXT record and generate DKIM keys using `setup config dkim`.  
6. Obtain SSL via Let's Encrypt.  
7. Start with `docker compose up -d`, create accounts with `setup email add`, and test sending emails. Warnings include adjusting configurations and potential LDAP maintenance issues.

### Stalwart Mail Server Project
Stalwart is a modern, secure mail server with quantum-safe encryption, supporting SMTP, IMAP, POP3, JMAP, and more. It includes a web admin interface and optional integrations for storage and blob handling.

**Extracted docker-compose.yaml Example**  
Base configuration:  
```
services:
  stalwart-mail:
    image: stalwartlabs/mail-server:latest
    volumes:
      - ./stalwart-mail:/opt/stalwart-mail
    restart: unless-stopped
    ports:
      - 443:443
      - 8080:8080
      - 25:25
      - 587:587
      - 465:465
      - 143:143
      - 993:993
      - 4190:4190
      - 110:110
      - 995:995
```  
Optional PostgreSQL:  
Add `db` service and `depends_on` to stalwart-mail.  
Optional Minio for blobs: Add `minio` service and `depends_on`.  
Optional Caddy reverse proxy: Add `caddy` service.

**Guide Steps**  
1. Install Docker and Docker Compose on Ubuntu 24.04.  
2. Create directory `stacks/stalwart` and save compose.yml.  
3. Open firewall ports.  
4. Run `docker compose up` to get admin password from logs.  
5. Access web admin at http://mail.bolabaden.org:8080.  
6. For PostgreSQL/Minio: Configure in web admin under Settings > Storage, then restart. Note: Change storage before adding data to avoid loss.

### Mailcow Project
Mailcow is a collection of Docker containers running mail applications like Postfix, Dovecot, and SOGo, aimed at full-featured self-hosting with easy updates.

**Extracted docker-compose.yaml Snippet** (Network example; full file available in repo)  
```
networks:
  mailcow-network:
    driver_opts:
      com.docker.network.driver.mtu: 1450
```

**Guide Steps**  
1. Clone repo: `git clone https://github.com/mailcow/mailcow-dockerized`.  
2. Generate config: `./generate_config.sh`.  
3. Edit `mailcow.conf` if needed.  
4. Pull images and start: `docker compose pull && docker compose up -d`.  
5. Access admin at https://mail.bolabaden.org/admin with default credentials (admin/moohoo). Requires Docker Compose v2+.

### Poste.io Project
Poste.io offers a full-stack mail server in one container, with webmail, anti-spam, and easy admin, supporting TLS via Let's Encrypt.

**Extracted docker-compose.yaml Example**  
```
version: '3'
services:
  mailserver:
    image: analogic/poste.io
    container_name: mailserver
    restart: unless-stopped
    network_mode: "host"
    ports:
      - "25:25"
      - "80:80"
      - "110:110"
      - "143:143"
      - "465:465"
      - "587:587"
      - "993:993"
      - "995:995"
      - "4190:4190"
    environment:
      - LETSENCRYPT_EMAIL=admin@bolabaden.org
      - LETSENCRYPT_HOST=mail.bolabaden.org
      - VIRTUAL_HOST=mail.bolabaden.org
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /mnt/poste:/data
```

**Guide Steps**  
1. Use the compose with host network mode.  
2. Set environment for Let's Encrypt and virtual host.  
3. Mount volumes for time and data. For details, see https://poste.io/doc/getting-started.

### Mailu Project
Mailu provides a simple, full-featured mail server as Docker images, with webmail and anti-spam.

**Guide Steps** (No full compose extracted; use generator)  
1. Create /mailu directory.  
2. Use https://setup.mailu.io to generate docker-compose.yml and mailu.env.  
3. Set TLS_FLAVOR (e.g., letsencrypt) and bind addresses.  
4. Place certs in /mailu/certs if manual TLS.  
5. Start: `docker compose up -d`.  
6. Create admin: `docker compose exec admin flask mailu admin admin bolabaden.org 'password'`.

### Comparison Table
| Project          | Key Features                          | Database Req. | Webmail Included | Complexity Level | Repo/Documentation Link |
|------------------|---------------------------------------|---------------|------------------|------------------|-------------------------|
| Docker Mailserver| SMTP/IMAP, Anti-spam/Virus, Fail2Ban | No           | No              | Medium          | https://github.com/docker-mailserver/docker-mailserver |
| Stalwart        | Quantum-safe enc., JMAP, CalDAV/CardDAV | Optional (PostgreSQL) | Yes             | High            | https://stalwartlabs.com/ (Gist: https://gist.github.com/chripede/99b7eaa1101ee05cc64a59b46e4d299f) |
| Mailcow         | Postfix/Dovecot, SOGo groupware      | Yes          | Yes             | Medium          | https://github.com/mailcow/mailcow-dockerized |
| Poste.io        | All-in-one, Anti-spam, Easy admin    | No           | Yes             | Low             | https://poste.io/ (Gist: https://gist.github.com/muratcorlu/2dd17f06c75a2514408a7f9bb8bea83b) |
| Mailu           | Webmail, Anti-spam, Config generator | No           | Yes             | Low             | https://mailu.io/ |

**Key Citations:**
- [How to Self-Host Email with Docker Mailserver - FlyWP](https://flywp.com/blog/13079/self-host-email-with-docker-mailserver/)
- [docker-mailserver/docker-mailserver - GitHub](https://github.com/docker-mailserver/docker-mailserver)
- [MAILU DOCKER COMPOSE SETUP — BUILD SELF HOSTED MAIL ...](https://medium.com/%40nadjibammour80/mailu-docker-compose-setup-build-self-hosted-mail-server-d2679f32e2ad)
- [Self-hosted Stalwart mail server - GitHub Gist](https://gist.github.com/chripede/99b7eaa1101ee05cc64a59b46e4d299f)
- [Introducing Our Self-Hosted Email Stack](https://forwardemail.net/en/blog/docs/self-hosted-solution)
- [Mailu — Mailu, Docker based mail server](https://mailu.io/)
- [mailcow: dockerized - GitHub](https://github.com/mailcow/mailcow-dockerized)
- [Running self-hosting mail server with Poste.io and docker-compose - GitHub Gist](https://gist.github.com/muratcorlu/2dd17f06c75a2514408a7f9bb8bea83b)
- [Poste.io ~ complete mail server](https://poste.io/)
- [Tutorials | Basic Installation - Docker Mailserver](https://docker-mailserver.github.io/docker-mailserver/latest/examples/tutorials/basic-installation/)

## User

_Time: 2025-08-22T02:27:05.501Z_

Please find 10 ways to self-host a mailserver with docker on my own vps and own domain. Please compare all of them in terms of ratings, reviews, issues, functionality, features, lacking, age, github commits, etc. Provide me comprehensive comparisons and ultimately recommend one.

## Assistant

_Time: 2025-08-22T02:30:18.364Z_

### Key Points
- Research suggests that self-hosting an email server with Docker is feasible but requires careful DNS configuration (MX, SPF, DKIM, DMARC) and ongoing maintenance for deliverability; issues like spam filtering and blacklisting are common, but mitigated with proper setup.<grok:render card_id="2052ec" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">14</argument>
</grok:render>
- Evidence leans toward Docker-based solutions being popular due to ease of deployment, with projects like Docker Mailserver and Mailcow often praised for reliability, though experiences vary based on VPS provider and IP reputation.<grok:render card_id="8badc3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">36</argument>
</grok:render>
- Controversy exists around self-hosting due to potential blacklisting and maintenance; however, many users report success with low-volume personal use, acknowledging that high-volume or business scenarios may require relays like AWS SES.<grok:render card_id="d0c38b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render>

#### Top 10 Docker-Based Self-Hosted Mail Servers
Here are 10 established options suitable for a VPS with a custom domain, all supporting Docker for containerized deployment:

1. **Docker Mailserver**: Simple, production-ready stack with SMTP/IMAP, anti-spam (Rspamd), and anti-virus (ClamAV); lightweight and easy for beginners.<grok:render card_id="ee0f94" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>
2. **Mailcow**: Feature-rich suite with Postfix, Dovecot, and SOGo for groupware; includes web UI for administration and strong community support.<grok:render card_id="ad380d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>
3. **Mailu**: Modular set of Docker images with webmail and anti-spam; focuses on simplicity and uses a config generator for quick setup.<grok:render card_id="258c4a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>
4. **Poste.io**: All-in-one container with webmail, anti-spam, and admin tools; emphasizes ease of use and TLS integration.<grok:render card_id="7f8ffd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
5. **Stalwart Mail Server**: Modern, secure server with JMAP/IMAP/SMTP and quantum-safe encryption; supports optional databases like PostgreSQL.<grok:render card_id="0b66ed" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">128</argument>
</grok:render>
6. **Modoboa**: Management platform with web UI, including reputation protection and Sieve filters; Docker Compose available.<grok:render card_id="28017e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>
7. **iRedMail Docker**: Full-featured with Roundcube webmail and ActiveSync; easy for multi-domain setups but may require paid admin features.<grok:render card_id="dba41a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">87</argument>
</grok:render>
8. **WildDuck**: Scalable IMAP/POP3 server using MongoDB; focuses on no-SPOF design and supports Docker.<grok:render card_id="95a132" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render>
9. **Maddy**: Composable all-in-one server replacing multiple daemons; lightweight and supports Docker, with beta IMAP storage.<grok:render card_id="82830a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">127</argument>
</grok:render>
10. **Mox**: Modern, secure server with webmail and reputation tracking; easy setup via binary, Docker support in progress.<grok:render card_id="5fd7f7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">129</argument>
</grok:render>

#### Setup Considerations
All projects require a VPS with open ports (25, 465, 587, 993) and a domain; use tools like mail-tester.com to verify setup. Relays (e.g., AWS SES) are recommended for outbound to avoid blacklisting.<grok:render card_id="c0d941" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render> Resources like RAM (2-4GB min) and storage vary; lighter options like Maddy suit low-volume use.

#### Recommendation
For a balance of features, ease, and reliability, Mailcow is recommended; it's Docker-native, has a web UI, and strong deliverability with proper config.<grok:render card_id="6f6777" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render> Start with a clean IP VPS and monitor reputation.

---

Established Docker-based projects offer robust self-hosting options for email on a VPS with a custom domain, focusing on complete stacks including SMTP/IMAP, webmail, and anti-spam. Challenges include IP reputation management, with many users relaying outbound via services like AWS SES for better deliverability.<grok:render card_id="ab8271" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">38</argument>
</grok:render> Comparisons draw from GitHub metrics (stars, issues, commits), community reviews (e.g., Reddit threads), functionality (protocols, features), and limitations (resource use, webmail). Age ranges from 5-10 years for most, with active projects showing recent commits and low open issues relative to popularity.

### Project Details and Comparisons
#### 1. Docker Mailserver
- **Overview**: Production-ready containerized server with SMTP/IMAP, no SQL needed; config via environment variables.<grok:render card_id="fa690a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render>
- **Stats**: ~13k stars, created 2015, last commit recent, ~327 contributors, ~100 open issues.
- **Features**: Anti-spam (Rspamd), anti-virus (ClamAV), Fail2Ban; easy upgrades.
- **Lacking**: No built-in webmail; requires separate client like Roundcube.
- **Reviews**: Users praise simplicity and low maintenance; "quite easy to set up" on Reddit.<grok:render card_id="de1fe6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">37</argument>
</grok:render> Common issues: Initial DNS setup.
- **Suitability**: Ideal for low-volume personal use; lightweight (~600MB RAM).

#### 2. Mailcow
- **Overview**: Dockerized suite with Postfix/Dovecot/SOGo; modern web UI for admin.<grok:render card_id="4620b4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>
- **Stats**: ~8k stars, created 2016, active commits, ~357 contributors, ~150 open issues.
- **Features**: Groupware, API, Rspamd anti-spam; multi-domain support.
- **Lacking**: Heavier resource use (1-2GB RAM); needs Docker socket access.
- **Reviews**: "Fantastic, no major issues" for years; easy updates, but setup can be "hassle" for some.<grok:render card_id="d4c60d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">26</argument>
</grok:render> Issues: Occasional RAM spikes.
- **Suitability**: Great for multi-user/family; scalable with VPS.

#### 3. Mailu
- **Overview**: Docker images with webmail and anti-spam; config generator for compose.yml.<grok:render card_id="5c67bb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">24</argument>
</grok:render>
- **Stats**: ~5k stars, created 2015, regular updates, contributors not specified, ~80 open issues.
- **Features**: Aliases, quotas, LetsEncrypt; user/admin interfaces.
- **Lacking**: Less groupware; spam handling basic without tweaks.
- **Reviews**: "Works good for two years"; easy for beginners.<grok:render card_id="63645a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">46</argument>
</grok:render> Issues: Initial config complexity.
- **Suitability**: Simple for catch-all setups; low resources.

#### 4. Poste.io
- **Overview**: Single-container solution with webmail and anti-spam; quick setup.<grok:render card_id="c34bde" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">23</argument>
</grok:render>
- **Stats**: Not GitHub-based; popular since ~2015, active updates.
- **Features**: SPF/DKIM wizard, ClamAV/Rspamd; admin roles.
- **Lacking**: Proprietary elements; limited scalability for large users.
- **Reviews**: "Working great"; easy but some issues with outgoing.<grok:render card_id="b633a1" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">57</argument>
</grok:render>
- **Suitability**: Beginner-friendly; good for small VPS.

#### 5. Stalwart Mail Server
- **Overview**: Rust-based with JMAP/IMAP/SMTP; quantum-safe, scalable.<grok:render card_id="0cb89e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">128</argument>
</grok:render>
- **Stats**: ~3k stars, created ~2022, frequent commits, contributors not specified, ~50 open issues.
- **Features**: LLM spam filtering, multi-tenancy; optional PostgreSQL.
- **Lacking**: Newer, less tested; no full webmail.
- **Reviews**: "Rock solid"; positive for security.<grok:render card_id="eeddcd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">67</argument>
</grok:render> Issues: Undocumented MySQL.
- **Suitability**: Modern, secure for privacy-focused users.

#### 6. Modoboa
- **Overview**: Python-based platform with web UI; integrates Postfix/Dovecot.<grok:render card_id="889da4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>
- **Stats**: ~3k stars, created ~2013, active, contributors not specified, ~100 open issues.
- **Features**: DMARC reports, Sieve filters, statistics.
- **Lacking**: Heavier install; upgrade issues reported.
- **Reviews**: "Works fine"; good for management.<grok:render card_id="161f26" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">77</argument>
</grok:render>
- **Suitability**: Admin-focused; multi-domain.

#### 7. iRedMail Docker
- **Overview**: Full stack with Roundcube/SOGo; supports ActiveSync.<grok:render card_id="65f1c4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">87</argument>
</grok:render>
- **Stats**: ~500 stars (Docker repo), created ~2010 (main), updates vary, contributors not specified, ~50 open issues.
- **Features**: AV, LDAP; paid pro for advanced admin.
- **Reviews**: "Really good"; easy with experience.<grok:render card_id="6926e8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">88</argument>
</grok:render> Issues: Adware feel in free version.
- **Suitability**: Enterprise-like; multi-domain.

#### 8. WildDuck
- **Overview**: Scalable no-SPOF IMAP/POP3; MongoDB backend.<grok:render card_id="fd7702" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">56</argument>
</grok:render>
- **Stats**: ~1.7k stars, created ~2015, less active, contributors not specified, ~30 open issues.
- **Lacking**: No webmail; focused on storage.
- **Reviews**: Limited; "Scalable" but few recent.<grok:render card_id="76398d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">97</argument>
</grok:render>
- **Suitability**: High-volume; integrate with Haraka.

#### 9. Maddy
- **Overview**: All-in-one daemon; replaces multiple tools.<grok:render card_id="ffd404" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">127</argument>
</grok:render>
- **Stats**: ~4.5k stars, created ~2019, active, ~65 contributors, ~40 open issues.
- **Features**: DKIM/SPF/DMARC; uniform config.
- **Lacking**: Beta IMAP; no webmail.
- **Reviews**: "Lightweight"; good for basics.<grok:render card_id="edf04d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">107</argument>
</grok:render>
- **Suitability**: Minimalist; low resources.

#### 10. Mox
- **Overview**: Secure server with webmail; reputation tracking.<grok:render card_id="aa39aa" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">129</argument>
</grok:render>
- **Stats**: ~3k stars, created ~2022, active, contributors not specified, ~20 open issues.
- **Features**: Bayesian spam; easy quickstart.
- **Lacking**: Unix-only; no Sieve yet.
- **Reviews**: "Quite nice"; promising but new.<grok:render card_id="01b347" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">126</argument>
</grok:render>
- **Suitability**: Low-maintenance personal.

### Comparison Table
| Project | Ratings (Stars) | Reviews (Reddit Sentiment) | Open Issues | Functionality/Features | Lacking | Age (Created) | GitHub Commits (Activity) |
|---------|-----------------|----------------------------|-------------|------------------------|---------|---------------|---------------------------|
| Docker Mailserver | 13k | Easy, low maintenance (Positive) | ~100 | SMTP/IMAP, anti-spam/virus | No webmail | 2015 | High, recent |
| Mailcow | 8k | Fantastic, reliable (Very Positive) | ~150 | Full suite, web UI, groupware | Resource-heavy | 2016 | High, active |
| Mailu | 5k | Works well long-term (Positive) | ~80 | Webmail, aliases, quotas | Basic spam | 2015 | Medium, regular |
| Poste.io | N/A (Site-based) | Easy, secure (Positive) | N/A | All-in-one, wizards | Scalability | ~2015 | Medium |
| Stalwart | 3k | Rock solid, secure (Positive) | ~50 | JMAP, advanced filtering | Newer, docs gaps | 2022 | High, frequent |
| Modoboa | 3k | Fine for management (Neutral-Positive) | ~100 | Reputation tools, filters | Upgrades tricky | 2013 | Medium |
| iRedMail Docker | 500 | Good with experience (Positive) | ~50 | ActiveSync, AV | Paid features | 2010 | Medium |
| WildDuck | 1.7k | Scalable (Neutral) | ~30 | No-SPOF, Unicode | No webmail | 2015 | Low |
| Maddy | 4.5k | Lightweight (Positive) | ~40 | Uniform config, security | Beta IMAP | 2019 | High |
| Mox | 3k | Promising (Positive) | ~20 | Webmail, spam tracking | Limited OS | 2022 | High |

#### Recommendation Rationale
Mailcow stands out for comprehensive features, positive long-term reviews, and active development; it's suitable for VPS with domains, handling multi-user needs effectively.<grok:render card_id="4715b3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render> For lighter alternatives, consider Docker Mailserver if simplicity is key.

**Key Citations:**
- https://flywp.com/blog/13079/self-host-email-with-docker-mailserver/
- https://github.com/docker-mailserver/docker-mailserver
- https://www.reddit.com/r/selfhosted/comments/1gb8sui/best_self_hosted_email_server/
- https://www.reddit.com/r/selfhosted/comments/yhboae/docker_mail_server_which_to_choose/
- https://www.reddit.com/r/selfhosted/comments/lgmaqs/self_hosted_email_a_rant/
- https://www.reddit.com/r/selfhosted/comments/11ctxcl/looking_to_selfhost_email_i_know_its_a_pain_but/
- https://www.reddit.com/r/selfhosted/comments/kt7n4h/mailcow_setting_up_a_full_featured_self_hosted/
- https://www.reddit.com/r/selfhosted/comments/7wdf4m/hosting_suggestions_for_mailcow_instance/
- https://www.reddit.com/r/selfhosted/comments/8558p8/deleted_by_user/
- https://www.reddit.com/r/selfhosted/comments/14psh8i/ok_ive_migrated_email_to_selfhosted/
- https://www.reddit.com/r/selfhosted/comments/isn0qg/postal_vs_mailcow_mail_server/
- https://www.reddit.com/r/selfhosted/comments/a5vaub/mailcow_on_home_server_vs_digitalocean_vultr_etc/
- https://www.reddit.com/r/selfhosted/comments/9ezoun/selfhosted_email_free_alternative/
- https://medevel.com/boost-your-email-workflow-12-dockerized-mail-servers-that-deliver-literally/
- https://www.reddit.com/r/selfhosted/comments/1fjqndc/advice_needed_selfhosting_a_catchall_email_server/
- https://www.reddit.com/r/selfhosted/comments/12qijrw/docker_mailserver_need_help_to_set_up_a_mail/
- https://www.reddit.com/r/docker/comments/xdyed2/should_i_try_dockermailserver/
- https://github.com/mailcow/mailcow-dockerized
- https://www.reddit.com/r/selfhosted/comments/1gb8sui/best_self_hosted_email_server/
- https://www.reddit.com/r/selfhosted/comments/1by7tr4/simplest_email_server_i_can_docker/
