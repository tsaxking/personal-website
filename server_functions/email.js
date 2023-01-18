const nodemailer = require('nodemailer'),
    sgTransport = require('nodemailer-sendgrid-transport');

var transporter = nodemailer.createTransport(sgTransport({
    service: 'gmail',
    auth: {
        api_key: "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"
    }
}))

class Email {
    constructor(recipient, subject) {
        this.recipient = recipient;
        this.subject = subject;
    }

    send(res, success) {
        let mailOptions = {
                from: 'tsaxking.music@gmail.com',
                to: this.recipient,
                subject: this.subject,
                text: this.message,
                html: this.html
            }
            // console.log(mailOptions);
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                res.json({ status: 'failed', msg: "There was an error on the server, please try again later" });
            } else {
                // console.log(`Email sent to ${this.recipient}: ${info.response}`);
                if (res, success) res.json({ status: 'failed', msg: 'Email sent' })
            }
            console.log('should have sent');
        });
    }
}

exports = module.exports = Email;