import express from "express";
import { resolve } from "node:path";
import morgan from "morgan";
import pg from "pg";

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "postgres",
  port: 5432,
});

let quiz = [
  { country: "France", capital: "Paris" },
  { country: "United Kingdom", capital: "London" },
  { country: "United States of America", capital: "New York" },
];
let currentQuestion = {};
let totalCorrect = 0;

db.connect();
db.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows;
    console.log("Database loaded successfully.");
  }
  db.end();
});

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, "public")));
app.use(morgan("dev"));

function nextQuestion() {
  const nextRandomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = nextRandomCountry;
}

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  console.log(currentQuestion);
  res.render("index", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  const answer = req.body.answer.trim();
  console.log(answer);
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();

  if (isCorrect) {
    console.log(currentQuestion);
  }

  res.render("index", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
