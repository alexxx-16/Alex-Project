import express from "express";
import { resolve } from "node:path";
import pg from "pg";
import "dotenv/config";
import morgan from "morgan";

const db = new pg.Pool({
  ser: process.env.DB_USER,
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

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

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

  // didnt enter both fields
  if (!email || !password) {
    return res.status(400).send("Both email and password are required");
  }

  // email duplicate
  try {
    await db.query("INSERT INTO web_user(email, password) VALUES ($1,$2)", [
      email,
      password,
    ]);
    res.render("secrets");
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).send("Email already exists");
    }

    // other errors
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  const { username: email, password } = req.body;

  // didnt enter both
  if (!email || !password) {
    return res.status(400).send("Both email and password are required");
  }

  try {
    const userPassword = await db.query(
      "SELECT password FROM web_user WHERE email = $1",
      [email],
    );

    //user doesnt exist
    if (userPassword.rows.length === 0) {
      return res.status(404).send("User doen't exist please register first");
    }

    const savedUserPassword = userPassword.rows[0].password;
    // password correct
    if (password === savedUserPassword) {
      res.render("secrets");
    } else {
      // password incorrect
      return res.status(401).send("Password incorrect");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
