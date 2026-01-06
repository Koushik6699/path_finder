let careersData = [];
const API_URL = "https://path-finder-1-s5ob.onrender.com/chat";

// Theme Toggle
function toggleTheme() { 
    document.body.classList.toggle('dark-mode');
    document.getElementById('themeBtn').innerText = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

function toggleTag(btn) { btn.classList.toggle('selected'); }

// Load JSON logic
async function loadCareers() {
    try {
        const response = await fetch("careers.json");
        const data = await response.json();
        careersData = data.careers;
    } catch (e) {
        console.error("Check if careers.json exists and is valid.");
    }
}
loadCareers();

function showResults() {
    const user = {
        subjects: [...document.querySelectorAll(".subject-input:checked")].map(e => e.value),
        skills: [...document.querySelectorAll(".skill-input:checked")].map(e => e.value),
        interests: [...document.querySelectorAll(".tag-btn.selected")].map(e => e.getAttribute('data-interest'))
    };

    if (user.subjects.length === 0 && user.skills.length === 0) {
        alert("Select some subjects/skills first, broo!");
        return;
    }

    const container = document.getElementById("resultsContainer");
    container.innerHTML = "";

    // Weighted Scoring logic (Subjects: 3, Skills: 5, Interests: 2)
    const results = careersData.map(career => {
        let score = 0;
        user.subjects.forEach(s => { if (career.subjects.includes(s)) score += 3; });
        user.skills.forEach(s => { if (career.skills.includes(s)) score += 5; });
        user.interests.forEach(i => { if (career.interests.includes(i)) score += 2; });
        return { ...career, score };
    }).filter(c => c.score > 0).sort((a, b) => b.score - a.score);

    results.forEach(career => {
        const card = document.createElement("div");
        card.className = "career-card";
        card.innerHTML = `
            <div class="card-badge">Match Score: ${career.score}</div>
            <h3>${career.title}</h3>
            <p style="font-size: 0.9rem; color: var(--muted); margin-bottom: 15px;">${career.description}</p>
            
            <div class="ai-insight-area" id="ai-area-${career.id}">
                <button class="btn-primary" onclick="askAI('${career.id}')" id="btn-${career.id}">
                    ✨ Quick AI Roadmap
                </button>
                <div class="ai-response-box" id="response-${career.id}" style="display:none;"></div>
            </div>
        `;
        container.appendChild(card);
    });

    document.getElementById("resultsPage").style.display = "block";
    document.getElementById("resultsPage").scrollIntoView({ behavior: 'smooth' });
}

async function askAI(careerId) {
    const career = careersData.find(c => c.id === careerId);
    const btn = document.getElementById(`btn-${careerId}`);
    const responseBox = document.getElementById(`response-${careerId}`);

    btn.disabled = true;
    btn.innerHTML = `<span class="loader"></span> Loading...`;
    responseBox.style.display = "block";
    responseBox.innerHTML = "Generating summary...";

    const prompt = `Role: ${career.title}. 
    1. Why it suits me? (Max 2 sentences).
    2. 3 Action steps (Bullet points).
    3. Top 3 Keywords.
    4. short explaination about thsi job and why i fit(max 3 points, each point 1 or 2 lines and use dot as bullets)
    Keep it extremely short and professional. Do not use hashtags. Use simple bolding.`;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: prompt })
        });
        const data = await response.json();
        
        btn.style.display = "none";
        responseBox.innerHTML = formatAIResponse(data.reply);
    } catch (error) {
        responseBox.innerHTML = "❌ AI server unreachable.";
        btn.disabled = false;
        btn.innerText = "✨ Try Again";
    }
}

function formatAIResponse(text) {
    let cleanText = text
        .replace(/#{1,6}\s?/g, '') 
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') 
        .replace(/\*(.*?)\*/g, '<i>$1</i>') 
        .replace(/\n/g, '<br>'); 

    return `<div class="ai-content">${cleanText}</div>`;
}