import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/AddBlog', (req, res) => {
    res.render('addBlog.ejs')
})

app.get('/Blogs', (req, res) => {
    res.render('blogs.ejs',{
        blogs: blogs
    })
})

app.post('/EditBlog', (req, res) => {
    const blog = blogs[req.body.id]
    res.render('editBlog.ejs', {
        blog: blog,
        id: req.body.id
    })
})

app.post('/UpdateBlog', (req, res) => {
    const blog = blogs[req.body.id]
    console.log(blog.title)
    // blog.title = req.body.title;
})

app.post('/DeleteBlog', (req, res) => {
    blogs = [].concat(blogs.slice(0,req.body.id), blogs.slice(parseInt(req.body.id) + 1))
    res.redirect('/Blogs')
})

let blogs = [];
app.post('/Blogs', (req, res) => {
    blogs.push(req.body)
    console.log(blogs)
    res.render('blogs.ejs',{
        blogs: blogs
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})