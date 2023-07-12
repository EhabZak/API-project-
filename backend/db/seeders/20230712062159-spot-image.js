'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Op } = require('sequelize');
const { SpotImage} = require('../models');

const spotImages = [
  {
    spotId: 1,
    url: "image url1",
    preview: true
    },
    {
    spotId: 2,
    url: "image url2",
    preview: false
    },
    {
      spotId: 3,
      url: "image url3",
      preview: false
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
      await SpotImage.bulkCreate(spotImages, { validate: true });
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
     *
     */

    // await queryInterface.bulkDelete('SpotImages', { [Op.or]: spotImages })

    options.tableName = 'SpotImages';
      const Op = Sequelize.Op;
      await queryInterface.bulkDelete(options,{
        url: { [Op.in]: ["image url1", "image url2", "image url3"] } /// can we use numbers?
      },{})
  }
};
