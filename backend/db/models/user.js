'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Spot,{
        foreignKey: 'ownerId',
        as:'owner',
        onDelete: 'CASCADE',
        hooks: true
      });
      User.hasMany(models.Booking,{
        foreignKey:'userId',
        onDelete: 'CASCADE',
        hooks: true
      });
      User.hasMany(models.Review,{
        foreignKey:'userId',
        onDelete: 'CASCADE',
        hooks: true
      })

    }
  };

  User.init(
    {
      // id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   primaryKey: true,
      //   autoIncrement: true
      //   },
      username: {
        type: DataTypes.STRING,
        allowNull: false,

      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,

      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,

      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,

      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
