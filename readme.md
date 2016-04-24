# Creating a simple Blog app from scratch with Express

## Setup

Download and install Node.js <https://nodejs.org> (version used: v4.4.3)

```
git clone https://github.com/gregorywyz/expressDemo.git
```

```
cd expressDemo
```

```
npm install
```

```
node app.js
```

## Get to work on your own

Use the repo as a working reference. There are additional notes in the code to help out

```
mkdir expressDemo
cd expressDemo
```

Start new project with

```
npm init
```

Follow instructions, clicking 'enter' to go through statements, specify app.js for the initial file

Install express and create intitial file

```
npm install --save express
touch app.js
```

Install nodemon - a utility that monitors changes in your source and automatically restarts the server

```
npm install - g nodemon
```

Nodmon is now installed globally and is available on all your node projects

Let's make a Hello World!

In app.js, load express then create and instance of it (commonly named app)

```javascript
var express = require('express');
var app = express();
```

Create a root route

```javascript
app.get('/', function(req,res){
  res.send('Hello World!');
})
```

Create a simple server

```javascript
app.listen(3000, function(){
  console.log("~~~ Server started on port 3000 ~~~");
});
```

Now start the server and browser to localhost:3000

```
node app.js
```

Since we have nodemon installed we can use

```
nodemon app.js
```

Or if your package.json has "main": "app.js" with your correct initial file, simply use

```
nodemon
```

Let's calculate some params!
Create a new route with wildcards

```javascript
app.get('/add/:x/:y', function(req,res){
  res.send('The answer is: ' + req.params.x + ' + ' + req.params.y + ' = ' + (parseInt(req.params.x) + parseInt(req.params.y)));
});
```

Now do something like http://localhost:3000/add/10/5

Time for blogging. We can get away from using res.send and start rendering files instead
Make a /views folder with and index.html and throw a Hello World in there

```
<!doctype html>

<html>
  <head>
  </head>
  <body>
    Hello world!
  </body>
</html>
```

Modify app.js to use the file via app#render

```javascript
app.get('/', function(req,res){
  // res.send('Hello World!');
  res.render('index.html');
});
```

Sweet! We got an error because we did not set a view engine. Let's edit app.js and use ejs for that.

```javascript
var ejs = require('ejs');

app.set('view engine', 'ejs');
```

You will get another error. ejs is a node module so we need to install it before it can be loaded.

```
npm install --save ejs
```

Now rename index.html to be index.ejs and dont forget to touch the route in app.js

```javascript
app.get('/', function(req,res){
  res.render('index');
});
```

The template should render just fine now.
Pass a data object as the second arguement for res#render

```javascript
res.render('index', {quote: 'Do not take life too seriously. You will never get out of it alive.'});
```

And embed it into index.ejs

```
<body>
  <h3>Quote of the day:</h3>
  <p>"<%= quote %>"</p>
</body>
```

Set up some partial templates to use across views
Also it will be easier to just set up header and footer partial for consistency across our views.
Under /views, create a /partials folder with header.ejs and footer.ejs

header.ejs

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Bloginator</title>
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <div class="container">
```

footer.ejs

```
      <hr>
      &copy; 2016 This is our footer
    </div>
  </body>
</html>
```

NOW let's get to blogging!

Encorporate the partials into the /views/posts/index.ejs

```
<% include ../partials/header %>

  <h1>All Posts</h1>
  <hr>

  <ul class="list-group">
    <% posts.forEach(function(post){ %>
      <li style="list-style: none;">
        <h3><%= post.title %></h3>
        <p>By: <%= post.author %></p>
      </li>
    <% }) %>
  </ul>

<% include ../partials/footer %>
```

Then in app.js create a simple data structure to store our posts. I will then perform CRUD operations by looing through the array and match the 'id' key with the 'id' param.

```javascript
var postsData = [
  {id:1,author:"Jimbo",post:"How to eat well and spend your whole paycheck"},
  {id:2,author:"Ralph",post:"Our bananas are green all the time every time"},
  {id:3,author:"Albertson",post:"Pay 3,000 a month to live across the street but we cater to the hobos"}
];
```

Then we will do a READ route for the data

```javascript
app.get('/posts', function(req,res){
  var allPosts = postsData;
  res.send(allPosts);
});
```

Navigate to http://localhost:3000/posts and you should see the array with data
Then swith the response to render the template, remember to pass the data as an object

```javascript
res.render('posts/index', {posts:allPosts});
```

Refresh the browser and checkout the blogs!

Time to create a new entry. Add a form to /views/posts/index.ejs

```
<h2>New Post</h2>
<form method="post" action="/posts">
  <label for="author">Author</label>
  <input type="text" name="author">
  <label for="title">Title</label>
  <input type="text" name="title">
  <input type="submit">
</form>
```

Then create the route in app.js

```javascript
app.post('/posts', function(req,res){
  var newId =  Math.floor(Math.random() * 1000);
  postsData.push({id:newId, author:req.body.author, title:req.body.title});
  res.send(postsData);
});
```

Fill out the form and submit. We expect to see the array of data but unfortunately we get an error.
Express needs a way of parsing params from a form. There's another module for this called body-parser. So let's first install it, then load it into our app.js

```
npm install --save body-parser
```

```javascript
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
```

Now go back and try that new entry again. You should see the new data in the array.
Make it pretty again by using res#redirect to go back to our posts view url

```javascript
res.redirect('/posts');
```

Sweet! You should see the form data be added to the screen after submit.

We can show a specific post based off of it's index in the array.
Create the route, and conditionally render a show page or return to the list of posts.

```javascript
app.get('/posts/:id', function(req, res){
  var postById;
  for (i = 0 ; i < postsData.length ; i++) {
    if (postsData[i]['id'] === parseInt(req.params.id)) {
      console.log('Found the entry');
      postById = postsData[i];
      break;
    }
  };

  res.render('posts/show', postById);
});
```

/views/posts/show.ejs

```
<% include ../partials/header %>

  <h1><%= title %></h1>
  <hr>

  <p>A post by: <%= author %></p>

<% include ../partials/footer %>
```

example url http://localhost:3000/posts/2

Let's add a link to the show page from /views/posts/index.ejs

```
<ul class="list-group">
  <% posts.forEach(function(post){ %>
    <h3><%= post.title %></h3>
    <p>By: <%= post.author %></p>
    <a class="btn btn-default" href="/posts/<%= post.id %>">Check it out</a>
  <% }) %>
</ul>
```

Time to delete some junky posts. We have to use AJAX for this so let's get JQuery invloved and include our future javascript file.

views/partials/header.ejs

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="/js/script.js"></script>
```

Then let's set up express where to serve static files from.

app.js

```javascript
app.use(express.static(__dirname+'/public'));
```

Then create your public directory and script.js file to match /public/js/script.js and add

```javascript
$(document).ready(function(){
  console.log("JQuery loaded and DOM ready!");

});
```

You should see this log in the developer tools console in your browser if loaded correctly. This tells JQuery to wait for the DOM content to be loaded before running anything inside the anonymous function.


Now set up the delete route in app.js

```javascript
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
```

Here comes the magic of JQuery. This is out AJAX request to delete a post.

/public/js/script.js

```javascript
$('.delete-link').on('click', function(event){
  event.preventDefault();
  var destroyRoute = $(this).attr('href');
  $.ajax({
    method: 'DELETE',
    url: destroyRoute
  }).done(function(){
    console.log('A post was deleted');
  });
});
```

Got to http://localhost:3000/posts and click the delete link. You should see a log in terminal that will tell you which post was deleted and a log in your browser terminal confirming a post was deleted via the AJAX call.

But nothing happened?? That's because we used JQuery to stop the page from refreshing. Click the page reload and see your post is now gone.

Be lazy and have JQuery remove it for us. Modify /public/js/script.js to include 'deleteBtn' and fadeOut()

```javascript
$('.delete-link').on('click', function(event){
  event.preventDefault();
  var destroyRoute = $(this).attr('href');
  var deleteBtn = $(this);
  $.ajax({
    method: 'DELETE',
    url: destroyRoute
  }).done(function(){
    console.log('A post was deleted');
    deleteBtn.closest('li').fadeOut('slow',function(){
      $(this).remove();
    });
  });
});
```

Like magic, the deleted post should fade away.

Now for an UPDATE route. First we need to set up a route to get a form for updating a post.

app.js

```javascript
app.get('/posts/:id/edit', function(req,res){
  var postByIdx = postsData[req.params.idx];
  res.render('posts/edit', postByIdx);
});
```
/views/posts/edit.ejs

```
<% include ../partials/header %>

  <h1>Edit Post</h1>

  <h3><%= title %></h3>
  <p>A post by: <%= author %></p>

  <br><br>

  <form class="put-form" action="/posts/<%= id %>">
    <label for="author">Author</label>
    <input type="text" name="author" value="<%= author %>">
    <label for="title">Title</label>
    <input type="text" name="title" value="<%= title %>">
    <input type="submit">
  </form>

<% include ../partials/footer %>
```

Add a link to the form in /views/posts/index.ejs

```
<a class="btn btn-info" href="/posts/<%= post.id %>/edit">Edit</a>
```

Click the edit link and we can see the form has been pre-populated with the data. Once again, AJAX has to be used to update this data.

Create an update route in app.js

```javascript
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
```

Set up AJAX request in /public/js/script.js

```javascript
  $('.put-form').on('submit', function(event){
    event.preventDefault();
    var updateRoute = $(this).attr('action');
    var updateData = $(this).serialize();
    $.ajax({
      method: 'PUT',
      url: updateRoute,
      data: updateData
    }).done(function(data){
      location.href="/posts";
    })
  });
```

Now the post has been updated and you will be redirected to the list of posts

You have just created an incredibly bare bones RESTful API!

## References

<https://nodejs.org>
<http://expressjs.com/>
<http://api.jquery.com/>
<getbootstrap.com>