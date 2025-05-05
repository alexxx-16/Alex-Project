import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const api = "http://www.thecocktaildb.com/api/json/v1/1/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/", async (req, res) => {
  try {
    const cocktail = await axios.get(`${api}random.php`);
    console.log(cocktail.data);
    res.render("cocktail.ejs", {
      cocktail: cocktail.data.drinks[0],
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Cocktailing on port ${port}.`);
});
