import { commandDatabase } from './commandDatabase.js';

class Documentation {
    constructor() {
        this.container = null;
        this.tabBtns = null;
        this.currentOS = 'linux';
        this.initialized = false;
        this.osKeyMap = {
            linux: 'linux',
            macos: 'mac',
            windows: 'windows'
        };
    }

    init() {
        if (!this.initialized) {
            this.container = document.getElementById('doc-content');
            this.tabBtns = document.querySelectorAll('.doc-tab-btn');
            
            this.tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.currentOS = btn.dataset.os;
                    this.render();
                });
            });
            this.initialized = true;
        }

        this.render();
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = '';
        
        // Group commands by category for better organization
        const categories = [...new Set(commandDatabase.map(cmd => cmd.category))];
        
        categories.forEach(category => {
            const categoryCommands = commandDatabase.filter(cmd => cmd.category === category);
            
            if (categoryCommands.length > 0) {
                const categorySection = document.createElement('div');
                categorySection.className = 'doc-category-section';
                
                const categoryTitle = document.createElement('h3');
                categoryTitle.className = 'doc-category-title';
                categoryTitle.textContent = category;
                categorySection.appendChild(categoryTitle);
                
                const commandGrid = document.createElement('div');
                commandGrid.className = 'doc-command-grid';
                
                categoryCommands.forEach(cmd => {
                    const dbOSKey = this.osKeyMap[this.currentOS];
                    const osCommand = cmd.commands[dbOSKey] || cmd.name;
                    
                    const cmdCard = document.createElement('div');
                    cmdCard.className = 'doc-command-card';
                    
                    cmdCard.innerHTML = `
                        <div class="doc-cmd-header">
                            <span class="doc-cmd-name">${osCommand}</span>
                            ${cmd.name !== osCommand ? `<span class="doc-cmd-alias">(Generic: ${cmd.name})</span>` : ''}
                        </div>
                        <div class="doc-cmd-body">
                            <p class="doc-cmd-desc">${cmd.description}</p>
                            <div class="doc-cmd-info">
                                <div class="doc-info-item">
                                    <span class="doc-info-label">Syntax:</span>
                                    <code class="doc-info-code">${cmd.syntax}</code>
                                </div>
                                <div class="doc-info-item">
                                    <span class="doc-info-label">Example:</span>
                                    <code class="doc-info-code">${cmd.example}</code>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    commandGrid.appendChild(cmdCard);
                });
                
                categorySection.appendChild(commandGrid);
                this.container.appendChild(categorySection);
            }
        });
    }
}

export const documentation = new Documentation();
