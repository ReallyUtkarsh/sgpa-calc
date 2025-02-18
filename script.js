function resetValues() {
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
    document.getElementById('result').innerHTML = '';
}

function calculateSGPA() {
    let totalCredits = 15; // 5 subjects, each with 3 credits
    let totalCreditPoints = 0;
    let valid = true;
    let resultHtml = '<table><tr><th>Subject</th><th>Theory</th><th>Sessional</th><th>Grade Point</th></tr>';

    for (let i = 1; i <= 5; i++) {
        const theoryMarks = parseFloat(document.querySelector(`input[name=theory${i}]`).value);
        const sessionalMarks = parseFloat(document.querySelector(`input[name=sessional${i}]`).value);

        if (isNaN(theoryMarks) || isNaN(sessionalMarks) || theoryMarks > 70 || theoryMarks < 1 || sessionalMarks > 30 || sessionalMarks < 0) {
            document.getElementById('result').innerHTML = '<p style="color: red;">Invalid input! Please ensure theory marks are between 1 and 70 and sessional marks are between 0 and 30.</p>';
            valid = false;
            break;
        }

        const totalMarks = theoryMarks + sessionalMarks;
        const gradePoint = getGradePoint(totalMarks);
        const creditPoints = gradePoint * 3; // Default credit is 3
        totalCreditPoints += creditPoints;

        resultHtml += `<tr>
                           <td>Paper ${i}</td>
                           <td>${theoryMarks}</td>
                           <td>${sessionalMarks}</td>
                           <td>${gradePoint}</td>
                       </tr>`;
    }

    if (valid) {
        const sgpa = totalCreditPoints / totalCredits;
        resultHtml += `</table><p style="text-align: center;">SGPA: ${sgpa.toFixed(2)}</p>`;
        document.getElementById('result').innerHTML = resultHtml;
    }
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
