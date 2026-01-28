import express from "express";
import axios from "axios";
import { resolve } from "node:path";
import morgan from "morgan";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3001;
const __dirname = import.meta.dirname;
const secretAPI = axios.create({
  baseURL: process.env.API_URL,
  timeout: 5000,
});

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

app.use(express.static(resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  try {
    const result = await secretAPI.get("/random");
    const { secret, username } = result.data;
    res.render("index", {
      secret: secret,
      user: username,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.render("index", {
      secret: "The secrets are locked away right now...",
      user: "Mr. Strange",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
