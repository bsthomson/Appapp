// Get references to page elements
var $exampleText = $('#example-text');
var $exampleDescription = $('#example-description');
var $submitBtn = $('#submit');
var $exampleList = $('#example-list');
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
  saveExample: function(example) {
    return $.ajax({
      headers: {
        'Content-Type': 'application/json'
      },
      type: 'POST',
      url: 'api/examples',
      data: JSON.stringify(example)
    });
  },
  getFavorites: function () {
    return $.ajax({
      url: 'api/favorites',
      type: 'GET'
    });
  },
  getExamples: function() {
    return $.ajax({
      url: 'api/examples',
      type: 'GET'
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: 'api/examples/' + id,
      type: 'DELETE'
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
        <p><a id='pet-image' value='${pet.media.photos.photo[1].$t}' img src='${pet.media.photos.photo[1].$t}' alt='animal'></a></p>
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

      var $delButton = $('<button>')
        .addClass('btn btn-danger float-right delete')
        .text('x');
      var $saveButton = $('<button>')
        .addClass('btn btn-secondary float-left save')
        .text('favorite');

      $li.append($delButton).append($saveButton);

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

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  if (!(example.text && example.description)) {
    alert('You must enter an example text and description!');
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val('');
  $exampleDescription.val('');
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
      var $saveButton = $('<button>')
        .addClass('btn btn-secondary float-left save')
        .text('favorite');

      $li.append($delButton).append($saveButton);

      return $li;
    });

    $petList.empty();
    $petList.append($pets);
  });
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr('data-id');

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on('click', handleFormSubmit);
$exampleList.on('click', '.delete', handleDeleteBtnClick);
$findPets.on('click', retrievePetfinderResults);
$petList.on('click', '.save', favoritePet);
$favoriteButton.on('click', retrieveFavorites);
