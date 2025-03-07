 const API_URL = 'https://api.sheety.co/9e85471184750ab5c58772ba225a1c1a/studentDashboard/scores';
const API_KEY = 'thisisasecretkeyforthisapi';  // Replace with your actual API key

// Fetch and display employees when the page loads
document.addEventListener('DOMContentLoaded', getScores);

// Get scores from the API
function getScores() {
    const scoreTable = document.getElementById('scoreTable');
    scoreTable.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';  // Loading state
    
    fetch(API_URL, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => response.json())
    .then(data => {
        const scoreTable = document.getElementById('scoreTable');
        scoreTable.innerHTML = '';  // Clear previous data

        data.scores.forEach(scores => {
            const row = `
                <tr>
                    <td>${scores.subject}</td>
                    <td>${scores.score}</td>
                    <td>${scores.grade}</td>
                    <td>${scores.datereceived}</td>
                </tr>
            `;
            scoreTable.innerHTML += row;
        });
    })
    .catch(error => console.error('[Error] :', error));
}


//when button is clicked, the function is called

const addBtn = document.getElementById('add_btn');
addBtn.addEventListener('click', () => { 
    const subject = document.getElementById('subject').value;
    const score  = document.getElementById('score').value;
    const grade = document.getElementById('grade').value;
    const datereceived = document.getElementById('datereceived').value;

    //this is the data that will be sent to the server
    //it should follow the format of the data in the database 
    //the data should be in json format that we can test in postman
    const data = {
        "score": {  
            "subject": subject,
            "score": score,
            "grade": grade,
            "datereceived": datereceived
        }
    }

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        alert('Data sent successfully');
        getScores();
    }).catch(error => {
        alert('Error occured');
        console.error('[Error] :', error);
    })

    
})