# Terminal Command Ecosystem (Secure Edition)

A comprehensive developer terminal learning platform featuring an interactive knowledge graph, OS documentation, terminal simulator, and quiz system.

## Secure Backend Architecture

The application is now powered by a **Secure Node.js Backend** that implements industry-standard security practices:

- **Helmet.js**: Configured with strict Content Security Policy (CSP) to prevent XSS and Clickjacking.
- **CORS**: Restricted to the local origin to prevent unauthorized cross-origin requests.
- **Express-Rate-Limit**: Protects the server from DoS and brute-force attacks by limiting requests to 100 per 15 minutes per IP.
- **Input Sanitization**: Terminal simulator handles user input safely without execution on the host machine.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run the Secure Server**:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:8001`.

## Features

- **Knowledge Graph**: Explore command relationships visually (D3.js).
- **OS Documentation**: platform-specific guides for Linux, macOS, and Windows.
- **Terminal Simulator**: Practice commands in a safe, simulated environment with `sudo` support.
- **Quiz Mode**: Test your knowledge with dynamically generated questions.

## Security & Hardening Category

A dedicated command category for **Security & Hardening** has been added, covering:
- Firewall management (`ufw`, `iptables`)
- Encryption & TLS (`openssl`)
- Privileged execution (`sudo`)
- Intrusion prevention (`fail2ban`)
- Network auditing (`nmap`)
- Audit logs (`last`, `passwd`)

## Repository Structure

```text
.
├── server.js           # Secure Node.js Backend
├── package.json        # Dependencies & Scripts
├── frontend/           # Web Application Files
│   ├── index.html
│   ├── app.js
│   ├── commandDatabase.js
│   └── ...
└── docs/               # Markdown Documentation
```

## Start Here

- Full reference: [docs/terminal-command-ecosystem.md](/Users/bhuvibhardwaj/Dev/commands/docs/terminal-command-ecosystem.md)

## Coverage

The reference is grouped by these major branches:

- Navigation
- File Management
- File Viewing
- Searching
- Permissions
- Processes
- Networking
- System Information
- Disk Management
- Compression / Archives
- Package Management

## Notes

- Linux commands use common GNU/Linux conventions. Package management examples use `apt`; substitute `dnf`, `yum`, `pacman`, or `zypper` where appropriate.
- macOS commands prefer built-in Unix tools when practical.
- PowerShell uses canonical cmdlets where they are the clearest choice. In a few areas, native Windows tools such as `icacls`, `tar`, and `winget` remain the most practical option from PowerShell as well.
- Some tasks do not have a perfect one-to-one native equivalent across all operating systems. Those cases are labeled directly in the reference.
