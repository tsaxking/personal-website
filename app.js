const express = require("express");
const locations = require("./locations");
const compRoute = require('./server_functions/compositions');
const appRoute = require('./server_functions/webapps');
const accountRoutes = require('./server_functions/account_routes');
const adminRoutes = require('./server_functions/admin_routes');
const fs = require('fs');
const session = require('express-session');
const HTMLConstructor = require("./server_functions/html_constructor");
const roles = require('./server_functions/roles');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { ips } = require('./server_functions/databases');
const requestIp = require('request-ip');
const helmet = require('helmet');
const Email = require("./server_functions/email");
const crypto = require('crypto');

const { temp, stat, root } = locations;

const routes = [
    "/thank-you",
    "/my-compositions",
    // "/composition/commissions",
    "/contact",
    "/home",
    "/about",
    "/about/portfolio",
    "/about/contact",
    "/about/projects",
    "/lessons",
    // "/lessons/saxophone",
    // "/lessons/composition",
    // "/other",
    // "/other/take-note",
    // "/other/score-editing",
    // "/performance",
    "/recording-studio",
    // "/recording-studio/recording",
    // "/recording-studio/mixing",
    // "/recording-studio/mockups",
    "/covid-19",
    "/webapp/tuner",
    "/sign-out"
]

const app = express();

app.use('/*', (req, res, next) => {
    let ip = requestIp.getClientIp(req);

    ips.all('SELECT * FROM ips WHERE ip = ?', [ip], (err, rows) => {
        if (rows[0] == undefined) {
            next()
        } else {
            console.log('BLOCKED CLIENT: ' + ip);
            res.status(403).json({ status: "blocked", msg: "403 (FORBIDDEN): You have sent too many requests to the server, your IP address has been blocked" });
        };
    });
});


app.use(cookieParser());

// const accounts = new Database(accounts);

function displayRequest(req, res, next) {
    console.log(`${req.method} - ${req.url}`);
    next();
}

let ipAddresses = {}

function serverTimeout(req, res, next) {
    let ip = requestIp.getClientIp(req);

    if (ipAddresses[ip] == undefined) ipAddresses[ip] = 0;

    setInterval(function() {
        // Every 60 seconds, reset the count
        ipAddresses[ip] = 0;
    }, 60000);

    next();
}

app.use(serverTimeout);

app.use('/*', (req, res, next) => {
    let ip = requestIp.getClientIp(req);
    ipAddresses[ip]++;
    // console.log(ipAddresses);

    if (ipAddresses[ip] > 1000) {
        ips.run('INSERT INTO ips VALUES (?)', [ip]);
    }

    next();
});

let sess = [];

app.use(session({
    genid: function(req) {
        return genSesID();
    },
    secret: 'almonds',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

function genSesID() {
    let rand = crypto.randomBytes(36).toString('base64');
    if (sess.includes(rand)) genSesID();
    else return rand;
}

app.use(displayRequest);
app.use(roles.createRoles);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Protection
// app.use(helmet());

function init(req, res, next) {
    if (!req.headers.index_loaded) {
        // res.set("Content-Security-Policy", "frame-src https://*.google.com https://anchor.fm https://youtube.com https://www.youtube.com https://giphy.com https://www.gstatic.com 'self';script-src 'self' https://*.google.com https://www.gstatic.com/ https://*.anchor.fm https://*.paypal.com https://s.ytimg.com https://youtube.com sdk.librato.com http://*.googleapis.com http://cdnjs.cloudflare.com;child-src https://youtube.com;");
    }

    next();
}


app.use(init);

app.use("/static", express.static(stat));

// let pdfRoot = '/home?file=';
// app.get('/*', (req, res, next) => {
//     if (req.url.substring(0, pdfRoot.length) != pdfRoot) next();
//     res.sendFile(root + req.query.file);
// });

app.post('/sign-out', (req, res) => {
    roles.resetKeys(req, res);
    // roles.addKey(req, res, 'user');
    res.json({ url: '/account/signed-out' });
});

app.get('/account/signed-out', (req, res) => {
    res.sendFile(`${temp}/account/signed-out.html`);
});

app.post('/send-email', (req, res) => {
    let { first_name, last_name, email, phone, message } = req.body;

    first_name = decodeURI(first_name);
    last_name = decodeURI(last_name);
    email = decodeURI(email);
    phone = decodeURI(phone);
    message = decodeURI(message);

    if (!phone) phone = '';
    const emailHTML = fs.readFileSync(`${temp}/emails/contact.html`);
    let emailSender = new Email('tsaxking@gmail.com', 'Website Contact-Me Form Submission');
    console.log(message);

    const constructorOptions = {
        replaceArray: [
            ['full_name', first_name + ' ' + last_name],
            ['email', email],
            ['phone_number', phone],
            ['message', message]
        ]
    }

    const constructor = new HTMLConstructor(req, res, emailHTML, constructorOptions);
    let emailToSend = constructor.render();
    emailSender.html = emailToSend;
    emailSender.send(res);
    res.json({ msg: 'success', url: '/home' });
});

app.get('/webapp/tuner', (req, res) => {
    res.sendFile(`${temp}/webapp/tuner.html`);
});


app.get("/*", (req, res, next) => {
    let signInOrUp = (req.url == '/account/sign-in' ||
            req.url == '/account/sign-up' ||
            req.url == '/account/signed-out' ||
            req.url == '/account/change-password'),
        accountReq = req.url.split("/").includes('account'),
        adminReq = req.url.split('/').includes('admin');
    if (!signInOrUp && (accountReq || adminReq)) {
        next();
    } else {
        if (req.headers.index_loaded != "true") {
            let html = fs.readFileSync(`${temp}/index.html`).toString();
            const username = roles.getUsername(req);

            const constructorOptions = {
                sendToClient: true,
                ifConditions: [{
                    token: 'account_dropdown',
                    valueIfTrue: `<h4 class="center account-dropdown_text">${username}</h4><h5 class="account-dropdown_text"><a href="/account/my-account/${username}" class="link account-dropdown_text">My Account</a><p/><h5><a href="/sign-out" class="link account-dropdown_text">Sign Out</a></h5>`,
                    condition: roles.checkAuth(req, ['client']),
                    elseCondition: roles.checkAuth(req, ['admin']),
                    elseTrue: `<h4 class="center account-dropdown_text">${username}</h4><h5 class="account-dropdown_text"><a href="/admin/home" class="link account-dropdown_text">To Admin</a></h5><h5 class="account-dropdown_text"><a href="/sign-out" data-link="nav" class="link account-dropdown_text">Sign Out</a></h5>`,
                    elseFalse: `<h5 class="account-dropdown_text"><a href="/account/sign-in" data-link="nav" class="link account-dropdown_text">Sign In</a></h5><h5 class="account-dropdown_text"><a href="/account/sign-up" data-link="nav" class="link account-dropdown_text">Sign Up</a></h5>`
                }]
            }

            let constructor = new HTMLConstructor(req, res, html, constructorOptions);
            constructor.render();
        } else {
            next();
        }
    }
});


app.use('/account', accountRoutes);

app.use('/admin', adminRoutes);

// app.get('/about/projects',(req,res))

app.get('/about/projects', (req, res) => {
    const html = fs.readFileSync(`${temp}/about/projects.html`);
    res.send(html);
});


// Send email using form
// app.use('/about', contactRoute);

app.use("/my-compositions", compRoute);


app.use("/webapp", appRoute);

app.get("/*", (req, res) => {
    let html;

    if (routes.includes(req.url)) {
        html = fs.readFileSync(`${temp}${req.url}.html`).toString();
        const constructorOptions = {
            replaceArray: [
                ["SUBPAGE", html] // render any page as full html
            ],
            sendToClient: true
        }

        let blankHTML = fs.readFileSync(`${temp}/blank.html`);
        var constructor = new HTMLConstructor(req, res, blankHTML, constructorOptions);
        console.log('sending: ' + req.url);
        constructor.render();
    }
    res.sendFile(`${temp}/404.html`);
});


app.listen(8000, () => console.log("Server is running..."));
