import express from 'express'
import axios from 'axios'

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const secret = await axios.get('http://secrets-api.appbrewery.com/random')
        res.render('index.ejs', {
            'secret': JSON.stringify(secret.data.secret),
            'user': JSON.stringify(secret.data.username)
        })
    } catch(error) {
        console.log(error.response.data);
        res.status(500)
    }   
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
});