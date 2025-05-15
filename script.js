const subjectsData = {
    "Semester-1": ["CIPA", "ATCE", "PPA", "EIFA", "CA"],
    "Semester-2": ["PA", "ADT", "PPA", "PPA", "IAD", "C&A"]
};

function loadSubjects() {
    let semester = document.getElementById('semester').value;
    let subjectsDiv = document.getElementById('subjects');
    subjectsDiv.innerHTML = "";

    if (semester) {
        subjectsData[semester].forEach(subject => {
            subjectsDiv.innerHTML += `
                <div class="subject">
                    <label>${subject}:</label>
                    <input type="number" name="theory" placeholder="Theory Marks" min="1" max="70">
                    <input type="number" name="sessional" placeholder="Sessional Marks" min="0" max="30">
                </div>`;
        });
    }
}

function calculateSGPA() {
    let rollNumber = document.getElementById('rollNumber').value.trim();
    let semester = document.getElementById('semester').value;
    let subjects = document.querySelectorAll('.subject');

    if (!rollNumber || !semester) {
        alert("Please enter Roll Number and select a Semester.");
        return;
    }

    let totalCredits = subjects.length * 3;
    let totalCreditPoints = 0;
    let subjectData = [];

    subjects.forEach(subject => {
        let theoryMarks = parseFloat(subject.querySelector('input[name=theory]').value);
        let sessionalMarks = parseFloat(subject.querySelector('input[name=sessional]').value);
        totalCreditPoints += getGradePoint(theoryMarks + sessionalMarks) * 3;
        subjectData.push({ name: subject.querySelector('label').innerText, theory: theoryMarks, sessional: sessionalMarks });
    });

    let sgpa = (totalCreditPoints / totalCredits).toFixed(2);

    fetch("YOUR_GOOGLE_SHEET_URL_HERE", {
        method: "POST",
        body: JSON.stringify({ rollNumber, semester, subjects: subjectData, sgpa }),
        headers: { "Content-Type": "application/json" }
    });

    document.getElementById('result').innerHTML = `<p class="bold-text">SGPA: ${sgpa}</p>`;
}
