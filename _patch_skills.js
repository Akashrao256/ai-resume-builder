const fs = require('fs');
let c = fs.readFileSync('resume-app.js', 'utf8');

// The original implementation we want to replace
const originalImplMarker = 'function setupAIListeners() {';
const originalImplEnd = 'override if I can find it.\n}';

// We need to find the start and end indices of the function block.
const start = c.indexOf(originalImplMarker);
if (start === -1) {
    console.log('Could not find setupAIListeners');
    process.exit(1);
}

// Find the closing brace after the marker
let depth = 0;
let end = -1;
for (let i = start; i < c.length; i++) {
    if (c[i] === '{') depth++;
    else if (c[i] === '}') {
        depth--;
        if (depth === 0) {
            end = i + 1;
            break;
        }
    }
}

if (end !== -1) {
    const newImpl = `function setupAIListeners() {
    // Summary
    const sumBtn = document.getElementById('btn-ai-summary');
    if (sumBtn) {
        const newBtn = sumBtn.cloneNode(true);
        sumBtn.parentNode.replaceChild(newBtn, sumBtn);
        newBtn.addEventListener('click', handleAISummary);
    }

    // Skill Suggestions (override existing behaviour)
    const skillBtn = document.getElementById('suggest-skills-btn');
    if (skillBtn) {
        // Clone to remove existing listeners
        const newBtn = skillBtn.cloneNode(true);
        skillBtn.parentNode.replaceChild(newBtn, skillBtn);
        
        newBtn.addEventListener('click', async () => {
            if (!window.aiClient) return;
            
            const originalText = newBtn.innerText;
            newBtn.innerHTML = 'Analyzing...';
            newBtn.classList.add('loading');
            newBtn.disabled = true;
            
            try {
                // Get role from first experience or default
                const role = (APP_STATE.resume.experience[0] && APP_STATE.resume.experience[0].role) || 'Developer';
                const res = await window.aiClient.suggestSkills(role);
                
                if (res && res.data) {
                    const tech = APP_STATE.resume.skills.technical;
                    let addedCount = 0;
                    res.data.forEach(s => {
                        if (!tech.includes(s)) {
                            tech.push(s);
                            addedCount++;
                        }
                    });
                    
                    if (addedCount > 0) {
                        renderSkillChips('technical');
                        saveState();
                        updatePreview();
                        showToast(\`Added \${addedCount} suggested skills for \${role}!\`);
                    } else {
                        showToast('No new skills found.');
                    }
                }
            } catch (e) {
                console.error(e);
                showToast('Skill suggestion failed.');
            } finally {
                newBtn.innerHTML = originalText;
                newBtn.classList.remove('loading');
                newBtn.disabled = false;
            }
        });
    }
}`;

    c = c.slice(0, start) + newImpl + c.slice(end);
    fs.writeFileSync('resume-app.js', c, 'utf8');
    console.log('Replaced setupAIListeners with skill support');
} else {
    console.log('Could not find end of setupAIListeners function');
}
