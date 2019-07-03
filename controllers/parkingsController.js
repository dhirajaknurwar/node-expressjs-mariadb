var express = require('express');
var router = express.Router();
var mariadb = require('mariadb');
var jwt = require('jsonwebtoken');
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

// create parking///
router.post('/createParking', async (req, res) => {
    var jsondata = req.body;
    console.log(jsondata);
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
                    const result = await conn.query("INSERT INTO parkings SET address='" + jsondata.address + "' , " + " landmark='" + jsondata.landmark + "' , " + " houseno='" + jsondata.houseno + "', " + " building_name='" + jsondata.building_name + "' , " + " lat=" + jsondata.lat + ", " + " lng=" + jsondata.lng + ", " + " owner_id=" + jsondata.owner_id + ", " + " rate_per_hour=" + jsondata.rate_per_hour + " , " + " is_available=" + jsondata.is_available + ", " + " parking_type=" + jsondata.parking_type + "");
                    console.log(result);
                    res.status(200).send({
                        status: 200,
                        message: 'created success',
                        data: result
                    }
                    );
                }

            });

        } else {
            res.status(401).send(
                {
                    status: 401,
                    success: false,
                    message: 'unathorized user, login and try again.'
                });
        }


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


router.post('/getNearByParking', async (req, res) => {

    // request body
    // {
    //     "lat": 17.5454,
    //     "lng": 78.54545,
    //     "max_distance":1
    // }

    var jsondata = req.body;
    console.log(jsondata);
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

                    const lat = req.body.lat;
                    const max_distance = req.body.max_distance;

                    const calculated_lat_one = (lat - (max_distance / 111.045));
                    const calculated_lat_two = (lat + (max_distance / 111.045));

                    const get_all_nearby_parkings = await conn.query("SELECT * FROM parkings where is_available=1 AND (lat BETWEEN " + calculated_lat_one + " AND " + calculated_lat_two + ")");
                    console.log(get_all_nearby_parkings);
                    res.status(200).send(
                        {
                            status: 200,
                            success: true,
                            data: get_all_nearby_parkings
                        });
                }

            });

        } else {
            res.status(401).send(
                {
                    status: 401,
                    success: false,
                    message: 'unathorized user, login and try again.'
                });
        }


        // response body
        // {
        //     "status": 200,
        //     "success": true,
        //     "data": [
        //         {
        //             "parking_id": 1000,
        //             "address": "MIyapur",
        //             "landmark": "FCI-WEDIA colony Kaman",
        //             "houseno": "#104",
        //             "building_name": "Sai Ram Residency",
        //             "lat": 17.545401,
        //             "lng": 78.545448,
        //             "owner_id": 1000,
        //             "rate_per_hour": 50,
        //             "is_available": 1,
        //             "parking_type": 1

        //     ]
        // }

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


function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = router;


