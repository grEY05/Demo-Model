const API = "/api";
const $ = (sel) => document.querySelector(sel);

function getParam(name) {
  return new URL(window.location.href).searchParams.get(name);
}

const lessonId = getParam("id");

function renderMarkdown(simple) {
  // minimal formatting: headers, bold, lists, double line breaks
  return simple
    .replace(/^# (.*)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n\n/g, "<br/>");
}

async function loadLesson() {
  const res = await fetch(`${API}/lessons/${lessonId}`);
  const lesson = await res.json();
  $("#lessonTitle").textContent = lesson.title;
  $("#lessonContent").innerHTML = renderMarkdown(lesson.content);

  const qres = await fetch(`${API}/quiz/${lessonId}`);
  const questions = await qres.json();
  renderQuiz(questions);
}

function renderQuiz(questions) {
  const container = $("#quizContainer");
  container.innerHTML = "";
  questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question";
    const options = q.options.map((opt, idx) =>
      `<label><input type="radio" name="${q.id}" value="${idx}"> ${opt}</label>`
    ).join("<br/>");
    div.innerHTML = `<b>Q${i + 1}. ${q.question}</b>${options}`;
    container.appendChild(div);
  });

  $("#submitBtn").onclick = async () => {
    const answers = {};
    questions.forEach(q => {
      const chosen = document.querySelector(`input[name="${q.id}"]:checked`);
      if (chosen) answers[q.id] = Number(chosen.value);
    });

    const res = await fetch(`${API}/quiz/${lessonId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });
    const result = await res.json();

    // Save best score for badges on home page
    const key = `lesson:${lessonId}:bestScore`;
    const prevBest = Number(localStorage.getItem(key) || 0);
    if (result.score > prevBest) localStorage.setItem(key, result.score);

    $("#result").textContent = `Score: ${result.score}/${result.total} (${result.percent}%)`;
    $("#bar").style.width = `${result.percent}%`;

    const fb = $("#feedback");
    fb.style.display = "block";
    fb.innerHTML = result.feedback.map(item => `
      <div class="row">
        <div class="${item.correct ? "ok" : "ng"}">
          ${item.correct ? "✓ Correct" : "✗ Incorrect"}
        </div>
        <div><b>${item.question}</b></div>
        ${item.userAnswer !== null ?
          `<div>Your answer: ${item.userAnswer}</div>` :
          `<div>Your answer: <i>not selected</i></div>`}
        <div>Correct answer: <b>${item.correctAnswer}</b></div>
        <div style="color:#6b7280">${item.explanation}</div>
      </div>
    `).join("");
  };

  $("#resetBtn").onclick = () => {
    document.querySelectorAll(`#quizContainer input[type="radio"]`).forEach(i => i.checked = false);
    $("#result").textContent = "";
    $("#bar").style.width = "0%";
    $("#feedback").style.display = "none";
    $("#feedback").innerHTML = "";
  };
}

loadLesson();
