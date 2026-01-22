import express from "express";
import { resolve } from "node:path";
import morgan from "morgan";

const __dirname = import.meta.dirname;
const app = express();
const port = process.env.PORT || 3000;
// const port = 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bandNameGenerator = (req, res, next) => {
  const { street, pet } = req.body;
  const format = (input) =>
    input.trim().charAt(0).toUpperCase() + input.slice(1).toLowerCase();

  req.bandName = `${format(street)} ${format(pet)}`;
  next();
};

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "public", "index.html"));
});

app.post("/submit", bandNameGenerator, (req, res) => {
  res.send(`<h1>Your band name is</h1> <h2>${req.bandName} 🤘</h2>`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
