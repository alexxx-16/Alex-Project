import express from "express";
import { resolve } from "node:path";
import pg from "pg";
import bcrypt from "bcrypt";
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
const saltRounds = 5;

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username: email, password } = req.body;

  try {
    const checkResult = await db.query(
      "SELECT * FROM web_user WHERE email = $1",
      [email],
    );
    // email already registered
    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      // success entry
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing", err);
        }
        await db.query(
          "INSERT INTO web_user (email, password) VALUES ($1, $2)",
          [email, hash],
        );
        res.render("secrets.ejs");
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const { username: email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM web_user WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      const storedPassword = result.rows[0].password;

      bcrypt.compare(password, storedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords", err);
        } else {
          if (result) {
            res.render("secrets.ejs");
          } else {
            res.send("Wrong password");
          }
        }
      });
    } else {
      res.send("User doesn't exist");
    }
  } catch (err) {
    res.console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
