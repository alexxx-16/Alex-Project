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

app.set("view engine", "views");
app.set("views", resolve(__dirname, "views"));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, "public")));

let defaultList = [
  { id: 1, title: "This is a todo list" },
  { id: 2, title: "Enter your tasks" },
];

async function getList() {
  const result = await db.query("SELECT * FROM todo_list ORDER BY id ASC");
  return result.rows.map((row) => ({ id: row.id, title: row.title }));
}

app.get("/", async (req, res) => {
  const list = await getList();
  const displayList = list.length > 0 ? list : defaultList;
  // console.log(list);
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const errorMessage = req.query.error || null;

  res.render("index.ejs", {
    listTitle: `Things to do on ${today}`,
    listItems: displayList,
    error: errorMessage,
  });
});

app.post("/add", async (req, res) => {
  const input = req.body.newItem;
  // capitalise first letter in css instead
  // console.log(input);

  //empty input
  if (!input || input === "") {
    console.log("Empty input.");
    return res.redirect("/?error=Task cannot be empty");
  }
  // good input
  try {
    await db.query("INSERT INTO todo_list (title) VALUES ($1)", [input]);
    res.redirect("/");
    //duplicated inputs
  } catch (err) {
    if (err.code === "23505") {
      console.log(`Input ${input} already exists.`);
      return res.redirect("/?error=Task already exists");
    } else {
      console.error(err);
      return res.redirect("/?error=Database error");
    }
  }
});

app.post("/edit", async (req, res) => {
  // console.log(req.body);
  const { updatedItemId, updatedItemTitle } = req.body;
  const formattedUpdatedTitle =
    updatedItemTitle.charAt(0).toUpperCase() + updatedItemTitle.slice(1);
  await db.query("UPDATE todo_list SET title = $1 WHERE id = $2", [
    formattedUpdatedTitle,
    updatedItemId,
  ]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  await db.query("DELETE FROM todo_list WHERE id = $1", [id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
