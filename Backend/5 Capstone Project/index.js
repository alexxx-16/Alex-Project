import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const api = 'https://v2.jokeapi.dev/';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  res.render('index.ejs');
});

app.post('/GetYourJoke', async (req, res) => {
  console.log(req.body);
  try {
    let categoryURL = 'Any';
    if (req.body.Category) {
      if (typeof req.body.category === 'string') {
        categoryURL = req.body.Category;
      } else {
        categoryURL = '';
        req.body.category.forEach((category, i, arr) => {
          categoryURL += category;
          if (i != arr.length - 1) {
            categoryURL += ',';
          }
        });
      }
    }
    // console.log(categoryURL);
    let flagsURL = '';
    if (req.body.flags) {
      flagsURL = 'blacklistFlags=';
      if (typeof req.body.flags === 'string') {
        flagsURL += req.body.flags;
      } else {
        req.body.flags.forEach((flag, i, arr) => {
          flagsURL += flag;
          if (i != arr.length - 1) {
            flagsURL += ',';
          }
        });
      }
      flagsURL += '&';
    }
    console.log(flagsURL);

    const response = await axios.get(
      `${api}joke/${categoryURL}?${flagsURL}type=${req.body.type}`
    );

    console.log(response.data);
    res.render('index.ejs', {
      joke: response.data,
    });
  } catch (error) {
    console.log(error.message);
    // res.status(500)
  }
});

app.listen(port, () => {
  console.log(`All good on port ${port}.`);
});
