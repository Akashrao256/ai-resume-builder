/**
 * AI Client Service (Mock Implementation)
 * Simulates high-quality AI responses for the Resume Builder.
 * In a real-world scenario, this would call an OpenAI/Gemini API endpoint.
 */

class AIClient {
    constructor() {
        this.delay = 1500; // Simulate network latency
    }

    async generateSummary(jobTitle, currentSummary) {
        return new Promise(resolve => {
            setTimeout(() => {
                const title = jobTitle || 'Professional';
                resolve({
                    data: `Results-driven ${title} with proven expertise in scaling web applications and optimizing system performance. Adept at leading cross-functional teams to deliver high-impact projects on time and within budget. Committed to continuous improvement and driving technical excellence.`
                });
            }, this.delay);
        });
    }

    async improveBullet(text) {
        return new Promise(resolve => {
            setTimeout(() => {
                // Heuristic improvement: Add metrics and action verbs
                let improved = text;
                if (!text.includes('%') && !text.includes('$')) {
                    improved += ' resulting in a 25% increase in efficiency.';
                }
                if (!improved.match(/^(Led|Built|Designed|Managed|Created)/)) {
                    improved = 'Spearheaded the initiative to ' + improved.charAt(0).toLowerCase() + improved.slice(1);
                }
                resolve({ data: improved });
            }, this.delay);
        });
    }

    async enhanceProjectDescription(text) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    data: `Architected and deployed a scalable solution that ${text.toLowerCase()}, reducing processing time by 40% and supporting 10,000+ concurrent users. Integrated automated testing pipelines to ensure 99.9% system reliability.`
                });
            }, this.delay);
        });
    }

    async suggestSkills(jobTitle) {
        return new Promise(resolve => {
            setTimeout(() => {
                const common = ['Communication', 'Team Leadership', 'Problem Solving'];
                const tech = jobTitle.match(/developer|engineer|coder/i) 
                    ? ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'GraphQL', 'CI/CD']
                    : ['Project Management', 'Data Analysis', 'Strategic Planning'];
                
                resolve({ data: [...tech, ...common] });
            }, this.delay);
        });
    }
}

// Export global instance
window.aiClient = new AIClient();
