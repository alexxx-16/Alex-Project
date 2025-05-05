import express from 'express';
import bodyParser from 'body-parser';
import { format } from 'date-fns'

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
    const featureBlogID = Math.floor(Math.random() * blogs.length);
    // console.log(featureBlogID);
    const today = format(new Date(), "E dd/MM/yyyy HH:mm")
    res.render('index.ejs',
        { today: today,
            id: featureBlogID,
            blog: blogs[featureBlogID],
         }
    );
})

app.post('/blog', (req, res) => {
    const today = format(new Date(), "E dd/MM/yyyy HH:mm")
    const blog = blogs[req.body.blogID];
    console.log(req.body);
    res.render('blog.ejs',
        { today: today,
          blog: blog,
         }

    );

})

app.get('/YourBlog', (req, res) => {
    const today = format(new Date(), "E dd/MM/yyyy HH:mm")
    res.render('YourBlog.ejs',
        { today: today }
    );
})

app.post('/blogEdit', (req, res) => {
    const today = format(new Date(), "E dd/MM/yyyy HH:mm")
    const blog = blogs[req.body.blogID];
    res.render('blogEdit.ejs',
        { today: today,
          blog: blog,
         }
    );
})

app.get('/FAQs', (req, res) => {
    const today = format(new Date(), "E dd/MM/yyyy HH:mm")
    res.render('FAQs.ejs',
        { today: today }
    );
})

app.get('/Blogs', (req, res) => {
    const today = format(new Date(), "E dd/MM/yyyy HH:mm")
    res.render('Blogs.ejs',
        { today: today, 
            blogs: blogs,
        }
    );
    // console.log("hehe");
})

const blogs = [{title: "Welcome to Alex's blog hosting website!",
    content: "You can write whatever you want here and everyone can share their thoughts.",
    time: "Sun 27/04/2025 23:48",
 }

];

app.post('/Blogs', (req, res) => {
    const today = format(new Date(), "E dd/MM/yyyy HH:mm")
    const blogsWithTimestamp = {
        title: req.body.title,
        content: req.body.content,
        time: today,
    }
    // console.log(blogsWithTimestamp);
    
    blogs.push(blogsWithTimestamp);
    // console.log(req.body);

    res.render('Blogs.ejs',
        { today: today,
            blogs: blogs,
        }
    );
})



app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
})
