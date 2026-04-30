export const bendiMalwareAnalysisMd = `
# Bendi.py Malware Analysis

Colton Hatfield
Date: 4/30/2026

---

## Executive Summary

On April 27, 2026, a malicious payload (\`bendi.py\`) was captured and analyzed via an isolated Cowrie honeypot. The malware operates as an automated SSH brute-forcing worm designed to target poorly secured Linux environments. Upon successful authentication using hardcoded credentials, the worm acts as a dropper for two primary payloads. It installs the Komari Agent, a Remote Access Trojan (RAT) that establishes persistent Command and Control (C2) via Telegram. Secondly, it deploys Traffmonetizer, a proxyware application indicating that the attacker's primary motivation is financial gain through bandwidth hijacking. The attack analyzed originated from a compromised Oracle Cloud virtual machine located in Ashburn, Virginia, which has been reported to the vendor for remediation. Additional artifacts, such as Chinese-language source code comments, were observed, though these may act as a false flag.

## Malware Metadata

* **Data.session:** \`0b4dff1847c2\`
* **Main sha:** \`806c1a4193780bbdfdc3db8606747edf12cdc16e8b38e318ed86928c5ce95457\`

**Attacker information:**
* **Location:** Ashburn, Virginia, USA (39.039474, -77.491806)
* **Organization:** Oracle Corporation

## Indicators of Compromise (IoCs)

This is the most critical section for other security analysts reading your report. You want to extract all the hardcoded network and file artifacts so they can hunt for this in their own environments.

**Domains/URLs:**
* \`sou.pp.ua\` (Central API for tracking infected hosts)
* \`del.sou.pp.ua\` (Used for downloading payloads and config files)

**File Paths & Directories:**
* \`/usr/lib/.sysd-scan/\` (Scanner directory)
* \`/var/lib/.sysd-data/\` (Data directory)
* \`/tmp/bendi.py\` (Initial drop payload)
* \`/etc/systemd/system/scan-runner.service\`
* \`/etc/systemd/system/file-monitor.service\`

**Malicious Accounts/Credentials Used:**
* **Usernames:** \`root\`
* **Passwords:** \`LeitboGi0ro\`, \`123@@@\`

**C2 Communication (Telegram):**
* **Bot Token:** \`7431501378:AAHTIaWSQ1Gcqp5ovhY6-6L1TG8Npubq1Ug\`
* **Chat ID:** \`743493786\`

## MITRE ATT&CK Analysis

The below table relates to the Wazuh alerts breakdown section and goes over the various tactics and techniques used by the malware to gain access and persistence in the honeypot.

| Tactic | Technique ID | Technique Name | Observed Behavior in Malware |
| :--- | :--- | :--- | :--- |
| Initial Access | T1110 | Brute Force | The \`ssh_scanner.py\` script attempts logins using hardcoded credentials (e.g., root/123@@@). |
| Execution | T1059.006 | Command and Scripting Interpreter: Python | Uses a Python script (\`bendi.py\`) for primary execution and orchestration. |
| Persistence | T1543.002 | Create or Modify System Process: Systemd Service | Creates \`scan-runner.service\` and \`file-monitor.service\` to start continuously on boot. |
| Defense Evasion | T1562.001 | Impair Defenses: Disable or Modify Tools | Actively kills processes holding package manager locks (\`apt\`, \`dpkg\`) to force installation. |
| Defense Evasion | T1070.004 | Indicator Removal: File Deletion | Deletes the initial \`/tmp/bendi.py\` payload using the \`rm\` command after execution attempts. |
| Command and Control | T1102 | Web Service | The Python monitor script acts as a C2 agent, reporting back to an external Telegram bot. |
| Impact | T1496 | Resource Hijacking | Deploys Traffmonetizer to consume and sell the compromised system's network bandwidth. |

## Static Analysis / Code Review

The python script has the following main functions and goals.

* **ssh_scanner.py:** A multi-threaded SSH brute-forcer that reads target IPs and attempts logins using the hardcoded credentials.
* **run_scan.sh:** The bash orchestrator. It uses masscan to find open ports 22 and 5522, extracts the IPs, filters them against an exclusion list (\`del.txt\`), and feeds them to the SSH scanner.
* **Payload Delivery:** The script attempts to download and install two distinct secondary payloads:
    * **Komari Agent:** Downloaded from \`https://del.sou.pp.ua/install.sh\`. It is a remote access trojan allowing persistent access to an attacker.
    * **Traffmonetizer (tm):** A proxyware/bandwidth-sharing application downloaded from \`https://del.sou.pp.ua/install_tm.sh\`. This indicates the attackers are financially motivated by selling the compromised machine's bandwidth.

## Persistence Mechanism

The malware creates the below services and sets them to start on boot so that they are never shutdown unless found by the user and manually shut down.

* **scan-runner.service:** Keeps the \`run_scan.sh\` bash script continuously running the masscan loop.
* **file-monitor.service:** Keeps the Python monitor script running, which acts as the Command & Control (C2) agent, reporting back to the Telegram bot and ensuring the payload is actively spreading.

## Defense Evasion & Environment Setup

The malware attempts to prepare the environment using a variety of package managers. It also queries the home server prior to sending malware on which malware it should send based on the system architecture it extracts (viewable during wazuh alerts).

* **Dependency Installation:** It explicitly checks for \`apt-get\`, \`yum\`, or \`dnf\` to install \`python3\`, \`curl\`, \`wget\`, \`masscan\`, and \`screen\`.
* **Package Manager Lock Hijacking:** The \`force_fix_apt_locks\` function actively searches for and kills processes holding apt or dpkg locks (\`killall apt apt-get dpkg\`), deleting lock files in \`/var/lib/dpkg/\` to ensure its own dependencies install without error.
* **API Deduplication:** It queries \`https://sou.pp.ua/check_ip.php\` to see if a target IP has already been compromised. This prevents multiple bots from infecting the same machine and stepping on each other's toes.

## Wazuh Alerts Breakdown

1. **[Apr 27, 2026 @ 03:43:43.036]** Connection from 129.159.169.213 to honeypot.
2. **[Apr 27, 2026 @ 03:43:43.040]** Another connection log noting the SSH version of the client “SSH-2.0-paramiko_4.0.0 “. Steps 2, 3, and 4 happen at the same time and the actual order is different.
3. **[Apr 27, 2026 @ 03:43:43.040]** Login successfully connected with username/password [\`root/123@@@\`].
4. **[Apr 27, 2026 @ 03:43:43.040]** Sharing ssh details on hasshalgorithms.
5. **[Apr 27, 2026 @ 03:43:43.048]** The following command is run: \`command -v python3 >/dev/null 2>&1 || { if command -v apt-get >/dev/null 2>&1; then apt-get update -y && apt-get install -y python3; elif command -v yum >/dev/null 2>&1; then yum install -y python3; elif command -v dnf >/dev/null 2>&1; then dnf install -y python3; fi; }\` This checks to see if python3 is installed on the system, and if not it then attempts to install it with various package managers such as apt, yum, and dnf with an else if command. This fails due to the restricted, emulated shell as the malware is not interacting with the OS itself.
6. **[Apr 27, 2026 @ 03:43:43.048]** This checks the environment of the vm it is in, showing that it is \`linux-x64-lsb\`. This is used to determine which malware it should download.
7. **[Apr 27, 2026 @ 03:43:43.048]** The malware is uploaded to the vm, it is named \`bendi.py\`.
8. **[Apr 27, 2026 @ 03:43:43.048]** The command “\`command -v python3\`” is attempted to be run but fails as \`python3\` was never actually installed, as it is running on a honeypot and can’t install packages.
9. **[Apr 27, 2026 @ 03:43:43.090]** The command “\`then apt-get update -y\`” fails because packages can’t be installed on the honeypot due to the sandbox environment.
10. **[Apr 27, 2026 @ 03:43:43.090]** The command “\`t{ if command -v apt-get\`” fails because packages can’t be installed on the honeypot.
11. **[Apr 27, 2026 @ 03:43:57.036]** The bot again checks the architecture and is shown \`linux-x64-lsb\`.
12. **[Apr 27, 2026 @ 03:43:57.042]** The malware attempts to execute the payload (\`python3 /tmp/bendi.py\`). This action generates simultaneous alerts for the command input, a failed command execution, and the closing of the TTY log.
13. **[Apr 27, 2026 @ 03:43:57.043]** It again checks the architecture.
14. **[Apr 27, 2026 @ 03:43:57.084]** It deletes the \`/tmp/bendi.py\` file with the \`rm\` command, tty logs it.
15. **[Apr 27, 2026 @ 03:43:57.084]** See 16.
16. **[Apr 27, 2026 @ 03:44:27.038]** Connection closes, whole session length was 45.5 seconds.

## Detection Engineering

Searching logs and setting up an alert for the hash provides detection of the malware being installed. Below are some example DQL queries that search for the malware or aspects of the malware running.

### Primary Payload & Hash Hunting
This query hunts for the specific file artifacts dropped during the initial access phase. It targets both the known filename and the SHA256 hash of the primary orchestrator script.

**DQL Query:**
\`\`\`
data.filename: "bendi.py" OR data.shasum: "806c1a4193780bbdfdc3db8606747edf12cdc16e8b38e318ed86928c5ce95457"
\`\`\`

### Suspicious Package Manager Activity (Defense Evasion)
The malware aggressively attempts to install dependencies by bypassing lock files and trying multiple package managers (apt, yum, dnf). This query identifies command inputs characteristic of this automated deployment sequence within a short timeframe.

**DQL Query:**
\`\`\`
data.eventid: "cowrie.command.input" AND data.input: (*apt-get* OR *yum* OR *dnf*) AND data.input: *python3*
\`\`\`

### Execution & Defense Evasion (Cleanup)
Following the attempted execution of the payload, the malware immediately attempts to cover its tracks by deleting the initial drop file from the /tmp/ directory. Searching for this specific execution and cleanup chain is a high-fidelity indicator of this worm.

**DQL Query:**
\`\`\`
data.eventid: "cowrie.command.input" AND data.input: ("python3 /tmp/bendi.py" OR "rm /tmp/bendi.py")
\`\`\`

### C2 and Infrastructure Communication
While Cowrie primarily captures the shell inputs, in a production environment, we want to hunt for network connections or curl/wget commands attempting to reach the central tracking API or payload delivery domains.

**DQL Query:**
\`\`\`
data.input: (*sou.pp.ua* OR *del.sou.pp.ua*)
\`\`\`
`;
