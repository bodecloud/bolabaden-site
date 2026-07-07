---
source_url: "https://chatgpt.com/c/68ca2c46-8ba0-8324-befd-8b339e6936ed"
conversation_id: "68ca2c46-8ba0-8324-befd-8b339e6936ed"
title: "Docker CLI without engine"
extracted_at: "2026-06-29T13:52:48.647Z"
message_count: 5
provenance: auth-ui
---

# Docker CLI without engine

Source: [ChatGPT conversation](https://chatgpt.com/c/68ca2c46-8ba0-8324-befd-8b339e6936ed)

## Assistant

Yes — for Ubuntu (and most Linux distros using /etc/shadow), sudo and the system password hashes do not use Argon2 by default. They typically use SHA-512, represented as $6$... in /etc/shadow.

Here’s the breakdown:

$id$ in /etc/shadow	Algorithm
$1$	MD5
$2a$ / $2y$	bcrypt
$5$	SHA-256
$6$	SHA-512

Argon2 is not used for /etc/shadow by default on Ubuntu.

If a tool explicitly asks for SUDO_PASSWORD_HASH in the $type$salt$hashed format, it expects a SHA-512 hash ($6$), not Argon2.

Ubuntu’s PAM stack can technically support Argon2 with extra configuration, but nothing in stock sudo or /etc/shadow uses it out of the box.

So for your purpose, using openssl passwd -6 "plaintext" or crypt.METHOD_SHA512 is correct.

If you want, I can give you a ready-to-use command that turns your known plaintext password into the exact $6$... hash for SUDO_PASSWORD_HASH. This avoids mistakes with salt or formatting. Do you want me to do that?

## User

are the quotes considered part of the password in ur example "plaintext"?

## Assistant

No — the quotes are not part of the password.

They’re just there to delimit the string for the shell so it’s interpreted correctly. For example:

Bash
openssl passwd -6 "MyPlainPassword"

Password = MyPlainPassword

Output = $6$...hashedstring...

The quotes ensure that spaces or special characters in the password are treated literally by the shell.

So if your actual password is MyPlainPassword (without quotes), just include it inside quotes like above; the quotes themselves are not included in the hash.

If your password literally includes quotes, then you would escape them, e.g.:

Bash
openssl passwd -6 '"MyPlainPassword"'  # includes the quotes as part of password

But in almost all normal cases, you do not include quotes as part of the password.

I can show a safe one-liner to generate SUDO_PASSWORD_HASH directly from your known password without mistakes if you want.

## User

okay i'm beyond confused it definitely doesn't work. unless you're saying i need to mount /etc/shadow to the container i'm using it in???

the container says i can specify HASHED_PASSWORD to set code-server's password. All i know is everything i tried to hashify the password doesn't work. Continually says 'invalid password'. I've tried everything -- even escaping $ with $$. Assume i've tried a bunch of things before you give me a useless response. The only thing i know that works is plaintext SUDO_PASSWORD= or PASSWORD=.


GIVEN THE OBVIOUS NATURE THAT CODE-SERVER OBVIOUSLY CAN AND DOES PUBLICLY SUPPORT HASHED_PASSWORD, and the info i gave earlier on it. WTF am i doing wrong??????? again have tried a fuckton of things including argon2, openssl -6, etc.
Show more

## Assistant

I understand your frustration. You're correct that code-server supports setting a hashed password via the HASHED_PASSWORD environment variable, and you've already tried various methods to generate a valid hash. Let's focus on the specific requirements for code-server and ensure we're aligned.

🔐 Code-Server's Password Hashing Requirements

According to the official documentation, code-server accepts hashed passwords in the Argon2 format:

YAML
auth: password
hashed-password: "$argon2i$v=19$m=4096,t=3,p=1$<salt>$<hash>"

auth: password: This enables password authentication.

hashed-password: This is the hashed version of your password using the Argon2 algorithm.

To generate a valid Argon2 hash for your password, you can use the following command:

Bash
echo -n "yourpassword" | npx argon2-cli -e

This will output a hash in the required format. Replace "yourpassword" with your actual password.

🛠️ Docker Compose Configuration

In your docker-compose.yml file, set the HASHED_PASSWORD environment variable as follows:

YAML
services:
  code-server:
    image: lscr.io/linuxserver/code-server:latest
    environment:
      - HASHED_PASSWORD=$argon2i$v=19$m=4096,t=3,p=1$<salt>$<hash>
    ports:
      - "8443:8443"
    volumes:
      - /path/to/config:/config
    restart: unless-stopped

Replace <salt> and <hash> with the corresponding values from the generated Argon2 hash.

✅ Troubleshooting Tips

Ensure Correct Formatting: Double-check that the HASHED_PASSWORD value is correctly formatted and does not contain any extra spaces or characters.

Escape Dollar Signs: In YAML files, dollar signs ($) are special characters. To prevent them from being interpreted as variables, escape them by using double dollar signs ($$):

YAML
HASHED_PASSWORD=$$argon2i$$v=19$$m=4096,t=3,p=1$$<salt>$$<hash>

Verify Hash Generation: Ensure that the hash is generated correctly and matches the expected format. You can verify the hash by attempting to authenticate using it in a test environment.

If you've already tried these steps and are still encountering issues, please provide more details about the error messages or logs you're seeing. This will help in diagnosing the problem more accurately.
