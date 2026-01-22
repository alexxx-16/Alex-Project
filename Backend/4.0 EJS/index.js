import express from "express";
import { resolve } from "node:path";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = import.meta.dirname;

const getWelcomeMessage = () => {
  const day = new Date().getDay();
  return day === 6 || day === 0
    ? "Hey! It's the weekend, have a rest!"
    : "Hello, it's a weekday, it's time to work!";
};

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

app.use(morgan("dev"));
app.use(express.static(resolve(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { welcomeMessage: getWelcomeMessage() });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
