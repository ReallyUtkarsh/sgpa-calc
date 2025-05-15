const subjectsData = {
    "Semester-1": ["CIPA", "ATCE", "PPA", "EIFA", "CA"],
    "Semester-2": ["PA", "ADT", "PPA", "IAD", "C&A"]
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
                    <input type="number" name="theory-${subject}" placeholder="Theory Marks" min="1" max="70">
                    <input type="number" name="sessional-${subject}" placeholder="Sessional Marks" min="0" max="30">
                </div>`;
        });
    }
}

function calculateSGPA() {
    let rollNumber = document.getElementById('rollNumber').value.trim();
    let semester = document.getElementById('semester').value;
    let subjects = subjectsData[semester];

    if (!rollNumber || !semester) {
        alert("Please enter Roll Number and select a Semester.");
        return;
    }

    let totalCredits = subjects.length * 3;
    let totalCreditPoints = 0;
    let subjectData = [];

    subjects.forEach(subject => {
        let theoryMarks = parseFloat(document.querySelector(`input[name=theory-${subject}]`).value);
        let sessionalMarks = parseFloat(document.querySelector(`input[name=sessional-${subject}]`).value);
        const totalMarks = theoryMarks + sessionalMarks;
        const gradePoint = getGradePoint(totalMarks);
        totalCreditPoints += gradePoint * 3;
        subjectData.push({ name: subject, theory: theoryMarks, sessional: sessionalMarks });
    });

    let sgpa = (totalCreditPoints / totalCredits).toFixed(2);
    document.getElementById('result').innerHTML = `<p class="bold-text">SGPA: ${sgpa}</p>`;

    fetch("YOUR_GOOGLE_SHEET_URL_HERE", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, semester, subjects: subjectData, sgpa })
    });
}
