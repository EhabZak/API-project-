'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Op } = require('sequelize');
const {ReviewImage} = require('../models');

const reviewImages= [
{
  reviewId: 1,
  url: "review image url1",
},
{
  reviewId: 2,
  url: "review image url2",
},
{
  reviewId: 3,
  url: "review image url3",
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
      await ReviewImage.bulkCreate(reviewImages, { validate: true });
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
    // await queryInterface.bulkDelete('ReviewImages', { [Op.or]: reviewImages })

    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options,{
      reviewId: { [Op.in]: [1, 2, 3] } /// can we use numbers?
    },{})
  }
};
