import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/GetQuote", async (req, res) => {
  try {
    const quote = await axios.get("https://api.kanye.rest");
    console.log(quote.data)
    res.render('fact.ejs', {
      'quote': JSON.stringify(quote.data.quote)
        })
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running port ${port}.`);
});
