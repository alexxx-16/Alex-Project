import express from "express";
import axios from "axios";
import { resolve } from "node:path";
import morgan from "morgan";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3001;
const __dirname = import.meta.dirname;
const API_URL = process.env.API_URL;
const yourBearerToken = process.env.BEARER_TOKEN;
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  try {
    const { id } = req.body;
    const response = await axios.get(`${API_URL}/secrets/${id}`, config);
    res.render("index", {
      content: JSON.stringify(response.data),
    });
  } catch (error) {
    res.render("index", {
      content: error.response?.data?.message || "Secret not found",
    });
  }
});

app.post("/post-secret", async (req, res) => {
  try {
    const { secret, score } = req.body;
    if (!secret || !score) {
      return res.render("index", {
        content: "Please provide both Secret and Score.",
      });
    }
    const response = await axios.post(`${API_URL}/secrets`, req.body, config);
    res.render("index", {
      content: JSON.stringify(response.data),
    });
  } catch (error) {
    res.render("index", {
      content: error.response?.data?.message || "Secret not found",
    });
  }
});

app.post("/put-secret", async (req, res) => {
  const { id, ...bodyData } = req.body;
  console.log(req.body);

  try {
    const response = await axios.put(
      `${API_URL}/secrets/${id}`,
      bodyData,
      config,
    );
    res.render("index", {
      content: JSON.stringify(response.data),
    });
  } catch (error) {
    console.error(error.message);

    res.render("index", {
      content: error.message || "Secret not found.",
    });
  }
});

app.post("/patch-secret", async (req, res) => {
  const { id, secret, score } = req.body;
  const patchData = {};
  if (secret) patchData.secret = secret;
  if (score) patchData.score = Number(score);

  try {
    const response = await axios.patch(
      `${API_URL}/secrets/${id}`,
      patchData,
      config,
    );
    res.render("index", { content: JSON.stringify(response.data) });
  } catch (error) {
    console.error(error.message);

    res.render("index", {
      content: error.message || "Secret not found.",
    });
  }
});

app.post("/delete-secret", async (req, res) => {
  const { id } = req.body;
  try {
    const response = await axios.delete(`${API_URL}/secrets/${id}`, config);
    res.render("index", {
      content: `Secret with the ID of ${id} has been deleted.`,
    });
  } catch (error) {
    console.error(error.message);
    res.render("index", { content: error.message || "Secret not found." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
