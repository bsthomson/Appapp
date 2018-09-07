// Get references to page elements
var $findPets = $('#find-pets');
var $petList = $('#pet-list');
var $favoriteButton = $('#find-favorites');

// The API object contains methods for each kind of request we'll make
var API = {
  getPets: function(pet) {
    return $.ajax({
      headers: {
        'Content-Type': 'application/json'
      },
      type: 'GET',
      url: 'api/pets',
      data: JSON.stringify(pet)
    });
  },
  putPetInfo: function (pet) {
    return $.ajax({
      headers: {
        'Content-Type': 'application/json'
      },
      type: 'POST',
      url: 'api/favorites',
      data: JSON.stringify(pet)
    });
  },
  getFavorites: function () {
    return $.ajax({
      url: 'api/favorites',
      type: 'GET'
    });
  }
};

var retrievePetfinderResults = function () {
  event.preventDefault();

  API.getPets().then(function (data) {
    var data = data.petfinder.pets.pet;
    var $pets = data.map(function (pet) {
      var $petinfo = $(
        `<p><a id='pet-name' value='${pet.name.$t}' href='/pet/${pet.id.$t}'>${pet.name.$t}</a></p>
        <p><div id='pet-image' value='${pet.media.photos.photo[1].$t}' img src='${pet.media.photos.photo[1].$t}' alt='animal'></div></p>
        <a id='pet-breed' value='${pet.breeds.breed.$t}'></a>
        <a id='pet-id' value='${pet.id.$t}'></a>
        <a id='pet-shelter-id' value='${pet.shelterPetId.$t}'></a>`
      );

      var $li=$('<li>')
        .attr({
          class: 'list-group-item',
          'data-id': pet.id.$t
        })
        .append($petinfo);

      var $saveButton = $('<button>')
        .addClass('btn btn-secondary float-left save')
        .text('favorite');

      $li.append($saveButton);

      return $li;
    });

    $petList.empty();
    $petList.append($pets);
  });
};

var favoritePet = function (event) {
  event.preventDefault();
  console.log($('#pet-id').attr('value'));

  var petFavorite = {
    petid: $('#pet-id').attr('value'),
    photolocation: $('#pet-image').attr('value'),
    petbreed: $('#pet-breed').attr('value'),
    petname: $('#pet-name').attr('value'),
    petshelterid: $('#pet-shelter-id').attr('value')
  };
  
  API.putPetInfo(petFavorite)
    .then(function () {
      console.log(petFavorite);
      $('<button>').prop('disabled', true);
    });
};

var retrieveFavorites = function () {
  API.getFavorites().then(function (data) {
    var $pets = data.map(function (pet) {
      console.log(pet);
      var $petinfo = $(
        `<p><a id='pet-name' value='${pet.petname}' href='/favorite/${pet.id}'>${pet.petname}</a></p>
        <p><a id='pet-image' value='${pet.photolocation}' img src='${pet.photolocation}' alt='animal'></a></p>
        <a id='pet-breed' value='${pet.petbreed}'></a>
        <a id='pet-id' value='${pet.petid}'></a>
        <a id='pet-shelter-id' value='${pet.petshelterid}'></a>
        <a href='/favorites/${pet.id}></a>`
      );

      var $li=$('<li>')
        .attr({
          class: 'list-group-item',
          'data-id': pet.id
        })
        .append($petinfo);

      var $delButton = $('<button>')
        .addClass('btn btn-danger float-right delete')
        .text('x');

      $li.append($delButton);

      return $li;
    });

    $petList.empty();
    $petList.append($pets);
  });
};

// Add event listeners to the submit and delete buttons
$findPets.on('click', retrievePetfinderResults);
$petList.on('click', '.save', favoritePet);
$favoriteButton.on('click', retrieveFavorites);
