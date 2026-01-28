import express from "express";
import { resolve } from "node:path";
import morgan from "morgan";
import pg from "pg";
import axios from "axios";
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

async function getBooksWithCovers() {
  try {
    const result = await db.query(
      "SELECT b.date, b.title,b.rating, b.review, i.isbn FROM book b JOIN book_isbn i ON b.title = i.title ORDER BY date DESC",
    );
    const books = result.rows;
    console.log(books);

    // get book covers
    const bookCovers = await Promise.all(
      books.map(async (book) => {
        const bookcoverURL = `${process.env.API_URL}/isbn/${book.isbn}-M.jpg`;
        return { ...book, cover: bookcoverURL };
      }),
    );
    return bookCovers;
  } catch (err) {
    console.error("Database query error:", err.stack);
    return [];
  }
}

app.get("/", async (req, res) => {
  try {
    const books = await getBooksWithCovers();
    res.render("index", { books });
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
