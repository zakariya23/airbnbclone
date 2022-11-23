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
   options.tableName = 'ReviewImages';
   queryInterface.bulkInsert(options, [
    {
      reviewId: 1,
      url: 'https:// randomreview'
    },
    {
      reviewId: 2,
      url: 'https:// randomreview'
    },
    {
      reviewId: 3,
      url: 'https:// randomreview'
    },


   ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3] }
    }, {});
  }
};
