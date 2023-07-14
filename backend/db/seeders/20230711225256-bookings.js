'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Op } = require('sequelize');
const { Booking} = require('../models');

const bookings =[
  {
    spotId: 1,
    userId: 1,
    startDate: "2021-11-19",
    endDate: "2021-11-20",
  },
  {
    spotId: 2,
    userId: 2,
    startDate: "2021-11-21",
    endDate: "2021-11-22",
  },{
    spotId: 3,
    userId: 3,
    startDate: "2021-11-23",
    endDate: "2021-11-24",
  }


]


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

    try {
      await Booking.bulkCreate(bookings, { validate: true });
    } catch(err) {
      console.error(err);
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // await queryInterface.bulkDelete('bookings', { [Op.or]: bookings })

    options.tableName = 'Bookings';
      const Op = Sequelize.Op;
      await queryInterface.bulkDelete(options,{
        spotId: { [Op.in]: [1, 2, 3] } /// can we use numbers?
      },{})
  }
};
