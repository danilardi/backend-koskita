'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageKosan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImageKosan.belongsTo(models.Kos, {
        foreignKey: 'kosId'
      });
    }
  }
  ImageKosan.init({
    name: DataTypes.STRING,
    kosanId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ImageKosan',
  });
  return ImageKosan;
};