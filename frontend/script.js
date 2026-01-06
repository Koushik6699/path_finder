let careersData = [];
let assignmentsData = [];
let activeCareerId = null;
const API_URL = "https://path-finder-1-s5ob.onrender.com/chat";

async function init() {
    try {
        const [cRes, aRes] = await Promise.all([
            fetch("careers.json"),
            fetch("assignments.json")
        ]);
        careersData = (await cRes.json()).careers;
        assignmentsData = (await aRes.json()).assignments;
    } catch (e) {
        console.error("Failed to load data files.", e);
    }
}
init();

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    document.getElementById('themeBtn').innerText = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

function showResults() {
    const user = {
        subjects: [...document.querySelectorAll(".subject-input:checked")].map(e => e.value),
        skills: [...document.querySelectorAll(".skill-input:checked")].map(e => e.value),
        interests: [...document.querySelectorAll(".interest-input:checked")].map(e => e.value)
    };

    if (user.subjects.length === 0 && user.skills.length === 0 && user.interests.length === 0) {
        alert("Please select some skills or interests first!"); 
        return;
    }

    const container = document.getElementById("resultsContainer");
    container.innerHTML = "";

    const results = careersData.map(career => {
        let score = 0;
        user.subjects.forEach(s => { if (career.subjects.includes(s)) score += 3; });
        user.skills.forEach(s => { if (career.skills.includes(s)) score += 5; });
        user.interests.forEach(i => { if (career.interests.includes(i)) score += 2; });
        return { ...career, score };
    })
    .filter(c => c.score > 2)
    .sort((a, b) => b.score - a.score);

    results.forEach(career => {
        const card = document.createElement("div");
        card.className = "career-card";
        card.innerHTML = `
            <div class="card-badge">Match Score: ${career.score}</div>
            <h3>${career.title}</h3>
            <p style="color:var(--muted); margin: 10px 0 20px; font-size:0.95rem;">${career.description}</p>
            <div class="action-btns" style="display:flex; gap:10px;">
                <button class="btn-primary" onclick="askAI('${career.id}')">✨ Roadmap</button>
                <button class="btn-secondary" onclick="startAssignment('${career.id}')">📝 Assignment</button>
            </div>
            <div class="ai-response-box" id="response-${career.id}" style="display:none;"></div>
        `;
        container.appendChild(card);
    });

    document.getElementById("resultsPage").style.display = "block";
    setTimeout(() => {
        document.getElementById("resultsPage").scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function startAssignment(careerId) {
    activeCareerId = careerId;
    const career = careersData.find(c => c.id === careerId);
    const assignment = assignmentsData.find(a => a.career_id === careerId);

    if (!assignment) {
        alert("Assignments for this path are coming soon!");
        return;
    }

    const body = document.getElementById("assignmentBody");
    document.getElementById("assignmentTitle").innerText = `${career.title} Skills Check`;
    body.innerHTML = "";

    assignment.questions.forEach((q, i) => {
        const qDiv = document.createElement("div");
        qDiv.className = "quiz-item";
        qDiv.innerHTML = `
            <p style="font-size: 1.1rem; font-weight:600;">Q${i+1}: ${q.q}</p>
            <div class="quiz-options">
                ${q.options.map(opt => `
                    <label><input type="radio" name="q${q.id}" value="${opt}"> ${opt}</label>
                `).join('')}
            </div>
        `;
        body.appendChild(qDiv);
    });

    document.getElementById("assignmentModal").style.display = "block";
    document.body.style.overflow = "hidden";
}

function calculateScore() {
    const assignment = assignmentsData.find(a => a.career_id === activeCareerId);
    let score = 0;
    assignment.questions.forEach(q => {
        const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
        if (selected && selected.value === q.a) score++;
    });
    alert(`You scored ${score}/${assignment.questions.length}.`);
    closeAssignment();
}

function closeAssignment() {
    document.getElementById("assignmentModal").style.display = "none";
    document.body.style.overflow = "auto";
}

async function askAI(careerId) {
    const career = careersData.find(c => c.id === careerId);
    const respBox = document.getElementById(`response-${careerId}`);
    respBox.style.display = "block";
    respBox.innerHTML = "<div class='loader'></div> Asking Gemini...";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: `Short roadmap for ${career.title}` })
        });
        const data = await response.json();
        respBox.innerHTML = data.reply;
    } catch (e) {
        respBox.innerHTML = "Error connecting to AI.";
    }
}

// New Helper Function to clean Markdown and format the text
function formatAIResponse(text) {
    // 1. Convert bold markdown **text** to <strong>text</strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 2. Convert markdown headers ## Text to <h4>Text</h4>
    formatted = formatted.replace(/^## (.*$)/gim, '<h4 style="margin-top:10px; color:var(--primary);">$1</h4>');
    
    // 3. Convert new lines to <br> tags
    formatted = formatted.replace(/\n/g, '<br>');

    // 4. Remove any remaining single asterisks or hashes that look messy
    formatted = formatted.replace(/^\* /gm, '• '); // Bullet points
    
    return formatted;
}

async function askAI(careerId) {
    const career = careersData.find(c => c.id === careerId);
    const respBox = document.getElementById(`response-${careerId}`);
    respBox.style.display = "block";
    respBox.innerHTML = "<div class='loader'></div> Generating your smart guide...";

    // Modified Prompt for "Short and Smart" key points
    const smartPrompt = `
        Act as a senior tech mentor. Provide a short and sweet guide for: ${career.title}.
        Structure it exactly like this:
        ## 🗺️ Roadmap
        (3 short bullet points)
        ## 🛠️ Projects to Build
        (2 specific project ideas)
        Keep it concise. Use simple language. No fluff.
    `;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: smartPrompt })
        });
        
        const data = await response.json();
        
        // Pass the raw AI reply through our new formatter
        respBox.innerHTML = formatAIResponse(data.reply);
        
    } catch (e) {
        respBox.innerHTML = "<span style='color:red;'>Error connecting to AI. Please try again.</span>";
        console.error("AI Error:", e);
    }
}