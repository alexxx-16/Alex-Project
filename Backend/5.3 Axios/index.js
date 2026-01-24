import express from "express";
import axios from "axios";
import { resolve } from "node:path";
import morgan from "morgan";

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;
const API_URL = "https://bored-api.appbrewery.com";

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

app.use(express.static(resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/random`);
    const result = response.data;
    res.render("index", { activity: result });
  } catch (error) {
    console.error("Error: ", error.message);
    res.render("index", { error: error.message });
  }
});

app.post("/", async (req, res) => {
  try {
    const { type, participants } = req.body;
    // const params = {};
    // if (type) params.type = type;
    // if (participants) params.participants = participants;
    const params = {
      ...(type && { type }),
      ...(participants && { participants }),
    };

    const response = await axios.get(`${API_URL}/filter`, {
      params,
    });
    const results = response.data;

    if (!results || results.length === 0) {
      throw new Error("Not found or empty array.");
    }

    const result = results[Math.floor(Math.random() * response.data.length)];

    res.render("index", {
      activity: result,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.render("index", {
      error:
        error.response?.status === 404
          ? "No activities match your section."
          : "Something went wrong, please try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
