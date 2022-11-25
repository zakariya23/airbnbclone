'use strict';
let options = {}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'SpotImages';
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      url: 'https:// spotImage1',
      preview: true
    },
    {
      spotId: 2,
      url: 'https:// spotImage2',
      preview: true
    },
    {
      spotId: 3,
      url: 'https:// spotImage3',
      preview: true
    },


   ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages', null, {})
  }
};
