
// Load node module
var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var app = express();

// setting the view engine
app.set('view engine', 'ejs');

// tell app to use the module
app.use(bodyParser.urlencoded({ extended: false }));

// set static directory
app.use(express.static(__dirname+'/public'));

// array to store posts
var postsData = [
  {id:1,author:"Jimbo",title:"How to eat well and spend your whole paycheck"},
  {id:2,author:"Ralph",title:"Our bananas are green all the time every time"},
  {id:3,author:"Albertson",title:"Pay 3,000 a month to live across the street but we cater to the hobos"}
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
  var newId =  Math.floor(Math.random() * 1000); // random number between 1 and 1000
  postsData.push({id:newId, author:req.body.author, title:req.body.title});
  // res.send(postsData);
  res.redirect('/posts');
});

// READ - show one post by index value
app.get('/posts/:id', function(req, res){
  var postById;
  // loop through data and find matching id
  for (i = 0 ; i < postsData.length ; i++) {
    if (postsData[i]['id'] === parseInt(req.params.id)) {
      console.log('Found the entry');
      postById = postsData[i];
      break;
    }
  };

  res.render('posts/show', postById);
});

// DESTROY - delete a post by index value
app.delete('/posts/:id', function(req,res){
  for (i = 0 ; i < postsData.length ; i++) {
    if (postsData[i]['id'] === parseInt(req.params.id)) {
      console.log('Deleting post:', postsData[i].title);
      postsData.splice(i,1);
      break;
    }
  };

  res.send({result:true});
});

// READ - show edit form
app.get('/posts/:id/edit', function(req,res){
  var postById;
  for (i = 0 ; i < postsData.length ; i++) {
    if (postsData[i]['id'] === parseInt(req.params.id)) {
      postById = postsData[i];
      break;
    }
  };

  res.render('posts/edit', postById);
});

// UPDATE - edit an existing post
app.put('/posts/:id', function(req,res){
  console.log('got here');
  var postById;
  for (i = 0 ; i < postsData.length ; i++) {
    if (postsData[i]['id'] === parseInt(req.params.id)) {
      console.log('Updating post:', postsData[i].title);
      postById = postsData[i];
      postById['author'] = req.body.author;
      postById['title'] = req.body.title;
      break;
    }
  };

  res.send(postById);
});



// accessing param values
app.get('/add/:x/:y', function(req,res){
  res.send('The answer is: ' + req.params.x + ' + ' + req.params.y + ' = ' + (parseInt(req.params.x) + parseInt(req.params.y)));
});



// define a server on port 3000
app.listen(3000, function(){
  console.log("~~~ Server started on port 3000 ~~~");
});