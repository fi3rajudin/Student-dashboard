 const API_URL = 'https://api.sheety.co/9e85471184750ab5c58772ba225a1c1a/studentDashboard/notes';
//Getnotes function
console.log("notes.js loaded");
document.addEventListener('DOMContentLoaded', getNotes);

function getNotes() {
    const noteTable = document.getElementById('noteTable');
    noteTable.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';  // Loading state
    
    fetch(API_URL, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("API Response : ", data);
        const noteTable = document.getElementById('noteTable');
        noteTable.innerHTML = '';  // Clear previous data

        data.notes.forEach(note => {
            const row = `
                <tr>
                    <td>${note.title}</td>
                    <td>${note.description}</td>
                </tr>
            `;
            noteTable.innerHTML += row;
        });
    })
    .catch(error => console.error('[Error] :', error));
}


//when button is clicked, the function is called

const addBtn = document.getElementById('add_note_btn');
addBtn.addEventListener('click', () => { 
    const title = document.getElementById('title').value;
    const description  = document.getElementById('description').value;

    //this is the data that will be sent to the server
    //it should follow the format of the data in the database 
    //the data should be in json format that we can test in postman
    const data = {
        "note": {  
            "title": title,
            "description": description
        }
    }

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        console.log("Status Code:", response.status);
        console.log("Response:", response);
        return response.json();
    })
    .then(data => {
        console.log("API Response Data:", data);
         //to add an alert that is user friendly and no need of user interaction,
         document.querySelector(".alert-success").removeAttribute("hidden");
         setTimeout(()=>{
             document.querySelector(".alert-success").setAttribute("hidden",true)
         },2000) //adding delay so the user can read the message
        getNotes();
    })
    .catch(error => {
        console.error('[Error] :', error);
        //to add an alert that is user friendly and no need of user interaction,
        document.querySelector(".alert-danger").removeAttribute("hidden");
        setTimeout(()=>{
            document.querySelector(".alert-danger").setAttribute("hidden",true)
        },2000) //adding delay so the user can read the message
    }); 
}
);