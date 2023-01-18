const { Router } = require('express');

const locations = require("../locations");

const { temp } = locations;
const { stat } = locations;

const helmet = require('helmet');

const router = Router();

let currentSessions = [];
// Functions
function sendIndex(req, res, next) {
    if (!currentSessions.includes(req.sessionID)) {
        currentSessions.push(req.sessionID);
    }
    console.log("SESSION: " + req.sessionID);
    if (req.headers.index_loaded == "true") {
        // console.log("Send something else");
        next();
    };
    res.set("Content-Security-Policy", "frame-src https://*.google.com https://anchor.fm https://youtube.com https://www.youtube.com https://giphy.com https://www.gstatic.com 'self';script-src 'self'  https://*.google.com https://www.gstatic.com/ https://*.anchor.fm https://*.paypal.com https://s.ytimg.com https://youtube.com sdk.librato.com http://*.googleapis.com http://cdnjs.cloudfare.com;child-src https://youtube.com;");
    // res.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0;");
    // res.setHeader('Set-Cookie', `visited=true;Max-Age=${30*24*60*60*1000};Secure`)
    // res.set("Cache-Control", "post-check=0, pre-check=0;");
    // res.set("Pragma", "no-cache;");
    // res.set('Cache-Control', 'must-revalidate');
    // console.log('send index.html');
    res.sendFile(`${temp}/index.html`);
    next();
}

// Protection
router.use(helmet());

router.use(sendIndex);

module.exports = router;