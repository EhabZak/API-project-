'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: 'userId'
        // onDelete: 'CASCADE'
      });
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId'
        // onDelete: 'CASCADE'
      });
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'CASCADE',
        hooks:true
      })

    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      allowNull: {
        arg: false,
        msg: "Review text is required"
      }


      // validate: {
      //   isAlpha: {
      //     args: true,
      //     msg: "Review text is required"
      //   }
      // }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: {
          args: true,
          msg: "Stars must be an integer from 1 to 5"
        },
        min: {
          args: 1,
          msg: "Stars must be an integer from 1 to 5"
        },
        max: {
          args: 5,
          msg: "Stars must be an integer from 1 to 5"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
