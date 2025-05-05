import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/submit', (req, res) => {
    const bmiCalc = Math.round(req.body.weight / (req.body.height * req.body.height))
    res.render('index.ejs',
        {
        bmi: bmiCalc,
        }
    )
})

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})