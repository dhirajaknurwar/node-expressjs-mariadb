//var mariadb = require('mariadb');
//const pool = mariadb.createPool({ host: 'localhost', user: 'root', password: 'ojas', database: 'dhirajdb', connectionLimit: 5 });
var _ = require('lodash')
const multer = require('multer');
var cors = require('cors');//security reason for browser
const ownerController = require('./controllers/ownerController');
const parkingController = require('./controllers/parkingsController');
const orderController = require('./controllers/ordersController');
const customerController = require('./controllers/customerController');

// pool.getConnection()
//     .then(conn => {
//         console.log("connected ! connection id is " + conn.threadId);
//         conn.end(); //release to pool
//     })
//     .catch(err => {
//         console.log("not connected due to error: " + err);
//     });

var bodyParser = require('body-parser')

var express = require('express')
var app = express();


var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With', 'Content-Type', 'Authorization');

    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
}


// app.use(bodyParser.json());       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//     extended: true
// }));

app.use(cors());
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}))

app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({
    storage
})

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (req.file)
        res.json({
            imageUrl: 'images/'+req.file.filename
        });
    else
        res.status("409").json("No Files to Upload.");
});

const port = 3070;//process.env.port || 3055;

app.listen(port, () => {
    console.log('App listening on port ', port);
});



app.use('/api/customers', customerController);
app.use('/api/owner', ownerController);
app.use('/api/parking', parkingController);
app.use('/api/orders', orderController);
