const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    username: "root",
    password: "",
    database: "eduwork_cruds"
});

module.exports = connection;
