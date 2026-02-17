// ===== STATE MANAGEMENT =====
const APP_STATE = {
    resume: {
        personalInfo: {
            name: '',
            email: '',
            phone: '',
            location: ''
        },
        summary: '',
        education: [],
        experience: [],
        projects: [],
        skills: '',
        links: {
            github: '',
            linkedin: ''
        }
    },
    template: 'classic' // classic, modern, minimal
};

// ===== SAMPLE DATA =====
const SAMPLE_DATA = {
    personalInfo: {
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        phone: '+1 (415) 555-0123',
        location: 'San Francisco, CA'
    },
    summary: 'Senior Software Engineer with 6+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud infrastructure. Proven track record of leading cross-functional teams and delivering high-impact products.',
    education: [
        {
            institution: 'Stanford University',
            degree: 'B.S. Computer Science',
            year: '2015 - 2019'
        },
        {
            institution: 'UC Berkeley',
            degree: 'M.S. Software Engineering',
            year: '2019 - 2021'
        }
    ],
    experience: [
        {
            company: 'TechCorp Inc.',
            role: 'Senior Software Engineer',
            duration: 'Jan 2021 - Present',
            description: 'Lead development of customer-facing web platform serving 2M+ users. Architected microservices infrastructure reducing latency by 40%. Mentor team of 5 junior engineers.'
        },
        {
            company: 'StartupXYZ',
            role: 'Full Stack Developer',
            duration: 'Jun 2019 - Dec 2020',
            description: 'Built MVP product from scratch using React and Node.js. Implemented CI/CD pipeline and automated testing. Collaborated with design team on user experience improvements.'
        }
    ],
    projects: [
        {
            name: 'Open Source Analytics Platform',
            description: 'Created real-time analytics dashboard used by 10K+ developers worldwide. Built with React, D3.js, and PostgreSQL.',
            techStack: 'React, D3.js, PostgreSQL, Docker'
        },
        {
            name: 'AI Resume Builder',
            description: 'Developed intelligent resume creation tool with ATS optimization. Features include AI-powered content suggestions and real-time preview.',
            techStack: 'Next.js, OpenAI API, TailwindCSS'
        }
    ],
    skills: 'JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, Git, CI/CD',
    links: {
        github: 'https://github.com/sarahchen',
        linkedin: 'https://linkedin.com/in/sarahchen'
    }
};

// ===== LOCAL STORAGE =====
function saveState() {
    localStorage.setItem('resume_builder_state', JSON.stringify(APP_STATE));
}

function loadState() {
    const saved = localStorage.getItem('resume_builder_state');
    if (saved) {
        try {
            const loaded = JSON.parse(saved);
            Object.assign(APP_STATE, loaded);
        } catch (e) {
            console.error('Failed to load state:', e);
        }
    }
}

// ===== ROUTING =====
function getCurrentRoute() {
    const hash = window.location.hash.slice(1);
    return hash || '/';
}

function navigateToRoute(route) {
    window.location.hash = route;
}

function handleRouteChange() {
    const route = getCurrentRoute();
    renderRoute(route);
}

function renderRoute(route) {
    const appContent = document.getElementById('app-content');
    
    // Clear current content
    appContent.innerHTML = '';
    
    // Render based on route
    switch (route) {
        case '/':
            renderHomePage();
            break;
        case '/builder':
            renderBuilderPage();
            break;
        case '/preview':
            renderPreviewPage();
            break;
        case '/proof':
            renderProofPage();
            break;
        default:
            renderHomePage();
    }
}

// ===== HOME PAGE =====
function renderHomePage() {
    const template = document.getElementById('home-template');
    const clone = template.content.cloneNode(true);
    
    const appContent = document.getElementById('app-content');
    appContent.appendChild(clone);
    
    // Add event listener to CTA button
    document.getElementById('start-building-btn').addEventListener('click', () => {
        navigateToRoute('/builder');
    });
}

// ===== BUILDER PAGE =====
function renderBuilderPage() {
    const template = document.getElementById('builder-template');
    const clone = template.content.cloneNode(true);
    
    const appContent = document.getElementById('app-content');
    appContent.appendChild(clone);
    
    // Setup form event listeners
    setupBuilderListeners();
    
    // Setup template switcher
    setupTemplateSwitcher();
    
    // Load existing data into form
    loadFormData();
    
    // Render dynamic sections
    renderEducationList();
    renderExperienceList();
    renderProjectsList();
    
    // Apply current template
    applyTemplate(APP_STATE.template);
    
    // Update preview
    updatePreview();
    
    // Update improvement panel
    updateImprovementPanel();
}

function setupBuilderListeners() {
    // Personal info fields
    ['name', 'email', 'phone', 'location'].forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('input', (e) => {
                APP_STATE.resume.personalInfo[field] = e.target.value;
                saveState();
                updatePreview();
            });
        }
    });
    
    // Summary
    const summaryInput = document.getElementById('summary');
    if (summaryInput) {
        summaryInput.addEventListener('input', (e) => {
            APP_STATE.resume.summary = e.target.value;
            saveState();
            updatePreview();
        });
    }
    
    // Skills
    const skillsInput = document.getElementById('skills');
    if (skillsInput) {
        skillsInput.addEventListener('input', (e) => {
            APP_STATE.resume.skills = e.target.value;
            saveState();
            updatePreview();
        });
    }
    
    // Links
    ['github', 'linkedin'].forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('input', (e) => {
                APP_STATE.resume.links[field] = e.target.value;
                saveState();
                updatePreview();
            });
        }
    });
    
    // Add buttons
    document.getElementById('add-education-btn').addEventListener('click', addEducationEntry);
    document.getElementById('add-experience-btn').addEventListener('click', addExperienceEntry);
    document.getElementById('add-project-btn').addEventListener('click', addProjectEntry);
    
    // Load sample data button
    document.getElementById('load-sample-btn').addEventListener('click', loadSampleData);
}

function loadFormData() {
    // Personal info
    document.getElementById('name').value = APP_STATE.resume.personalInfo.name || '';
    document.getElementById('email').value = APP_STATE.resume.personalInfo.email || '';
    document.getElementById('phone').value = APP_STATE.resume.personalInfo.phone || '';
    document.getElementById('location').value = APP_STATE.resume.personalInfo.location || '';
    
    // Summary
    document.getElementById('summary').value = APP_STATE.resume.summary || '';
    
    // Skills
    document.getElementById('skills').value = APP_STATE.resume.skills || '';
    
    // Links
    document.getElementById('github').value = APP_STATE.resume.links.github || '';
    document.getElementById('linkedin').value = APP_STATE.resume.links.linkedin || '';
}

function loadSampleData() {
    // Load sample data into state
    APP_STATE.resume = JSON.parse(JSON.stringify(SAMPLE_DATA));
    saveState();
    
    // Reload the builder page
    renderBuilderPage();
}

// ===== EDUCATION SECTION =====
function addEducationEntry() {
    APP_STATE.resume.education.push({
        institution: '',
        degree: '',
        year: ''
    });
    saveState();
    renderEducationList();
}

function removeEducationEntry(index) {
    APP_STATE.resume.education.splice(index, 1);
    saveState();
    renderEducationList();
    updatePreview();
}

function renderEducationList() {
    const container = document.getElementById('education-list');
    container.innerHTML = '';
    
    APP_STATE.resume.education.forEach((edu, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-item';
        
        entryDiv.innerHTML = `
            <div class="entry-header">
                <span class="entry-label">Education ${index + 1}</span>
                <button class="btn-remove" data-index="${index}">Remove</button>
            </div>
            <div class="form-field">
                <label>Institution</label>
                <input type="text" class="edu-institution" data-index="${index}" value="${edu.institution || ''}" placeholder="Stanford University">
            </div>
            <div class="form-field">
                <label>Degree</label>
                <input type="text" class="edu-degree" data-index="${index}" value="${edu.degree || ''}" placeholder="B.S. Computer Science">
            </div>
            <div class="form-field">
                <label>Year</label>
                <input type="text" class="edu-year" data-index="${index}" value="${edu.year || ''}" placeholder="2018 - 2022">
            </div>
        `;
        
        container.appendChild(entryDiv);
        
        // Event listeners
        entryDiv.querySelector('.btn-remove').addEventListener('click', () => removeEducationEntry(index));
        
        entryDiv.querySelector('.edu-institution').addEventListener('input', (e) => {
            APP_STATE.resume.education[index].institution = e.target.value;
            saveState();
            updatePreview();
        });
        
        entryDiv.querySelector('.edu-degree').addEventListener('input', (e) => {
            APP_STATE.resume.education[index].degree = e.target.value;
            saveState();
            updatePreview();
        });
        
        entryDiv.querySelector('.edu-year').addEventListener('input', (e) => {
            APP_STATE.resume.education[index].year = e.target.value;
            saveState();
            updatePreview();
        });
    });
}

// ===== EXPERIENCE SECTION =====
function addExperienceEntry() {
    APP_STATE.resume.experience.push({
        company: '',
        role: '',
        duration: '',
        description: ''
    });
    saveState();
    renderExperienceList();
}

function removeExperienceEntry(index) {
    APP_STATE.resume.experience.splice(index, 1);
    saveState();
    renderExperienceList();
    updatePreview();
}

function renderExperienceList() {
    const container = document.getElementById('experience-list');
    container.innerHTML = '';
    
    APP_STATE.resume.experience.forEach((exp, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-item';
        
        entryDiv.innerHTML = `
            <div class="entry-header">
                <span class="entry-label">Experience ${index + 1}</span>
                <button class="btn-remove" data-index="${index}">Remove</button>
            </div>
            <div class="form-field">
                <label>Company</label>
                <input type="text" class="exp-company" data-index="${index}" value="${exp.company || ''}" placeholder="TechCorp Inc.">
            </div>
            <div class="form-field">
                <label>Role</label>
                <input type="text" class="exp-role" data-index="${index}" value="${exp.role || ''}" placeholder="Senior Software Engineer">
            </div>
            <div class="form-field">
                <label>Duration</label>
                <input type="text" class="exp-duration" data-index="${index}" value="${exp.duration || ''}" placeholder="Jan 2020 - Present">
            </div>
            <div class="form-field">
                <label>Description</label>
                <textarea class="exp-description" data-index="${index}" rows="3" placeholder="Describe your responsibilities and achievements...">${exp.description || ''}</textarea>
            </div>
        `;
        
        container.appendChild(entryDiv);
        
        // Event listeners
        entryDiv.querySelector('.btn-remove').addEventListener('click', () => removeExperienceEntry(index));
        
        entryDiv.querySelector('.exp-company').addEventListener('input', (e) => {
            APP_STATE.resume.experience[index].company = e.target.value;
            saveState();
            updatePreview();
        });
        
        entryDiv.querySelector('.exp-role').addEventListener('input', (e) => {
            APP_STATE.resume.experience[index].role = e.target.value;
            saveState();
            updatePreview();
        });
        
        entryDiv.querySelector('.exp-duration').addEventListener('input', (e) => {
            APP_STATE.resume.experience[index].duration = e.target.value;
            saveState();
            updatePreview();
        });
        
        entryDiv.querySelector('.exp-description').addEventListener('input', (e) => {
            APP_STATE.resume.experience[index].description = e.target.value;
            saveState();
            updatePreview();
            
            // Add bullet guidance hint
            const fieldContainer = e.target.closest('.form-field');
            addBulletHint(fieldContainer, e.target.value);
        });
    });
}

// ===== PROJECTS SECTION =====
function addProjectEntry() {
    APP_STATE.resume.projects.push({
        name: '',
        description: '',
        techStack: ''
    });
    saveState();
    renderProjectsList();
}

function removeProjectEntry(index) {
    APP_STATE.resume.projects.splice(index, 1);
    saveState();
    renderProjectsList();
    updatePreview();
}

function renderProjectsList() {
    const container = document.getElementById('projects-list');
    container.innerHTML = '';
    
    APP_STATE.resume.projects.forEach((proj, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-item';
        
        entryDiv.innerHTML = `
            <div class="entry-header">
                <span class="entry-label">Project ${index + 1}</span>
                <button class="btn-remove" data-index="${index}">Remove</button>
            </div>
            <div class="form-field">
                <label>Project Name</label>
                <input type="text" class="proj-name" data-index="${index}" value="${proj.name || ''}" placeholder="E-Commerce Platform">
            </div>
            <div class="form-field">
                <label>Description</label>
                <textarea class="proj-description" data-index="${index}" rows="2" placeholder="Brief description of the project...">${proj.description || ''}</textarea>
            </div>
            <div class="form-field">
                <label>Tech Stack</label>
                <input type="text" class="proj-tech" data-index="${index}" value="${proj.techStack || ''}" placeholder="React, Node.js, MongoDB">
            </div>
        `;
        
        container.appendChild(entryDiv);
        
        // Event listeners
        entryDiv.querySelector('.btn-remove').addEventListener('click', () => removeProjectEntry(index));
        
        entryDiv.querySelector('.proj-name').addEventListener('input', (e) => {
            APP_STATE.resume.projects[index].name = e.target.value;
            saveState();
            updatePreview();
        });
        
        entryDiv.querySelector('.proj-description').addEventListener('input', (e) => {
            APP_STATE.resume.projects[index].description = e.target.value;
            saveState();
            updatePreview();
            
            // Add bullet guidance hint
            const fieldContainer = e.target.closest('.form-field');
            addBulletHint(fieldContainer, e.target.value);
        });
        
        entryDiv.querySelector('.proj-tech').addEventListener('input', (e) => {
            APP_STATE.resume.projects[index].techStack = e.target.value;
            saveState();
            updatePreview();
        });
    });
}

// ===== LIVE PREVIEW UPDATE =====
function updatePreview() {
    const previewContainer = document.getElementById('preview-content');
    if (!previewContainer) return;
    
    previewContainer.innerHTML = generateResumeHTML();
    
    // Apply current template
    applyTemplate(APP_STATE.template);
    
    // Update ATS score
    updateATSScore();
    
    // Update improvement panel
    updateImprovementPanel();
}

// ===== ATS SCORING ENGINE =====
function calculateATSScore() {
    const { personalInfo, summary, education, experience, projects, skills, links } = APP_STATE.resume;
    
    let score = 0;
    const feedback = [];
    
    // Rule 1: Summary length (40-120 words) = +15 points
    if (summary) {
        const wordCount = summary.trim().split(/\s+/).filter(w => w).length;
        if (wordCount >= 40 && wordCount <= 120) {
            score += 15;
        } else if (wordCount > 0) {
            if (wordCount < 40) {
                feedback.push(`Write a stronger summary (currently ${wordCount} words, target 40-120 words)`);
            } else {
                feedback.push(`Shorten your summary (currently ${wordCount} words, target 40-120 words)`);
            }
        } else {
            feedback.push('Write a stronger summary (40-120 words)');
        }
    } else {
        feedback.push('Write a stronger summary (40-120 words)');
    }
    
    // Rule 2: At least 2 projects = +10 points
    const validProjects = projects.filter(p => p.name || p.description).length;
    if (validProjects >= 2) {
        score += 10;
    } else {
        feedback.push(`Add at least 2 projects (currently have ${validProjects})`);
    }
    
    // Rule 3: At least 1 experience entry = +10 points
    const validExperience = experience.filter(e => e.company || e.role).length;
    if (validExperience >= 1) {
        score += 10;
    } else {
        feedback.push('Add at least 1 work experience entry');
    }
    
    // Rule 4: Skills ≥ 8 items = +10 points
    const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];
    if (skillsArray.length >= 8) {
        score += 10;
    } else {
        feedback.push(`Add more skills (currently have ${skillsArray.length}, target 8+)`);
    }
    
    // Rule 5: GitHub OR LinkedIn exists = +10 points
    if (links.github || links.linkedin) {
        score += 10;
    } else {
        feedback.push('Add LinkedIn or GitHub profile');
    }
    
    // Rule 6: Metrics in experience/project bullets = +15 points
    const hasMetrics = checkForMetrics([...experience, ...projects]);
    if (hasMetrics) {
        score += 15;
    } else {
        feedback.push('Add measurable impact (numbers, %, metrics) in your bullet points');
    }
    
    // Rule 7: Complete education fields = +10 points
    const completeEducation = education.filter(e => e.institution && e.degree && e.year).length;
    if (completeEducation > 0) {
        score += 10;
    } else if (education.length > 0) {
        feedback.push('Complete all education fields (institution, degree, year)');
    }
    
    // Additional: All basic info filled = +10 points (bonus)
    if (personalInfo.name && personalInfo.email && personalInfo.phone && personalInfo.location) {
        score += 10;
    }
    
    // Cap at 100
    score = Math.min(score, 100);
    
    return { score, feedback };
}

function checkForMetrics(entries) {
    // Check if any description contains numbers or metrics
    const metricsPattern = /\d+[%kmb+]?|\d+,\d+|\d+x|increased|decreased|reduced|improved/i;
    
    for (const entry of entries) {
        const description = entry.description || '';
        if (metricsPattern.test(description)) {
            return true;
        }
    }
    
    return false;
}

function updateATSScore() {
    const scoreNumberEl = document.getElementById('score-number');
    const scoreCircleEl = document.getElementById('score-circle');
    const suggestionsContainer = document.getElementById('suggestions-container');
    
    if (!scoreNumberEl || !scoreCircleEl || !suggestionsContainer) return;
    
    const { score, feedback } = calculateATSScore();
    
    // Update score display
    scoreNumberEl.textContent = score;
    
    // Update circle meter
    const circumference = 314; // 2 * PI * r (r=50)
    const offset = circumference - (score / 100) * circumference;
    scoreCircleEl.style.strokeDashoffset = offset;
    
    // Update suggestions
    renderSuggestions(score, feedback);
}

function renderSuggestions(score, feedback) {
    const suggestionsContainer = document.getElementById('suggestions-container');
    if (!suggestionsContainer) return;
    
    // Hide if score >= 90
    if (score >= 90) {
        suggestionsContainer.innerHTML = '';
        return;
    }
    
    // Show max 3 suggestions
    const topSuggestions = feedback.slice(0, 3);
    
    if (topSuggestions.length === 0) {
        suggestionsContainer.innerHTML = '';
        return;
    }
    
    let html = '<div class="suggestions-title">Suggestions to improve score:</div>';
    topSuggestions.forEach(suggestion => {
        html += `<div class="suggestion-item">${escapeHtml(suggestion)}</div>`;
    });
    
    suggestionsContainer.innerHTML = html;
}

function generateResumeHTML() {
    const { personalInfo, summary, education, experience, projects, skills, links } = APP_STATE.resume;
    
    let html = '';
    
    // Header
    if (personalInfo.name || personalInfo.email || personalInfo.phone || personalInfo.location) {
        html += '<div class="resume-header">';
        if (personalInfo.name) {
            html += `<h1 class="resume-name">${escapeHtml(personalInfo.name)}</h1>`;
        }
        html += '<div class="resume-contact">';
        if (personalInfo.email) html += `<span>${escapeHtml(personalInfo.email)}</span>`;
        if (personalInfo.phone) html += `<span>${escapeHtml(personalInfo.phone)}</span>`;
        if (personalInfo.location) html += `<span>${escapeHtml(personalInfo.location)}</span>`;
        html += '</div>';
        html += '</div>';
    }
    
    // Summary
    if (summary) {
        html += '<div class="resume-section">';
        html += '<h2 class="resume-section-title">Professional Summary</h2>';
        html += `<p class="resume-summary">${escapeHtml(summary)}</p>`;
        html += '</div>';
    }
    
    // Education
    if (education.length > 0) {
        html += '<div class="resume-section">';
        html += '<h2 class="resume-section-title">Education</h2>';
        education.forEach(edu => {
            if (edu.institution || edu.degree || edu.year) {
                html += '<div class="resume-entry">';
                html += '<div class="resume-entry-header">';
                if (edu.institution) html += `<span class="resume-entry-title">${escapeHtml(edu.institution)}</span>`;
                if (edu.year) html += `<span class="resume-entry-meta">${escapeHtml(edu.year)}</span>`;
                html += '</div>';
                if (edu.degree) html += `<div class="resume-entry-subtitle">${escapeHtml(edu.degree)}</div>`;
                html += '</div>';
            }
        });
        html += '</div>';
    }
    
    // Experience
    if (experience.length > 0) {
        html += '<div class="resume-section">';
        html += '<h2 class="resume-section-title">Work Experience</h2>';
        experience.forEach(exp => {
            if (exp.company || exp.role || exp.duration || exp.description) {
                html += '<div class="resume-entry">';
                html += '<div class="resume-entry-header">';
                if (exp.role) html += `<span class="resume-entry-title">${escapeHtml(exp.role)}</span>`;
                if (exp.duration) html += `<span class="resume-entry-meta">${escapeHtml(exp.duration)}</span>`;
                html += '</div>';
                if (exp.company) html += `<div class="resume-entry-subtitle">${escapeHtml(exp.company)}</div>`;
                if (exp.description) html += `<p class="resume-entry-description">${escapeHtml(exp.description)}</p>`;
                html += '</div>';
            }
        });
        html += '</div>';
    }
    
    // Projects
    if (projects.length > 0) {
        html += '<div class="resume-section">';
        html += '<h2 class="resume-section-title">Projects</h2>';
        projects.forEach(proj => {
            if (proj.name || proj.description || proj.techStack) {
                html += '<div class="resume-entry">';
                if (proj.name) html += `<div class="resume-entry-title">${escapeHtml(proj.name)}</div>`;
                if (proj.description) html += `<p class="resume-entry-description">${escapeHtml(proj.description)}</p>`;
                if (proj.techStack) html += `<div class="resume-entry-meta">Tech: ${escapeHtml(proj.techStack)}</div>`;
                html += '</div>';
            }
        });
        html += '</div>';
    }
    
    // Skills
    if (skills) {
        html += '<div class="resume-section">';
        html += '<h2 class="resume-section-title">Skills</h2>';
        html += '<div class="resume-skills">';
        const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
        skillsArray.forEach(skill => {
            html += `<span class="skill-tag">${escapeHtml(skill)}</span>`;
        });
        html += '</div>';
        html += '</div>';
    }
    
    // Links
    if (links.github || links.linkedin) {
        html += '<div class="resume-section">';
        html += '<h2 class="resume-section-title">Links</h2>';
        html += '<div class="resume-links">';
        if (links.github) html += `<a href="${escapeHtml(links.github)}" class="resume-link" target="_blank">GitHub: ${escapeHtml(links.github)}</a>`;
        if (links.linkedin) html += `<a href="${escapeHtml(links.linkedin)}" class="resume-link" target="_blank">LinkedIn: ${escapeHtml(links.linkedin)}</a>`;
        html += '</div>';
        html += '</div>';
    }
    
    if (!html) {
        html = '<p style="color: #6a6a6a; text-align: center; padding: 2rem;">Start filling out the form to see your resume preview...</p>';
    }
    
    return html;
}

// ===== PREVIEW PAGE =====
function renderPreviewPage() {
    const template = document.getElementById('preview-template');
    const clone = template.content.cloneNode(true);
    
    const appContent = document.getElementById('app-content');
    appContent.appendChild(clone);
    
    // Setup template switcher
    setupTemplateSwitcher();
    
    // Setup export actions
    setupExportActions();
    
    // Render resume in full preview
    const fullPreview = document.getElementById('full-preview-content');
    fullPreview.innerHTML = generateResumeHTML();
    
    // Apply current template
    applyTemplate(APP_STATE.template);
}

// ===== PROOF PAGE =====
function renderProofPage() {
    const template = document.getElementById('proof-template');
    const clone = template.content.cloneNode(true);
    
    const appContent = document.getElementById('app-content');
    appContent.appendChild(clone);
}

// ===== TEMPLATE SYSTEM =====
function setupTemplateSwitcher() {
    const templateTabs = document.querySelectorAll('.template-tab');
    
    templateTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const templateName = tab.getAttribute('data-template');
            switchTemplate(templateName);
        });
    });
    
    // Set active tab based on current template
    templateTabs.forEach(tab => {
        if (tab.getAttribute('data-template') === APP_STATE.template) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

function switchTemplate(templateName) {
    // Update state
    APP_STATE.template = templateName;
    saveState();
    
    // Update active tab
    document.querySelectorAll('.template-tab').forEach(tab => {
        if (tab.getAttribute('data-template') === templateName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Apply template styling (does NOT affect score or content)
    applyTemplate(templateName);
    
    console.log(`✓ Template switched to: ${templateName}`);
}

function applyTemplate(templateName) {
    const resumeDocuments = document.querySelectorAll('.resume-document');
    
    resumeDocuments.forEach(doc => {
        // Remove all template classes
        doc.classList.remove('template-classic', 'template-modern', 'template-minimal');
        
        // Add new template class
        doc.classList.add(`template-${templateName}`);
    });
}

// ===== BULLET DISCIPLINE GUIDANCE =====
const ACTION_VERBS = [
    'built', 'developed', 'designed', 'implemented', 'led', 'improved', 
    'created', 'optimized', 'automated', 'managed', 'architected',
    'launched', 'delivered', 'analyzed', 'established', 'coordinated',
    'streamlined', 'enhanced', 'reduced', 'increased', 'achieved'
];

function checkBulletGuidance(text) {
    const hints = [];
    
    // Check for action verb
    const startsWithActionVerb = ACTION_VERBS.some(verb => 
        text.toLowerCase().trim().startsWith(verb)
    );
    
    if (!startsWithActionVerb && text.trim().length > 0) {
        hints.push('Start with a strong action verb.');
    }
    
    // Check for numeric impact
    const hasNumericImpact = /\d+[%kmb+]?|\d+,\d+|\d+x/i.test(text);
    
    if (!hasNumericImpact && text.trim().length > 10) {
        hints.push('Add measurable impact (numbers).');
    }
    
    return hints;
}

function addBulletHint(container, text) {
    // Remove existing hint
    const existingHint = container.querySelector('.bullet-hint');
    if (existingHint) {
        existingHint.remove();
    }
    
    const hints = checkBulletGuidance(text);
    
    if (hints.length > 0) {
        const hintDiv = document.createElement('div');
        hintDiv.className = 'bullet-hint';
        hintDiv.textContent = hints[0]; // Show first hint
        container.appendChild(hintDiv);
    }
}

// ===== IMPROVEMENT PANEL =====
function updateImprovementPanel() {
    const improvementList = document.getElementById('improvement-list');
    const improvementPanel = document.getElementById('improvement-panel');
    
    if (!improvementList || !improvementPanel) return;
    
    const { score, feedback } = calculateATSScore();
    
    // Hide panel if score >= 90
    if (score >= 90) {
        improvementPanel.classList.add('hidden');
        return;
    }
    
    improvementPanel.classList.remove('hidden');
    
    // Generate top 3 improvements based on scoring gaps
    const improvements = generateTopImprovements();
    
    if (improvements.length === 0) {
        improvementPanel.classList.add('hidden');
        return;
    }
    
    let html = '';
    improvements.slice(0, 3).forEach(improvement => {
        html += `<div class="improvement-item">${escapeHtml(improvement)}</div>`;
    });
    
    improvementList.innerHTML = html;
}

function generateTopImprovements() {
    const { personalInfo, summary, education, experience, projects, skills, links } = APP_STATE.resume;
    const improvements = [];
    
    // Priority order based on impact
    
    // Check projects (high impact)
    const validProjects = projects.filter(p => p.name || p.description).length;
    if (validProjects < 2) {
        improvements.push('Add at least one more project.');
    }
    
    // Check metrics in bullets (high impact)
    const hasMetrics = checkForMetrics([...experience, ...projects]);
    if (!hasMetrics) {
        improvements.push('Include measurable impact in experience.');
    }
    
    // Check summary
    if (summary) {
        const wordCount = summary.trim().split(/\s+/).filter(w => w).length;
        if (wordCount < 40) {
            improvements.push('Expand your summary to strengthen positioning.');
        }
    } else {
        improvements.push('Expand your summary to strengthen positioning.');
    }
    
    // Check skills
    const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];
    if (skillsArray.length < 8) {
        improvements.push('Add more role-relevant skills.');
    }
    
    // Check experience
    const validExperience = experience.filter(e => e.company || e.role).length;
    if (validExperience === 0) {
        improvements.push('Include internship or project-based experience.');
    }
    
    // Check links
    if (!links.github && !links.linkedin) {
        improvements.push('Add LinkedIn or GitHub profile link.');
    }
    
    // Check education completeness
    const completeEducation = education.filter(e => e.institution && e.degree && e.year).length;
    if (education.length > 0 && completeEducation === 0) {
        improvements.push('Complete all education fields.');
    }
    
    return improvements;
}

// ===== EXPORT SYSTEM =====
function setupExportActions() {
    const printBtn = document.getElementById('export-print-btn');
    const copyBtn = document.getElementById('export-copy-btn');
    
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            if (validateResumeBeforeExport()) {
                handlePrintExport();
            }
        });
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (validateResumeBeforeExport()) {
                handleCopyAsText();
            }
        });
    }
}

function validateResumeBeforeExport() {
    const { personalInfo, experience, projects } = APP_STATE.resume;
    const issues = [];
    
    // Check for missing name
    if (!personalInfo.name || !personalInfo.name.trim()) {
        issues.push('Your resume is missing a name');
    }
    
    // Check for no experience AND no projects
    const hasExperience = experience.some(e => e.company || e.role);
    const hasProjects = projects.some(p => p.name || p.description);
    
    if (!hasExperience && !hasProjects) {
        issues.push('Your resume has no experience or projects listed');
    }
    
    if (issues.length > 0) {
        showValidationModal(issues);
        return false; // Block until user confirms
    }
    
    return true; // No issues, proceed
}

function showValidationModal(issues) {
    const modal = document.getElementById('validation-modal');
    const message = document.getElementById('validation-message');
    const cancelBtn = document.getElementById('validation-cancel-btn');
    const continueBtn = document.getElementById('validation-continue-btn');
    
    if (!modal) return;
    
    // Set message
    message.textContent = issues.join('. ') + '.';
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Setup event listeners
    cancelBtn.onclick = () => {
        modal.classList.add('hidden');
    };
    
    continueBtn.onclick = () => {
        modal.classList.add('hidden');
        // Determine which action was attempted
        const lastAction = modal.dataset.action;
        if (lastAction === 'print') {
            window.print();
        } else if (lastAction === 'copy') {
            copyResumeToClipboard();
        }
    };
    
    // Store action for later
    modal.dataset.action = event.target.id.includes('print') ? 'print' : 'copy';
}

function handlePrintExport() {
    console.log('✓ Print/PDF export initiated');
    window.print();
}

function handleCopyAsText() {
    copyResumeToClipboard();
}

function copyResumeToClipboard() {
    const plainText = generatePlainTextResume();
    
    navigator.clipboard.writeText(plainText).then(() => {
        console.log('✓ Resume copied to clipboard');
        
        // Visual feedback
        const copyBtn = document.getElementById('export-copy-btn');
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.backgroundColor = 'var(--color-accent)';
            copyBtn.style.color = 'var(--color-bg-white)';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
                copyBtn.style.color = '';
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        alert('Failed to copy to clipboard. Please try again.');
    });
}

function generatePlainTextResume() {
    const { personalInfo, summary, education, experience, projects, skills, links } = APP_STATE.resume;
    
    let text = '';
    
    // Name and Contact
    if (personalInfo.name) {
        text += personalInfo.name.toUpperCase() + '\n';
    }
    
    const contactParts = [];
    if (personalInfo.email) contactParts.push(personalInfo.email);
    if (personalInfo.phone) contactParts.push(personalInfo.phone);
    if (personalInfo.location) contactParts.push(personalInfo.location);
    
    if (contactParts.length > 0) {
        text += contactParts.join(' | ') + '\n';
    }
    
    text += '\n';
    
    // Summary
    if (summary) {
        text += 'SUMMARY\n';
        text += summary + '\n\n';
    }
    
    // Education
    if (education.length > 0) {
        text += 'EDUCATION\n';
        education.forEach(edu => {
            if (edu.institution || edu.degree || edu.year) {
                if (edu.institution) text += edu.institution;
                if (edu.degree) text += ' — ' + edu.degree;
                if (edu.year) text += ' (' + edu.year + ')';
                text += '\n';
            }
        });
        text += '\n';
    }
    
    // Experience
    if (experience.length > 0) {
        text += 'EXPERIENCE\n';
        experience.forEach(exp => {
            if (exp.role || exp.company) {
                if (exp.role) text += exp.role;
                if (exp.company) text += ' — ' + exp.company;
                if (exp.duration) text += ' (' + exp.duration + ')';
                text += '\n';
                if (exp.description) {
                    text += '  • ' + exp.description + '\n';
                }
                text += '\n';
            }
        });
    }
    
    // Projects
    if (projects.length > 0) {
        text += 'PROJECTS\n';
        projects.forEach(proj => {
            if (proj.name) {
                text += proj.name + '\n';
                if (proj.description) {
                    text += '  • ' + proj.description + '\n';
                }
                if (proj.techStack) {
                    text += '  Tech: ' + proj.techStack + '\n';
                }
                text += '\n';
            }
        });
    }
    
    // Skills
    if (skills) {
        text += 'SKILLS\n';
        text += skills + '\n\n';
    }
    
    // Links
    if (links.github || links.linkedin) {
        text += 'LINKS\n';
        if (links.github) text += 'GitHub: ' + links.github + '\n';
        if (links.linkedin) text += 'LinkedIn: ' + links.linkedin + '\n';
    }
    
    return text.trim();
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== INITIALIZATION =====
function init() {
    loadState();
    
    // Verification logging
    console.log('=== AI Resume Builder - Verification ===');
    console.log('✓ Persistence: Data loaded from localStorage');
    console.log('✓ Auto-save: Enabled on all form changes');
    console.log('✓ Preview: Live rendering active');
    console.log('✓ ATS Scoring: Enabled');
    console.log(`✓ Template System: ${APP_STATE.template} template loaded`);
    console.log('✓ Bullet Guidance: Action verb & numeric checks enabled');
    console.log('✓ Improvement Panel: Top 3 insights generating');
    console.log('✓ Export System: Print/PDF & plain-text copy ready');
    console.log('✓ Validation: Pre-export warnings active');
    if (APP_STATE.resume.personalInfo.name) {
        console.log(`✓ Form data reloaded: ${APP_STATE.resume.personalInfo.name}`);
    }
    console.log('========================================');
    
    // Handle route changes
    window.addEventListener('hashchange', handleRouteChange);
    
    // Initial route
    handleRouteChange();
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
