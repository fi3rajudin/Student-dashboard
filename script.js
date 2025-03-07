// const API_URL_SCORES = 'https://api.sheety.co/9e85471184750ab5c58772ba225a1c1a/studentDashboard/scores';
// const API_URL_NOTES = 'https://api.sheety.co/9e85471184750ab5c58772ba225a1c1a/studentDashboard/notes';
// const API_URL_TRACKER = 'https://api.sheety.co/9e85471184750ab5c58772ba225a1c1a/studentDashboard/tracker'

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

//Creating tracker bar chart

d3.json(API_URL_TRACKER).then(data => {
    console.log(data.tracker);
    const dataset = data.tracker;
    const svg = d3.select("#trackerBarChart");  // Target the new SVG element

    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const padding = 40;

    // Extract subjects and hours
    const subjects = dataset.map(d => d.subject);
    const hours = dataset.map(d => d.hours);

    // xScale for subjects (categorical data)
    const xScale = d3.scaleBand()
        .domain(subjects)
        .range([padding, width - padding])
        .padding(0.2);

    // yScale for hours
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(hours)])
        .range([height - padding, padding]);

    // x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height - padding})`)
        .call(xAxis);

    // y-axis
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding},0)`)
        .call(yAxis);

    // Create the bars
    svg.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.subject))
        .attr("y", d => yScale(d.hours))
        .attr("width", xScale.bandwidth())
        .attr("height", d => Math.max(0, height - padding - yScale(d.hours)))
        .attr("class", "bar")
        .attr("fill", "#69b3a2")
        .on("mouseover", (event, data) => {
            d3.select("#tooltip")
                .style("display", "block")
                .style("left", (event.pageX - 170) + "px")
                .style("top", (event.pageY - 60) + "px")
                .html(`Subject: ${data.subject} <br/> Hours: ${data.hours}`);
        })
        .on("mouseout", () => {
            d3.select("#tooltip").style("display", "none");
        });

    // Tooltip for displaying data on hover
    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ddd")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("display", "none");

}).catch(error => {
    console.log(error);
});