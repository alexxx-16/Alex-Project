import express from "express";
import axios from "axios";
import { resolve } from "node:path";
import morgan from "morgan";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3001;
const __dirname = import.meta.dirname;
const newsAPI = axios.create({
  baseURL: process.env.API_URL,
  timeout: 5000,
  params: {
    "api-key": process.env.API_KEY,
  },
});

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

app.use(express.static(resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/getNews", async (req, res) => {
  try {
    const { topic } = req.body;
    const result = await newsAPI.get("/search", { params: { q: topic } });
    const news = result.data.response.results;
    // console.log(news);
    res.render("index", { topic: topic, news: news });
  } catch (error) {
    res.status(404);
    console.error("Error:", error.message);
  }
});

app.listen(port, (req, res) => {
  console.log(`Server running on http://localhost:${port}.`);
});
