'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
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
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
