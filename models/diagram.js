'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Diagram extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Diagram.init({
    link: DataTypes.STRING,
    developerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Diagram',
  });
  return Diagram;
};