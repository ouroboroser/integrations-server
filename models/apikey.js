'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApiKey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ApiKey.init({
    key: DataTypes.STRING,
    disable: DataTypes.BOOLEAN,
    developerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ApiKey',
  });
  return ApiKey;
};