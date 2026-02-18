/**
 * AI Client Service — Real LLM Integration
 * Uses Google Gemini 2.0 Flash via REST API (no SDK required).
 *
 * API Key Security Model (client-side app):
 *   - Key is entered by the user at runtime via the Settings panel.
 *   - Stored in localStorage under 'ai_api_key' (never in source code).
 *   - Never committed to git (no hardcoded secrets).
 *   - Falls back to mock responses if no key is configured.
 *
 * To use:
 *   1. Click the ⚙ Settings icon in the nav bar.
 *   2. Enter your Google AI Studio API key (https://aistudio.google.com/apikey).
 *   3. Click Save — AI features activate immediately.
 */

const AI_CONFIG = {
    // Gemini 2.0 Flash — fast, cost-effective, high quality
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    maxTokens: 512,
    temperature: 0.7,
};

// ─── Prompt Templates ────────────────────────────────────────────────────────

const PROMPTS = {
    summary: (roles, currentSummary) => `You are an expert resume writer. Write a concise, impactful professional summary (3-4 sentences, max 80 words) for a candidate with the following roles: ${roles}.

Requirements:
- Start with a strong action-oriented opening
- Include quantifiable achievements where possible
- Use industry-standard keywords for ATS optimization
- Avoid first-person pronouns (no "I", "my", "me")
- Tone: confident, professional, results-focused

${currentSummary ? `Current summary for reference (improve it): "${currentSummary}"` : ''}

Return ONLY the summary text. No labels, no quotes, no explanation.`,

    bullet: (text, role) => `You are an expert resume writer. Rewrite this experience bullet point to be more impactful:

Original: "${text}"
${role ? `Role context: ${role}` : ''}

Requirements:
- Start with a strong action verb (Led, Built, Architected, Reduced, Increased, etc.)
- Add specific metrics or quantifiable outcomes (%, $, users, time saved, etc.)
- Keep it to 1-2 sentences maximum
- Make it ATS-friendly with relevant keywords
- Be specific and concrete, not vague

Return ONLY the improved bullet point. No labels, no quotes, no explanation.`,

    projectDescription: (text, title) => `You are an expert resume writer. Enhance this project description to highlight technical depth and business impact:

Project: ${title || 'Personal Project'}
Current description: "${text}"

Requirements:
- Lead with the technical approach or architecture
- Include scale metrics (users, data volume, performance improvements)
- Mention key technologies used if apparent
- Highlight the business/user impact
- Keep it to 2-3 sentences maximum

Return ONLY the enhanced description. No labels, no quotes, no explanation.`,

    skills: (role, existingSkills) => `You are a technical recruiter. Suggest the top 8 most relevant technical skills for a "${role}" role that are commonly required in job postings.

${existingSkills.length > 0 ? `The candidate already has: ${existingSkills.join(', ')}. Suggest DIFFERENT skills they are likely missing.` : ''}

Requirements:
- Focus on in-demand, ATS-optimized skill names
- Mix of technical tools, languages, and frameworks
- Relevant to the specific role
- Return exactly 8 skills

Return ONLY a JSON array of skill strings. Example: ["Skill1", "Skill2", "Skill3"]
No explanation, no markdown, just the JSON array.`,
};

// ─── Core API Call ────────────────────────────────────────────────────────────

async function callGemini(prompt) {
    const apiKey = localStorage.getItem('ai_api_key');

    if (!apiKey) {
        throw new Error('NO_API_KEY');
    }

    const url = `${AI_CONFIG.endpoint}?key=${apiKey}`;

    const body = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            maxOutputTokens: AI_CONFIG.maxTokens,
            temperature: AI_CONFIG.temperature,
        },
        safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT',       threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH',      threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ]
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err?.error?.message || `HTTP ${response.status}`;

        if (response.status === 400 && msg.includes('API_KEY')) throw new Error('INVALID_API_KEY');
        if (response.status === 429) throw new Error('RATE_LIMITED');
        if (response.status === 403) throw new Error('INVALID_API_KEY');
        throw new Error(`API_ERROR: ${msg}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('EMPTY_RESPONSE');
    return text.trim();
}

// ─── Mock Fallback ────────────────────────────────────────────────────────────

const MOCK = {
    generateSummary: (roles) => `Results-driven ${roles} with proven expertise in building scalable systems and leading cross-functional teams. Delivered high-impact products serving millions of users while reducing operational costs by 30%. Committed to engineering excellence and continuous improvement.`,

    improveBullet: (text) => {
        let improved = text.trim();
        if (!improved.match(/^(Led|Built|Designed|Architected|Reduced|Increased|Launched|Delivered|Managed|Created|Developed|Optimized|Implemented)/i)) {
            improved = 'Led the development of ' + improved.charAt(0).toLowerCase() + improved.slice(1);
        }
        if (!improved.includes('%') && !improved.includes('$') && !improved.includes('users')) {
            improved = improved.replace(/\.$/, '') + ', achieving a 35% improvement in performance.';
        }
        return improved;
    },

    enhanceProjectDescription: (text, title) =>
        `Architected and deployed ${title || 'a full-stack solution'} that ${text.toLowerCase().replace(/\.$/, '')}, supporting 10,000+ concurrent users with 99.9% uptime. Implemented CI/CD pipelines and automated testing, reducing deployment time by 60%.`,

    suggestSkills: (role) => {
        const isTech = /developer|engineer|architect|devops|data|ml|ai/i.test(role);
        return isTech
            ? ['TypeScript', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Redis', 'PostgreSQL', 'CI/CD']
            : ['Agile/Scrum', 'Stakeholder Management', 'Data Analysis', 'OKRs', 'Roadmapping', 'SQL', 'Tableau', 'JIRA'];
    },
};

// ─── AIClient Class ───────────────────────────────────────────────────────────

class AIClient {
    constructor() {
        this._hasKey = () => !!localStorage.getItem('ai_api_key');
    }

    get isConfigured() {
        return this._hasKey();
    }

    async generateSummary(roles, currentSummary) {
        if (!this._hasKey()) {
            return { data: MOCK.generateSummary(roles), mock: true };
        }
        try {
            const text = await callGemini(PROMPTS.summary(roles, currentSummary));
            return { data: text };
        } catch (e) {
            return this._handleError(e, MOCK.generateSummary(roles));
        }
    }

    async improveBullet(text, role = '') {
        if (!this._hasKey()) {
            return { data: MOCK.improveBullet(text), mock: true };
        }
        try {
            const result = await callGemini(PROMPTS.bullet(text, role));
            return { data: result };
        } catch (e) {
            return this._handleError(e, MOCK.improveBullet(text));
        }
    }

    async enhanceProjectDescription(text, title = '') {
        if (!this._hasKey()) {
            return { data: MOCK.enhanceProjectDescription(text, title), mock: true };
        }
        try {
            const result = await callGemini(PROMPTS.projectDescription(text, title));
            return { data: result };
        } catch (e) {
            return this._handleError(e, MOCK.enhanceProjectDescription(text, title));
        }
    }

    async suggestSkills(role, existingSkills = []) {
        if (!this._hasKey()) {
            return { data: MOCK.suggestSkills(role), mock: true };
        }
        try {
            const raw = await callGemini(PROMPTS.skills(role, existingSkills));
            // Parse JSON array from response
            const match = raw.match(/\[[\s\S]*?\]/);
            if (!match) throw new Error('PARSE_ERROR');
            const skills = JSON.parse(match[0]);
            if (!Array.isArray(skills)) throw new Error('PARSE_ERROR');
            return { data: skills };
        } catch (e) {
            if (e.message === 'PARSE_ERROR') {
                return { data: MOCK.suggestSkills(role), mock: true };
            }
            return this._handleError(e, MOCK.suggestSkills(role));
        }
    }

    _handleError(error, fallbackData) {
        const msg = error.message || '';

        if (msg === 'NO_API_KEY') {
            return { data: fallbackData, mock: true, error: 'no_key' };
        }
        if (msg === 'INVALID_API_KEY') {
            // Notify user their key is invalid
            if (typeof showToast === 'function') {
                showToast('⚠ Invalid API key. Check Settings.', 'error');
            }
            return { data: fallbackData, mock: true, error: 'invalid_key' };
        }
        if (msg === 'RATE_LIMITED') {
            if (typeof showToast === 'function') {
                showToast('⚠ Rate limit reached. Try again shortly.', 'warn');
            }
            return { data: fallbackData, mock: true, error: 'rate_limited' };
        }

        console.error('[AIClient]', error);
        if (typeof showToast === 'function') {
            showToast('AI request failed. Using smart fallback.', 'warn');
        }
        return { data: fallbackData, mock: true, error: 'api_error' };
    }
}

// ─── API Key Settings Panel ───────────────────────────────────────────────────

function initAISettings() {
    // Inject settings button into nav
    const navRight = document.querySelector('.nav-right');
    if (!navRight || document.getElementById('ai-settings-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'ai-settings-btn';
    btn.className = 'nav-ai-settings-btn';
    btn.title = 'AI Settings';
    btn.innerHTML = `<span class="ai-key-indicator ${localStorage.getItem('ai_api_key') ? 'active' : ''}"></span> AI Key`;
    btn.addEventListener('click', openAISettingsModal);
    navRight.appendChild(btn);

    // Inject modal HTML
    if (!document.getElementById('ai-settings-modal')) {
        const modal = document.createElement('div');
        modal.id = 'ai-settings-modal';
        modal.className = 'ai-modal-overlay hidden';
        modal.innerHTML = `
            <div class="ai-modal">
                <div class="ai-modal-header">
                    <h3>AI Settings</h3>
                    <button class="ai-modal-close" id="ai-modal-close-btn">✕</button>
                </div>
                <div class="ai-modal-body">
                    <p class="ai-modal-desc">
                        Enter your <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio API key</a>
                        to enable real AI-powered resume writing. Your key is stored locally and never sent to our servers.
                    </p>
                    <div class="form-field">
                        <label for="ai-key-input">Gemini API Key</label>
                        <input type="password" id="ai-key-input" placeholder="AIza..." autocomplete="off" spellcheck="false">
                    </div>
                    <div class="ai-modal-status" id="ai-modal-status"></div>
                </div>
                <div class="ai-modal-footer">
                    <button class="btn-secondary" id="ai-key-clear-btn">Clear Key</button>
                    <button class="btn-primary" id="ai-key-save-btn">Save & Activate</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Bind modal events
        document.getElementById('ai-modal-close-btn').addEventListener('click', closeAISettingsModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeAISettingsModal(); });

        document.getElementById('ai-key-save-btn').addEventListener('click', saveAPIKey);
        document.getElementById('ai-key-clear-btn').addEventListener('click', clearAPIKey);
    }
}

function openAISettingsModal() {
    const modal = document.getElementById('ai-settings-modal');
    const input = document.getElementById('ai-key-input');
    const status = document.getElementById('ai-modal-status');

    if (!modal) return;

    // Pre-fill masked key if exists
    const existing = localStorage.getItem('ai_api_key');
    if (existing) {
        input.value = existing;
        status.innerHTML = `<span class="status-ok">✓ API key configured — AI features active</span>`;
    } else {
        input.value = '';
        status.innerHTML = `<span class="status-warn">No key set — using smart fallback responses</span>`;
    }

    modal.classList.remove('hidden');
    setTimeout(() => input.focus(), 100);
}

function closeAISettingsModal() {
    const modal = document.getElementById('ai-settings-modal');
    if (modal) modal.classList.add('hidden');
}

async function saveAPIKey() {
    const input = document.getElementById('ai-key-input');
    const status = document.getElementById('ai-modal-status');
    const saveBtn = document.getElementById('ai-key-save-btn');
    const key = input.value.trim();

    if (!key) {
        status.innerHTML = `<span class="status-error">Please enter an API key.</span>`;
        return;
    }

    // Validate key format
    if (!key.startsWith('AIza') || key.length < 30) {
        status.innerHTML = `<span class="status-error">Invalid key format. Gemini keys start with "AIza".</span>`;
        return;
    }

    // Test the key with a minimal API call
    saveBtn.textContent = 'Verifying...';
    saveBtn.disabled = true;
    status.innerHTML = `<span class="status-warn">Verifying key with Gemini API...</span>`;

    try {
        const testUrl = `${AI_CONFIG.endpoint}?key=${key}`;
        const testRes = await fetch(testUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Say "OK" in one word.' }] }],
                generationConfig: { maxOutputTokens: 5 }
            })
        });

        if (testRes.status === 403 || testRes.status === 400) {
            status.innerHTML = `<span class="status-error">⚠ Key rejected by Gemini API. Check your key and try again.</span>`;
            return;
        }

        if (!testRes.ok && testRes.status !== 429) {
            status.innerHTML = `<span class="status-error">⚠ API error (${testRes.status}). Check your key.</span>`;
            return;
        }

        // Key is valid (429 = rate limited but key works)
        localStorage.setItem('ai_api_key', key);
        status.innerHTML = `<span class="status-ok">✓ Key verified and saved! AI features are now active.</span>`;

        // Update nav indicator
        const indicator = document.querySelector('.ai-key-indicator');
        if (indicator) indicator.classList.add('active');

        setTimeout(closeAISettingsModal, 1500);

    } catch (e) {
        status.innerHTML = `<span class="status-error">⚠ Network error. Check your connection.</span>`;
    } finally {
        saveBtn.textContent = 'Save & Activate';
        saveBtn.disabled = false;
    }
}

function clearAPIKey() {
    localStorage.removeItem('ai_api_key');
    document.getElementById('ai-key-input').value = '';
    document.getElementById('ai-modal-status').innerHTML =
        `<span class="status-warn">Key cleared — using smart fallback responses.</span>`;

    const indicator = document.querySelector('.ai-key-indicator');
    if (indicator) indicator.classList.remove('active');
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

window.aiClient = new AIClient();

// Init settings panel after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAISettings);
} else {
    // Re-init on route changes (SPA pattern)
    const _origPushState = history.pushState;
    window.addEventListener('hashchange', () => setTimeout(initAISettings, 100));
    setTimeout(initAISettings, 200);
}
