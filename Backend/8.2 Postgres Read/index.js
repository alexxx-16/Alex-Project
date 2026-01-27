import express from "express";
import { resolve } from "node:path";
import morgan from "morgan";
import pg from "pg";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3001;
const __dirname = import.meta.dirname;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, "public")));
app.use(morgan("dev"));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

let quiz = [];
let totalCorrect = 0;
let currentQuestion = {};

db.connect();
db.query("SELECT * FROM flags", (error, res) => {
  if (error) {
    console.log("Error executing query", err.stack);
  } else {
    quiz = res.rows;
    console.log("Database loaded successfully.");
  }
  db.end();
});

function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

app.get("/", (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.name.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }
  nextQuestion();

  if (isCorrect) {
    console.log(currentQuestion);
  }

  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });

  // res.render("index", {
  //   question: currentQuestion,
  //   wasCorrect: isCorrect,
  //   totalScore: totalCorrect,
  //   error: `Incorrect! The country of ${currentQuestion.flag} is ${currentQuestion.country}`,
  // });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
