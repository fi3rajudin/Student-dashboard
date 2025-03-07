function appendToDisplay(value) {
    document.getElementById('calc-display').value += value;
}

function clearDisplay() {
    document.getElementById('calc-display').value = '';
}

function calculateResult() {
    try {
        let result = eval(document.getElementById('calc-display').value);
        document.getElementById('calc-display').value = result;
    } catch (error) {
        document.getElementById('calc-display').value = 'Error';
    }
}

function backspace() {
    let display = document.getElementById('calc-display').value;
    document.getElementById('calc-display').value = display.slice(0, -1);
}

//GPA Calculator function

const gradePoints = {
    "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0
};

function addCourseRow() {
    const row = `<tr>
        <td><input type="text" class="form-control"></td>
        <td><input type="number" class="form-control" min="1"></td>
        <td><input type="text" class="form-control"></td>
    </tr>`;
    document.getElementById("courseTable").insertAdjacentHTML("beforeend", row);
}

function calculateGPA() {
    const rows = document.querySelectorAll("#courseTable tr");
    let totalCredits = 0, totalPoints = 0;

    rows.forEach(row => {
        const cells = row.querySelectorAll("input");
        const credits = parseFloat(cells[1].value);
        const grade = cells[2].value.toUpperCase();

        if (credits > 0 && gradePoints[grade] !== undefined) {
            totalCredits += credits;
            totalPoints += gradePoints[grade] * credits;
        }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    document.getElementById("gpa-result").innerText = gpa;
}