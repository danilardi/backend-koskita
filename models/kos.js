'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kos.belongsToMany(models.User, {
        through: models.Kamar,
        foreignKey: 'kosId',
        otherKey: 'userId'
      });
      Kos.belongsToMany(models.Facility, {
        through: models.KosanFacility,
        foreignKey: 'kosId',
        otherKey: 'facilityId'
      });
      Kos.hasMany(models.ImageKosan, {
        foreignKey: 'kosId',
        as: 'images'
      });
    }
  }
  Kos.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stockKamar: DataTypes.INTEGER,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Kos',
  });
  return Kos;
};