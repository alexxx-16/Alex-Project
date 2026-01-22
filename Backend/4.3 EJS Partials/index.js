import express from "express";
import { resolve } from "node:path";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = import.meta.dirname;

app.use(express.static(resolve(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

/* Write your code here:
Step 1: Render the home page "/" index.ejs
Step 2: Make sure that static files are linked to and the CSS shows up.
Step 3: Add the routes to handle the render of the about and contact pages.
  Hint: Check the nav bar in the header.ejs to see the button hrefs
Step 4: Add the partials to the about and contact pages to show the header and footer on those pages. */

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
