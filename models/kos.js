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
        foreignKey: 'kosanId',
        otherKey: 'userId'
      });
      Kos.belongsToMany(models.Facility, {
        through: models.KosanFacility,
        as: 'facilities',
        foreignKey: 'kosanId',
        otherKey: 'facilityId',
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