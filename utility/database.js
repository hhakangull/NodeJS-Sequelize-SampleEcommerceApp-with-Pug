const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodeapp', 'root', '', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;