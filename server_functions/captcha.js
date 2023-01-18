const { Router } = require('express');
const request = require('https');

const router = Router();

function verifyContent(req, res) {
    if (req.body.captcha == undefined ||
        req.body.captcha == '' ||
        req.body.captcha == null) {
        res.json({ status: 'failed', msg: "Please select captcha" });
    }
    const secretKey = "6Lcni7wdAAAAAAxQbSf68lbGvCY1jdn59DPcOTRD";
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;
    // Make request to verify url
    request(verifyUrl, (err, res, body) => {
        body = JSON.parse(body);
        // If not successful
        if (body.success != undefined && !body.success) {
            res.json({ status: 'failed', msg: "Failed Captcha Verification" });
        }
        res.json({ status: 'failed', msg: "Recaptcha Success" });
    })
}

router.use(verifyContent);

module.exports = router;