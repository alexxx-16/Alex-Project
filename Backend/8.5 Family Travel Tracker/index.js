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

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, "public")));

let currentUserId = 1;

async function getUsers() {
  let result = await db.query("SELECT * from users");
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    color: row.color,
  }));
}

async function checkVisitedCountries() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries WHERE user_id = $1",
    [currentUserId],
  );
  return result.rows.map((row) => row.country_code);
}

async function getHomeData() {
  const users = await getUsers();
  const countries = await checkVisitedCountries();
  const currentUser =
    users.find((user) => user.id == currentUserId) || users[0];
  return {
    users,
    countries,
    total: countries.length,
    color: currentUser ? currentUser.color : "teal",
  };
}

app.get("/", async (req, res) => {
  try {
    const data = await getHomeData();
    res.render("index.ejs", data);
    console.log(data.users);
  } catch (err) {
    console.error("Error", err);
    res.status(500).send("Server Error");
  }
});

// add country
app.post("/add", async (req, res) => {
  const input = req.body.country;

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()],
    );
    // successfully add country
    if (result.rows.length !== 0) {
      const countryCode = result.rows[0].country_code;
      try {
        await db.query(
          "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
          [countryCode, currentUserId],
        );
        res.redirect("/");
      } catch (err) {
        //already entered
        console.error;
        const data = await getHomeData();
        res.render("index", {
          countries: data.countries,
          total: data.total,
          color: data.color,
          users: data.users,
          error: "Country has already been added, try again.",
        });
      }

      // country doesnt exist
    } else {
      const data = await getHomeData();
      res.render("index.ejs", {
        countries: data.countries,
        total: data.total,
        users: data.users,
        color: data.color,
        error: "Country name not found, try again.",
      });
    }
  } catch (err) {
    console.log("Error adding country:", err);
    res.redirect("/");
  }
});

// switch users or add new user
app.post("/user", (req, res) => {
  // console.log(req.body);
  if (req.body.add) {
    res.render("new");
  } else {
    currentUserId = req.body.user;
    res.redirect("/");
  }
});

//add user detail page
app.post("/new", async (req, res) => {
  const users = await getUsers();
  // console.log(users);
  // console.log(req.body);

  const result = await db.query(
    "INSERT INTO users (id,name,color) VALUES ($1,$2,$3) RETURNING id",
    [users.length + 1, req.body.name, req.body.color],
  );
  currentUserId = result.rows[0].id;
  // console.log(currentUserId);

  res.redirect("/");
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
