// ===== STATE MANAGEMENT =====
const APP_STATE = {
    currentStep: 1,
    steps: {
        1: { completed: false, artifact: null, name: 'Problem', route: '/rb/01-problem' },
        2: { completed: false, artifact: null, name: 'Market', route: '/rb/02-market' },
        3: { completed: false, artifact: null, name: 'Architecture', route: '/rb/03-architecture' },
        4: { completed: false, artifact: null, name: 'HLD', route: '/rb/04-hld' },
        5: { completed: false, artifact: null, name: 'LLD', route: '/rb/05-lld' },
        6: { completed: false, artifact: null, name: 'Build', route: '/rb/06-build' },
        7: { completed: false, artifact: null, name: 'Test', route: '/rb/07-test' },
        8: { completed: false, artifact: null, name: 'Ship', route: '/rb/08-ship' }
    },
    proofData: {
        lovableLink: '',
        githubLink: '',
        deployLink: ''
    }
};

// ===== STEP CONTENT =====
const STEP_CONTENT = {
    1: {
        title: 'Step 1: Problem Definition',
        description: 'Define the problem your AI Resume Builder will solve',
        content: `
            <h3>🎯 Define the Problem</h3>
            <p>Welcome to the AI Resume Builder project! In this step, you'll define the core problem your application will solve.</p>
            
            <h4>Key Questions to Address:</h4>
            <ul>
                <li>What pain points do job seekers face when creating resumes?</li>
                <li>How can AI help streamline the resume creation process?</li>
                <li>What makes your solution unique?</li>
                <li>Who is your target audience?</li>
            </ul>
            
            <h4>Deliverable:</h4>
            <p>Create a problem statement document that clearly articulates the need for an AI-powered resume builder.</p>
            
            <p><strong>Upload your problem definition document to proceed to the next step.</strong></p>
        `,
        code: '<!-- Problem Definition Template -->\n// Document the problem statement\n// Include user pain points\n// Define success metrics'
    },
    2: {
        title: 'Step 2: Market Research',
        description: 'Research the market and competitive landscape',
        content: `
            <h3>📊 Market Analysis</h3>
            <p>Research the competitive landscape and identify opportunities for your AI Resume Builder.</p>
            
            <h4>Research Areas:</h4>
            <ul>
                <li>Analyze existing resume builder tools</li>
                <li>Identify feature gaps in current solutions</li>
                <li>Research AI/ML capabilities in resume optimization</li>
                <li>Study pricing models and monetization strategies</li>
                <li>Understand user demographics and preferences</li>
            </ul>
            
            <h4>Deliverable:</h4>
            <p>Create a market research report with competitive analysis and feature differentiation strategy.</p>
            
            <p><strong>Upload your market research to unlock the next step.</strong></p>
        `,
        code: '<!-- Market Research Template -->\n// Competitive analysis\n// Feature comparison matrix\n// Market opportunity sizing'
    },
    3: {
        title: 'Step 3: Architecture Design',
        description: 'Design the overall system architecture',
        content: `
            <h3>🏗️ System Architecture</h3>
            <p>Design the high-level architecture for your AI Resume Builder application.</p>
            
            <h4>Architecture Components:</h4>
            <ul>
                <li>Frontend framework and UI architecture</li>
                <li>Backend services and API design</li>
                <li>AI/ML integration strategy</li>
                <li>Database schema design</li>
                <li>Authentication and security layer</li>
                <li>File storage and processing pipeline</li>
            </ul>
            
            <h4>Deliverable:</h4>
            <p>Create an architecture diagram showing all major components and their interactions.</p>
            
            <p><strong>Upload your architecture design to continue.</strong></p>
        `,
        code: '<!-- Architecture Diagram -->\n// System components\n// Data flow\n// Technology stack'
    },
    4: {
        title: 'Step 4: High-Level Design (HLD)',
        description: 'Create detailed high-level design specifications',
        content: `
            <h3>📐 High-Level Design</h3>
            <p>Define the detailed design for each major component of your system.</p>
            
            <h4>HLD Components:</h4>
            <ul>
                <li>Module breakdown and responsibilities</li>
                <li>API endpoint specifications</li>
                <li>Data models and schemas</li>
                <li>Integration points and interfaces</li>
                <li>Scalability considerations</li>
                <li>Security and privacy design</li>
            </ul>
            
            <h4>Deliverable:</h4>
            <p>Create comprehensive HLD documentation with component diagrams and interface specifications.</p>
            
            <p><strong>Upload your HLD document to proceed.</strong></p>
        `,
        code: '<!-- HLD Template -->\n// Component specifications\n// API contracts\n// Data models'
    },
    5: {
        title: 'Step 5: Low-Level Design (LLD)',
        description: 'Create implementation-ready low-level designs',
        content: `
            <h3>🔍 Low-Level Design</h3>
            <p>Create detailed, implementation-ready designs for all system components.</p>
            
            <h4>LLD Details:</h4>
            <ul>
                <li>Class diagrams and object models</li>
                <li>Algorithm designs and pseudocode</li>
                <li>Database table structures with constraints</li>
                <li>State machine diagrams</li>
                <li>Error handling strategies</li>
                <li>Performance optimization plans</li>
            </ul>
            
            <h4>Deliverable:</h4>
            <p>Create detailed LLD documentation ready for implementation.</p>
            
            <p><strong>Upload your LLD document to unlock the build phase.</strong></p>
        `,
        code: '<!-- LLD Template -->\n// Class definitions\n// Method signatures\n// Implementation details'
    },
    6: {
        title: 'Step 6: Build Implementation',
        description: 'Implement your AI Resume Builder',
        content: `
            <h3>⚡ Build Phase</h3>
            <p>Time to bring your design to life! Implement your AI Resume Builder application.</p>
            
            <h4>Implementation Tasks:</h4>
            <ul>
                <li>Set up development environment</li>
                <li>Implement frontend UI components</li>
                <li>Build backend APIs and services</li>
                <li>Integrate AI/ML capabilities</li>
                <li>Connect database and storage</li>
                <li>Implement authentication</li>
                <li>Build resume generation logic</li>
            </ul>
            
            <h4>Deliverable:</h4>
            <p>Upload screenshots or a demo video of your working application.</p>
            
            <p><strong>Upload build proof to continue to testing.</strong></p>
        `,
        code: '// Build on Lovable.ai\n// Implement your designs\n// Create working prototype'
    },
    7: {
        title: 'Step 7: Testing & Quality Assurance',
        description: 'Test your application thoroughly',
        content: `
            <h3>🧪 Testing Phase</h3>
            <p>Thoroughly test your AI Resume Builder to ensure quality and reliability.</p>
            
            <h4>Testing Areas:</h4>
            <ul>
                <li>Unit testing for core functions</li>
                <li>Integration testing for APIs</li>
                <li>UI/UX testing across devices</li>
                <li>AI output quality validation</li>
                <li>Performance and load testing</li>
                <li>Security vulnerability assessment</li>
                <li>User acceptance testing</li>
            </ul>
            
            <h4>Deliverable:</h4>
            <p>Create a test report documenting test cases, results, and bug fixes.</p>
            
            <p><strong>Upload your test report to proceed to deployment.</strong></p>
        `,
        code: '// Test cases\n// Coverage reports\n// Bug fixes log'
    },
    8: {
        title: 'Step 8: Ship & Deploy',
        description: 'Deploy your application to production',
        content: `
            <h3>🚀 Deployment Phase</h3>
            <p>Deploy your AI Resume Builder to production and make it available to users!</p>
            
            <h4>Deployment Tasks:</h4>
            <ul>
                <li>Set up production environment</li>
                <li>Configure domain and SSL certificates</li>
                <li>Deploy frontend and backend</li>
                <li>Set up monitoring and analytics</li>
                <li>Create user documentation</li>
                <li>Plan marketing and launch strategy</li>
            </ul>
            
            <h4>Deliverable:</h4>
            <p>Upload deployment confirmation with live URL and deployment logs.</p>
            
            <p><strong>Upload deployment proof to complete the project!</strong></p>
        `,
        code: '// Deployment scripts\n// Production URL\n// Launch checklist'
    }
};

// ===== LOCAL STORAGE =====
function saveState() {
    localStorage.setItem('kodnest_build_state', JSON.stringify(APP_STATE));
}

function loadState() {
    const saved = localStorage.getItem('kodnest_build_state');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(APP_STATE, loaded);
    }
}

function saveArtifact(stepNumber, artifactData) {
    localStorage.setItem(`rb_step_${stepNumber}_artifact`, artifactData);
    APP_STATE.steps[stepNumber].artifact = artifactData;
    APP_STATE.steps[stepNumber].completed = true;
    saveState();
}

function getArtifact(stepNumber) {
    return localStorage.getItem(`rb_step_${stepNumber}_artifact`);
}

// ===== ROUTING =====
function getCurrentRoute() {
    return window.location.hash.slice(1) || '/rb/01-problem';
}

function getStepFromRoute(route) {
    const match = route.match(/\/rb\/0(\d)-/);
    return match ? parseInt(match[1]) : null;
}

function navigateToRoute(route) {
    window.location.hash = route;
}

function getHighestUnlockedStep() {
    for (let i = 1; i <= 8; i++) {
        if (!APP_STATE.steps[i].completed) {
            return i;
        }
    }
    return 8; // All completed
}

// ===== GATING LOGIC =====
function canAccessStep(stepNumber) {
    if (stepNumber === 1) return true;
    // Can only access if previous step is completed
    return APP_STATE.steps[stepNumber - 1].completed;
}

function enforceGating() {
    const route = getCurrentRoute();
    
    if (route === '/rb/proof') {
        // Proof page is always accessible
        renderProofPage();
        return;
    }
    
    const stepNumber = getStepFromRoute(route);
    
    if (stepNumber && !canAccessStep(stepNumber)) {
        // Redirect to highest unlocked step
        const highestUnlocked = getHighestUnlockedStep();
        navigateToRoute(APP_STATE.steps[highestUnlocked].route);
        return;
    }
    
    if (stepNumber) {
        APP_STATE.currentStep = stepNumber;
        renderStep(stepNumber);
    }
}

// ===== RENDERING =====
function renderStep(stepNumber) {
    const step = STEP_CONTENT[stepNumber];
    
    // Update top bar
    document.getElementById('current-step-display').textContent = stepNumber;
    
    // Update context header
    document.getElementById('step-title').textContent = step.title;
    document.getElementById('step-description').textContent = step.description;
    
    // Update main workspace
    document.getElementById('workspace-content').innerHTML = step.content;
    
    // Update build panel code
    document.getElementById('lovable-code').value = step.code;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update progress dots
    renderProgressDots();
    
    // Check if artifact already uploaded
    const artifact = getArtifact(stepNumber);
    if (artifact) {
        document.getElementById('artifact-feedback').innerHTML = 
            '<div class="feedback-success">✓ Artifact uploaded!</div>';
    } else {
        document.getElementById('artifact-feedback').innerHTML = '';
    }
    
    saveState();
}

function renderProofPage() {
    // Hide build panel and show proof content
    document.querySelector('.build-panel').style.display = 'none';
    document.querySelector('.main-workspace').style.flex = '1';
    
    // Update header
    document.getElementById('step-title').textContent = 'Project Proof & Submission';
    document.getElementById('step-description').textContent = 'Review your progress and submit your final project';
    document.getElementById('current-step-display').textContent = 'Proof';
    
    // Render proof page content
    let stepsHTML = '';
    for (let i = 1; i <= 8; i++) {
        const step = APP_STATE.steps[i];
        const isCompleted = step.completed;
        stepsHTML += `
            <div class="step-card ${isCompleted ? 'completed' : ''}">
                <div class="step-number">Step ${i}</div>
                <div class="step-name">${step.name}</div>
                <div class="step-status ${isCompleted ? 'completed' : 'incomplete'}">
                    ${isCompleted ? '✓ Completed' : '○ Incomplete'}
                </div>
            </div>
        `;
    }
    
    const allCompleted = Object.values(APP_STATE.steps).every(s => s.completed);
    
    document.getElementById('workspace-content').innerHTML = `
        <div class="proof-container">
            <div class="proof-header">
                <h2>🏆 Project Completion Status</h2>
                <p>Track your progress and submit your final project</p>
            </div>
            
            <div class="steps-overview">
                ${stepsHTML}
            </div>
            
            <div class="links-section">
                <h3>📎 Project Links</h3>
                
                <div class="link-input-group">
                    <label for="lovable-link">Lovable Project Link</label>
                    <input type="url" id="lovable-link" placeholder="https://lovable.ai/projects/..." 
                           value="${APP_STATE.proofData.lovableLink}">
                </div>
                
                <div class="link-input-group">
                    <label for="github-link">GitHub Repository Link</label>
                    <input type="url" id="github-link" placeholder="https://github.com/..." 
                           value="${APP_STATE.proofData.githubLink}">
                </div>
                
                <div class="link-input-group">
                    <label for="deploy-link">Deployment URL</label>
                    <input type="url" id="deploy-link" placeholder="https://..." 
                           value="${APP_STATE.proofData.deployLink}">
                </div>
            </div>
            
            <div class="submission-section">
                <button class="btn-submit" id="submit-btn" ${!allCompleted ? 'disabled' : ''}>
                    ${allCompleted ? '📋 Copy Final Submission' : '⚠️ Complete All Steps First'}
                </button>
                <div id="submission-feedback"></div>
            </div>
        </div>
    `;
    
    // Hide navigation in footer
    document.querySelector('.footer-nav').style.display = 'none';
    
    // Add event listeners for proof page
    setupProofPageListeners();
}

function setupProofPageListeners() {
    // Save links on change
    ['lovable-link', 'github-link', 'deploy-link'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', (e) => {
                const key = id.replace('-link', 'Link').replace('lovable', 'lovable');
                APP_STATE.proofData[key] = e.target.value;
                saveState();
            });
        }
    });
    
    // Submit button
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn && !submitBtn.disabled) {
        submitBtn.addEventListener('click', handleFinalSubmission);
    }
}

function handleFinalSubmission() {
    const submission = `
=== AI RESUME BUILDER - FINAL SUBMISSION ===

PROJECT: AI Resume Builder (Project 3)
STUDENT: [Your Name]
DATE: ${new Date().toLocaleDateString()}

COMPLETION STATUS:
${Object.entries(APP_STATE.steps).map(([num, step]) => 
    `Step ${num} (${step.name}): ${step.completed ? '✓ COMPLETED' : '○ INCOMPLETE'}`
).join('\n')}

PROJECT LINKS:
- Lovable: ${APP_STATE.proofData.lovableLink || 'Not provided'}
- GitHub: ${APP_STATE.proofData.githubLink || 'Not provided'}
- Live URL: ${APP_STATE.proofData.deployLink || 'Not provided'}

ARTIFACTS:
${Object.entries(APP_STATE.steps).map(([num, step]) => 
    `Step ${num}: ${step.artifact ? 'Uploaded ✓' : 'Missing ✗'}`
).join('\n')}

Generated: ${new Date().toISOString()}
    `.trim();
    
    navigator.clipboard.writeText(submission).then(() => {
        document.getElementById('submission-feedback').innerHTML = 
            '<div class="feedback-success" style="margin-top: 1rem;">✓ Submission copied to clipboard!</div>';
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Previous button
    prevBtn.disabled = APP_STATE.currentStep === 1;
    prevBtn.onclick = () => {
        if (APP_STATE.currentStep > 1) {
            navigateToRoute(APP_STATE.steps[APP_STATE.currentStep - 1].route);
        }
    };
    
    // Next button - enabled only if current step artifact uploaded
    const hasArtifact = APP_STATE.steps[APP_STATE.currentStep].completed;
    nextBtn.disabled = !hasArtifact || APP_STATE.currentStep === 8;
    
    if (APP_STATE.currentStep === 8 && hasArtifact) {
        nextBtn.textContent = 'View Proof →';
        nextBtn.disabled = false;
        nextBtn.onclick = () => navigateToRoute('/rb/proof');
    } else {
        nextBtn.textContent = 'Next →';
        nextBtn.onclick = () => {
            if (APP_STATE.currentStep < 8 && hasArtifact) {
                navigateToRoute(APP_STATE.steps[APP_STATE.currentStep + 1].route);
            }
        };
    }
}

function renderProgressDots() {
    const dotsContainer = document.getElementById('progress-dots');
    dotsContainer.innerHTML = '';
    
    for (let i = 1; i <= 8; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        
        if (APP_STATE.steps[i].completed) {
            dot.classList.add('completed');
        } else if (i === APP_STATE.currentStep) {
            dot.classList.add('active');
        }
        
        dot.title = `Step ${i}: ${APP_STATE.steps[i].name}`;
        dotsContainer.appendChild(dot);
    }
}

// ===== EVENT HANDLERS =====
function setupEventListeners() {
    // Copy button
    document.getElementById('copy-btn').addEventListener('click', () => {
        const code = document.getElementById('lovable-code').value;
        navigator.clipboard.writeText(code).then(() => {
            const btn = document.getElementById('copy-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="btn-icon">✓</span> Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    });
    
    // Build in Lovable button
    document.getElementById('build-lovable-btn').addEventListener('click', () => {
        window.open('https://lovable.ai', '_blank');
    });
    
    // Status buttons
    document.getElementById('status-worked').addEventListener('click', () => {
        showFeedback('upload-feedback', 'Build successful! ✓', 'success');
    });
    
    document.getElementById('status-error').addEventListener('click', () => {
        showFeedback('upload-feedback', 'Error reported. Debug and try again.', 'error');
    });
    
    document.getElementById('status-screenshot').addEventListener('click', () => {
        document.getElementById('screenshot-upload').click();
    });
    
    document.getElementById('screenshot-upload').addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            showFeedback('upload-feedback', `Screenshot uploaded: ${e.target.files[0].name}`, 'success');
        }
    });
    
    // Artifact upload
    document.getElementById('upload-artifact-btn').addEventListener('click', () => {
        const fileInput = document.getElementById('artifact-upload');
        const file = fileInput.files[0];
        
        if (!file) {
            showFeedback('artifact-feedback', 'Please select a file first', 'error');
            return;
        }
        
        // Simulate upload (store file name)
        const artifactData = {
            filename: file.name,
            uploadDate: new Date().toISOString(),
            step: APP_STATE.currentStep
        };
        
        saveArtifact(APP_STATE.currentStep, JSON.stringify(artifactData));
        showFeedback('artifact-feedback', `✓ Artifact uploaded! Next step unlocked.`, 'success');
        
        // Update UI
        updateNavigationButtons();
        renderProgressDots();
    });
    
    // Hash change (routing)
    window.addEventListener('hashchange', enforceGating);
}

function showFeedback(elementId, message, type) {
    const el = document.getElementById(elementId);
    el.innerHTML = `<div class="feedback-${type}">${message}</div>`;
}

// ===== INITIALIZATION =====
function init() {
    loadState();
    setupEventListeners();
    
    // Handle initial route or redirect to first step
    if (!window.location.hash) {
        navigateToRoute('/rb/01-problem');
    } else {
        enforceGating();
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
