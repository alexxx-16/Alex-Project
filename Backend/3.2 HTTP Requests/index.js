import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('<h1>Hey there. This is Alex.<h1>')
  })

app.get('/about', (req, res) => {
    res.send('<h1>This is about Alex.<h1>')
  })
  
app.get('/contact', (req, res) => {
    res.send('<h2>You can contact me on</h2><p>0424 691 877<p>');
})

  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })