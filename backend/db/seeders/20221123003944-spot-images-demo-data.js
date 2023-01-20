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
   options.tableName = 'SpotImages';
   await queryInterface.bulkInsert(options, [
    {
      spotId: 1,
      url: 'https://images.unsplash.com/photo-1580183377265-1aa7761bf11e',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://images.unsplash.com/photo-1516315138947-26e8f277dbe3',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858',
      preview: true
    },


   ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
