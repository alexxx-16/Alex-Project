import express from "express";
import { resolve } from "node:path";
import { type } from "node:os";
import recipe from "./recipe.json" with { type: "json" };
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = import.meta.dirname;

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

app.use(express.static(resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/recipe", (req, res) => {
  const userChoice = req.body.choice;
  const chosenRecipe = recipe.find((taco) => {
    return taco.ingredients.protein.name.toLowerCase() === userChoice;
  });

  if (!chosenRecipe) {
    res.render("index", {
      name: "Taco not found",
      error: "Please try another recipe.",
    });
  }

  res.render("index", {
    name: chosenRecipe.name,
    protein: chosenRecipe.ingredients.protein.name,
    preparation: chosenRecipe.ingredients.protein.preparation,
    salsa: chosenRecipe.ingredients.salsa.name,
    toppings: chosenRecipe.ingredients.toppings,
  });
});

app.get("/recipe", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
