const subjects = {
  1: ["PA", "ADT - CE", "PPA", "EIFA", "C&A"],
  2: ["PA", "ADT - ME", "PPA", "IAD", "C&A"]
};

const form = document.getElementById("marksForm");
const semesterSelect = document.getElementById("semester");
const calculateBtn = document.getElementById("calculateBtn");
const resultDiv = document.getElementById("result");

semesterSelect.addEventListener("change", () => {
  form.innerHTML = "";
  resultDiv.innerHTML = "";
  const sem = semesterSelect.value;
  if (!sem) return;

  subjects[sem].forEach(sub => {
    const row = document.createElement("div");
    row.innerHTML = `
      <label>${sub}</label>
      <input type="number" min="0" max="30" placeholder="Sessional" inputmode="numeric" required />
      <input type="number" min="0" max="70" placeholder="Theory" inputmode="numeric" required />
      <br />
    `;
    form.appendChild(row);
  });
  calculateBtn.disabled = false;
});

function getGradePoint(total) {
  if (total >= 91) return 10;
  if (total >= 81) return 9;
  if (total >= 71) return 8;
  if (total >= 61) return 7;
  if (total >= 51) return 6;
  if (total >= 41) return 5;
  if (total >= 31) return 4;
  return 0;
}

calculateBtn.addEventListener("click", () => {
  const roll = document.getElementById("roll").value;
  const sem = semesterSelect.value;
  if (!roll || !sem) return alert("Please fill in roll number and semester.");

  const inputs = form.querySelectorAll("input");
  const data = [];
  let totalPoints = 0;
  let totalCredits = 0;

  for (let i = 0; i < inputs.length; i += 2) {
    const sessional = parseInt(inputs[i].value);
    const theory = parseInt(inputs[i + 1].value);
    if (sessional > 30 || theory > 70) return alert("Marks exceed maximum allowed.");
    const total = sessional + theory;
    const gradePoint = getGradePoint(total);
    totalPoints += gradePoint * 3;
    totalCredits += 3;
    data.push({
      subject: subjects[sem][i / 2],
      sessional,
      theory,
      total,
      gradePoint
    });
  }

  const sgpa = (totalPoints / totalCredits).toFixed(2);

  let html = `<table><tr><th>Subject</th><th>Sessional</th><th>Theory</th><th>Total</th><th>Grade</th></tr>`;
  data.forEach(row => {
    html += `<tr><td>${row.subject}</td><td>${row.sessional}</td><td>${row.theory}</td><td>${row.total}</td><td>${row.gradePoint}</td></tr>`;
  });
  html += `</table><h2>SGPA: ${sgpa}</h2>`;
  resultDiv.innerHTML = html;

  fetch("https://script.google.com/macros/s/AKfycbxHnblehTGfyta5FdWD9POe172FJLWw1MwwUvxVEjrjbRiV1RgvmX7kVkZno0ymznua/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roll: roll, sgpa: sgpa })
  });
});
