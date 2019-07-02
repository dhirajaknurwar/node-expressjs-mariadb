var express = require('express');
var router = express.Router();

var mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ojas',
    database: 'dhirajdb',
    sessionVariables: { wait_timeout: 31536000 },
    connectionLimit: 5,
    acquireTimeout: 5000
});



module.exports = router;


