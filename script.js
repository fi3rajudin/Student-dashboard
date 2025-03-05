const API_URL_SCORES = 'https://api.sheety.co/8a2495540de3f6b32f93631ef4abf0bd/studentDashboard/scores';

document.addEventListener("DOMContentLoaded", async () => {
    // Fetch scores data from API
    const scoresData = await fetchScores();
    const { labels, data } = prepareScoreData(scoresData);

    // 🥧 Score Distribution (Pie Chart)
    const scorePieCtx = document.getElementById('scorePieChart').getContext('2d');
    const scorePieChart = new Chart(scorePieCtx, {
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

    // 📈 Scores Over Time (Line Chart)
    const scoreLineCtx = document.getElementById('scoreLineChart').getContext('2d');
    new Chart(scoreLineCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Scores',
                data: [78, 82, 88, 90], // Static for now
                borderColor: '#36A2EB',
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

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

// Fetch scores data from API
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

// Prepare data for the pie chart
const prepareScoreData = (scores) => {
    const subjectScores = {};

    scores.forEach((score) => {
        if (subjectScores[score.subject]) {
            subjectScores[score.subject] += parseInt(score.score);
        } else {
            subjectScores[score.subject] = parseInt(score.score);
        }
    });

    const labels = Object.keys(subjectScores);
    const data = Object.values(subjectScores);

    return { labels, data };
};

// Generate random colors for charts
const generateColors = (count) => {
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED'
    ];
    while (colors.length < count) {
        colors.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
    }
    return colors.slice(0, count);
};
