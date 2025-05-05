import express from 'express';
import bodyParser from 'body-parser'

const app = express();
const port = 3000;

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/WriteBlog', (req, res) => {
    res.render('writeBlog.ejs')
})

const blogs = [];
app.get('/Blogs', (req, res) => {
    res.render('blogs.ejs', {
        blogs: blogs
    })
})

app.post('/Blogs', (req, res) => {
    blogs.push(req.body)
    res.render('blogs.ejs', {
        blogs: blogs
    })
    // console.log(req.body)
})

app.post('/EditBlog', (req, res) => {
    res.render('editBlog.ejs',
        {
            blogIndex: req.body.blogIndex,
            blog: blogs[req.body.blogIndex]
        }
    )
})

app.post('/UpdateBlog', (req, res) => {
    blogs[req.body.blogIndex].title = req.body.title;
    blogs[req.body.blogIndex].content = req.body.content;
    res.redirect('/Blogs')
})

app.post('/DeleteBlog', (req, res) => {
    console.log(req.body.blogIndex)
    const indexToRemove = req.body.blogIndex;
    blogs.splice(indexToRemove, 1)
    res.redirect('/Blogs')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})