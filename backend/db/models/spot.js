'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User,{
        foreignKey: 'ownerId'

      });
      Spot.hasMany(models.Booking,{
        foreignKey:'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });
      Spot.hasMany(models.Review,{
        foreignKey:'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });
      Spot.hasMany(models.SpotImage,{
        foreignKey:'spotId',
        onDelete: 'CASCADE',
        hooks: true
      })
    }
  }
  Spot.init({
    // id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   primaryKey: true,
    //   autoIncrement: true
    //   },
    ownerId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      // unique:true,

    },
    address: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: { msg: 'Street address is required' },
      },
    },
    city: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: { msg: 'City is required' },
      },
    },
    state: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: { msg: 'State is required' },
      },
    },
    country: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: { msg: 'Country is required' },
      },
    },
    lat: {
      type:DataTypes.DECIMAL,
      validate: {
        isDecimal: { msg: 'Latitude must be a valid decimal number' },
      },
    },
    lng: {
      type:DataTypes.DECIMAL,
      validate: {
        isDecimal: { msg: 'Latitude must be a valid decimal number' },
      },
    },
    name: {
      type:DataTypes.STRING,
      validate: {
        len: {
          args: [0, 50],
          msg: 'Name must be less than or equal to 50 characters',
        },
      },
    },
    description: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: { msg: 'Description is required' },

      },
    },
    price: {
      type:DataTypes.DECIMAL,
      allowNull:false,
      validate: {
        notNull: { msg: 'Price per day is required' },
      },
    },

  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
