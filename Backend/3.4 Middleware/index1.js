import express from "express";
import { resolve } from "node:path";
import morgan from "morgan";
const __dirname = import.meta.dirname;

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "public/index.html"));
});

app.post("/submit", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
