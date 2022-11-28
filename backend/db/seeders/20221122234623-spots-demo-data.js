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
   options.tableName = 'Spots';
   await queryInterface.bulkInsert(options, [
    {
      ownerId: 1,
      address: '1234 sesame street',
      city: 'Toronto',
      state: 'Ohio',
      country: 'Canada',
      lat: 52.87465,
      lng: 129.45691,
      name: 'cool house',
      description: 'nice house man',
      price: 29.99
    },
    {
      ownerId: 2,
      address: '231 food street',
      city: 'rio di janero',
      state: 'florida',
      country: 'qatar',
      lat: 52.87465,
      lng: 124.45691,
      name: 'food house',
      description: 'wow this is a nice description',
      price: 12.44
    },
    {
      ownerId: 3,
      address: '1 north pole',
      city: 'north pole town',
      state: 'cold',
      country: 'north pole',
      lat: 90.87465,
      lng: 130.0000,
      name: 'gingerbread house',
      description: 'delicious house',
      price: 29.99
    }


   ], {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete(options, {
      state: { [Op.in]: ['Ohio', 'florida', 'cold'] }
    }, {});
  }
};
