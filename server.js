require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');


var db = require('./models');
var quiz = require('./data/results');

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));







app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(morgan('dev'));

app.use(cookieParser());

// initialize express-session to allow us to track the logged-in user accross sections
app.use(session({
  key: 'user_sid',
  secret: 'somerandomstuff',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));



/* This middleware will check if user's cookie is still saved in browser and user is not set, 
then automatically log the user out. This usually happens when you stop your express server 
after login, your cookie still remains saved in the browser. */
app.use( (req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

// Routes
require('./routes/apiRoutes')(app);
require('./routes/htmlRoutes')(app);

var syncOptions = { force: true };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === 'test') {
  syncOptions.force = true;
}



// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.',
      PORT
    );
  });
});

module.exports = app;
