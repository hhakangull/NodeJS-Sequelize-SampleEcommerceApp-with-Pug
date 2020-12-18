const sequelize = require('../utility/database');
const {
    DataTypes,
    Model
} = require('sequelize');


class Category extends Model {}

Category.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: DataTypes.STRING(50),
    description: { 
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {

    sequelize,
    modelName: 'Category'
});

module.exports = Category;