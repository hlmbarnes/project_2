'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    age: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user;
};