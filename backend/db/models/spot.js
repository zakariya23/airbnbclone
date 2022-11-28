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
      Spot.hasMany(models.Booking, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true
      })
      Spot.hasMany(models.Review,{
        foreignKey: "spotId",
        onDelete:"CASCADE",
        hooks: true
      })
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
        hooks: true
      })
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId"
      })
    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type:DataTypes.STRING,
      allowNull: false
    },
    lat:{
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    lng:{
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min:0
      }
    },

  }, {
    sequelize,
    modelName: 'Spot',

  });
  return Spot;
};
