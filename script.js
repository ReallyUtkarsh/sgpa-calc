function resetValues() {
    document.querySelectorAll('input, select').forEach(input => input.value = '');
    document.getElementById('result').innerHTML = '';
}

function calculateSGPA() {
    let rollNumber = document.getElementById('rollNumber').value.trim();
    let semester = document.getElementById('semester').value;
    if (!rollNumber) {
        alert("Roll Number is mandatory!");
        return;
    }

    let totalCredits = 15;
    let totalCreditPoints = 0;
    let valid = true;
    let resultHtml = '<table><tr><th>Subject</th><th>Theory</th><th>Sessional</th><th>Grade Point</th></tr>';

    for (let i = 1; i <= 5; i++) {
        let theoryMarks = parseFloat(document.querySelector(`input[name=theory${i}]`).value);
        let sessionalMarks = parseFloat(document.querySelector(`input[name=sessional${i}]`).value);

        const totalMarks = theoryMarks + sessionalMarks;
        const gradePoint = getGradePoint(totalMarks);
        totalCreditPoints += gradePoint * 3;

        resultHtml += `<tr><td>Paper ${i}</td><td>${theoryMarks}</td><td>${sessionalMarks}</td><td>${gradePoint}</td></tr>`;
    }

    const sgpa = (totalCreditPoints / totalCredits).toFixed(2);
    resultHtml += `</table><p class="bold-text">SGPA: ${sgpa}</p>`;
    document.getElementById('result').innerHTML = resultHtml;
}

async function submitSGPA() {
    let rollNumber = document.getElementById('rollNumber').value;
    let semester = document.getElementById('semester').value;
    let sgpa = document.querySelector('.bold-text').textContent.replace("SGPA: ", "").trim();

    await fetch("https://script.google.com/macros/s/AKfycbzlTuPxDBTvMgT2dHdK0SZPTvCtxQME2XbjLXCpUXD8omBapA5DDTMo1p1Yw2fv-eJdow/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, semester, sgpa })
    });

    alert("SGPA saved successfully!");
}
document.getElementById("saveSGPA").addEventListener("click", submitSGPA);
