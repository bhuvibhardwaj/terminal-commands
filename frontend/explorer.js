import { commandDatabase } from './commandDatabase.js';

export class CommandExplorer {
    constructor(containerId, detailsPanelId) {
        this.container = document.getElementById(containerId);
        this.detailsPanel = document.getElementById(detailsPanelId);
        this.detailsContent = this.detailsPanel.querySelector('.details-content');
        this.emptyState = this.detailsPanel.querySelector('.empty-state');
        
        this.simulation = null;
        this.svg = null;
        this.g = null;
        this.link = null;
        this.node = null;
        this.selectedNode = null;

        this.onCommandSelected = null;
    }

    init() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.container.innerHTML = '';

        this.svg = d3.select(`#${this.container.id}`)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .call(d3.zoom().on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            }));

        this.g = this.svg.append('g');

        this.update();

        new ResizeObserver(() => {
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            if (this.simulation) {
                this.simulation.force('center', d3.forceCenter(w / 2, h / 2)).alpha(0.3).restart();
            }
        }).observe(this.container);
    }

    update(filters = { os: ['linux', 'macos', 'windows'], showCrossPlatform: true }) {
        const data = this.transformData(filters);
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        if (this.simulation) this.simulation.stop();

        this.simulation = d3.forceSimulation(data.nodes)
            .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => (d.size || 5) + 20));

        this.g.selectAll('.links').remove();
        this.g.selectAll('.nodes').remove();

        this.link = this.g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(data.links)
            .enter().append('line')
            .attr('class', d => `link ${d.type}`)
            .attr('stroke-width', d => {
                if (d.type === 'os-cat') return 2;
                if (d.type === 'cat-cmd') return 1;
                return 0.5; // related links
            })
            .attr('stroke-dasharray', d => d.type === 'related' ? '5,5' : 'none');

        this.node = this.g.append('g')
            .attr('class', 'nodes')
            .selectAll('.node')
            .data(data.nodes)
            .enter().append('g')
            .attr('class', 'node')
            .call(this.drag(this.simulation))
            .on('click', (event, d) => this.handleNodeClick(d))
            .on('mouseover', (event, d) => this.handleNodeHover(d))
            .on('mouseout', () => this.handleNodeUnhover());

        this.node.append('circle')
            .attr('r', d => d.size || 8)
            .attr('fill', d => {
                if (d.type === 'command') {
                    if (d.data.category === 'Security & Hardening') return 'var(--graph-red)';
                    return 'var(--node-command)';
                }
                if (d.type === 'category') {
                    if (d.label === 'Security & Hardening') return 'var(--graph-red)';
                    return 'var(--node-category)';
                }
                return 'var(--node-os)';
            })
            .style('filter', d => {
                let color = d.type === 'command' ? 'var(--node-command)' : d.type === 'category' ? 'var(--node-category)' : 'var(--node-os)';
                if (d.data?.category === 'Security & Hardening' || d.label === 'Security & Hardening') color = 'var(--graph-red)';
                return `drop-shadow(0 0 3px ${color})`;
            });

        this.node.append('text')
            .attr('dx', 12)
            .attr('dy', '.35em')
            .text(d => d.label);

        this.simulation.on('tick', () => {
            this.link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            this.node.attr('transform', d => `translate(${d.x},${d.y})`);
        });
    }

    transformData(filters) {
        const nodes = [];
        const links = [];
        const categories = new Set();
        const oss = ['linux', 'macos', 'windows'];
        
        // Map filter keys to database keys
        const osKeyMap = {
            linux: 'linux',
            macos: 'mac',
            windows: 'windows'
        };

        // 1. Add OS Core Nodes
        filters.os.forEach(os => {
            nodes.push({ 
                id: os, 
                label: os.charAt(0).toUpperCase() + os.slice(1), 
                type: 'os', 
                size: 20 
            });
        });

        // 2. Add Category Nodes and Link to OS
        commandDatabase.forEach(cmd => {
            if (!categories.has(cmd.category)) {
                categories.add(cmd.category);
                nodes.push({ 
                    id: `cat_${cmd.category}`, 
                    label: cmd.category, 
                    type: 'category', 
                    size: 15 
                });

                // Link category to relevant OS nodes
                oss.forEach(os => {
                    if (filters.os.includes(os)) {
                        links.push({ 
                            source: os, 
                            target: `cat_${cmd.category}`, 
                            type: 'os-cat' 
                        });
                    }
                });
            }

            // 3. Add Command Nodes
            // Check if any of the enabled filters match the command's available platforms
            const hasEnabledOs = filters.os.some(os => cmd.commands[osKeyMap[os]]);
            if (!hasEnabledOs) return;

            nodes.push({ 
                id: cmd.name, 
                label: cmd.name, 
                type: 'command', 
                size: 10 + (cmd.importance || 0),
                data: cmd 
            });

            // Link command to its category
            links.push({ 
                source: `cat_${cmd.category}`, 
                target: cmd.name, 
                type: 'cat-cmd' 
            });

            // 4. Add Related Command Links (Cross-Platform Links)
            if (filters.showCrossPlatform && cmd.related) {
                cmd.related.forEach(relatedName => {
                    // Only link if the related command exists in our database
                    const relatedCmd = commandDatabase.find(c => c.name === relatedName);
                    if (relatedCmd) {
                        links.push({ 
                            source: cmd.name, 
                            target: relatedName, 
                            type: 'related' 
                        });
                    }
                });
            }
        });

        return { nodes, links };
    }

    drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }

    handleNodeClick(d) {
        if (d.type !== 'command') return;
        
        this.selectedNode = d;
        this.emptyState.classList.add('hidden');
        this.detailsContent.classList.remove('hidden');
        this.detailsPanel.classList.remove('empty');

        document.getElementById('detail-category').textContent = d.data.category;
        document.getElementById('detail-title').textContent = d.name;
        document.getElementById('detail-description').textContent = d.data.description;
        document.getElementById('detail-syntax').textContent = d.data.syntax;
        document.getElementById('detail-example').textContent = d.data.example;

        const equivs = document.getElementById('detail-equivalents');
        equivs.innerHTML = `
            <div class="equiv-item"><span class="equiv-os">Linux</span> <span class="equiv-cmd">${d.data.commands.linux}</span></div>
            <div class="equiv-item"><span class="equiv-os">macOS</span> <span class="equiv-cmd">${d.data.commands.mac}</span></div>
            <div class="equiv-item"><span class="equiv-os">Windows</span> <span class="equiv-cmd">${d.data.commands.windows}</span></div>
        `;

        if (this.onCommandSelected) this.onCommandSelected(d.data);
    }

    handleNodeHover(d) {
        if (d.type === 'command') {
            this.showTooltip(d);
        }

        const connectedNodeIds = new Set();
        connectedNodeIds.add(d.id);

        this.link.classed('highlighted', l => {
            const isConnected = l.source.id === d.id || l.target.id === d.id;
            if (isConnected) {
                connectedNodeIds.add(l.source.id);
                connectedNodeIds.add(l.target.id);
            }
            return isConnected;
        });

        this.node.classed('highlighted', n => connectedNodeIds.has(n.id));
        this.node.classed('dimmed', n => !connectedNodeIds.has(n.id));
    }

    handleNodeUnhover() {
        this.hideTooltip();
        this.link.classed('highlighted', false);
        this.node.classed('highlighted', false);
        this.node.classed('dimmed', false);
    }

    showTooltip(d) {
        let tooltip = d3.select('#graph-tooltip');
        if (tooltip.empty()) {
            tooltip = d3.select('body').append('div')
                .attr('id', 'graph-tooltip')
                .attr('class', 'graph-tooltip');
        }

        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`
            <div class="tooltip-title">${d.label}</div>
            <div class="tooltip-desc">${d.data.description}</div>
        `)
        .style('left', (event.pageX + 15) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    }

    hideTooltip() {
        d3.select('#graph-tooltip').transition().duration(500).style('opacity', 0);
    }

    search(term) {
        if (!term) {
            this.handleNodeUnhover();
            return;
        }
        const lowerTerm = term.toLowerCase();
        this.node.classed('highlighted', n => n.label.toLowerCase().includes(lowerTerm));
        this.node.classed('dimmed', n => !n.label.toLowerCase().includes(lowerTerm));
    }
}
