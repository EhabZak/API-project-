'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Op } = require('sequelize');
const {Review} = require('../models');

const reviews = [
  {
    spotId: 1,
    userId: 1,
    review: "This was an awesome spot!",
    stars: 5,
  },
  {
    spotId: 2,
    userId: 2,
    review: "This was a good spot!",
    stars: 4,
  },
  {
    spotId: 3,
    userId: 3,
    review: "This was an ok spot!",
    stars: 3,
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
      await Review.bulkCreate(reviews, { validate: true });
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

    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      spotId: { [Op.in]: [1, 2, 3] } /// can we use numbers?
    },{})
  }
};
