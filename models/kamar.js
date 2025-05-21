'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kamar.belongsTo(models.User, {
        foreignKey: 'userId'
      });
      Kamar.belongsTo(models.Kos, {
        foreignKey: 'kosanId'
      });
    }
  }
  Kamar.init({
    kosanId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Kamar',
  });
  return Kamar;
};