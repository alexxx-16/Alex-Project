import express from "express";
import { resolve } from "node:path";
import morgan from "morgan";
import pg from "pg";
import axios from "axois";
import "dotenv/config";

const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const app = express();
const port = process.env.PORT || 3001;
const __dirname = import.meta.dirname;

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, "public")));

async function getBooks() {
  const result = await db.query("SELECT * FROM books");
  return result.rows.map((row) => ({
    title: row.title,
    date: row.date,
    rating: row.rating,
    review: row.review,
  }));
}

app.get("/", async (req, res) => {
  const books = await getBooks();
  res.render("index", { books: books });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
