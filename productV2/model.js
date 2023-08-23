const sequelize = require('../config/sequelize');
const { DataTypes } = require('sequelize');

const Product = sequelize.define('Product', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    imageUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

module.exports = Product;
