var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
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

// register new owner///
router.post('/registerOwner', async (req, res) => {
    // {
    //     "name":"Dhiraj",
    //     "age": 33,
    //     "email":"dhiraj@gmail.com"
    // }
    var jsondata = req.body;
    console.log(jsondata);
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO owner SET name='" + jsondata.name + "' , " + " mobile='" + jsondata.mobile + "' , " + " email='" + jsondata.email + "', " + " address='" + jsondata.address + "'");
        console.log(result);
        res.send(result);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
})

router.get("/getOwnerById", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("SELECT * FROM owner WHERE owner_id =" + req.query.owner_id);
        console.log(result);
        res.send(result);
    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            //conn.end();
            conn.release();
            console.log('------connection release');
            console.log('------totalConnections', pool.totalConnections());
            console.log('------activeConnections', pool.activeConnections());
            console.log('------idleConnections', pool.idleConnections());
        }

    }

})


module.exports = router;


