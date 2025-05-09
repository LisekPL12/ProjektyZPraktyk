const express = require('express');
const { title } = require('process');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const blog = require('./models/blog');

//database connection
const dbURI = 'mongodb+srv://Bartosz:Test123@node.q7zpfwt.mongodb.net/Node_tuts?retryWrites=true&w=majority&appName=Node';
mongoose.connect(dbURI, {})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs');




app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/add-blog', (req, res) => {
    const newBlog = new blog({
        title: 'new blog',
        snippet: 'about my new blog',
        body: 'more about my new blog'
    });


    newBlog.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/all-blogs', (req, res) => {
    blog.find()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/single-blog', (req, res) => {
    blog.findById('681c7e6487fe1a99224adb60')
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    //res.send('<p>about page</p>');
    res.render('about', {title: 'About Us'});
});


app.get('/contact', (req, res) => {
    //res.send('<p>contact page</p>');
    res.render('contact', {title: 'Contact Us'});
  });

app.get('/create', (req, res) => {
    //res.send('<p>create page</p>');
    res.render('create', {title: 'Create a new blog'});
});

app.get('/blogs', (req, res) => {
    blog.find().sort({ createdAt: -1 })
    .then((result) => {
        res.render('index', {title: 'All blogs', blogs: result});
    })
    .catch((err) => {
        console.log(err);
    });    
    
});

app.get('/blogs/create', (req, res) => {
    //res.send('<p>create page</p>');
    res.render('create', {title: 'Create a new blog'});
});

app.post('/blogs', (req, res) => {
    const newBlog = new blog(req.body);

    newBlog.save()
        .then(() => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    blog.findById(id)
        .then(result => {
            res.render('details', {blog: result, title: 'Blog Details'});
        })
        .catch((err) => {
            res.status(404).render('404', {title: 'Blog not found'});
        });
});

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    blog.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/blogs' });
        })
        .catch((err) => {
            console.log(err);
        });
});

app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});

