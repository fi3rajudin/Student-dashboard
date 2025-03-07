const API_URL = 'https://api.sheety.co/9e85471184750ab5c58772ba225a1c1a/studentDashboard/tracker';
const studyForm = document.getElementById('studyForm');
const studyLog = document.getElementById('studyLog');

// Fetch and render study sessions from API
const fetchSessions = async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderSessions(data.tracker);
    } catch (error) {
        console.error('[Fetch Error]:', error);
        alert('Failed to fetch study sessions.');
    }
};

// Render study sessions in the table
const renderSessions = (sessions) => {
    studyLog.innerHTML = '';
    sessions.forEach((session) => {
        const row = `
            <tr>
                <td>${session.subject}</td>
                <td>${session.hours}</td>
                <td>${session.date}</td>
            </tr>
        `;
        studyLog.innerHTML += row;
    });
};

// Add a new study session via API
studyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const subject = document.getElementById('subject').value;
    const duration = document.getElementById('duration').value;

    const newSession = {
        tracker: {
            subject,
            hours: parseFloat(duration),
            date: new Date().toLocaleDateString()
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newSession)
        });

        if (response.ok) {
            //to add an alert that is user friendly and no need of user interaction,
        document.querySelector(".alert-success").removeAttribute("hidden");
        setTimeout(()=>{
            document.querySelector(".alert-success").setAttribute("hidden",true)
        },2000) //adding delay so the user can read the message
            studyForm.reset();
            fetchSessions();
        } else {
            //to add an alert that is user friendly and no need of user interaction,
        document.querySelector(".alert-danger").removeAttribute("hidden");
        setTimeout(()=>{
            document.querySelector(".alert-danger").setAttribute("hidden",true)
        },2000) //adding delay so the user can read the message
        }
    } catch (error) {
        console.error('[Add Error]:', error);
        alert('Error adding session.');
    }
});

// Delete a session via API
const deleteSession = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Session deleted successfully!');
            fetchSessions();
        } else {
            alert('Failed to delete session.');
        }
    } catch (error) {
        console.error('[Delete Error]:', error);
        alert('Error deleting session.');
    }
};

// Initial fetch
fetchSessions();
