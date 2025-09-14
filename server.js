// server.js — serves API + frontend in one process
// Run:
//   cd backend
//   npm init -y
//   npm install express cors body-parser
//   node server.js
//
// Open http://localhost:3000/

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ---------- Lessons (hardcoded) ----------
const lessons = [
  {
    id: "ai-basics",
    title: "AI Basics",
    duration: "20 min",
    level: "Beginner",
    content: `
# AI Basics
Artificial Intelligence (AI) is about making computers perform tasks that usually need human intelligence.

- **AI:** Makes decisions or predictions.
- **Machine Learning (ML):** Teaches computers using data.
- **Model:** Learns patterns from data.

**Examples:** spam filters, recommendation systems, speech recognition.
`
  },
  {
    id: "no-code-ai",
    title: "No-Code AI",
    duration: "15 min",
    level: "Beginner",
    content: `
# No-Code AI
No-code AI tools let you build AI without programming.

**Typical steps**
1. Upload data (CSV, text, images)
2. Pick a template (chatbot, classifier, Q&A)
3. Click train / configure
4. Share link or embed

**Benefit:** business users can prototype quickly.
**Trade-off:** less control than writing custom code.
`
  },
  {
    id: "rag",
    title: "Retrieval-Augmented Generation (RAG)",
    duration: "25 min",
    level: "Beginner",
    content: `
# RAG (Retrieval-Augmented Generation)
RAG = **Retriever** + **Generator**

1. **Retriever:** finds relevant text from your documents.
2. **Generator:** creates an answer using that text.

**Why RAG?**
- Grounds answers in your own docs
- Reduces hallucinations
- Enables citations
`
  },
  {
    id: "agents",
    title: "Agentic Workflows",
    duration: "20 min",
    level: "Beginner",
    content: `
# Agentic Workflows
"Agents" are programs that **decide next actions** based on goals and tools.

**Core ideas**
- Tools (search, summarize, email, DB query)
- Policies / rules (when to use which tool)
- Memory / state (what happened so far)
- Human-in-the-loop for approvals where needed

**Example flow:** Ingest file → Extract tasks → Draft summary → Ask for approval → Email the report.
`
  },
];

// ---------- Quizzes (hardcoded) ----------
const quizzes = {
  "ai-basics": [
    {
      id: "q1",
      question: "What is Artificial Intelligence?",
      options: [
        "A programming language",
        "Systems performing tasks needing human-like intelligence",
        "A database system",
        "A mobile app",
      ],
      answer: 1,
      explanation: "AI aims at tasks like reasoning, perception and decision-making."
    },
    {
      id: "q2",
      question: "Machine Learning teaches computers using:",
      options: ["Hard-coded rules", "Data and examples", "Graphics only", "Random numbers"],
      answer: 1,
      explanation: "ML learns patterns from data rather than explicit rules."
    },
    {
      id: "q3",
      question: "A 'model' is best described as:",
      options: [
        "A CSV file",
        "A program that learned patterns from data",
        "A network router",
        "An IDE"
      ],
      answer: 1,
      explanation: "Models internalize patterns from training data to make predictions."
    },
    {
      id: "q4",
      question: "Which is NOT a common AI application?",
      options: ["Spam filtering", "Recommenders", "Speech recognition", "Plastic molding"],
      answer: 3,
      explanation: "Plastic molding is manufacturing, not an AI application itself."
    },
    {
      id: "q5",
      question: "Data quality affects AI systems by:",
      options: ["No effect", "Affects accuracy & fairness", "Only changes speed", "Only changes UI"],
      answer: 1,
      explanation: "Garbage in → garbage out; biases and errors come from data."
    },
  ],
  "no-code-ai": [
    {
      id: "q1",
      question: "No-code AI mainly helps you:",
      options: [
        "Write low-level C code",
        "Build AI features via interfaces",
        "Design hardware chips",
        "Edit photos only",
      ],
      answer: 1,
      explanation: "It provides UI workflows for AI without coding."
    },
    {
      id: "q2",
      question: "First step in many no-code tools:",
      options: [
        "Compile the kernel",
        "Upload data (CSV/text/images)",
        "Flash BIOS",
        "Solder a circuit"
      ],
      answer: 1,
      explanation: "You usually start by adding your data."
    },
    {
      id: "q3",
      question: "Key advantage of no-code AI:",
      options: ["Maximum control", "Fast prototyping", "Highest performance always", "Offline only"],
      answer: 1,
      explanation: "Speed of iteration for non-developers is the main benefit."
    },
    {
      id: "q4",
      question: "Common limitation of no-code AI:",
      options: ["Cannot run in a browser", "Less customization at low level", "No data upload", "Needs a supercomputer"],
      answer: 1,
      explanation: "You trade some fine-grained control for simplicity."
    },
    {
      id: "q5",
      question: "Which workflow is typical?",
      options: [
        "Write device drivers → build kernel",
        "Pick template → upload data → click train",
        "Reverse engineer CPU",
        "Install GPU drivers only"
      ],
      answer: 1,
      explanation: "Templates + data + train is the common flow."
    },
  ],
  "rag": [
    {
      id: "q1",
      question: "What does the Retriever do in RAG?",
      options: ["Generates answers", "Finds relevant text from documents", "Stores images", "Sends emails"],
      answer: 1,
      explanation: "Retriever searches a knowledge base and returns passages."
    },
    {
      id: "q2",
      question: "Why is RAG useful?",
      options: [
        "It avoids using any data",
        "It grounds answers in your documents",
        "It guarantees 100% accuracy",
        "It replaces the internet"
      ],
      answer: 1,
      explanation: "Grounding reduces hallucinations and improves trust."
    },
    {
      id: "q3",
      question: "Correct order in a RAG flow:",
      options: [
        "Generate → Retrieve → Answer",
        "Question → Retrieve → Generate",
        "Store → Index → Delete",
        "Render → Paint → Layout"
      ],
      answer: 1,
      explanation: "You retrieve first, then use the retrieved text to generate."
    },
    {
      id: "q4",
      question: "What reduces hallucinations in RAG?",
      options: [
        "Ignoring documents",
        "Using retrieved documents as context",
        "Lowering GPU memory",
        "Turning off the model"
      ],
      answer: 1,
      explanation: "Grounding the generation with retrieved context helps."
    },
    {
      id: "q5",
      question: "RAG often includes:",
      options: [
        "Citations or sources",
        "Heat-sinks",
        "Motherboards",
        "Printers"
      ],
      answer: 0,
      explanation: "Citations help users verify the answer."
    },
  ],
  "agents": [
    {
      id: "q1",
      question: "An 'agent' in agentic workflows is:",
      options: [
        "A static web page",
        "A program that chooses and executes next actions",
        "Only a database table",
        "A PDF viewer"
      ],
      answer: 1,
      explanation: "Agents decide which tool to use next toward a goal."
    },
    {
      id: "q2",
      question: "Which is a common tool an agent may use?",
      options: ["Search", "Email send", "DB query", "All of the above"],
      answer: 3,
      explanation: "Agents combine multiple tools."
    },
    {
      id: "q3",
      question: "Human-in-the-loop means:",
      options: [
        "No human involvement",
        "Human approval/feedback at key steps",
        "Agents are humans",
        "Agents cannot run automatically"
      ],
      answer: 1,
      explanation: "A person can review or approve actions."
    },
    {
      id: "q4",
      question: "Example of an agentic flow:",
      options: [
        "Open Paint and draw",
        "Read file → Extract tasks → Draft summary → Ask approval",
        "Format C drive",
        "Change monitor brightness"
      ],
      answer: 1,
      explanation: "That sequence shows multi-step decision + tool use."
    },
    {
      id: "q5",
      question: "Main benefit of agentic workflows:",
      options: [
        "More manual work",
        "Automated multi-step tasks",
        "Slower processes",
        "Louder speakers"
      ],
      answer: 1,
      explanation: "They automate repetitive flows across tools."
    },
  ],
};

// ---------- API ----------
app.get("/api/lessons", (req, res) => {
  res.json(lessons.map(({ id, title, duration, level }) => ({ id, title, duration, level })));
});

app.get("/api/lessons/:id", (req, res) => {
  const lesson = lessons.find((l) => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: "Not found" });
  res.json(lesson);
});

// send sanitized quiz (no answers)
app.get("/api/quiz/:id", (req, res) => {
  const quiz = quizzes[req.params.id];
  if (!quiz) return res.status(404).json({ error: "No quiz" });
  res.json(quiz.map(q => ({ id: q.id, question: q.question, options: q.options })));
});

// submit answers → return score + feedback with correct answers
app.post("/api/quiz/:id/submit", (req, res) => {
  const quiz = quizzes[req.params.id];
  if (!quiz) return res.status(404).json({ error: "No quiz" });
  const userAnswers = req.body.answers || {};
  let score = 0;

  const feedback = quiz.map(q => {
    const correctIndex = q.answer;
    const userIndex = userAnswers[q.id];
    const correct = userIndex === correctIndex;
    if (correct) score++;
    return {
      questionId: q.id,
      question: q.question,
      correct,
      userAnswer: typeof userIndex === "number" ? q.options[userIndex] : null,
      correctAnswer: q.options[correctIndex],
      explanation: q.explanation
    };
  });

  const total = quiz.length;
  const percent = Math.round((score / total) * 100);
  res.json({ total, score, percent, feedback });
});

// ---------- Serve frontend ----------
const FRONTEND = path.join(__dirname, "..", "frontend");
app.use(express.static(FRONTEND));
app.get("/", (_req, res) => res.sendFile(path.join(FRONTEND, "index.html")));

app.listen(PORT, () => {
  console.log(`✔ AI Learning Portal at http://localhost:${PORT}`);
});
