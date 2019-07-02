var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mariadb = require('mariadb');
const config = require('./config')

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ojas',
    database: 'dhirajdb',
    sessionVariables: { wait_timeout: 31536000 },
    connectionLimit: 5,
    acquireTimeout: 5000
});

// CREATE New  User///
router.post('/createCustomer', async (req, res) => {
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
        const result = await conn.query("INSERT INTO customer SET name='" + jsondata.name + "' , " + " sex='" + jsondata.sex + "' , " + " email='" + jsondata.email + "', " + " mobile='" + jsondata.mobile + "', " + " idproofurl='"
            + jsondata.idproofurl + "' , " + " addressproofurl='" + jsondata.addressproofurl + "'"
            + ",  password='" + jsondata.password + "'");

        console.log(result);
        res.send({
            status: 200,
            data: result
        });
    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            conn.release();
        }
    }
})


//GET OTP
router.post("/getOtp", async (req, res) => {
    var jsondata = req.body;
    var password = Math.floor(1000 + Math.random() * 9000).toString();
    //  var hashedPassword = User.hashPassword(password);
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("SELECT name FROM customer WHERE mobile='" + req.body.mobile + "'");
        var userExist = await conn.query("SELECT name FROM customer WHERE mobile='" + req.body.mobile + "'");
        console.log(userExist);

        if (userExist != null && (userExist.length == 0)) {

            console.log("-------insie if -------");

            const result = await conn.query("INSERT INTO customer SET name='" + jsondata.name + "' , " + " mobile='" + jsondata.mobile + "', " + " device_type='"
                + jsondata.device_type + "' , " + " device_token='" + jsondata.device_token + "'"
                + ",  otp='" + password + "'");

            console.log(result);

            //CODE TO SEND SMS
            // request
            // .get('http://bulk.sms-india.in/send.php?usr=25748&pwd=123456&sndr=GRYTKT&ph=' + username + '&text=OTP for Validation is ' + password)
            // .on('response', function (response) {
            //     console.log(response);
            // });

         
            res.send({
                status: 200,
                message: 'new user created - OTP sent to registered mobile',
                otp: password,
                data: result
            });
        } else {

            var obj = JSON.stringify(userExist[0]);
            var jsondataObj = JSON.parse(obj);

            var updateUserValues = await conn.query("UPDATE customer SET otp='" + password + "' , device_token='"
                + req.body.device_token
                + "' , device_type='" + req.body.device_type
                + "' , name='" + req.body.name
                + "' " + " WHERE mobile ='" + req.body.mobile + "'")



            //CODE TO SEND SMS
            // request
            // .get('http://bulk.sms-india.in/send.php?usr=25748&pwd=123456&sndr=GRYTKT&ph=' + username + '&text=OTP for Validation is ' + password)
            // .on('response', function (response) {
            //     console.log(response);
            // });

            //update db with
            res.send({
                status: 200,
                message: 'user found - OTP sent to registered mobile',
                otp: password,
                data: jsondataObj
            });

        }

    } catch (err) {
        res.send(err);
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

router.post("/login", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("SELECT name FROM customer WHERE mobile='" + req.body.mobile + "'");
        var userExist = await conn.query("SELECT * FROM customer WHERE mobile='" + req.body.mobile + "' AND  otp='" + req.body.otp + "'");
        console.log(userExist);

        if (userExist != null && (userExist.length == 0)) {
            res.status(400).send({
                status: 400,
                message: 'wrong credentials'
            });

        } else {
            var obj = JSON.stringify(userExist[0]);
            var jsondataObj = JSON.parse(obj);

            res.status(200).send({
                status: 200,
                message: 'login success',
                token: jwt.sign({ mobile: jsondataObj.mobile, otp: jsondataObj.otp }, config.secret, { expiresIn: config.tokenLife }),
                data: jsondataObj

            });

        }


    } catch (error) {
        res.send(error);
    } finally {
        if (conn) {
            //conn.end();
            conn.release();
            console.log('------connection release');
            console.log('------totalConnections', pool.totalConnections());
            console.log('------activeConnections', pool.activeConnections());
            console.log('------idleConnections', pool.idleConnections());

            //  pool.totalConnections

        }

    }

})

//method to get users current orders

router.get("/getUserCurrentOrders", async (req, res) => {

    let conn;
    try {
        conn = await pool.getConnection();
        console.log('------------headers--------', req.headers.authorization);
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
            jwt.verify(req.headers.authorization.split(' ')[1], config.secret, async (error, response) => {

                if (error) {
                    res.status(401).send(
                        {
                            status: 401,
                            success: false,
                            meaasge: 'unathorized user, login and try again.'
                        });
                } else {
                    console.log('------------verified--------', response);

                    const result = await conn.query("SELECT * FROM orders WHERE customer_id =" + req.query.customer_id + " AND status < 1003")
                    console.log('----------current orders--------', result)
                    res.status(200).send({
                        status: 200,
                        count: result.length,
                        data: result
                    });

                }

            });

        } else {
            res.status(401).send(
                {
                    status: 401,
                    success: false,
                    meaasge: 'unathorized user, login and try again.'
                });
        }


    } catch (error) {
        throw error;
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

router.get("/getCustomerById", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("SELECT * FROM customer WHERE customer_id =" + req.query.customer_id);
        console.log(result);
        res.send({
            status: 200,
            data: result
        });
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

router.delete("/deleteCustomerById", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("DELETE FROM customer WHERE id =" + req.query.id);
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

router.post("/updateCustomerById", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("UPDATE customer SET age=" + req.body.age + " WHERE id =" + req.body.id);
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

//get all users
router.get("/getCustomerData", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("SELECT * FROM customer");
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

//get all users --by using stored procedure
router.get("/getAllCustomerSP", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query("CALL sp_getall_customer()");
        var obj = JSON.stringify(result[0]);
        var jsondataObj = JSON.parse(obj);
        console.log(jsondataObj);
        res.send(jsondataObj);
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


