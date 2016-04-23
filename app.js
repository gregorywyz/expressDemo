
// Load node module
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var app = express();

// setting the view engine
app.set('view engine', 'ejs');

// tell app to use the module
app.use(bodyParser.urlencoded({ extended: false }));

// array to store posts
var postsData = [
  {author:"Jimbo",title:"How to eat well and spend your whole paycheck"},
  {author:"Ralph",title:"Our bananas are green all the time every time"},
  {author:"Albertson",title:"Pay 3,000 a month to live across the street but we cater to the hobos"}
];

// root route
app.get('/', function(req,res){
  // res.send('Hello World!');
  // res.render('index.html');
  // res.render('index');
  res.render('index', {quote: 'Do not take life too seriously. You will never get out of it alive.'});
});

// READ - get all posts
app.get('/posts', function(req,res){
  var allPosts = postsData;

  // res.send(allPosts);
  res.render('posts/index', {posts:allPosts});

});

// CREATE - new post
app.post('/posts', function(req,res){
  postsData.push({author:req.body.author, title:req.body.title});
  // res.send(postsData);
  res.redirect('/posts');
});



// accessing param values
app.get('/add/:x/:y', function(req,res){
  res.send('The answer is: ' + req.params.x + ' + ' + req.params.y + ' = ' + (parseInt(req.params.x) + parseInt(req.params.y)));
});



// define a server on port 3000
app.listen(3000, function(){
  console.log("~~~ Server started on port 3000 ~~~");
});