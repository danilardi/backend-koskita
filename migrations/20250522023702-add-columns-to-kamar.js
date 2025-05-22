'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Kamars', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('Kamars', 'startDate', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('Kamars', 'endDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Kamars', 'duration');
    await queryInterface.removeColumn('Kamars', 'startDate');
    await queryInterface.removeColumn('Kamars', 'endDate');
  }
};
