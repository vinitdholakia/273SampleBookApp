//import express module 
var express = require('express');
//create  an express app
var app = express();
//require express middleware body-parser
var bodyParser = require('body-parser');
//require express session
var session = require('express-session');
var cookieParser = require('cookie-parser');

//set the view engine to ejs
app.set('view engine','ejs');
//set the directory of views
app.set('views','./views');
//specify the path of static directory
app.use(express.static(__dirname + '/public')); 

//use body parser to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(session({
    secret: 'cpe_273_secure_string',
    resave: false,
    saveUninitialized: true
  }));

//Only user allowed is admin
var Users = [{
    "username" : "admin",
    "password" : "admin"
}];
//By Default we have 3 books
var books = [
    {"BookID" : "1", "Title" : "Book 1", "Author" : "Author 1"},
    {"BookID" : "2", "Title" : "Book 2", "Author" : "Author 2"},
    {"BookID" : "3", "Title" : "Book 3", "Author" : "Author 3"}
]
//route to root
app.get('/',function(req,res){
    //check if user session exits
    if(req.session.user){
        res.render('/home');
    }else
        res.render('login');
});

app.post('/login',function(req,res){
    if(req.session.user){
        res.render('/home');
    }else{
        console.log("Inside Login Post Request");
        console.log("Req Body : ", req.body);
        Users.filter(function(user){
            if(user.username === req.body.username && user.password === req.body.password){
                req.session.user = user;
                res.redirect('/home');
            }
        })
    }
    
});

app.post('/create',function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        var newBook = {BookID: req.body.BookID, Title: req.body.Title, Author : req.body.Author};
        books.push(newBook);
        res.redirect('/home');
        console.log("Book Added Successfully!!!!");
    }
    
});

app.get('/home',function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        console.log("Session data : " , req.session);
        res.render('home',{
            books : books
        });
    }
    
});


app.get('/delete',function(req,res){
    console.log("Session Data : ", req.session.user);
    if(!req.session.user){
        res.redirect('/');
    }else
        res.render('delete');
});
app.get('/create',function(req,res){
    if(!req.session.user){
        res.redirect('/');
    }else{
        res.render('create');
    }
    
});

app.post('/delete',function(req,res){
    console.log("Inside Delete Request");
    var index = books.map(function(book){
        return book.BookID;
     }).indexOf(req.body.BookID); 
     
     if(index === -1){
        console.log("Book Not Found");
     } else {
        books.splice(index, 1);
        console.log("Book : " + req.body.BookID + " was removed successfully");
        res.redirect('/home');
     }
})

var server = app.listen(3000, function () {
    console.log("Server listening on port 3000");
 
});