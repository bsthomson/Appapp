var db = require('../models');
var request = require('request');

module.exports = function(app) {
  app.get('/api/pets', function (req, res) {
    var apikey = process.env.PETFINDER_KEY;
    var animal = 'dog';
    var zipcode = 66205;
    request('http://api.petfinder.com/pet.find?key=' + apikey + '&animal=' + animal + '&location=' + zipcode + '&format=json', function (error, response, body) {
      return res.json(body);
    });
  });
  // Get all examples
  app.get('/api/examples', function(req, res) {
    db.User.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post('/api/examples', function(req, res) {
    db.User.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete('/api/examples/:id', function(req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
      res.json(dbExample);
    });
  });
};
