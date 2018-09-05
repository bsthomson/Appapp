var db = require('../models');
var request = require('request');

module.exports = function(app) {
  app.get('/api/pets', function (req, res) {
    var apikey = process.env.PETFINDER_KEY;
    var animal = 'dog';
    var zipcode = req.session.user.zipcode;
    var count = 8;
    request('http://api.petfinder.com/pet.find?key=' + apikey + '&animal=' + animal + '&location=' + zipcode + '&count=' + count + '&format=json', function (error, response, body) {
      return res.json(JSON.parse(body));
    });
  });

  // get all Favorites
  app.get('/api/favorites', function (req, res) {
    db.Favorite.findAll({
      where: {
        username: req.session.user.username
      }
    }).then(function (dbFavorites) {
      res.json(dbFavorites);
    });
  });

  // Create a new example
  app.post('/api/examples', function(req, res) {
    db.User.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  app.post('/api/favorites', function (req, res) {
    var savedInfo = req.body;
    savedInfo.username = req.session.user.username;

    db.Favorite.create(savedInfo)
      .then(function (dbFavorite) {
        res.json(dbFavorite);
      });
  });

  // Delete an example by id
  app.delete('/api/examples/:id', function(req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
