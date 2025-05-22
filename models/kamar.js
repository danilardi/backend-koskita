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
        foreignKey: 'userId',
        as: 'user'
      });
      Kamar.belongsTo(models.Kos, {
        foreignKey: 'kosanId',
        as: 'kosan'
      });
    }
  }
  Kamar.init({
    noKamar: DataTypes.STRING,
    kosanId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ['available', 'booked'],
      defaultValue: 'available',
    },
  }, {
    sequelize,
    modelName: 'Kamar',
  });
  return Kamar;
};