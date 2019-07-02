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
// place order///
router.post('/placeOrder', async (req, res) => {
    var jsondata = req.body;
    console.log(jsondata);
    let conn;
    try {

        // conn = await pool.getConnection();
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

                    conn = await pool.getConnection();
                    console.log('--------parking_id--------', req.body.parking_id);
                    const result = await conn.query("SELECT * FROM parkings WHERE parking_id = " + (req.body.parking_id) + " LIMIT 1");

                    if (isEmpty(result)) {

                        res.status(400).send(
                            {
                                status: 400,
                                success: false,
                                message: 'parking does not exist'
                            });

                    } else {
                        console.log('--------result first--------', result);
                        var obj = JSON.stringify(result[0]);
                        var jsondataObj = JSON.parse(obj);
                        console.log('--------result--------', jsondataObj);
                        console.log('--------is_available--------', jsondataObj.is_available);

                        if (jsondataObj.is_available) {
                            console.log('--------inside--------');
                            //here write logic to place order
                            const queryStr = "INSERT INTO orders SET address='" + req.body.address + "' ,"
                                + " landmark='" + req.body.landmark + "', houseno='" + req.body.houseno + "' , building_name='" + req.body.building_name + "', "
                                + " lat=" + req.body.lat + " , lng=" + req.body.lng + " , customer_id=" + req.body.customer_id + " , owner_id=" + req.body.owner_id
                                + " , order_amount=" + req.body.order_amount + " , order_date='" + req.body.order_date
                                + "' , parking_type=" + req.body.parking_type + " , noofdays=" + req.body.noofdays + " , "
                                + " transaction_id='" + req.body.transaction_id + "', payment_mode='" + req.body.payment_mode + "' , "
                                + " start_timestamp=" + req.body.start_timestamp + " , "
                                + " end_timestamp=" + req.body.end_timestamp + " , "
                                + " parking_id = " + req.body.parking_id + " , "
                                + " is_confirm = " + req.body.is_confirm + ""
                                + " , status = " + req.body.status + "";

                            console.log('--------queryStr--------', queryStr);


                            const placeOrderResult = await conn.query("INSERT INTO orders SET address ='" + req.body.address + "' ,"
                                + " landmark ='" + req.body.landmark + "', houseno = '" + req.body.houseno + "' , building_name = '" + req.body.building_name + "', "
                                + " lat = " + req.body.lat + " , lng =" + req.body.lng + " , customer_id = " + req.body.customer_id + " , owner_id = " + req.body.owner_id
                                + " , order_amount = " + req.body.order_amount + " , order_date = '" + req.body.order_date
                                + "' , parking_type = " + req.body.parking_type + " , noofdays = " + req.body.noofdays + " , "
                                + " transaction_id = '" + req.body.transaction_id + "', payment_mode = '" + req.body.payment_mode + "' , "
                                + " start_timestamp = " + req.body.start_timestamp + " , "
                                + " end_timestamp = " + req.body.end_timestamp + " , "
                                + " parking_id = " + req.body.parking_id + " , "
                                + " is_confirm = " + req.body.is_confirm + ""
                                + " , status = " + req.body.status + "");

                            //update parking as occupied here
                            //also send push to customer as well as onwer
                            const parking_unavailable = await conn.query("UPDATE parkings SET is_available = 0  WHERE parking_id =" + req.body.parking_id);

                            res.status(200).send(
                                {
                                    status: 200,
                                    success: true,
                                    data: placeOrderResult
                                });

                        } else {
                            res.status(400).send(
                                {
                                    status: 400,
                                    success: false,
                                    message: 'parking already occupied'
                                });
                        }
                    }
                    console.log(result);
                    res.send(result);

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


router.put('/updateOrderStatus', async (req, res) => {
    var jsondata = req.body;
    console.log(jsondata);
    let conn;
    try {

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

                    conn = await pool.getConnection();
                    const result = await conn.query("SELECT order_id FROM orders WHERE order_id = " + req.body.order_id + "");
                    var obj = JSON.stringify(result[0]);
                    var jsondataObj = JSON.parse(obj);
                    console.log(jsondataObj);

                    if (jsondataObj.order_id == (req.body.order_id)) {

                        var str_query = "UPDATE orders SET status = " + req.body.status + " WHERE order_id =" + req.body.order_id;
                        console.log(str_query);
                        const update_result = await conn.query("UPDATE orders SET status = " + req.body.status + " WHERE order_id =" + req.body.order_id)

                        var msg = '';
                        if (req.body.status == 1001) {
                            msg = 'your order accepted';
                        } else if (req.body.status == 1002) {
                            msg = 'your order confirmed';
                        } else if (req.body.status == 1003) {
                            msg = 'your order completed';
                        } else if (req.body.status == 1006) {
                            msg = 'your order rejected by owner';
                        } else if (req.body.status == 1007) {
                            msg = 'you cancelled your order';
                        }
                        res.status(200).send(
                            {
                                status: 200,
                                success: true,
                                data: msg
                            }
                        );

                    } else {
                        res.status(400).send(
                            {
                                status: 400,
                                success: false,
                                message: 'invalid order details '
                            }
                        );
                    }
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


