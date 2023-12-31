'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
options.schema = process.env.SCHEMA; // define your schema in options object
}

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }  // with bulk create we don't need this

const { Op } = require('sequelize');
const {Spot} = require('../models');

const spots =[
{
  ownerId: 1,
  address: "123 Disney Lane-spotId-1",
  city: "San Francisco",
  state: "California",
  country: "United States of America",
  lat: 37.7645358,
  lng: -122.4730327,
  name: "App Academy",
  description: "Place where web developers are created",
  price: 123

},
{
  ownerId: 2,
  address: "123 LaLa Lane-spotId-2",
  city: "Boston",
  state: "California",
  country: "United States of America",
  lat: 31.7645358,
  lng: -132.4730327,
  name: "Eden garden",
  description: "House where web developers are created",
  price: 213
},
{
  ownerId: 3,
  address: "123 Bye Lane-spotId-3",
  city: "San Jose",
  state: "California",
  country: "United States of America",
  lat: 41.7645358,
  lng: -142.4730327,
  name: "Hello see",
  description: "building web developers are created",
  price: 321
},
{
  ownerId: 1,
  address: "123 Albacore Lane-spotId-4",
  city: "San Francisco",
  state: "California",
  country: "United States of America",
  lat: 37.7645358,
  lng: -122.4730327,
  name: "App Academy",
  description: "Place where web developers are created",
  price: 123

},
{
  ownerId: 2,
  address: "123 spring Lane-spotId-5",
  city: "Boston",
  state: "California",
  country: "United States of America",
  lat: 31.7645358,
  lng: -132.4730327,
  name: "best place",
  description: "House where web developers are created",
  price: 213
},
{
  ownerId: 3,
  address: "123 beach Lane-spotId-6",
  city: "San Jose",
  state: "California",
  country: "United States of America",
  lat: 41.7645358,
  lng: -142.4730327,
  name: "beach park",
  description: "building web developers are created",
  price: 321
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
      await Spot.bulkCreate(spots, { validate: true });
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
    options.tableName = 'Spots';
      const Op = Sequelize.Op;

      // await queryInterface.bulkDelete('Spots', { [Op.or]: spots })
      await queryInterface.bulkDelete(options,{
        name: { [Op.in]: ["App Academy", "Hello Bye", "Hello see"] }
      },{})


// add the options property
    // add the options
  }
};
