const sequelize = require('../utility/database');
const {
    Sequelize,
    DataTypes,
    Model
} = require('sequelize');


class Product extends Model {}

Product.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false, 
        primaryKey: true
    },
    name: {
        type:  DataTypes.STRING(50),
        allowNull: false, 
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {

    sequelize,
    modelName: 'Product'
});

module.exports = Product;