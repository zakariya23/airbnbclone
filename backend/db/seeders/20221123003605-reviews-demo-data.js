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
   options.tableName = 'Reviews';
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      userId: 1,
      review: '1st generic review',
      stars: 4
    },
    {
      spotId: 2,
      userId: 2,
      review: '2nd generic review',
      stars: 3
    },
    {
      spotId: 3,
      userId: 3,
      review: '3rd generic review',
      stars: 5
    },


   ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', null, {})
  }
};
