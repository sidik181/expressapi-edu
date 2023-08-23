const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    host: "localhost",
    username: "root",
    password: "",
    database: "eduwork_cruds-v2",
    dialect: "mysql"
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established succesfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

module.exports = sequelize;
