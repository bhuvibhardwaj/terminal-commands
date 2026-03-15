import { commandDatabase } from './commandDatabase.js';

export class TerminalSimulator {
    constructor(outputId, inputId, suggestionId) {
        this.output = document.getElementById(outputId);
        this.input = document.getElementById(inputId);
        this.suggestion = document.getElementById(suggestionId);
        this.currentPath = '/home/user';
        this.history = [];
        this.historyIndex = -1;
        this.currentShell = 'linux'; // default
        this.isWaitingForPassword = false;
        this.pendingCommand = null;

        this.shellProfiles = {
            linux: {
                prompt: 'user@simulator:~$',
                name: 'bash',
                path: '/home/user',
                cmdKey: 'linux'
            },
            macos: {
                prompt: 'user@macbook:~ %',
                name: 'zsh',
                path: '/Users/user',
                cmdKey: 'mac'
            },
            powershell: {
                prompt: 'PS C:\\Users\\user>',
                name: 'powershell',
                path: 'C:\\Users\\user',
                cmdKey: 'windows'
            },
            cmd: {
                prompt: 'C:\\Users\\user>',
                name: 'cmd',
                path: 'C:\\Users\\user',
                cmdKey: 'windows'
            }
        };

        this.fs = {
            '/': { type: 'dir', children: ['home', 'bin', 'etc'] },
            '/home': { type: 'dir', children: ['user'] },
            '/home/user': { type: 'dir', children: ['documents', 'projects', 'notes.txt'] },
            '/home/user/documents': { type: 'dir', children: ['resume.pdf', 'budget.xlsx'] },
            '/home/user/projects': { type: 'dir', children: ['webapp', 'scripts'] },
            '/home/user/notes.txt': { type: 'file', content: 'Learning terminal commands is fun!' },
            '/Users': { type: 'dir', children: ['user'] },
            '/Users/user': { type: 'dir', children: ['Documents', 'Desktop'] },
            'C:': { type: 'dir', children: ['Users', 'Windows', 'Program Files'] },
            'C:\\Users': { type: 'dir', children: ['user'] },
            'C:\\Users\\user': { type: 'dir', children: ['Documents', 'Downloads'] }
        };

        this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.input.addEventListener('input', () => this.handleInput());
    }

    setShell(shellType) {
        if (this.shellProfiles[shellType]) {
            this.currentShell = shellType;
            const profile = this.shellProfiles[shellType];
            this.currentPath = profile.path;
            
            // Update UI prompt
            const promptElem = document.querySelector('.terminal-prompt');
            if (promptElem) promptElem.textContent = profile.prompt;
            
            // Update Tab title
            const tabTitle = document.getElementById('terminal-tab-title');
            if (tabTitle) tabTitle.innerHTML = `<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg> ${profile.name} — simulator`;

            this.addToTerminal(`Switched to ${profile.name} simulation.`, 'info');
        }
    }

    addToTerminal(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }

    handleInput() {
        const value = this.input.value;
        if (!value) {
            this.suggestion.textContent = '';
            return;
        }

        const profile = this.shellProfiles[this.currentShell];
        const match = commandDatabase.find(c => c.name.startsWith(value) || c.commands[profile.cmdKey].startsWith(value));
        if (match) {
            const suggestionText = match.name.startsWith(value) ? match.name : match.commands[profile.cmdKey];
            this.suggestion.textContent = value + suggestionText.slice(value.length);
        } else {
            this.suggestion.textContent = '';
        }
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            const cmd = this.input.value.trim();
            this.suggestion.textContent = '';
            
            if (this.isWaitingForPassword) {
                // Mock password check
                this.isWaitingForPassword = false;
                this.addToTerminal('[sudo] password for user: **********', 'command-entered');
                this.execute(this.pendingCommand, true);
                this.pendingCommand = null;
                this.input.value = '';
                return;
            }

            if (cmd) {
                this.history.push(cmd);
                this.historyIndex = this.history.length;
                this.execute(cmd);
            }
            this.input.value = '';
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const value = this.input.value;
            const profile = this.shellProfiles[this.currentShell];
            const match = commandDatabase.find(c => c.name.startsWith(value) || c.commands[profile.cmdKey].startsWith(value));
            if (match) {
                this.input.value = match.name.startsWith(value) ? match.name : match.commands[profile.cmdKey];
                this.suggestion.textContent = '';
            }
        } else if (e.key === 'ArrowUp') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
                this.handleInput();
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
                this.handleInput();
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
                this.suggestion.textContent = '';
            }
            e.preventDefault();
        }
    }

    execute(input, sudoAuthenticated = false) {
        const profile = this.shellProfiles[this.currentShell];
        if (!sudoAuthenticated) {
            this.addToTerminal(`${profile.prompt} ${input}`, 'command-entered');
        }
        
        const parts = input.split(' ');
        const commandName = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Handle sudo simulation
        if (commandName === 'sudo' && !sudoAuthenticated) {
            if (args.length === 0) {
                this.addToTerminal('usage: sudo [command]', 'error');
                return;
            }
            this.isWaitingForPassword = true;
            this.pendingCommand = args.join(' ');
            this.addToTerminal('[sudo] password for user: ', 'info');
            return;
        }

        if (commandName === 'help' && args.length > 0) {
            this.showHelp(args[0]);
            return;
        }

        switch (commandName) {
            case 'help':
                this.addToTerminal('Terminal Command Ecosystem Simulator v1.0.0');
                this.addToTerminal('Available categories: ' + [...new Set(commandDatabase.map(c => c.category))].join(', '));
                this.addToTerminal("Type 'help <command>' for detailed information about a specific command.");
                this.addToTerminal("Common commands: ls, cd, pwd, clear, whoami, git status, ping, etc.");
                break;
            case 'clear':
            case 'cls':
                this.output.innerHTML = '';
                break;
            case 'pwd':
                this.addToTerminal(this.currentPath);
                break;
            case 'ls':
            case 'dir':
                const currentDir = this.fs[this.currentPath] || this.fs['/home/user'];
                if (currentDir && currentDir.type === 'dir') {
                    this.addToTerminal(currentDir.children.join('  '));
                }
                break;
            case 'whoami':
                this.addToTerminal('user');
                break;
            case 'cd':
                this.handleCd(args[0]);
                break;
            default:
                // Find if command exists in database for the current shell's key
                const cmdData = commandDatabase.find(c => 
                    c.name === commandName || 
                    c.commands.linux === commandName || 
                    c.commands.mac === commandName || 
                    c.commands.windows === commandName ||
                    (parts.length > 1 && `${parts[0]} ${parts[1]}` === c.name) // Handle git clone etc
                );

                if (cmdData) {
                    this.simulateCommandOutput(cmdData, parts);
                } else {
                    this.addToTerminal(`${commandName}: command not found`, 'error');
                }
        }
    }

    simulateCommandOutput(cmdData, parts) {
        const profile = this.shellProfiles[this.currentShell];
        const cmdName = parts[0];
        
        this.addToTerminal(`${cmdName} — ${cmdData.description}`, 'info');
        this.addToTerminal(`Syntax: ${cmdData.syntax}`);
        this.addToTerminal(`Example: ${cmdData.example}`);
        
        // Add some simulated flavor text
        if (cmdData.category === 'Git') {
            this.addToTerminal('On branch main. Your branch is up to date with \'origin/main\'.');
        } else if (cmdData.category === 'Networking') {
            if (cmdName === 'ping') {
                this.addToTerminal(`PING ${parts[1] || 'google.com'} (142.250.190.46): 56 data bytes`);
                this.addToTerminal(`64 bytes from 142.250.190.46: icmp_seq=0 ttl=117 time=14.2 ms`);
            } else if (cmdName === 'curl') {
                this.addToTerminal(`HTTP/1.1 200 OK`);
                this.addToTerminal(`Content-Type: text/html; charset=UTF-8`);
                this.addToTerminal(`<!doctype html><html>...</html>`);
            }
        }
    }

    handleCd(target) {
        if (!target || target === '~') {
            this.currentPath = '/home/user';
        } else if (target === '..') {
            if (this.currentPath !== '/') {
                const parts = this.currentPath.split('/');
                parts.pop();
                this.currentPath = parts.join('/') || '/';
            }
        } else {
            let newPath = target.startsWith('/') ? target : `${this.currentPath}/${target}`.replace(/\/+/g, '/');
            if (this.fs[newPath] && this.fs[newPath].type === 'dir') {
                this.currentPath = newPath;
            } else {
                this.addToTerminal(`cd: no such directory: ${target}`, 'error');
            }
        }
    }

    showHelp(cmdName) {
        const cmd = commandDatabase.find(c => 
            c.name === cmdName || 
            c.commands.linux === cmdName || 
            c.commands.mac === cmdName || 
            c.commands.windows === cmdName
        );

        if (cmd) {
            this.addToTerminal(`--- Help: ${cmd.name} ---`, 'info');
            this.addToTerminal(`${cmd.name} — ${cmd.description}`);
            this.addToTerminal(`Syntax: ${cmd.syntax}`);
            this.addToTerminal(`Example: ${cmd.example}`);
            this.addToTerminal(`Related: ${cmd.related.join(', ')}`);
        } else {
            this.addToTerminal(`No help entry found for: ${cmdName}`, 'error');
        }
    }
}
