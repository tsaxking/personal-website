const nodemailer = require('nodemailer'),
    sgTransport = require('nodemailer-sendgrid-transport');

const os = require('os');

const inDevelopment = os.hostname() != 'BERINT-SERVER';


// Creates connection to my gmail
var transporter = nodemailer.createTransport(sgTransport({
    service: 'gmail',
    auth: {
        api_key: "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"
    }
}));

class Email {
    /**
     * 
     * @param {String} recipient 
     * @param {String} subject 
     */
    constructor(recipient, subject, attachments) {
        this.recipient = recipient;
        this.subject = subject;
        this.attachments = attachments;
    }

    /**
     * @description Sends the email. BE SURE TO PUT this.text OR this.html BEFORE SENDING
     * @param {Function} callback Optional (error, emailInfo)
     */
    send() {
        if (inDevelopment) {
            if (this.message) this.message = this.message.replace(new RegExp('https://taylorreeseking.com', 'gi'), 'http://localhost:8000');
            if (this.html) this.html = this.html.replace(new RegExp('https://taylorreeseking.com', 'gi'), 'http://localhost:8000');
        }

        let mailOptions = {
            from: 'info@sfzmusic.org',
            to: this.recipient,
            subject: this.subject,
            text: this.message,
            html: this.html,
            cc: this.cc,
            bcc: this.bcc,
            attachments: Array.isArray(this.attachments) ? this.attachments : []
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.error('Email:', err);
            else console.log('Email:', info);
        });
    }
}

exports = module.exports = Email;