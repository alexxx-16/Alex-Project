import express from "express";
import { resolve } from "node:path";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = import.meta.dirname;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(resolve(__dirname, "public", "index.html"));
});

app.post("/check", (req, res) => {
  if (req.body.password === "ILoveProgramming") {
    console.log("Password correct.");
    res.sendFile(resolve(__dirname, "public", "secret.html"));
  } else {
    console.log(`Wrong password entered: ${req.body.password}`);
    res.send("<h1>Sorry wrong password.</h1><a href='/'>Try again</a>");
  }
});

app.use((req, res) => {
  res.status(404).send("<h1>Page not found.</h1>");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
