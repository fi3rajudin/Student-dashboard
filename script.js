const API_URL_SCORES = 'https://api.sheety.co/8a2495540de3f6b32f93631ef4abf0bd/studentDashboard/scores';
const API_URL_NOTES = 'https://api.sheety.co/8a2495540de3f6b32f93631ef4abf0bd/studentDashboard/notes';

document.addEventListener("DOMContentLoaded", async () => {
    // 🥧 Fetch scores data and render pie chart
    const scoresData = await fetchScores();
    const { labels, data } = prepareScoreData(scoresData);

    const scorePieCtx = document.getElementById('scorePieChart').getContext('2d');
    new Chart(scorePieCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score Distribution',
                data: data,
                backgroundColor: generateColors(labels.length)
            }]
        }
    });

    // 🗒️ Fetch and display notes
    const notesData = await fetchNotes();
    displayNotes(notesData);

    // 📊 Tasks Completion Status (Bar Chart)
    const taskBarCtx = document.getElementById('taskBarChart').getContext('2d');
    new Chart(taskBarCtx, {
        type: 'bar',
        data: {
            labels: ['Completed', 'Pending', 'Overdue'],
            datasets: [{
                label: 'Tasks',
                data: [5, 3, 2], // Static for now
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
});

// 🟢 Fetch scores data from API
const fetchScores = async () => {
    try {
        const response = await fetch(API_URL_SCORES);
        const data = await response.json();
        return data.scores;
    } catch (error) {
        console.error('[Fetch Error]:', error);
        alert('Failed to fetch scores.');
        return [];
    }
};

// 🟢 Prepare data for the pie chart
const prepareScoreData = (scores) => {
    const subjectScores = {};

    scores.forEach((score) => {
        const scoreValue = parseInt(score.score);
        if (subjectScores[score.subject]) {
            subjectScores[score.subject] += scoreValue;
        } else {
            subjectScores[score.subject] = scoreValue;
        }
    });

    const labels = Object.keys(subjectScores);
    const data = Object.values(subjectScores);

    return { labels, data };
};

// 🟢 Fetch notes data from API
const fetchNotes = async () => {
    try {
        const response = await fetch(API_URL_NOTES);
        const data = await response.json();
        return data.notes;
    } catch (error) {
        console.error('[Fetch Error]:', error);
        alert('Failed to fetch notes.');
        return [];
    }
};

// 🟢 Display notes in the HTML
const displayNotes = (notes) => {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = ''; // Clear previous notes if any

    if (notes.length === 0) {
        notesList.innerHTML = '<li class="list-group-item text-center text-muted">No notes available</li>';
        return;
    }

    notes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `
            <strong>${note.title}</strong>: ${note.description}
        `;
        notesList.appendChild(listItem);
    });
};

// 🟢 Generate random colors for charts
const generateColors = (count) => {
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED'
    ];
    while (colors.length < count) {
        colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }
    return colors.slice(0, count);
};
