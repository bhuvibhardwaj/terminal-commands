const commandDatabase = [
  // --- Navigation ---
  {
    name: "ls",
    category: "Navigation",
    description: "List files and directories in the current location.",
    syntax: "ls [options] [path]",
    example: "ls -la",
    commands: { linux: "ls", mac: "ls", windows: "dir" },
    related: ["cd", "pwd", "find"],
    importance: 10
  },
  {
    name: "cd",
    category: "Navigation",
    description: "Change the current working directory.",
    syntax: "cd [path]",
    example: "cd /home/user/documents",
    commands: { linux: "cd", mac: "cd", windows: "cd" },
    related: ["ls", "pwd", "mkdir"],
    importance: 10
  },
  {
    name: "pwd",
    category: "Navigation",
    description: "Print the absolute path of the current working directory.",
    syntax: "pwd",
    example: "pwd",
    commands: { linux: "pwd", mac: "pwd", windows: "cd" },
    related: ["ls", "cd"],
    importance: 8
  },

  // --- File Management ---
  {
    name: "mkdir",
    category: "File Management",
    description: "Create a new directory.",
    syntax: "mkdir [directory_name]",
    example: "mkdir projects",
    commands: { linux: "mkdir", mac: "mkdir", windows: "mkdir" },
    related: ["rmdir", "cd", "touch"],
    importance: 7
  },
  {
    name: "rm",
    category: "File Management",
    description: "Remove files or directories.",
    syntax: "rm [options] [file]",
    example: "rm -rf old_folder",
    commands: { linux: "rm", mac: "rm", windows: "del" },
    related: ["rmdir", "mv", "cp"],
    importance: 7
  },
  {
    name: "rmdir",
    category: "File Management",
    description: "Remove an empty directory.",
    syntax: "rmdir [directory]",
    example: "rmdir empty_folder",
    commands: { linux: "rmdir", mac: "rmdir", windows: "rd" },
    related: ["rm", "mkdir"],
    importance: 5
  },
  {
    name: "touch",
    category: "File Management",
    description: "Create an empty file or update timestamps.",
    syntax: "touch [filename]",
    example: "touch script.js",
    commands: { linux: "touch", mac: "touch", windows: "type nul > [filename]" },
    related: ["cat", "rm", "mkdir"],
    importance: 6
  },
  {
    name: "cp",
    category: "File Management",
    description: "Copy files and directories.",
    syntax: "cp [source] [destination]",
    example: "cp config.json backup/",
    commands: { linux: "cp", mac: "cp", windows: "copy" },
    related: ["mv", "rm", "scp"],
    importance: 7
  },
  {
    name: "mv",
    category: "File Management",
    description: "Move or rename files and directories.",
    syntax: "mv [source] [destination]",
    example: "mv data.csv archive/",
    commands: { linux: "mv", mac: "mv", windows: "move" },
    related: ["cp", "rm"],
    importance: 7
  },

  // --- File Viewing ---
  {
    name: "cat",
    category: "File Viewing",
    description: "Concatenate and display file content.",
    syntax: "cat [file]",
    example: "cat log.txt",
    commands: { linux: "cat", mac: "cat", windows: "type" },
    related: ["less", "head", "tail", "grep"],
    importance: 7
  },
  {
    name: "less",
    category: "File Viewing",
    description: "View file content with pagination and search.",
    syntax: "less [file]",
    example: "less large_file.log",
    commands: { linux: "less", mac: "less", windows: "more" },
    related: ["cat", "head", "tail"],
    importance: 6
  },
  {
    name: "head",
    category: "File Viewing",
    description: "Output the first part of files.",
    syntax: "head -n [number] [file]",
    example: "head -n 10 main.py",
    commands: { linux: "head", mac: "head", windows: "gc [file] -head [n]" },
    related: ["tail", "cat", "less"],
    importance: 5
  },
  {
    name: "tail",
    category: "File Viewing",
    description: "Output the last part of files.",
    syntax: "tail -n [number] [file]",
    example: "tail -f server.log",
    commands: { linux: "tail", mac: "tail", windows: "gc [file] -tail [n]" },
    related: ["head", "cat", "less"],
    importance: 5
  },

  // --- Searching ---
  {
    name: "grep",
    category: "Searching",
    description: "Search for patterns in files.",
    syntax: "grep [options] [pattern] [file]",
    example: "grep 'error' access.log",
    commands: { linux: "grep", mac: "grep", windows: "findstr" },
    related: ["find", "locate", "cat"],
    importance: 9
  },
  {
    name: "find",
    category: "Searching",
    description: "Search for files in a directory hierarchy.",
    syntax: "find [path] -name [filename]",
    example: "find . -name '*.js'",
    commands: { linux: "find", mac: "find", windows: "where /r" },
    related: ["grep", "locate", "ls"],
    importance: 8
  },
  {
    name: "locate",
    category: "Searching",
    description: "Find files by name using a pre-built database.",
    syntax: "locate [filename]",
    example: "locate config.yaml",
    commands: { linux: "locate", mac: "mdfind -name", windows: "everything (cli)" },
    related: ["find", "grep"],
    importance: 6
  },

  // --- Permissions ---
  {
    name: "chmod",
    category: "Permissions",
    description: "Change file mode bits (permissions).",
    syntax: "chmod [mode] [file]",
    example: "chmod +x script.sh",
    commands: { linux: "chmod", mac: "chmod", windows: "icacls" },
    related: ["chown", "ls"],
    importance: 7
  },
  {
    name: "chown",
    category: "Permissions",
    description: "Change file owner and group.",
    syntax: "chown [owner]:[group] [file]",
    example: "chown root:root secret.txt",
    commands: { linux: "chown", mac: "chown", windows: "takeown" },
    related: ["chmod", "ls"],
    importance: 6
  },

  // --- System Information ---
  {
    name: "uname",
    category: "System Information",
    description: "Print system information.",
    syntax: "uname [options]",
    example: "uname -a",
    commands: { linux: "uname", mac: "uname", windows: "systeminfo" },
    related: ["hostname", "uptime"],
    importance: 5
  },
  {
    name: "hostname",
    category: "System Information",
    description: "Show or set the system's host name.",
    syntax: "hostname",
    example: "hostname",
    commands: { linux: "hostname", mac: "hostname", windows: "hostname" },
    related: ["uname", "whoami"],
    importance: 5
  },
  {
    name: "whoami",
    category: "System Information",
    description: "Print the effective user ID.",
    syntax: "whoami",
    example: "whoami",
    commands: { linux: "whoami", mac: "whoami", windows: "whoami" },
    related: ["hostname", "id"],
    importance: 5
  },
  {
    name: "uptime",
    category: "System Information",
    description: "Tell how long the system has been running.",
    syntax: "uptime",
    example: "uptime",
    commands: { linux: "uptime", mac: "uptime", windows: "net statistics workstation" },
    related: ["uname", "top"],
    importance: 5
  },

  // --- Disk Usage ---
  {
    name: "df",
    category: "Disk Usage",
    description: "Report file system disk space usage.",
    syntax: "df -h",
    example: "df -h",
    commands: { linux: "df", mac: "df", windows: "wmic logicaldisk get size,freespace,caption" },
    related: ["du", "lsblk"],
    importance: 6
  },
  {
    name: "du",
    category: "Disk Usage",
    description: "Estimate file space usage.",
    syntax: "du -sh [path]",
    example: "du -sh /var/log",
    commands: { linux: "du", mac: "du", windows: "dir /s" },
    related: ["df", "ls"],
    importance: 6
  },

  // --- Process Management ---
  {
    name: "ps",
    category: "Process Management",
    description: "Report a snapshot of current processes.",
    syntax: "ps [options]",
    example: "ps aux | grep node",
    commands: { linux: "ps aux", mac: "ps aux", windows: "tasklist" },
    related: ["top", "kill", "pkill"],
    importance: 7
  },
  {
    name: "top",
    category: "Process Management",
    description: "Display Linux processes dynamically.",
    syntax: "top",
    example: "top",
    commands: { linux: "top", mac: "top", windows: "taskmgr" },
    related: ["ps", "htop", "kill"],
    importance: 6
  },
  {
    name: "kill",
    category: "Process Management",
    description: "Send a signal to a process (usually to stop it).",
    syntax: "kill [pid]",
    example: "kill 1234",
    commands: { linux: "kill", mac: "kill", windows: "taskkill /f /pid" },
    related: ["pkill", "ps", "top"],
    importance: 7
  },
  {
    name: "pkill",
    category: "Process Management",
    description: "Look up or signal processes based on name.",
    syntax: "pkill [process_name]",
    example: "pkill node",
    commands: { linux: "pkill", mac: "pkill", windows: "taskkill /f /im" },
    related: ["kill", "ps"],
    importance: 6
  },

  // --- Networking ---
  {
    name: "ping",
    category: "Networking",
    description: "Send ICMP ECHO_REQUEST to network hosts.",
    syntax: "ping [host]",
    example: "ping google.com",
    commands: { linux: "ping", mac: "ping", windows: "ping" },
    related: ["curl", "ssh", "netstat"],
    importance: 8
  },
  {
    name: "curl",
    category: "Networking",
    description: "Transfer data from or to a server.",
    syntax: "curl [options] [url]",
    example: "curl -I https://example.com",
    commands: { linux: "curl", mac: "curl", windows: "curl" },
    related: ["wget", "ping", "ssh"],
    importance: 9
  },
  {
    name: "wget",
    category: "Networking",
    description: "The non-interactive network downloader.",
    syntax: "wget [url]",
    example: "wget https://example.com/file.zip",
    commands: { linux: "wget", mac: "wget", windows: "curl -O" },
    related: ["curl", "scp"],
    importance: 7
  },
  {
    name: "ssh",
    category: "Networking",
    description: "OpenSSH SSH client (remote login program).",
    syntax: "ssh [user]@[host]",
    example: "ssh dev@server.com",
    commands: { linux: "ssh", mac: "ssh", windows: "ssh" },
    related: ["scp", "ping", "curl"],
    importance: 9
  },
  {
    name: "scp",
    category: "Networking",
    description: "Secure copy (remote file copy program).",
    syntax: "scp [source] [destination]",
    example: "scp local.txt user@remote:/path",
    commands: { linux: "scp", mac: "scp", windows: "scp" },
    related: ["ssh", "cp", "rsync"],
    importance: 8
  },
  {
    name: "netstat",
    category: "Networking",
    description: "Print network connections, routing tables, and more.",
    syntax: "netstat [options]",
    example: "netstat -tuln",
    commands: { linux: "netstat", mac: "netstat", windows: "netstat" },
    related: ["ping", "ps"],
    importance: 6
  },

  // --- Compression ---
  {
    name: "tar",
    category: "Compression",
    description: "Archiving utility.",
    syntax: "tar [options] [file]",
    example: "tar -cvzf archive.tar.gz folder/",
    commands: { linux: "tar", mac: "tar", windows: "tar" },
    related: ["gzip", "zip", "unzip"],
    importance: 7
  },
  {
    name: "zip",
    category: "Compression",
    description: "Package and compress (archive) files.",
    syntax: "zip [options] [archive] [files]",
    example: "zip -r archive.zip folder/",
    commands: { linux: "zip", mac: "zip", windows: "Compress-Archive" },
    related: ["unzip", "tar"],
    importance: 6
  },
  {
    name: "unzip",
    category: "Compression",
    description: "List, test and extract compressed files in a ZIP archive.",
    syntax: "unzip [file]",
    example: "unzip archive.zip",
    commands: { linux: "unzip", mac: "unzip", windows: "Expand-Archive" },
    related: ["zip", "tar"],
    importance: 6
  },
  {
    name: "gzip",
    category: "Compression",
    description: "Compress or expand files.",
    syntax: "gzip [file]",
    example: "gzip large_file.txt",
    commands: { linux: "gzip", mac: "gzip", windows: "gzip" },
    related: ["tar", "zip"],
    importance: 6
  },

  // --- Package Managers ---
  {
    name: "apt",
    category: "Package Managers",
    description: "Command-line interface for package management (Debian/Ubuntu).",
    syntax: "sudo apt install [package]",
    example: "sudo apt update",
    commands: { linux: "apt", mac: "brew", windows: "winget" },
    related: ["yum", "pacman", "brew", "winget"],
    importance: 8
  },
  {
    name: "yum",
    category: "Package Managers",
    description: "Yellowdog Updater Modified package manager (RHEL/CentOS).",
    syntax: "sudo yum install [package]",
    example: "sudo yum update",
    commands: { linux: "yum", mac: "brew", windows: "winget" },
    related: ["apt", "pacman", "brew", "winget"],
    importance: 7
  },
  {
    name: "pacman",
    category: "Package Managers",
    description: "Arch Linux package manager utility.",
    syntax: "sudo pacman -S [package]",
    example: "sudo pacman -Syu",
    commands: { linux: "pacman", mac: "brew", windows: "winget" },
    related: ["apt", "yum", "brew", "winget"],
    importance: 7
  },
  {
    name: "brew",
    category: "Package Managers",
    description: "The missing package manager for macOS (and Linux).",
    syntax: "brew install [package]",
    example: "brew install git",
    commands: { linux: "apt", mac: "brew", windows: "winget" },
    related: ["apt", "winget", "choco"],
    importance: 8
  },
  {
    name: "winget",
    category: "Package Managers",
    description: "Windows Package Manager client.",
    syntax: "winget install [package]",
    example: "winget install Microsoft.VisualStudioCode",
    commands: { linux: "apt", mac: "brew", windows: "winget" },
    related: ["choco", "brew", "apt"],
    importance: 7
  },
  {
    name: "choco",
    category: "Package Managers",
    description: "The package manager for Windows.",
    syntax: "choco install [package]",
    example: "choco install nodejs",
    commands: { linux: "apt", mac: "brew", windows: "choco" },
    related: ["winget", "brew", "apt"],
    importance: 7
  },

  // --- Git Commands ---
  {
    name: "git clone",
    category: "Git",
    description: "Clone a repository into a new directory.",
    syntax: "git clone [url]",
    example: "git clone https://github.com/user/repo.git",
    commands: { linux: "git clone", mac: "git clone", windows: "git clone" },
    related: ["git status", "git pull", "git add"],
    importance: 10
  },
  {
    name: "git status",
    category: "Git",
    description: "Show the working tree status.",
    syntax: "git status",
    example: "git status",
    commands: { linux: "git status", mac: "git status", windows: "git status" },
    related: ["git add", "git commit", "git clone"],
    importance: 10
  },
  {
    name: "git add",
    category: "Git",
    description: "Add file contents to the index.",
    syntax: "git add [file]",
    example: "git add .",
    commands: { linux: "git add", mac: "git add", windows: "git add" },
    related: ["git commit", "git status", "git reset"],
    importance: 10
  },
  {
    name: "git commit",
    category: "Git",
    description: "Record changes to the repository.",
    syntax: "git commit -m '[message]'",
    example: "git commit -m 'Initial commit'",
    commands: { linux: "git commit", mac: "git commit", windows: "git commit" },
    related: ["git add", "git push", "git status"],
    importance: 10
  },
  {
    name: "git push",
    category: "Git",
    description: "Update remote refs along with associated objects.",
    syntax: "git push [remote] [branch]",
    example: "git push origin main",
    commands: { linux: "git push", mac: "git push", windows: "git push" },
    related: ["git pull", "git commit", "git remote"],
    importance: 10
  },
  {
    name: "git pull",
    category: "Git",
    description: "Fetch from and integrate with another repository or a local branch.",
    syntax: "git pull [remote] [branch]",
    example: "git pull origin main",
    commands: { linux: "git pull", mac: "git pull", windows: "git pull" },
    related: ["git push", "git fetch", "git merge"],
    importance: 9
  },
  {
    name: "git branch",
    category: "Git",
    description: "List, create, or delete branches.",
    syntax: "git branch [branch_name]",
    example: "git branch feature-x",
    commands: { linux: "git branch", mac: "git branch", windows: "git branch" },
    related: ["git checkout", "git merge"],
    importance: 8
  },
  {
    name: "git checkout",
    category: "Git",
    description: "Switch branches or restore working tree files.",
    syntax: "git checkout [branch_name]",
    example: "git checkout main",
    commands: { linux: "git checkout", mac: "git checkout", windows: "git checkout" },
    related: ["git branch", "git switch", "git merge"],
    importance: 9
  },
  {
    name: "git merge",
    category: "Git",
    description: "Join two or more development histories together.",
    syntax: "git merge [branch]",
    example: "git merge feature-x",
    commands: { linux: "git merge", mac: "git merge", windows: "git merge" },
    related: ["git pull", "git branch", "git checkout"],
    importance: 8
  },

  // --- Security & Hardening ---
  {
    name: "sudo",
    category: "Security & Hardening",
    description: "Execute a command with superuser privileges.",
    syntax: "sudo [command]",
    example: "sudo apt update",
    commands: { linux: "sudo", mac: "sudo", windows: "runas" },
    related: ["passwd", "chown", "chmod"],
    importance: 10
  },
  {
    name: "ufw",
    category: "Security & Hardening",
    description: "Uncomplicated Firewall - interface for managing a netfilter firewall.",
    syntax: "sudo ufw [enable|disable|allow|deny]",
    example: "sudo ufw allow 80/tcp",
    commands: { linux: "ufw", mac: "pfctl", windows: "netsh advfirewall" },
    related: ["iptables", "netstat"],
    importance: 8
  },
  {
    name: "iptables",
    category: "Security & Hardening",
    description: "Administration tool for IPv4 packet filtering and NAT.",
    syntax: "sudo iptables -L",
    example: "sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT",
    commands: { linux: "iptables", mac: "pfctl", windows: "netsh advfirewall" },
    related: ["ufw", "nmap"],
    importance: 7
  },
  {
    name: "fail2ban",
    category: "Security & Hardening",
    description: "Bans IPs that show the malicious signs -- too many password failures, etc.",
    syntax: "sudo fail2ban-client status",
    example: "sudo fail2ban-client set sshd unbanip 1.2.3.4",
    commands: { linux: "fail2ban-client", mac: "fail2ban-client", windows: "N/A" },
    related: ["ssh", "iptables", "ufw"],
    importance: 6
  },
  {
    name: "openssl",
    category: "Security & Hardening",
    description: "Toolkit for Transport Layer Security (TLS) and Secure Sockets Layer (SSL).",
    syntax: "openssl [command] [options]",
    example: "openssl genrsa -out key.pem 2048",
    commands: { linux: "openssl", mac: "openssl", windows: "openssl" },
    related: ["ssh", "scp"],
    importance: 8
  },
  {
    name: "nmap",
    category: "Security & Hardening",
    description: "Network exploration tool and security / port scanner.",
    syntax: "nmap [scan type] [options] {target specification}",
    example: "nmap -sV 192.168.1.1",
    commands: { linux: "nmap", mac: "nmap", windows: "nmap" },
    related: ["ping", "netstat", "ufw"],
    importance: 9
  },
  {
    name: "passwd",
    category: "Security & Hardening",
    description: "Change user password.",
    syntax: "passwd [user]",
    example: "sudo passwd root",
    commands: { linux: "passwd", mac: "passwd", windows: "net user" },
    related: ["sudo", "whoami"],
    importance: 7
  },
  {
    name: "last",
    category: "Security & Hardening",
    description: "Show a listing of last logged in users.",
    syntax: "last [options]",
    example: "last -n 10",
    commands: { linux: "last", mac: "last", windows: "quser" },
    related: ["whoami", "uptime"],
    importance: 5
  }
];

export { commandDatabase };
