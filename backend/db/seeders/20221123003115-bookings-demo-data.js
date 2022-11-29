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
   options.tableName = 'Bookings';
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      userId: 1,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7))
    },
    {
      spotId: 2,
      userId: 2,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7))

    },
    {
      spotId: 3,
      userId: 3,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7))
    },


   ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
