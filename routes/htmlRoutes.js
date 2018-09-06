var db = require('../models');

module.exports = function(app) {

  // Middleware function to check for logged in users
  var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      res.redirect('/dashboard');
    } else {
      next();
    }
  };

  //route for Home page
  app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
  });

  //route for user signup
  app.route('/signup')
    .get(sessionChecker, (req, res) => {
      res.render('signup');
    })
    .post((req, res) => {
      db.User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        zipcode: req.body.zipcode
      })
        .then(user => {
          req.session.user = user.dataValues;
          res.redirect('/quiz');
        })
        .catch(error => {
          console.log(error);
          res.redirect('/signup');
        });
    });

  app.route('/quiz')
    .get((req, res) => {
      res.render('quiz');
    });


  //route for user Login
  app.route('/login')
    .get(sessionChecker, (req, res) => {
      res.render('login');
    })
    .post((req, res) => {
      var username = req.body.username;
      var password = req.body.password;
      db.User.findOne({ where: { username: username } })
        .then(function (user) {
          if (!user) {
            res.redirect('/login');
          } else if (!user.validPassword(password)) {
            res.redirect('/login');
          } else {
            req.session.user = user.dataValues;
            res.redirect('/dashboard');
          }
        });
    });

  //route for user's dashboard
  app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.render('dashboard');
    } else {
      res.redirect('/login');
    }
  });

  //route for user's saved
  app.get('/saved', (req, res) => {
    db.Favorite.findAll({})
      .then(function (data) {
        if (req.session.user && req.cookies.user_sid) {
          var hbsObject = {
            pets: data
          };
          res.render('saved', hbsObject);
        } else {
          res.redirect('/login');
        }
      });
  });

  //route for user Logout
  app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  });
  // Render 404 page for any unmatched routes
  app.get('*', function(req, res) {
    res.render('404');
  });

  app.use(function (req, res) {
    res.status(404).send('Sorry can not find that!');
  });  
};
