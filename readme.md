# Creating a simple Blog app from scratch with Express

```
mkdir expressDemo
cd expressDemo
```

Start new project with

```
npm init
```

Follow instructions, clicking <enter> to go through statements, specify app.js for the initial file

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
    <title>Document</title>
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/style.css">
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
      <h3><%= post.title %></h3>
      <p>By: <%= post.author %></p>
    <% }) %>
  </ul>

<% include ../partials/footer %>
```

Then in app.js create a simple data structure to store our posts

```javascript
var postsData = [
  {author:"Jimbo",post:"How to eat well and spend your whole paycheck"},
  {author:"Ralph",post:"Our bananas are green all the time every time"},
  {author:"Albertson",post:"Pay 3,000 a month to live across the street but we cater to the hobos"}
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
  <label for="male">Author</label>
  <input type="text" name="author">
  <label for="male">Title</label>
  <input type="text" name="title">
  <input type="submit">
</form>
```

Then create the route in app.js

```javascript
app.post('/posts', function(req,res){
  postsData.push({author:req.body.author, title:req.body.title});
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






















