const HTMLConstructor = require('./html_constructor');
const locations = require("../locations");
const { Router } = require('express');
const { accounts, verify } = require('./databases');
const recaptcha = require('./captcha');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const roles = require('./roles');
const Email = require('./email');
const sanitizeHTML = require('sanitize-html');
// const URL = require('url');
const multer = require('multer');

const { temp, stat, root } = locations;
const blankHTML = fs.readFileSync(`${temp}/blank.html`).toString();

function send404(req, res) {
    console.log('NO ACCESSS: ' + req.url);
    const path = `${temp}/account/404.html`;
    const forbiddenHTML = fs.readFileSync(path).toString();
    res.sendFile(path);
}


function noPermission(req, res) {
    console.log('NO PERMISSIONS: ' + req.url);
    const path = `${temp}/account/no-permission.html`;
    const forbiddenHTML = fs.readFileSync(path);
    // res.send(forbiddenHTML);
    res.sendFile(path);
}

const router = Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/sign-in', (req, res) => {
    const constructorOptions = {
        sendToClient: true,
        ifConditions: [
            { token: 'subpage', valueIfTrue: fs.readFileSync(`${temp}/account/sign-in.html`).toString(), valueIfFalse: fs.readFileSync(`${temp}/account/already-signed-in.html`).toString(), condition: roles.checkAuth(req, ['user']) }
        ]
    }

    let constructor = new HTMLConstructor(req, res, blankHTML, constructorOptions);
    constructor.render();
});

router.get('/sign-up', (req, res) => {
    const constructorOptions = {
        sendToClient: true,
        ifConditions: [
            { token: 'subpage', valueIfTrue: fs.readFileSync(`${temp}/account/sign-up.html`).toString(), valueIfFalse: fs.readFileSync(`${temp}/account/already-signed-in.html`).toString(), condition: roles.checkAuth(req, ['user']) }
        ]
    }

    let constructor = new HTMLConstructor(req, res, blankHTML, constructorOptions);
    constructor.render();
});

router.get('/change-password', (req, res) => {
    res.sendFile(`${temp}/account/change-password.html`)
});

router.post('/change-password', (req, res) => {
    let { password, username, new_password, confirm_new_password } = req.body;
    password = decodeURI(password);
    username = decodeURI(username);
    new_password = decodeURI(new_password);
    confirm_new_password = decodeURI(confirm_new_password);

    if (new_password != confirm_new_password) { res.json({ status: 'failed', msg: 'Passwords do not match' }); return; }
    accounts.get("SELECT * FROM users WHERE username = ?", [username], (err, rows) => {
        const account = rows[0];

        if (!account) {
            res.json({ status: 'failed', msg: 'Incorrect username or password' });
            return;
        }

        const pwdObj = JSON.parse(account.password);

        crypto.pbkdf2(password, pwdObj.salt, pwdObj.iterations, 64, 'sha512', (err, derivedKey) => {
            if (derivedKey == pwdObj.password) {
                let newPwdObj = {
                    salt: crypto.randomBytes(36).toString('base64'),
                    iterations: pwdObj.iterations
                }

                crypto.pbkdf2(new_password, newPwdObj.salt, newPwdObj.iterations, 64, 'sha512', (err, dk) => {
                    newPwdObj.password = dk;
                    let newJson = JSON.stringify(newPwdObj);

                    accounts.run("UPDATE users SET password = ? WHERE username = ?", [newJson, username], (err) => {
                        if (err) res.json({ status: "failed", msg: "Something went wrong, contact the Admin" });
                        else res.json({ status: "failed", msg: "Password Change Successful!" })
                    });
                });
            } else res.json({ status: 'failed', msg: 'Incorrect username or password' });
        });
    });
});

router.get('/signed-out', (req, res) => {
    let html = fs.readFileSync(`${temp}/account/signed-out.html`);
    res.status(200).send(html);
});

router.post('/sign-up', urlencodedParser, (req, res) => {
    encryptPassword(req, res);
});

router.post('/sign-in', urlencodedParser, (req, res) => {
    locateAccount(req, res);
});


router.get('/verify/:id', (req, res) => {
    const { id } = req.params;

    accounts.all('SELECT id FROM verify WHERE id = ?', [id], (err, rows) => {
        console.log(rows);

        if (rows == undefined) {
            console.log('no rows');
            res.sendFile(`${temp}/verify/account-invalid.html`)
        } else {
            accounts.run('DELETE FROM verify WHERE id = ?', [id], (err, rows));
            res.sendFile(`${temp}/verify/account-verified.html`);
        }
    });
});

router.use('/*/:username', getUrlWithoutUsername);

router.get('/*/:username', (req, res, next) => {
    console.log('accessing account page');
    const { username } = req.params;

    accounts.all('SELECT first_name,last_name,username,id,info FROM users WHERE username = ?', [username], (err, rows) => {
        const account = rows[0];

        if (!account) { send404(req, res); return; }

        if (roles.checkAuth(req, ['client']) &&
            roles.authUser(req, username)) {
            accountIndex(req, res, account);

            if (req.headers.index_loaded == "true") {
                console.log("PERMISSION GRANTED");
                next();
            }
        } else {
            send404(req, res);
        }
    });
});

router.use('/account-info/:username', (req, res) => {
    let html = fs.readFileSync(`${temp}/account/account-info.html`).toString();
    let user = req.params.username;

    if (roles.authUser(req, user)) {
        accounts.all('SELECT * FROM users WHERE username = ?', [user], (err, rows) => {
            const account = rows[0];
            let { username, first_name, last_name, email, phone_number } = account;
            const constructorOptions = {
                sendToClient: true,
                replaceArray: [
                    ['subpage', html],
                    ['username', username],
                    ['first_name', first_name],
                    ['last_name', last_name],
                    ['email', email],
                    ['phone_number', phone_number]
                ]
            }
            let constructor = new HTMLConstructor(req, res, blankHTML, constructorOptions);
            constructor.render();
        });
    }
});

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `${stat}/pictures/uploads`)
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const imageFilter = function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = "Only image files are allowed!";
        return cb(new Error("Only image files are allowed!"), false);
    }

    cb(null, true);
}

router.post('/change-account-info/:username', (req, res) => {
    const accountUsername = req.params.username;
    let upload = multer({ storage: storage, fileFilter: imageFilter });
    console.log(upload);

    let {
        username,
        first_name,
        last_name,
        email,
        phone_number,
        new_password,
        confirm_new_password,
        password
    } = req.body;

    first_name = decodeURI(first_name);
    last_name = decodeURI(last_name);
    email = decodeURI(email);
    phone_number = decodeURI(phone_number);
    confirm_new_password = decodeURI(confirm_new_password);
    new_password = decodeURI(new_password);
    password = decodeURI(password);

    console.log(req.body);
    const failedMessage = { msg: "Password is incorrect", status: "failed" }

    accounts.all(`SELECT * FROM users WHERE username = ?`, [accountUsername], (err, rows) => {
        if (rows.length >= 1) {
            const account = rows[0];
            const actPwdJSON = account.password;
            const actPwdObj = JSON.parse(actPwdJSON);
            username = decodeURI(username);
            password = decodeURI(password);

            // checks if username's hashed password is the same as the one typed
            crypto.pbkdf2(password, actPwdObj.salt, actPwdObj.iterations, 64, 'sha512', (err, derivedKey) => {
                if (derivedKey.toString('base64') === actPwdObj.password) {
                    if (confirm_new_password == new_password) {
                        var salt = crypto.randomBytes(36).toString('base64');
                        var iterations = 200000;

                        crypto.pbkdf2(new_password, salt, iterations, 64, 'sha512', (err, derivedKey) => {
                            const json = JSON.stringify({
                                password: derivedKey.toString('base64'),
                                salt: salt,
                                iterations: iterations
                            });

                            changeAccountData(accountUsername, 'password', json);
                        });

                        changeAccountData(accountUsername, 'username', username);
                        changeAccountData(accountUsername, 'first_name', first_name);
                        changeAccountData(accountUsername, 'last_name', last_name);
                        changeAccountData(accountUsername, 'email', email);
                        changeAccountData(accountUsername, 'phone_number', phone_number);
                    } else res.json({ status: 'failed', msg: 'Passwords do not match' });
                } else {
                    res.json(failedMessage);
                }
            });
        }
    });
});

function changeAccountData(username, header, data) {
    if (!data) return;

    accounts.run(`UPDATE users SET ${header} = ? WHERE username = ?`, [data, username], (err) => {
        if (err) console.error(err);
    });
}

// router.get('/lessons/:username', (req, res) => {
//     if (!roles.checkAuth(req, res, ['student'])) noPermission(req, res);
//     // let html = fs.readFileSync
// });

router.get('/lesson-logs/:username', (req, res) => {
    if (!roles.checkAuth(req, ['student'])) noPermission(req, res);
    let html = fs.readFileSync(`${temp}/account/lesson-logs.html`).toString();
    const user = req.params.username;
    if (roles.authUser(req, user)) {
        accounts.all('SELECT * FROM users WHERE username = ?', [user], (err, rows) => {
            if (err) console.error(err);

            const account = rows[0];
            let { info } = account;
            info = JSON.parse(info);
            const { logs } = info;

            let repeatArray = logs.map(log => {
                return [
                    ["id", decodeURI(log.id)],
                    ["date", decodeURI(log.date)],
                    ["content", decodeURI(log.content).replace(/\n/g, '<br>')],
                    ["log_json", JSON.stringify(log).replace(/\n/g, '<br>')]
                ]
            });

            const constructorOptions = {
                sendToClient: true,
                repeatObj: {
                    lesson_logs: repeatArray
                },
                sanitize: true
            }

            let constructor = new HTMLConstructor(req, res, html, constructorOptions);
            constructor.render();
        });
    } else noPermission(req, res);
});

function accountIndex(req, res, account) {
    if (req.headers.index_loaded == "true") {
        console.log('index is loaded');
        return;
    }

    console.log("index isn't loaded");
    let html = fs.readFileSync(`${temp}/account/account_index.html`).toString();
    let profilePic;

    if (account.info != undefined) profilePic = JSON.parse(account.info).profilePic;

    if (!profilePic) profilePic = 'blank_profile.png';

    const constructorOptions = {
        replaceArray: [
            ["username", `${account.first_name} ${account.last_name}`],
            ["profile_pic_src", profilePic]
        ],
        sendToClient: true
    }

    let constructor = new HTMLConstructor(req, res, html, constructorOptions);
    constructor.render();
}

function getUrlWithoutUsername(req, res, next) {
    console.log('creating url with no user');
    const { username } = req.params;

    if (!username) return;

    req.username = username;
    let splitUrl = req.url.split('/');
    splitUrl.pop();
    req.urlNoUser = splitUrl.join('/');
    next();
}

router.get('/my-account/:username', (req, res) => {
    const { username } = req.params;
    accounts.all('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
        const account = rows[0];
        const html = fs.readFileSync(`${temp}/account/my-account.html`);

        const constructorOptions = {
            sendToClient: true,
            replaceArray: [
                ['subpage', html],
                ['full_name', account.first_name + ' ' + account.last_name],
                ['username', username]
            ]
        }

        let constructor = new HTMLConstructor(req, res, blankHTML, constructorOptions);
        constructor.render();
    });
});

function ifErr(err, message) {
    if (err) console.error(err);
    else console.log(message);
}

try { accounts.run("CREATE TABLE IF NOT EXISTS verify(username,id)") } catch (err) {}

function encryptPassword(req, res) {
    let { password, password_confirm } = req.body;

    if (password != password_confirm) {
        res.json({ status: "failed", msg: "Passwords do not match" });
        return;
    }

    if (password.length < 8) {
        res.json({ status: "failed", msg: "Password is shorter than 8 characters" });
        return;
    }

    password = decodeURI(password);
    var salt = crypto.randomBytes(36).toString('base64');
    var iterations = 200000;

    crypto.pbkdf2(password, salt, iterations, 64, 'sha512', (err, derivedKey) => {
        ifErr(err, 'Hash Complete!');
        const json = JSON.stringify({
            password: derivedKey.toString('base64'),
            salt: salt,
            iterations: iterations
        });

        createAccount(req, res, json);
    });
    return;
}

function createAccount(req, res, password) {
    let { first_name, last_name, email, phone_number, username } = req.body;

    first_name = sanitizeHTML(decodeURI(first_name));
    last_name = sanitizeHTML(decodeURI(last_name));
    email = sanitizeHTML(decodeURI(email));
    phone_number = sanitizeHTML(decodeURI(phone_number));
    username = sanitizeHTML(decodeURI(username));

    const permissions = JSON.stringify({ roles: ['client'] });
    const info = JSON.stringify({ account_type: '', logs: [], pages: [], account_logs: [] })
    const id = crypto.randomBytes(36).toString('base64');
    const tableSet = [first_name, last_name, username, email, permissions, phone_number, password, id, info];

    // Searches for the same username
    accounts.all(`SELECT username FROM users WHERE username = ?`, [username], (err, rows) => {
        if (rows[0] != undefined) { // username already exists
            res.json({ msg: "Username already exists", status: "failed", recUsername: createUsername(first_name, last_name) });
            return;
        } else { // username does not exist
            accounts.run("INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?)", tableSet);
            sendEmail(first_name, last_name, email, username, res);
            // res.json({ msg: "username available", status: "success", url: `/account/sign-in` });
            res.json({ status: 'failed', msg: 'Please check your email, if nothing comes through try signing up again.' })
        }
    });
}

function createUsername(first, last) {
    let lastLetter = last.substr(0, 1);
    let rand = Math.floor(1000 + Math.random() * 9000).toString();
    let createdUsername = first + lastLetter + rand;

    accounts.all(`SELECT username FROM users WHERE username = ?`, [createdUsername], (err, rows) => {
        if (rows.length > 0) createdUsername(first, last);
    });

    return createdUsername;
}

function sendEmail(first, last, email, username, res) {
    let verifyId = generateVerifyId(username);
    const constructorOptions = {
        replaceArray: [
            ['first', first],
            ['last', last],
            ['verify', verifyId]
        ]
    }

    let html = fs.readFileSync(`${temp}/emails/verify.html`);
    let constructor = new HTMLConstructor(null, null, html, constructorOptions);
    var email = new Email(email, "King Music Studio: Email Confirmation");
    email.html = constructor.render();
    email.send(res);
}

function generateVerifyId(username) {
    let id = crypto.randomBytes(36).toString('base64'); // generate random string
    id = replaceAll(id, '/', 2);
    // set to database
    accounts.run('INSERT INTO verify VALUES (?,?)', [username, id]);

    setTimeout(function() {
        accounts.all('SELECT username,id FROM verify WHERE id = ?', [id], (err, rows) => {
            if (rows[0] != undefined) { // user did not verify
                accounts.all('DELETE FROM verify WHERE id = ?', [id], (err, rows) => {
                    accounts.all('DELETE FROM users WHERE username = ?', [username], (err, rows) => {
                        console.log(`${username} deleted`);
                    });
                });
            }
        });
    }, 1000 * 60 * 5);

    return id;
}

function replaceAll(str, searchValue, value) {
    while (str.indexOf(searchValue) != -1) {
        str = str.replace(searchValue, value);
    }

    return str;
}

function locateAccount(req, res) {
    const formInfo = req.body
    var { email } = formInfo;
    email = decodeURI(email);
    // find username in database
    const failedMessage = { msg: "Username or Password is incorrect, or you have not verified your email", status: "failed" }

    accounts.all(`SELECT * FROM users WHERE username = ? OR email = ?`, [email, email], (err, rows) => {
        console.log(rows);
        if (rows.length >= 1) {
            let account = rows[0];
            const actPwdJSON = account.password;
            const actPwdObj = JSON.parse(actPwdJSON);
            let { password } = formInfo;
            let { username } = account;

            username = decodeURI(username);
            password = decodeURI(password);

            // checks if username's hashed password is the same as the one typed
            crypto.pbkdf2(password, actPwdObj.salt, actPwdObj.iterations, 64, 'sha512', (err, derivedKey) => {
                if (derivedKey.toString('base64') === actPwdObj.password) {
                    accounts.all('SELECT username FROM verify WHERE username = ?', [username], (err, rows) => {
                        if (rows[0] == undefined) {
                            const permissions = JSON.parse(account.permissions).roles;
                            console.log("Logging user in, giving permissions: " + permissions.toString());
                            roles.removeKey(req, 'user');

                            for (var permission in permissions) {
                                console.log("Adding key: " + permissions[permission]);
                                roles.addKey(req, permissions[permission]);
                            }

                            roles.addUsername(req, username);
                            res.cookie('username', account.username, {
                                maxAge: 1000 * 60 * 60,
                                httpOnly: false
                            });

                            let url;

                            if (permissions.includes('admin')) url = '/admin/home';
                            else url = `/account/my-account/${account.username}`;

                            console.log(url);

                            res.json({
                                status: "success",
                                url: url,
                                accountData: {
                                    username: username,
                                    email: account.email,
                                    first_name: account.first_name,
                                    last_name: account.last_name,
                                    phone_number: account.phone_number,
                                    roles: permissions
                                }
                            });
                        } else {
                            res.json(failedMessage);
                        }
                    });
                } else {
                    res.json(failedMessage);
                }
            });
        } else res.json(failedMessage);
    });
}

module.exports = router;