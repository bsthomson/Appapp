'use strict';
module.exports = (sequelize, DataTypes) => {
  var Favorite = sequelize.define('Favorite', {
    username: DataTypes.STRING,
    petid: DataTypes.INTEGER,
    photolocation: DataTypes.STRING,
    petbreed: DataTypes.STRING,
    petname: DataTypes.STRING,
    petshelterid: DataTypes.STRING
  }, {});
  Favorite.associate = function(models) {
    // associations can be defined here
  };
  return Favorite;
};