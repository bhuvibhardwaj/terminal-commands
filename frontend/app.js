import { CommandExplorer } from './explorer.js';
import { TerminalSimulator } from './terminal.js';
import { QuizSystem } from './quiz.js';
import { documentation } from './documentation.js';

// DOM Elements
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const graphSearch = document.getElementById('graph-search');
const osFilters = document.querySelectorAll('.os-filter');
const showCrossPlatform = document.getElementById('show-cross-platform');
const runInTerminalBtn = document.getElementById('run-in-terminal-btn');
const shellSelector = document.getElementById('shell-selector');

// Initialize Components
const explorer = new CommandExplorer('graph-container', 'details-panel');
const terminal = new TerminalSimulator('terminal-output', 'terminal-input', 'terminal-suggestion');
const quiz = new QuizSystem(
    'quiz-question', 
    'quiz-options', 
    'current-score', 
    'quiz-result', 
    'final-score', 
    'restart-quiz-btn',
    'current-q-index'
);

// --- Navigation ---
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetSection = btn.getAttribute('data-section');
        
        // Update Nav UI
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update Sections
        sections.forEach(s => {
            s.classList.remove('active');
            if (s.id === targetSection) s.classList.add('active');
        });

        // Special handling for section switches
        if (targetSection === 'explorer') {
            explorer.init();
        } else if (targetSection === 'documentation') {
            documentation.init();
        } else if (targetSection === 'terminal') {
            setTimeout(() => terminal.input.focus(), 100);
        } else if (targetSection === 'quiz') {
            quiz.start();
        }
    });
});

// --- Terminal Events ---
shellSelector.addEventListener('change', (e) => {
    terminal.setShell(e.target.value);
});

// --- Explorer Events ---
graphSearch.addEventListener('input', (e) => {
    explorer.search(e.target.value);
});

function getFilters() {
    const os = Array.from(osFilters).filter(f => f.checked).map(f => f.value);
    const cross = showCrossPlatform.checked;
    return { os, showCrossPlatform: cross };
}

osFilters.forEach(f => {
    f.addEventListener('change', () => {
        explorer.update(getFilters());
    });
});

showCrossPlatform.addEventListener('change', () => {
    explorer.update(getFilters());
});

runInTerminalBtn.addEventListener('click', () => {
    if (!explorer.selectedNode) return;
    const profile = terminal.shellProfiles[terminal.currentShell];
    const cmd = explorer.selectedNode.data.commands[profile.cmdKey] || explorer.selectedNode.data.name;
    
    // Switch to terminal tab
    document.querySelector('[data-section="terminal"]').click();
    
    // Execute command
    terminal.execute(cmd);
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    explorer.init();
});
