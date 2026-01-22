import express from "express";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", (req, res) => {
  const { fName, lName } = req.body;
  const nameLength = fName.length + lName.length;
  res.render("index.ejs", { nameLength: nameLength });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
