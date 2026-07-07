---
source_url: "https://grok.com/c/d51626bb-76ee-4cc4-9268-83c6205f8e95"
conversation_id: "d51626bb-76ee-4cc4-9268-83c6205f8e95"
title: "Eclipse Temurin JDK Installation on Fedora"
extracted_at: "2026-06-29T16:37:28.887Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Eclipse Temurin JDK Installation on Fedora

Source: [Grok conversation](https://grok.com/c/d51626bb-76ee-4cc4-9268-83c6205f8e95)

## User

_Time: 2026-06-04T01:10:05.881Z_

install java / jdk / eclipse adoptium or whatever the widely adopted most popular implementation is in 2026 on fedora?

## Assistant

_Time: 2026-06-04T01:10:28.300Z_

**Eclipse Temurin (Adoptium) remains one of the most widely adopted, community-trusted OpenJDK distributions in 2026**, especially for developers who want consistency across Linux, Windows, and macOS.<grok:render card_id="092ea3" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">11</argument></grok:render>

### Recommended Approach on Fedora (2026)

Fedora provides excellent native **OpenJDK** packages (Red Hat builds), but many developers prefer **Eclipse Temurin** for:

- Broader platform consistency
- Excellent build quality and testing
- Easier access to multiple versions (including older LTS like 8/11/17)
- Strong community and corporate backing (Eclipse Foundation, IBM, Red Hat contributors, etc.)

### Option 1: Native Fedora OpenJDK (Simplest & Recommended for Most Users)

This integrates best with the system.

```bash
# Update system first
sudo dnf update

# Check available versions
dnf search openjdk

# Install the main development kit (JDK 25 is a strong LTS choice in 2026)
sudo dnf install java-25-openjdk-devel

# Or the absolute latest (feature release)
sudo dnf install java-latest-openjdk-devel
```

**For runtime only** (no compiler):
```bash
sudo dnf install java-25-openjdk
```

**Verify**:
```bash
java -version
javac -version
```

### Option 2: Eclipse Temurin (Adoptium) — Most Popular Cross-Platform Choice

This is what many people mean when they say "Eclipse Adoptium".

1. **Add the official Adoptium repository**:

```bash
sudo dnf install adoptium-temurin-java-repository   # If available in Fedora repos

# Or manually (more reliable):
sudo cat << EOF > /etc/yum.repos.d/adoptium.repo
[Adoptium]
name=Adoptium
baseurl=https://packages.adoptium.net/artifactory/rpm/${DISTRIBUTION_NAME:-$(. /etc/os-release; echo $ID)}/\$releasever/\$basearch
enabled=1
gpgcheck=1
gpgkey=https://packages.adoptium.net/artifactory/api/gpg/key/public
EOF
```

2. **Install the version you want** (25 is excellent in 2026):

```bash
sudo dnf install temurin-25-jdk
# Or for development tools emphasis (includes full JDK)
```

You can install multiple versions side-by-side (`temurin-21-jdk`, `temurin-17-jdk`, etc.).

### Managing Multiple Java Versions

Fedora uses the `alternatives` system:

```bash
sudo alternatives --config java
sudo alternatives --config javac
```

This lets you switch the default `java` command easily.

Set `JAVA_HOME` in your shell profile (`~/.bashrc` or `~/.zshrc`):

```bash
export JAVA_HOME=/usr/lib/jvm/temurin-25-jdk   # or /usr/lib/jvm/java-25-openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

### Other Popular Options in 2026

| Distribution       | Best For                          | Installation Method                  | Notes |
|--------------------|-----------------------------------|--------------------------------------|-------|
| **Fedora OpenJDK** | Best system integration          | `dnf install java-25-openjdk-devel` | Red Hat patches, Shenandoah GC |
| **Eclipse Temurin**| General development, consistency | Adoptium repo                        | Most popular community build |
| **Azul Zulu**      | Production, long support         | Their repo or tarball                | Strong enterprise focus |
| **Amazon Corretto**| AWS-heavy workloads              | Official repo                        | AWS optimizations |
| **Oracle JDK**     | When you need commercial features| RPM from oracle.com                  | Licensing considerations |

### Additional Tools You Probably Want

```bash
sudo dnf install maven gradle
# Or use SDKMAN! for even more flexibility with Java + tools
```

**SDKMAN** is popular among power users:
```bash
curl -s "https://get.sdkman.io" | bash
sdk install java 25-temurin
```

### Summary Recommendation (2026)

- **Casual / General use** → Native `java-25-openjdk-devel`
- **Professional / Multi-platform development** → **Eclipse Temurin 25** via their repo
- Need older Java (8/11/17) → Almost always Temurin

Would you like me to give you the exact commands tailored to a specific Java version (e.g., 21, 25, or latest) or for a particular use case like Android development, Spring Boot, etc.?

## User

_Time: 2026-06-04T01:28:04.740Z_

how to setup i2pd and sams servers on fedora? is the java version still preferred?

## Assistant

_Time: 2026-06-04T01:28:17.453Z_

**Here's a complete, up-to-date guide for setting up i2pd and enabling SAMS (SAM bridge) on Fedora in 2026.**

### i2pd vs Java I2P Router: Which is Preferred in 2026?

**Yes — i2pd (C++ implementation) is still widely preferred** for most server and lightweight use cases on Linux:

- **Lower resource usage** (CPU + RAM) — ideal for servers, VPS, or always-on routers.
- No Java dependency (lighter footprint, faster startup).
- Excellent stability and full network compatibility with Java I2P routers.
- Easier to run as a systemd service.

**Java I2P (or I2P+)** is better if you want:
- Built-in apps (I2PSnark torrent client, Susimail email, etc.).
- Richer web console with more plugins and GUI features.
- Easier point-and-click configuration.

For a pure **server/router setup** (especially with external apps using SAM), **i2pd is the better choice** on Fedora.

---

### Step-by-Step: Install i2pd on Fedora

1. **Enable the official COPR repository** (maintained by the PurpleI2P team):

```bash
sudo dnf copr enable supervillain/i2pd
sudo dnf update
```

2. **Install i2pd**:

```bash
sudo dnf install i2pd
```

3. **Start and enable the service**:

```bash
sudo systemctl enable --now i2pd
sudo systemctl status i2pd
```

**Access the web console**:
- Open your browser → `http://127.0.0.1:7070`
- Default username/password is usually blank or `admin` (check `/etc/i2pd/i2pd.conf`).

---

### Enable and Configure SAM Bridge (SAMS)

**SAM (Simple Anonymous Messaging)** is the protocol you use to let external applications (in any language) talk to the I2P network through i2pd.

SAM is **enabled by default** in recent i2pd versions.

**Edit the main config**:

```bash
sudo nano /etc/i2pd/i2pd.conf
```

Add or ensure these lines under the proper sections:

```ini
# SAM Bridge
[sam]
enabled = true
address = 127.0.0.1
port = 7656

# Optional but recommended
sam.singlethread = false   # Better performance for multiple sessions
```

You can also enable other useful interfaces:

```ini
[httpproxy]
enabled = true
port = 4444

[socksproxy]
enabled = true
port = 4445

[http]
enabled = true
port = 7070   # Web console
```

**Restart i2pd**:

```bash
sudo systemctl restart i2pd
```

**Verify SAM is listening**:

```bash
ss -tuln | grep 7656
```

You should see something listening on port **7656**.

---

### Firewall Configuration (Important for Server Use)

If this is a server and you want to accept incoming I2P traffic:

```bash
sudo firewall-cmd --permanent --add-port=7070/tcp   # Web console
sudo firewall-cmd --permanent --add-port=4444/tcp   # HTTP Proxy
sudo firewall-cmd --permanent --add-port=7656/tcp   # SAM
sudo firewall-cmd --reload
```

**Note**: Most I2P traffic is outbound through random high ports. You usually don’t need to open many inbound ports.

---

### Useful Additional Configurations

Create a tunnels configuration for specific services (e.g., hosting hidden services):

```bash
sudo nano /etc/i2pd/tunnels.conf
```

Example for a basic server tunnel:

```ini
[MyHiddenService]
type = server
host = 127.0.0.1
port = 8080          # Local service port
keys = my-service.dat
```

Then restart i2pd.

---

### Managing i2pd

```bash
sudo systemctl status i2pd
sudo systemctl restart i2pd
sudo journalctl -u i2pd -f     # Live logs
```

Configuration files are in:
- `/etc/i2pd/` (system-wide)
- `~/.i2pd/` (per-user, if running manually)

---

### Summary Recommendation (2026)

- **For servers / headless / low-resource** → **i2pd** (what you asked for) — still the top choice.
- **For desktop with full apps** → Consider Java I2P or I2P+.
- Use **SDKMAN** or system OpenJDK only if you decide to go with the Java router later.

Would you like me to expand on any part?
- Hosting specific services (e.g., website, IRC, torrent)?
- Running multiple tunnels?
- Securing the setup further (firewall, hardening)?
- Using it with specific apps (e.g., via SAM in Python/Go/Java)?

Let me know your exact use case!
