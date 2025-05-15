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
                    <input type="number" name="theory${subject}" placeholder="Theory Marks" min="1" max="70">
                    <input type="number" name="sessional${subject}" placeholder="Sessional Marks" min="0" max="30">
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
        let theoryMarks = parseFloat(document.querySelector(`input[name=theory${subject}]`).value);
        let sessionalMarks = parseFloat(document.querySelector(`input[name=sessional${subject}]`).value);

        if (isNaN(theoryMarks) || isNaN(sessionalMarks) || theoryMarks > 70 || theoryMarks < 1 || sessionalMarks > 30 || sessionalMarks < 0) {
            alert(`Invalid marks entered for ${subject}. Ensure theory marks are between 1 and 70, and sessional marks are between 0 and 30.`);
            return;
        }

        const totalMarks = theoryMarks + sessionalMarks;
        const gradePoint = getGradePoint(totalMarks);
        totalCreditPoints += gradePoint * 3;
        subjectData.push({ name: subject, theory: theoryMarks, sessional: sessionalMarks });
    });

    let sgpa = (totalCreditPoints / totalCredits).toFixed(2);

    // Display the SGPA
    document.getElementById('result').innerHTML = `<p class="bold-text">SGPA: ${sgpa}</p>`;

    // Save the data to Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbzlTuPxDBTvMgT2dHdK0SZPTvCtxQME2XbjLXCpUXD8omBapA5DDTMo1p1Yw2fv-eJdow/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, semester, subjects: subjectData, sgpa })
    })
    .then(response => response.text())
    .then(data => {
        console.log("Data saved successfully:", data);
    })
    .catch(error => console.error("Error saving data:", error));
}

function getGradePoint(marks) {
    if (marks >= 91) return 10;
    if (marks >= 81) return 9;
    if (marks >= 71) return 8;
    if (marks >= 61) return 7;
    if (marks >= 51) return 6;
    if (marks >= 41) return 5;
    if (marks >= 31) return 4;
    return 0;
}
