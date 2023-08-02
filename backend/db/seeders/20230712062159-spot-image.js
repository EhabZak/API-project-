'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Op } = require('sequelize');
const { SpotImage} = require('../models');

const spotImages = [
  {
    spotId: 1,
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    preview: true
    },
    {
      spotId: 1,
      url: "https://images.unsplash.com/photo-1624921938155-48a9a341d501?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      preview: true
      },
      {
        spotId: 1,
        url: "https://images.unsplash.com/photo-1531870095880-cac1a675e830?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=736&q=80",
        preview: true
        },
        {
          spotId: 1,
          url: "https://images.unsplash.com/photo-1551298328-a2f5d9f0b010?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
          preview: true
          },
          {
            spotId: 1,
            url: "https://images.unsplash.com/photo-1594237926304-3e833086e6ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
            preview: true
            },
    {
    spotId: 2,
    url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    preview: true
    },
    {
      spotId: 3,
      url: "https://images.unsplash.com/photo-1623298317883-6b70254edf31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      preview: true
      },
    {
      spotId: 4,
      url: "https://plus.unsplash.com/premium_photo-1661964475795-f0cb85767a88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      preview: true
      },
    {
      spotId: 5,
      url: "https://images.unsplash.com/photo-1623298460174-371443cc45f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
      preview: true
      },
    {
      spotId: 6,
      url: "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      preview: true
      },

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
