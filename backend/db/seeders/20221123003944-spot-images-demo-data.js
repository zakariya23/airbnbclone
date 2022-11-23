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
   queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      url: 'https:// spotImage',
      preview: true
    },
    {
      spotId: 2,
      url: 'https:// spotImage',
      preview: true
    },
    {
      spotId: 3,
      url: 'https:// spotImage',
      preview: true
    },


   ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1,2,3] }
    }, {});
  }
};
