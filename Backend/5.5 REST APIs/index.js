import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

// HINTs: Use the axios documentation as well as the video lesson to help you.
// https://axios-http.com/docs/post_example
// Use the Secrets API documentation to figure out what each route expects and how to work with it.
// https://secrets-api.appbrewery.com/

//TODO 1: Add your own bearer token from the previous lesson.
const yourBearerToken = "3858d94a-ec37-4c0c-8835-31a20128d9c4";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/secrets/${req.body.id}`,config);
    res.render("index.ejs", 
      { 
        'content': JSON.stringify(response.data) 
      }
    );
  } catch (error) {
    res.render("index.ejs", 
      { 
        'content': JSON.stringify(error.response.data) 
      }
    );
  }
});

app.post("/post-secret", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/secrets`, 
      {
        'secret': req.body.secret,
        'score': req.body.score
      },
      config)
    res.render('index.ejs', {
      content: JSON.stringify(response.data)
    })
  } catch(error) {
    console.log(error)
    }
});

app.post("/put-secret", async (req, res) => {
  try {
    const response = await axios.put(`${API_URL}/secrets/${req.body.id}`, req.body, config);
    res.render("index.ejs", { 
      'content': JSON.stringify(response.data) 
    });
  } catch (error) {
    res.render("index.ejs", { 
      'content': JSON.stringify(error.response.data) 
    });
  }
});

app.post("/patch-secret", async (req, res) => {
  console.log(req.body)
  try {
    await axios.patch(`${API_URL}/secrets/${req.body.id}`, req.body, config);
    const updatedSecret = await axios.get(`${API_URL}/secrets/${req.body.id}`, config);
    res.render('index.ejs', {
      'content': JSON.stringify(updatedSecret.data)
    })
  } catch(error) {
    res.render('index.ejs', {
      'content': JSON.stringify(error.response.data)
    })
  }
});

app.post("/delete-secret", async (req, res) => {
  try {
    const response = await axios.delete(`${API_URL}/secrets/${req.body.id}`, config)
    res.render('index.ejs', {
      'content': JSON.stringify(response.data.message)
    })
  } catch(error) {
    res.render('index.ejs', {
      'content': JSON.stringify(error.response.data)
    })
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
