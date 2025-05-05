import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const root = dirname(fileURLToPath(import.meta.url))
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.render(root + '/views/index.ejs');
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})
