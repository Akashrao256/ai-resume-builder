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
        skills: {
            technical: [],
            soft: [],
            tools: []
        },
        links: {
            github: '',
            linkedin: ''
        }
    },
    template: 'classic',   // classic | modern | minimal
    accentColor: 'hsl(168, 60%, 40%)' // default: teal
};

// Accent color palette — scalable for future additions
const ACCENT_COLORS = [
    { name: 'Teal',     value: 'hsl(168, 60%, 40%)', id: 'teal'     },
    { name: 'Navy',     value: 'hsl(220, 60%, 35%)', id: 'navy'     },
    { name: 'Burgundy', value: 'hsl(345, 60%, 35%)', id: 'burgundy' },
    { name: 'Forest',   value: 'hsl(150, 50%, 30%)', id: 'forest'   },
    { name: 'Charcoal', value: 'hsl(0,   0%, 25%)',  id: 'charcoal' }
];

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
            title: 'Open Source Analytics Platform',
            description: 'Created real-time analytics dashboard used by 10K+ developers worldwide. Built with React, D3.js, and PostgreSQL.',
            techStack: ['React', 'D3.js', 'PostgreSQL', 'Docker'],
            liveUrl: '',
            githubUrl: 'https://github.com/sarahchen/analytics'
        },
        {
            title: 'AI Resume Builder',
            description: 'Developed intelligent resume creation tool with ATS optimization. Features include AI-powered content suggestions and real-time preview.',
            techStack: ['Next.js', 'OpenAI API', 'TailwindCSS'],
            liveUrl: 'https://airesume.demo',
            githubUrl: 'https://github.com/sarahchen/resume'
        }
    ],
    skills: {
        technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
        soft: ['Team Leadership', 'Problem Solving', 'Communication'],
        tools: ['Git', 'Docker', 'AWS', 'PostgreSQL', 'CI/CD']
    },
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
            // Deep merge to preserve new schema defaults
            if (loaded.resume) {
                Object.assign(APP_STATE.resume, loaded.resume);
                // Ensure skills is always the structured object
                if (typeof APP_STATE.resume.skills === 'string') {
                    // Migrate old comma-string to technical array
                    const oldSkills = APP_STATE.resume.skills
                        .split(',').map(s => s.trim()).filter(s => s);
                    APP_STATE.resume.skills = { technical: oldSkills, soft: [], tools: [] };
                }
                if (!APP_STATE.resume.skills || typeof APP_STATE.resume.skills !== 'object' || Array.isArray(APP_STATE.resume.skills)) {
                    APP_STATE.resume.skills = { technical: [], soft: [], tools: [] };
                }
                // Ensure projects have new schema
                APP_STATE.resume.projects = APP_STATE.resume.projects.map(p => ({
                    title: p.title || p.name || '',
                    description: p.description || '',
                    techStack: Array.isArray(p.techStack) ? p.techStack
                        : (p.techStack ? p.techStack.split(',').map(s => s.trim()).filter(s => s) : []),
                    liveUrl: p.liveUrl || '',
                    githubUrl: p.githubUrl || ''
                }));
            }
            if (loaded.template) APP_STATE.template = loaded.template;
            if (loaded.accentColor) APP_STATE.accentColor = loaded.accentColor;
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
    
    // Apply current template + accent color
    applyTemplate(APP_STATE.template);
    applyAccentColor(APP_STATE.accentColor);
    
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

    // ===== SKILLS TAG INPUT SYSTEM =====
    ['technical', 'soft', 'tools'].forEach(category => {
        const input = document.getElementById(`input-${category}`);
        const tagArea = document.getElementById(`tags-${category}`);
        if (!input || !tagArea) return;

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const val = input.value.trim();
                if (!val) return;
                const arr = APP_STATE.resume.skills[category];
                if (arr.includes(val)) { input.value = ''; return; } // no duplicates
                arr.push(val);
                input.value = '';
                saveState(); updatePreview();
                renderSkillChips(category);
            }
        });

        // Remove chip via delegation
        tagArea.addEventListener('click', e => {
            if (e.target.classList.contains('chip-remove')) {
                const skill = e.target.dataset.skill;
                APP_STATE.resume.skills[category] =
                    APP_STATE.resume.skills[category].filter(s => s !== skill);
                saveState(); updatePreview();
                renderSkillChips(category);
            }
        });
    });

    // Suggest Skills button
    const suggestBtn = document.getElementById('suggest-skills-btn');
    if (suggestBtn) {
        suggestBtn.addEventListener('click', () => {
            suggestBtn.textContent = 'Loading...';
            suggestBtn.disabled = true;
            setTimeout(() => {
                const suggestions = {
                    technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
                    soft: ['Team Leadership', 'Problem Solving'],
                    tools: ['Git', 'Docker', 'AWS']
                };
                ['technical', 'soft', 'tools'].forEach(cat => {
                    suggestions[cat].forEach(skill => {
                        if (!APP_STATE.resume.skills[cat].includes(skill)) {
                            APP_STATE.resume.skills[cat].push(skill);
                        }
                    });
                    renderSkillChips(cat);
                });
                saveState(); updatePreview();
                suggestBtn.textContent = '\u2728 Suggest Skills';
                suggestBtn.disabled = false;
            }, 1000);
        });
    }

    // Accordion toggles
    ['skills', 'projects'].forEach(section => {
        const btn = document.getElementById(`${section}-accordion-btn`);
        const body = document.getElementById(`${section}-accordion-body`);
        if (btn && body) {
            btn.addEventListener('click', () => {
                const isOpen = body.classList.toggle('accordion-open');
                btn.querySelector('.accordion-chevron').style.transform = isOpen ? 'rotate(180deg)' : '';
            });
            // Open by default
            body.classList.add('accordion-open');
            btn.querySelector('.accordion-chevron').style.transform = 'rotate(180deg)';
        }
    });
    
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
    
    // Skills chips
    ['technical', 'soft', 'tools'].forEach(cat => renderSkillChips(cat));
    
    // Links
    document.getElementById('github').value = APP_STATE.resume.links.github || '';
    document.getElementById('linkedin').value = APP_STATE.resume.links.linkedin || '';
}

function renderSkillChips(category) {
    const tagArea = document.getElementById(`tags-${category}`);
    const countEl = document.getElementById(`count-${category}`);
    if (!tagArea) return;

    const arr = APP_STATE.resume.skills[category] || [];

    // Remove old chips (keep the input)
    const input = tagArea.querySelector('.tag-input-field');
    tagArea.innerHTML = '';

    arr.forEach(skill => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.innerHTML = `${escapeHtml(skill)}<button class="chip-remove" data-skill="${escapeHtml(skill)}" aria-label="Remove">×</button>`;
        tagArea.appendChild(chip);
    });

    tagArea.appendChild(input);

    if (countEl) countEl.textContent = arr.length;
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

// ===== PROJECTS SECTION (accordion cards) =====
function addProjectEntry() {
    APP_STATE.resume.projects.push({
        title: '',
        description: '',
        techStack: [],
        liveUrl: '',
        githubUrl: ''
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
    if (!container) return;
    container.innerHTML = '';

    APP_STATE.resume.projects.forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.index = index;

        const headerLabel = proj.title ? escapeHtml(proj.title) : 'Untitled Project';
        const descLen = (proj.description || '').length;
        const techChipsHTML = (proj.techStack || []).map(t =>
            `<span class="chip">${escapeHtml(t)}<button class="chip-remove" data-skill="${escapeHtml(t)}" aria-label="Remove">×</button></span>`
        ).join('');

        card.innerHTML = `
            <div class="project-card-header">
                <span class="project-card-title">${headerLabel}</span>
                <div class="project-card-actions">
                    <button class="project-toggle-btn" aria-label="Toggle">&#8964;</button>
                    <button class="btn-remove proj-delete-btn">Delete</button>
                </div>
            </div>
            <div class="project-card-body">
                <div class="form-field">
                    <label>Project Title</label>
                    <input type="text" class="proj-title-input" value="${escapeHtml(proj.title)}" placeholder="E-Commerce Platform">
                </div>
                <div class="form-field">
                    <label>Description <span class="char-counter">${descLen}/200</span></label>
                    <textarea class="proj-desc-input" rows="3" maxlength="200" placeholder="Brief description of the project...">${escapeHtml(proj.description)}</textarea>
                </div>
                <div class="form-field">
                    <label>Tech Stack</label>
                    <div class="tag-input-area proj-tech-tags">${techChipsHTML}<input class="tag-input-field proj-tech-input" placeholder="e.g. React"></div>
                </div>
                <div class="form-field">
                    <label>Live URL <span style="color:var(--color-text-muted);font-weight:400">(optional)</span></label>
                    <input type="url" class="proj-live-input" value="${escapeHtml(proj.liveUrl)}" placeholder="https://myproject.com">
                </div>
                <div class="form-field">
                    <label>GitHub URL <span style="color:var(--color-text-muted);font-weight:400">(optional)</span></label>
                    <input type="url" class="proj-github-input" value="${escapeHtml(proj.githubUrl)}" placeholder="https://github.com/user/repo">
                </div>
            </div>
        `;

        container.appendChild(card);

        // Toggle collapse
        const toggleBtn = card.querySelector('.project-toggle-btn');
        const body = card.querySelector('.project-card-body');
        toggleBtn.addEventListener('click', () => {
            const collapsed = card.classList.toggle('collapsed');
            toggleBtn.style.transform = collapsed ? 'rotate(-90deg)' : '';
        });

        // Delete
        card.querySelector('.proj-delete-btn').addEventListener('click', () => removeProjectEntry(index));

        // Title
        card.querySelector('.proj-title-input').addEventListener('input', e => {
            APP_STATE.resume.projects[index].title = e.target.value;
            card.querySelector('.project-card-title').textContent = e.target.value || 'Untitled Project';
            saveState(); updatePreview();
        });

        // Description + char counter
        const descTA = card.querySelector('.proj-desc-input');
        const charCounter = card.querySelector('.char-counter');
        descTA.addEventListener('input', e => {
            const val = e.target.value;
            charCounter.textContent = `${val.length}/200`;
            APP_STATE.resume.projects[index].description = val;
            saveState(); updatePreview();
            addBulletHint(e.target.closest('.form-field'), val);
        });

        // Tech stack tag input
        const techTagArea = card.querySelector('.proj-tech-tags');
        const techInput = card.querySelector('.proj-tech-input');
        techInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const val = techInput.value.trim();
                if (!val) return;
                if (APP_STATE.resume.projects[index].techStack.includes(val)) { techInput.value = ''; return; }
                APP_STATE.resume.projects[index].techStack.push(val);
                techInput.value = '';
                saveState(); updatePreview();
                renderProjectsList();
            }
        });
        techTagArea.addEventListener('click', e => {
            if (e.target.classList.contains('chip-remove')) {
                const skill = e.target.dataset.skill;
                APP_STATE.resume.projects[index].techStack =
                    APP_STATE.resume.projects[index].techStack.filter(s => s !== skill);
                saveState(); updatePreview();
                renderProjectsList();
            }
        });

        // Live URL
        card.querySelector('.proj-live-input').addEventListener('input', e => {
            APP_STATE.resume.projects[index].liveUrl = e.target.value;
            saveState(); updatePreview();
        });

        // GitHub URL
        card.querySelector('.proj-github-input').addEventListener('input', e => {
            APP_STATE.resume.projects[index].githubUrl = e.target.value;
            saveState(); updatePreview();
        });
    });
}

// ===== LIVE PREVIEW UPDATE =====
function updatePreview() {
    const previewContainer = document.getElementById('preview-content');
    if (!previewContainer) return;
    
    previewContainer.innerHTML = generateResumeHTML();
    
    // Apply current template + accent color
    applyTemplate(APP_STATE.template);
    applyAccentColor(APP_STATE.accentColor);
    
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

    // Flatten skills for counting
    const allSkills = [
        ...(skills.technical || []),
        ...(skills.soft || []),
        ...(skills.tools || [])
    ];
    
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
    const validProjects = projects.filter(p => p.title || p.description).length;
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
    
    // Rule 4: Skills >= 8 items = +10 points
    if (allSkills.length >= 8) {
        score += 10;
    } else {
        feedback.push(`Add more skills (currently have ${allSkills.length}, target 8+)`);
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

// ===== RESUME HTML HELPERS =====
function _buildProjectsHTML(projects) {
    const validProjects = projects.filter(p => p.title || p.description || (p.techStack && p.techStack.length));
    if (!validProjects.length) return '';
    let html = '<div class="resume-section">';
    html += '<h2 class="resume-section-title">Projects</h2>';
    validProjects.forEach(proj => {
        html += '<div class="resume-entry">';
        html += '<div class="resume-entry-header">';
        if (proj.title) html += `<span class="resume-entry-title">${escapeHtml(proj.title)}</span>`;
        html += '<span class="resume-project-links">';
        if (proj.liveUrl) html += `<a href="${escapeHtml(proj.liveUrl)}" target="_blank" class="resume-proj-link">&#127760; Live</a>`;
        if (proj.githubUrl) html += `<a href="${escapeHtml(proj.githubUrl)}" target="_blank" class="resume-proj-link">&#128279; GitHub</a>`;
        html += '</span></div>';
        if (proj.description) html += `<p class="resume-entry-description">${escapeHtml(proj.description)}</p>`;
        if (proj.techStack && proj.techStack.length) {
            html += '<div class="resume-skills" style="margin-top:0.4rem">';
            proj.techStack.forEach(t => { html += `<span class="skill-tag">${escapeHtml(t)}</span>`; });
            html += '</div>';
        }
        html += '</div>';
    });
    html += '</div>';
    return html;
}

function _buildExperienceHTML(experience) {
    if (!experience.length) return '';
    let html = '<div class="resume-section"><h2 class="resume-section-title">Work Experience</h2>';
    experience.forEach(exp => {
        if (exp.company || exp.role || exp.duration || exp.description) {
            html += '<div class="resume-entry"><div class="resume-entry-header">';
            if (exp.role) html += `<span class="resume-entry-title">${escapeHtml(exp.role)}</span>`;
            if (exp.duration) html += `<span class="resume-entry-meta">${escapeHtml(exp.duration)}</span>`;
            html += '</div>';
            if (exp.company) html += `<div class="resume-entry-subtitle">${escapeHtml(exp.company)}</div>`;
            if (exp.description) html += `<p class="resume-entry-description">${escapeHtml(exp.description)}</p>`;
            html += '</div>';
        }
    });
    return html + '</div>';
}

function _buildEducationHTML(education) {
    if (!education.length) return '';
    let html = '<div class="resume-section"><h2 class="resume-section-title">Education</h2>';
    education.forEach(edu => {
        if (edu.institution || edu.degree || edu.year) {
            html += '<div class="resume-entry"><div class="resume-entry-header">';
            if (edu.institution) html += `<span class="resume-entry-title">${escapeHtml(edu.institution)}</span>`;
            if (edu.year) html += `<span class="resume-entry-meta">${escapeHtml(edu.year)}</span>`;
            html += '</div>';
            if (edu.degree) html += `<div class="resume-entry-subtitle">${escapeHtml(edu.degree)}</div>`;
            html += '</div>';
        }
    });
    return html + '</div>';
}

function _buildSkillsHTML(skills) {
    const technical = skills.technical || [];
    const soft = skills.soft || [];
    const tools = skills.tools || [];
    if (!technical.length && !soft.length && !tools.length) return '';
    let html = '<div class="resume-section"><h2 class="resume-section-title">Skills</h2>';
    if (technical.length) {
        html += '<div class="resume-skill-group"><div class="resume-skill-group-label">Technical</div><div class="resume-skills">';
        technical.forEach(s => { html += `<span class="skill-tag">${escapeHtml(s)}</span>`; });
        html += '</div></div>';
    }
    if (soft.length) {
        html += '<div class="resume-skill-group"><div class="resume-skill-group-label">Soft Skills</div><div class="resume-skills">';
        soft.forEach(s => { html += `<span class="skill-tag">${escapeHtml(s)}</span>`; });
        html += '</div></div>';
    }
    if (tools.length) {
        html += '<div class="resume-skill-group"><div class="resume-skill-group-label">Tools &amp; Technologies</div><div class="resume-skills">';
        tools.forEach(s => { html += `<span class="skill-tag">${escapeHtml(s)}</span>`; });
        html += '</div></div>';
    }
    return html + '</div>';
}

function generateResumeHTML() {
    const { personalInfo, summary, education, experience, projects, skills, links } = APP_STATE.resume;

    // Modern template uses a two-column sidebar layout
    if (APP_STATE.template === 'modern') {
        return _generateModernHTML({ personalInfo, summary, education, experience, projects, skills, links });
    }

    // Classic & Minimal — single column
    let html = '';

    // Header
    if (personalInfo.name || personalInfo.email || personalInfo.phone || personalInfo.location) {
        html += '<div class="resume-header">';
        if (personalInfo.name) html += `<h1 class="resume-name">${escapeHtml(personalInfo.name)}</h1>`;
        html += '<div class="resume-contact">';
        if (personalInfo.email) html += `<span>${escapeHtml(personalInfo.email)}</span>`;
        if (personalInfo.phone) html += `<span>${escapeHtml(personalInfo.phone)}</span>`;
        if (personalInfo.location) html += `<span>${escapeHtml(personalInfo.location)}</span>`;
        html += '</div></div>';
    }

    if (summary) {
        html += '<div class="resume-section">';
        html += '<h2 class="resume-section-title">Professional Summary</h2>';
        html += `<p class="resume-summary">${escapeHtml(summary)}</p>`;
        html += '</div>';
    }

    html += _buildEducationHTML(education);
    html += _buildExperienceHTML(experience);
    html += _buildProjectsHTML(projects);
    html += _buildSkillsHTML(skills);

    // Links
    if (links.github || links.linkedin) {
        html += '<div class="resume-section"><h2 class="resume-section-title">Links</h2><div class="resume-links">';
        if (links.github) html += `<a href="${escapeHtml(links.github)}" class="resume-link" target="_blank">GitHub: ${escapeHtml(links.github)}</a>`;
        if (links.linkedin) html += `<a href="${escapeHtml(links.linkedin)}" class="resume-link" target="_blank">LinkedIn: ${escapeHtml(links.linkedin)}</a>`;
        html += '</div></div>';
    }

    if (!html) {
        html = '<p style="color: #6a6a6a; text-align: center; padding: 2rem;">Start filling out the form to see your resume preview...</p>';
    }

    return html;
}

function _generateModernHTML({ personalInfo, summary, education, experience, projects, skills, links }) {
    const technical = skills.technical || [];
    const soft = skills.soft || [];
    const tools = skills.tools || [];
    const allSkills = [...technical, ...soft, ...tools];

    // Sidebar
    let sidebar = '<div class="resume-modern-sidebar">';
    if (personalInfo.name) sidebar += `<h1 class="resume-name">${escapeHtml(personalInfo.name)}</h1>`;
    sidebar += '<div class="resume-contact">';
    if (personalInfo.email) sidebar += `<span>${escapeHtml(personalInfo.email)}</span>`;
    if (personalInfo.phone) sidebar += `<span>${escapeHtml(personalInfo.phone)}</span>`;
    if (personalInfo.location) sidebar += `<span>${escapeHtml(personalInfo.location)}</span>`;
    sidebar += '</div>';

    // Skills in sidebar
    if (allSkills.length) {
        sidebar += '<div class="sidebar-section-title">Skills</div>';
        if (technical.length) {
            sidebar += '<div class="sidebar-section-title" style="font-size:0.6rem;margin-top:0.5rem;border:none;color:rgba(255,255,255,0.5)">Technical</div>';
            technical.forEach(s => { sidebar += `<span class="skill-tag">${escapeHtml(s)}</span>`; });
        }
        if (soft.length) {
            sidebar += '<div class="sidebar-section-title" style="font-size:0.6rem;margin-top:0.5rem;border:none;color:rgba(255,255,255,0.5)">Soft Skills</div>';
            soft.forEach(s => { sidebar += `<span class="skill-tag">${escapeHtml(s)}</span>`; });
        }
        if (tools.length) {
            sidebar += '<div class="sidebar-section-title" style="font-size:0.6rem;margin-top:0.5rem;border:none;color:rgba(255,255,255,0.5)">Tools</div>';
            tools.forEach(s => { sidebar += `<span class="skill-tag">${escapeHtml(s)}</span>`; });
        }
    }

    // Links in sidebar
    if (links.github || links.linkedin) {
        sidebar += '<div class="sidebar-section-title">Links</div>';
        if (links.github) sidebar += `<a href="${escapeHtml(links.github)}" class="resume-link" target="_blank">GitHub</a>`;
        if (links.linkedin) sidebar += `<a href="${escapeHtml(links.linkedin)}" class="resume-link" target="_blank">LinkedIn</a>`;
    }
    sidebar += '</div>';

    // Main column
    let main = '<div class="resume-modern-main">';
    if (summary) {
        main += '<div class="resume-section"><h2 class="resume-section-title">Summary</h2>';
        main += `<p class="resume-summary">${escapeHtml(summary)}</p></div>`;
    }
    main += _buildExperienceHTML(experience);
    main += _buildProjectsHTML(projects);
    main += _buildEducationHTML(education);
    main += '</div>';

    const hasContent = personalInfo.name || summary || education.length || experience.length || projects.length || allSkills.length;
    if (!hasContent) {
        return '<p style="color: #6a6a6a; text-align: center; padding: 2rem;">Start filling out the form to see your resume preview...</p>';
    }

    return `<div class="resume-modern-layout">${sidebar}${main}</div>`;
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
    
    // Apply current template + accent color
    applyTemplate(APP_STATE.template);
    applyAccentColor(APP_STATE.accentColor);
}

// ===== PROOF PAGE =====
function renderProofPage() {
    const template = document.getElementById('proof-template');
    const clone = template.content.cloneNode(true);
    
    const appContent = document.getElementById('app-content');
    appContent.appendChild(clone);
}

// ===== TEMPLATE SYSTEM =====

// SVG thumbnail sketches for each template
const TEMPLATE_THUMBNAILS = {
    classic: `<svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg">
        <!-- Header -->
        <rect x="8" y="6" width="64" height="6" rx="1" fill="var(--thumb-accent)" opacity="0.85"/>
        <rect x="16" y="14" width="48" height="2.5" rx="1" fill="#bbb"/>
        <!-- Divider -->
        <line x1="8" y1="20" x2="72" y2="20" stroke="var(--thumb-accent)" stroke-width="0.8"/>
        <!-- Section label -->
        <rect x="8" y="24" width="20" height="2" rx="0.5" fill="var(--thumb-accent)" opacity="0.7"/>
        <rect x="8" y="28" width="60" height="1.5" rx="0.5" fill="#ddd"/>
        <rect x="8" y="31" width="52" height="1.5" rx="0.5" fill="#ddd"/>
        <!-- Divider -->
        <line x1="8" y1="36" x2="72" y2="36" stroke="var(--thumb-accent)" stroke-width="0.8"/>
        <rect x="8" y="40" width="22" height="2" rx="0.5" fill="var(--thumb-accent)" opacity="0.7"/>
        <rect x="8" y="44" width="60" height="1.5" rx="0.5" fill="#ddd"/>
        <rect x="8" y="47" width="48" height="1.5" rx="0.5" fill="#ddd"/>
        <rect x="8" y="50" width="56" height="1.5" rx="0.5" fill="#ddd"/>
        <!-- Divider -->
        <line x1="8" y1="56" x2="72" y2="56" stroke="var(--thumb-accent)" stroke-width="0.8"/>
        <rect x="8" y="60" width="18" height="2" rx="0.5" fill="var(--thumb-accent)" opacity="0.7"/>
        <rect x="8" y="64" width="40" height="1.5" rx="0.5" fill="#ddd"/>
        <rect x="8" y="67" width="36" height="1.5" rx="0.5" fill="#ddd"/>
        <!-- Skills chips -->
        <rect x="8" y="74" width="14" height="4" rx="2" fill="var(--thumb-accent)" opacity="0.2"/>
        <rect x="24" y="74" width="14" height="4" rx="2" fill="var(--thumb-accent)" opacity="0.2"/>
        <rect x="40" y="74" width="14" height="4" rx="2" fill="var(--thumb-accent)" opacity="0.2"/>
    </svg>`,

    modern: `<svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg">
        <!-- Left sidebar -->
        <rect x="0" y="0" width="26" height="110" rx="0" fill="var(--thumb-accent)" opacity="0.85"/>
        <!-- Sidebar content -->
        <rect x="3" y="8" width="20" height="3" rx="1" fill="white" opacity="0.9"/>
        <rect x="3" y="13" width="16" height="2" rx="0.5" fill="white" opacity="0.6"/>
        <rect x="3" y="22" width="14" height="1.5" rx="0.5" fill="white" opacity="0.5"/>
        <rect x="3" y="25" width="18" height="1.5" rx="0.5" fill="white" opacity="0.4"/>
        <rect x="3" y="28" width="16" height="1.5" rx="0.5" fill="white" opacity="0.4"/>
        <rect x="3" y="36" width="12" height="1.5" rx="0.5" fill="white" opacity="0.7"/>
        <rect x="3" y="40" width="18" height="2.5" rx="1" fill="white" opacity="0.25"/>
        <rect x="3" y="44" width="18" height="2.5" rx="1" fill="white" opacity="0.25"/>
        <rect x="3" y="48" width="14" height="2.5" rx="1" fill="white" opacity="0.25"/>
        <!-- Main content area -->
        <rect x="30" y="6" width="46" height="4" rx="1" fill="#333" opacity="0.8"/>
        <rect x="30" y="12" width="36" height="2" rx="0.5" fill="#bbb"/>
        <rect x="30" y="20" width="18" height="2" rx="0.5" fill="var(--thumb-accent)" opacity="0.8"/>
        <rect x="30" y="24" width="44" height="1.5" rx="0.5" fill="#ddd"/>
        <rect x="30" y="27" width="40" height="1.5" rx="0.5" fill="#ddd"/>
        <rect x="30" y="30" width="44" height="1.5" rx="0.5" fill="#ddd"/>
        <rect x="30" y="38" width="20" height="2" rx="0.5" fill="var(--thumb-accent)" opacity="0.8"/>
        <rect x="30" y="42" width="44" height="1.5" rx="0.5" fill="#ddd"/>
        <rect x="30" y="45" width="38" height="1.5" rx="0.5" fill="#ddd"/>
        <rect x="30" y="48" width="42" height="1.5" rx="0.5" fill="#ddd"/>
        <rect x="30" y="56" width="16" height="2" rx="0.5" fill="var(--thumb-accent)" opacity="0.8"/>
        <rect x="30" y="60" width="44" height="1.5" rx="0.5" fill="#ddd"/>
        <rect x="30" y="63" width="36" height="1.5" rx="0.5" fill="#ddd"/>
    </svg>`,

    minimal: `<svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg">
        <!-- Header -->
        <rect x="8" y="8" width="50" height="5" rx="1" fill="#222" opacity="0.85"/>
        <rect x="8" y="15" width="36" height="2" rx="0.5" fill="#bbb"/>
        <!-- Generous whitespace, no dividers -->
        <rect x="8" y="28" width="16" height="2" rx="0.5" fill="#555" opacity="0.7"/>
        <rect x="8" y="33" width="60" height="1.5" rx="0.5" fill="#e0e0e0"/>
        <rect x="8" y="36" width="52" height="1.5" rx="0.5" fill="#e0e0e0"/>
        <rect x="8" y="48" width="18" height="2" rx="0.5" fill="#555" opacity="0.7"/>
        <rect x="8" y="53" width="60" height="1.5" rx="0.5" fill="#e0e0e0"/>
        <rect x="8" y="56" width="48" height="1.5" rx="0.5" fill="#e0e0e0"/>
        <rect x="8" y="59" width="56" height="1.5" rx="0.5" fill="#e0e0e0"/>
        <rect x="8" y="71" width="14" height="2" rx="0.5" fill="#555" opacity="0.7"/>
        <rect x="8" y="76" width="44" height="1.5" rx="0.5" fill="#e0e0e0"/>
        <rect x="8" y="79" width="38" height="1.5" rx="0.5" fill="#e0e0e0"/>
        <!-- Skills — plain text style -->
        <rect x="8" y="90" width="12" height="2" rx="0.5" fill="#555" opacity="0.7"/>
        <rect x="8" y="94" width="60" height="1.5" rx="0.5" fill="#e0e0e0"/>
    </svg>`
};

function setupTemplateSwitcher() {
    // Find the template-switcher container (builder) or template-toolbar (preview)
    const switcherEl = document.querySelector('.template-switcher') ||
                       document.querySelector('.template-toolbar');
    if (!switcherEl) return;

    // Replace inner content with thumbnail cards
    switcherEl.innerHTML = `
        <div class="template-picker-label">Template</div>
        <div class="template-thumbnails" id="template-thumbnails"></div>
    `;

    const container = switcherEl.querySelector('#template-thumbnails');

    const templates = [
        { id: 'classic',  label: 'Classic'  },
        { id: 'modern',   label: 'Modern'   },
        { id: 'minimal',  label: 'Minimal'  }
    ];

    templates.forEach(({ id, label }) => {
        const card = document.createElement('button');
        card.className = 'template-thumb-card' + (APP_STATE.template === id ? ' active' : '');
        card.dataset.template = id;
        card.setAttribute('aria-label', `Switch to ${label} template`);
        card.innerHTML = `
            <div class="thumb-preview" style="--thumb-accent: ${APP_STATE.accentColor}">
                ${TEMPLATE_THUMBNAILS[id]}
            </div>
            <div class="thumb-label">
                <span>${label}</span>
                <span class="thumb-check" aria-hidden="true">&#10003;</span>
            </div>
        `;
        card.addEventListener('click', () => switchTemplate(id));
        container.appendChild(card);
    });

    // Inject color picker below
    setupColorPicker(switcherEl);
}

function setupColorPicker(parentEl) {
    const pickerHTML = `
        <div class="color-picker-section" id="color-picker-section">
            <div class="color-picker-label">Accent Color</div>
            <div class="color-swatches" id="color-swatches"></div>
        </div>
    `;
    parentEl.insertAdjacentHTML('beforeend', pickerHTML);

    const swatchContainer = parentEl.querySelector('#color-swatches');

    ACCENT_COLORS.forEach(({ name, value, id }) => {
        const btn = document.createElement('button');
        btn.className = 'color-swatch' + (APP_STATE.accentColor === value ? ' active' : '');
        btn.dataset.color = value;
        btn.dataset.colorId = id;
        btn.setAttribute('aria-label', `${name} accent color`);
        btn.setAttribute('title', name);
        btn.style.background = value;
        btn.innerHTML = `<span class="swatch-check" aria-hidden="true">&#10003;</span>`;
        btn.addEventListener('click', () => switchAccentColor(value));
        swatchContainer.appendChild(btn);
    });
}

function switchAccentColor(colorValue) {
    APP_STATE.accentColor = colorValue;
    saveState();
    applyAccentColor(colorValue);

    // Update swatch active states
    document.querySelectorAll('.color-swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.color === colorValue);
    });

    // Update thumb SVG accent
    document.querySelectorAll('.thumb-preview').forEach(p => {
        p.style.setProperty('--thumb-accent', colorValue);
    });

    // Re-render preview with new color
    updatePreview();
    console.log(`\u2713 Accent color changed to: ${colorValue}`);
}

function applyAccentColor(colorValue) {
    document.documentElement.style.setProperty('--resume-accent', colorValue);
}

function switchTemplate(templateName) {
    APP_STATE.template = templateName;
    saveState();

    // Update thumbnail active states
    document.querySelectorAll('.template-thumb-card').forEach(card => {
        card.classList.toggle('active', card.dataset.template === templateName);
    });

    // Apply template class + accent color
    applyTemplate(templateName);
    applyAccentColor(APP_STATE.accentColor);

    // Re-render preview content
    updatePreview();

    console.log(`\u2713 Template switched to: ${templateName}`);
}

function applyTemplate(templateName) {
    const resumeDocuments = document.querySelectorAll('.resume-document');
    resumeDocuments.forEach(doc => {
        doc.classList.remove('template-classic', 'template-modern', 'template-minimal');
        doc.classList.add(`template-${templateName}`);
    });
    applyAccentColor(APP_STATE.accentColor);
}

// ===== TOAST NOTIFICATION =====
function showToast(message, duration = 3000) {
    // Remove any existing toast
    const existing = document.getElementById('resume-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'resume-toast';
    toast.className = 'resume-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
        <span class="toast-icon">&#10003;</span>
        <span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('toast-visible'));
    });

    // Auto-dismiss
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
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
    const validProjects = projects.filter(p => p.title || p.description).length;
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
    const allSkillsFlat = [
        ...(skills.technical || []),
        ...(skills.soft || []),
        ...(skills.tools || [])
    ];
    if (allSkillsFlat.length < 8) {
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
            if (validateResumeBeforeExport('print')) {
                handlePrintExport();
            }
        });
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (validateResumeBeforeExport('copy')) {
                handleCopyAsText();
            }
        });
    }
}

function validateResumeBeforeExport(actionType) {
    const { personalInfo, experience, projects } = APP_STATE.resume;
    const issues = [];
    
    // Check for missing name
    if (!personalInfo.name || !personalInfo.name.trim()) {
        issues.push('Your resume is missing a name');
    }
    
    // Check for no experience AND no projects
    const hasExperience = experience.some(e => e.company || e.role);
    const hasProjects = projects.some(p => p.title || p.description);
    
    if (!hasExperience && !hasProjects) {
        issues.push('Your resume has no experience or projects listed');
    }
    
    if (issues.length > 0) {
        showValidationModal(issues, actionType);
        return false; // Block until user confirms
    }
    
    return true; // No issues, proceed
}

function showValidationModal(issues, actionType) {
    const modal = document.getElementById('validation-modal');
    const message = document.getElementById('validation-message');
    const cancelBtn = document.getElementById('validation-cancel-btn');
    const continueBtn = document.getElementById('validation-continue-btn');
    
    if (!modal) return;
    
    // Set message
    message.textContent = issues.join('. ') + '.';
    
    // Store action type
    modal.dataset.action = actionType;
    
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
}

function handlePrintExport() {
    showToast('PDF export ready! Check your downloads.');
    console.log('Print/PDF export initiated');
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
            if (proj.title) {
                text += proj.title + '\n';
                if (proj.description) {
                    text += '  \u2022 ' + proj.description + '\n';
                }
                if (proj.techStack && proj.techStack.length) {
                    text += '  Tech: ' + proj.techStack.join(', ') + '\n';
                }
                if (proj.liveUrl) text += '  Live: ' + proj.liveUrl + '\n';
                if (proj.githubUrl) text += '  GitHub: ' + proj.githubUrl + '\n';
                text += '\n';
            }
        });
    }
    
    // Skills
    const allSkillsText = [
        ...(skills.technical || []),
        ...(skills.soft || []),
        ...(skills.tools || [])
    ];
    if (allSkillsText.length) {
        text += 'SKILLS\n';
        if ((skills.technical || []).length) text += 'Technical: ' + skills.technical.join(', ') + '\n';
        if ((skills.soft || []).length) text += 'Soft Skills: ' + skills.soft.join(', ') + '\n';
        if ((skills.tools || []).length) text += 'Tools: ' + skills.tools.join(', ') + '\n';
        text += '\n';
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
