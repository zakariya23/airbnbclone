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
   await queryInterface.bulkInsert(options, [
    {
      reviewId: 1,
      url: 'https:// randomreview1'
    },
    {
      reviewId: 2,
      url: 'https:// randomreview2'
    },
    {
      reviewId: 3,
      url: 'https:// randomreview3'
    },


   ], {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
