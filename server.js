const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

//loading partial templates directory to reuse in different pages
hbs.registerPartials(__dirname + '/views/partials');

//Register a fcuntion that can be called inside the hbs templates with or without arguments
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());
//This tells node what view engine to use, in this case hbs
app.set('view engine', 'hbs');

//Creating a express middleware to do things before the app moves on, so we can have functions or logic to set things up first and then with next() command we can move on.
app.use((req, res, next) => {

  var now = new Date().toString();
  var log = now + ': ' + req.method + ' ' + req.url;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err){
      console.log('Unable to create or update log');
    }
  });
  // res.render('maintenance.hbs',{
  //   pageTitle: 'Page under construction',
  //   message: 'We\'ll be back soon.'
  // });
  next();
});


//uses the content of a determine public directory
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  //res.send('<h1>Hello Express!</h1>');
  res.render('home.hbs',{
    pageTitle: 'Home Page',
    welcomeMessage: 'Hello! welcome to my page'
  });
});

app.get('/about', (req,res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req,res) => {
  res.send({errorType: 'bad request', errorMessage: 'Unable to get what you where looking for'});
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
