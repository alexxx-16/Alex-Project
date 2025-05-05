import express, { response } from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "pipiiiiii";
const yourPassword = "XAyjgh169";
const yourAPIKey = "e886efed-dfab-4c29-9982-7837a9409a1b";
const yourBearerToken = "3858d94a-ec37-4c0c-8835-31a20128d9c4";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}random`)
    res.render('index.ejs', {
      'content': JSON.stringify(response.data)
    })
  } catch(error) {
      console.log(error)
    }
});

app.get("/basicAuth", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}all?page=2`, {
      auth: {
        'username': yourUsername,
        'password': yourPassword
      }
    })
    res.render('index.ejs', {
      'content': JSON.stringify(response.data)
      })
  } catch(error) {
    console.log(error)
  }
});

app.get("/apiKey", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}filter?apiKey=${yourAPIKey}&score=5`)
    res.render('index.ejs', {
      content: JSON.stringify(response.data)
    })
  } catch(error) {
    console.log(error)
  }
});

app.get("/bearerToken", async (req, res) => {
  try {
    const response = await axios(`${API_URL}secrets/42`,
      {
        headers: {
          'Authorization': `Bearer ${yourBearerToken}`
        }
      })
    res.render('index.ejs', {
      content: JSON.stringify(response.data)
    })                 
  
  } catch(error) {
    console.log(error)
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
