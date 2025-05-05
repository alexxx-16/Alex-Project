import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const api = "http://v2.jokeapi.dev/joke/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/", async (req, res) => {
  try {
    let typeURL = "";
    console.log(req.body);
    if (typeof req.body.type === "string") {
        typeURL = req.body.type;
    };

    let categoryURL = "Any";
    if (req.body.category) {
      if (typeof req.body.category === "string") {
        categoryURL = '&type=' + req.body.category;
      } else {
        categoryURL = "";
        req.body.category.forEach((category, i, arr) => {
          categoryURL += category;
          if (i < arr.length - 1) {
            categoryURL += ",";
          }
        });
      }
      // console.log(categoryURL)
    }

    let blacklistURL = "";
    if (req.body.flags) {
      if (typeof req.body.flags === "string") {
        blacklistURL = req.body.blacklistURL;
      } else {
        req.body.flags.forEach((flag, i, arr) => {
          blacklistURL += flag;
          if (i < arr.length) {
            blacklistURL += ",";
          }
        });
      }
    }

    const joke = await axios.get(
      `${api}${categoryURL}?blacklistFlasg=${blacklistURL}${typeURL}`
    );
    console.log(joke.data);
    res.render("index.ejs", {
      joke: joke.data,
    });
  } catch (error) {
    res.render("index.ejs", {
      error: "Sorry none of our jokes meet your criteria.",
    });
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Port ${port} working!`);
});
