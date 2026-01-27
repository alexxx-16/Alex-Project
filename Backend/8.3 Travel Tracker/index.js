import express from "express";
import { resolve } from "node:path";
import morgan from "morgan";
import pg from "pg";
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

app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, "public")));
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

async function getVisitedCountries() {
  const result = await db.query("SELECT * FROM visited_countries");
  return result.rows.map((country) => country.country_code);
}

app.get("/", async (req, res) => {
  try {
    const countries = await getVisitedCountries();
    res.render("index", {
      total: countries.length,
      countries: countries,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
