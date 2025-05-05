import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    // console.log(response.data)
    res.render("index.ejs", { data: response.data });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  try { 
    const response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${req.body.type}&participants=${req.body.participants}`)
    // console.log(response.data)
    const activity = response.data[Math.floor(Math.random() * response.data.length)]
    res.render('index.ejs', {
      activity: activity
    })
  } catch (error){
    console.error("Error:", error.message);
    res.render("index.ejs", {
      error: 'No activities match your criteria.',
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
