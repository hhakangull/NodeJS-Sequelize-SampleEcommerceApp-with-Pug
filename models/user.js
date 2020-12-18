const sequelize = require('../utility/database');
const { DataTypes,  Model} = require('sequelize');


class User extends Model {}


User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    }, 
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    
    password: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
},{
    sequelize,
    tableName: "user"
})

module.exports = User;