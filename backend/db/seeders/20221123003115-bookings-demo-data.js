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
   options.tableName = 'Bookings';
   queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      userId: 1,
      startDate: '2022-11-22',
      endDate: '2022-11-29'
    },
    {
      spotId: 2,
      userId: 2,
      startDate: '2022-11-29',
      endDate: '2022-12-04'
    },
    {
      spotId: 3,
      userId: 3,
      startDate: '2022-11-24',
      endDate: '2022-11-30'
    },


   ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3] }
    }, {});
  }
};
