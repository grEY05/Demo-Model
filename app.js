// Use same origin (server serves frontend), so relative API path works
const API = "/api";

function statusBadgeFor(id, total) {
  const best = Number(localStorage.getItem(`lesson:${id}:bestScore`) || 0);
  if (!best) return "";
  if (best >= (total || 5)) return `<span class="badge good">✓ Completed</span>`;
  return `<span class="badge warn">In progress (${best}/${total || "?"})</span>`;
}

async function loadLessons() {
  const res = await fetch(`${API}/lessons`);
  const lessons = await res.json();
  const container = document.getElementById("lessonList");
  container.innerHTML = "";

  lessons.forEach(l => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${l.title} ${statusBadgeFor(l.id, 5)}</h3>
      <div class="meta">${l.level} • ${l.duration}</div>
      <div class="actions">
        <a class="btn" href="/lesson.html?id=${l.id}">Open Lesson</a>
      </div>
    `;
    container.appendChild(div);
  });
}

loadLessons();
