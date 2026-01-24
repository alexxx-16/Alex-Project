import express from "express";
import axios from "axios";
import { resolve } from "node:path";
import morgan from "morgan";

const app = express();
const port = 3000;
const __dirname = import.meta.dirname;
const API_URL = "https://secrets-api.appbrewery.com";

const yourUsername = "Alexxx";
const yourPassword = "1116";
const yourAPIKey = "c2c072c1-dfe1-4ea9-a615-3b441fc4825a";
const yourBearerToken = "3e5135db-12f8-4314-bf49-5160b3dea352";

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.render("index", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/random`);
    console.log(response.data);
    res.render("index", { content: JSON.stringify(response.data) });
  } catch (error) {
    console.error("Error", error.message);
    res.render("index");
  }
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
});

app.get("/basicAuth", async (req, res) => {
  try {
    const page = 2;
    const response = await axios.get(`${API_URL}/all?page=${page}`, {
      auth: { username: yourUsername, password: yourPassword },
    });
    res.render("index", {
      content: JSON.stringify(response.data),
    });
  } catch (error) {
    console.error("Error", error.message);
    res.render("index");
  }
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
});

app.get("/apiKey", async (req, res) => {
  try {
    const score = "5";
    const response = await axios.get(`${API_URL}/filter`, {
      params: { score: score, apiKey: yourAPIKey },
    });
    res.render("index", {
      content: JSON.stringify(response.data),
    });
  } catch (error) {
    console.error("Error", error.message);
    res.render("index");
  }
  //HINT: You need to provide a query parameter of apiKey in the request.
});

app.get("/bearerToken", async (req, res) => {
  try {
    const id = "45";
    const response = await axios.get(`${API_URL}/secrets/${id}`, {
      headers: {
        Authorization: `Bearer ${yourBearerToken}`,
      },
    });
    res.render("index", {
      content: JSON.stringify(response.data),
    });
  } catch (error) {
    console.error("Error", error.message);
    res.render("index");
  }
  //and get the secret with id of 42
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
