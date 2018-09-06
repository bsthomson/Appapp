var db = require('../models');
var request = require('request');
var quiz = require('../data/results');


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

  app.post('/api/favorites', function (req, res) {
    var savedInfo = req.body;
    savedInfo.username = req.session.user.username;

    db.Favorite.create(savedInfo)
      .then(function (dbFavorite) {
        res.json(dbFavorite);
      });
  });
    app.get("/api/quiz", function(req, res) {
        res.json(quiz);
    });

    app.post("/api/quiz", function(req, res) {
        
        
        var petName = "";
        var petPic = "";
        var petDesc = "";

        var totalDifference = 1000;

        quiz.forEach(function(results) {

          console.log(results);

            var scoresArray = [];
            var currentDifference = 1000;

            function add(total, num) {
                return total + num;
            }

            for (var i = 0; i < results.scores.length; i++) {
                scoresArray.push(Math.abs(parseInt(req.body.scores[i]) - parseInt(results.scores[i])));

            }

            currentDifference = scoresArray.reduce(add, 0);
            console.log(currentDifference);
            
            if (currentDifference < totalDifference) {
                totalDifference = currentDifference;

                petName = results.name;
                petPic = results.pic;
                petDesc = results.desc;
            }
        });

        

        res.json({ status: "ok", petName: petName, petPic: petPic, petDesc: petDesc });

        quiz.push(req.body);
    });
};

