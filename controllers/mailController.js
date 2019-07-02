var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sender email',
        pass: 'sender email password'
    }
});



var sendEmail = (email, name) => {
    return new Promise(function (resolve, reject) {
        var mailOptions = {
            from: 'email id from ',
            to: email,
            subject: 'Welcome to Dhiraj',
            html: '<p>Your html here</p>'// plain text body
        };

        console.log('----------------ERROR in EMAIL SENDING------------------', name);

        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log('----------------ERROR in EMAIL SENDING------------------', name);
                resolve(error);
            } else {
                console.log('----------------EMAIL SENT------------------', name);
                resolve({ message: 'Email sent' });
            }
        })
    })
}

module.exports = {
    sendEmail
}
