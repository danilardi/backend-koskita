'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KosanFacility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      KosanFacility.belongsTo(models.Kos, {
        foreignKey: 'kosId'
      });
      KosanFacility.belongsTo(models.Facility, {
        foreignKey: 'facilityId'
      });
    }
  }
  KosanFacility.init({
    kosanId: DataTypes.INTEGER,
    facilityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'KosanFacility',
  });
  return KosanFacility;
};