const HTMLConstructor = require('./html_constructor');
const locations = require("../locations");
const { Router } = require('express');
const { accounts, transactions } = require('./databases');
const Databases = require('./databases');
// const Database = require('./databases');
// const Jimp = require('jimp');
// const email = require('./email');
const recaptcha = require('./captcha');
// const qs = require('querystring');
// const { request } = require('http');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const roles = require('./roles');
const sanitizeHTML = require('sanitize-html');
const formidable = require('formidable');

const { temp, stat, root } = locations;

const adminUsername = 'tsaxking';
let blankHTML = fs.readFileSync(`${temp}/blank.html`).toString();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

const router = Router();

function send404(req, res) {
    console.log('NO ADMIN ACCESSS: ' + req.url);
    const path = `${temp}/account/404.html`;
    const forbiddenHTML = fs.readFileSync(path).toString();
    res.sendFile(path);
}

function redirectToAdmin(req, res) {
    console.log('REDIRECTING TO ACCOUNT FROM: ' + req.url);
    const path = `${temp}/admin/redirect-admin.html`;
    const forbiddenHTML = fs.readFileSync(path).toString();
    res.sendFile(path);
}

function checkPageAuth(req, res, next) {
    if (roles.checkAuth(req, ['admin'])) next();

    else {
        console.log('Authentication failed');
        if (req.method == "GET") send404(req, res);
        else if (req.method == "POST") res.json({ status: "failed", msg: "You are not authorized to perform that action" });
    }
}

function adminIndex(req, res, account) {
    if (req.headers.index_loaded == "true") {
        console.log('admin index is loaded');
        return;
    }

    let html = fs.readFileSync(`${temp}/admin/admin_index.html`).toString();
    let profilePic;
    if (account.info != undefined) profilePic = JSON.parse(account.info);
    else profilePic = 'blank_profile.png';

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

// router.use('/*', checkPageAuth);

router.get('/*', (req, res, next) => {
    accounts.all('SELECT first_name,last_name,username,id,info FROM users WHERE username = ?', [adminUsername], (err, rows) => {
        console.log(rows);
        const account = rows[0];

        if (roles.authUser(req, adminUsername)) {
            console.log('Account has access');
            adminIndex(req, res, account);

            if (req.headers.index_loaded == "true") {
                console.log('admin index is loaded');
                next();
            }
        } else {
            send404(req, res);
        }
    });
});

router.get('/home', (req, res) => {
    let html = fs.readFileSync(`${temp}/admin/home.html`).toString();
    const constructorOptions = {
        sendToClient: true,
        replaceArray: [
            ['subpage', html]
        ]
    }

    let constructor = new HTMLConstructor(req, res, blankHTML, constructorOptions);
    constructor.render();
})

router.get('/clients', (req, res) => {
    console.log("MADE IT HERE");
    let html = fs.readFileSync(`${temp}/admin/clients.html`);
    accounts.all("SELECT * FROM users", (err, rows) => {
        let repeatArray = [];

        rows.forEach(row => {
            console.log(row);
            if (row.username != 'tsaxking') {
                console.log(row);
                let { info } = row;
                // info = JSON.parse(info);
                const { roles } = JSON.parse(row.permissions);
                let replaceArray = [
                    ['full_name', row.first_name + " " + row.last_name],
                    ['phone_number', row.phone_number],
                    ['username', row.username],
                    ['email', row.email],
                    ['account_type', info.account_type],
                    ['permissions', roles.toString()]
                ]
                repeatArray.push(replaceArray);
            }
        });

        const constructorOptions = {
            sendToClient: true,
            sanitize: true,
            replaceArray: [
                ['subpage', html]
            ],
            repeatObj: {
                client: repeatArray
            }
        }

        let constructor = new HTMLConstructor(req, res, blankHTML, constructorOptions);
        constructor.render();
    });
});

router.get('/client-profile/:username', (req, res) => {
    let { username } = req.params;
    accounts.all("SELECT * FROM users WHERE username = ?", [username], (err, rows) => {
        // console.log(rows);
        let account = rows[0];
        let html = fs.readFileSync(`${temp}/admin/client-profile.html`).toString();
        let { info } = account;
        info = JSON.parse(info);
        let repeatLessonLogs;

        if (info.logs) {
            repeatLessonLogs = info.logs.map(log => {
                return [
                    ['lesson_log_id', decodeURI(log.id)],
                    ['lesson_log_date', decodeURI(log.date)],
                    ['lesson_log_content', decodeURI(log.content)],
                    ['lesson_log_id-enc', log.id],
                    ['lesson_log_date-enc', log.date],
                    ['lesson_log_content-enc', log.content],
                    ['open-popup', 'open-popup'],
                    ['pointer', 'pointer']
                ]
            });
        } else {
            repeatLessonLogs = [
                [
                    ['lesson_log_id', "No Information"],
                    ['lesson_log_date', "No Information"],
                    ['lesson_log_content', "No Information"],
                    ['lesson_log_id-enc', ''],
                    ['lesson_log_date-enc', ''],
                    ['lesson_log_content-enc', ''],
                    ['open-popup', ''],
                    ['pointer', '']
                ]
            ]
        }

        const userRoles = JSON.parse(account.permissions).roles;
        let repeatRoles = userRoles.map(userRole => {
            return [
                ['role', userRole]
            ];
        });

        const constructorOptions = {
            sendToClient: true,
            sanitize: true,
            replaceArray: [
                ['subpage', html],
                ['full_name', account.first_name + ' ' + account.last_name],
                ['account_type', info.account_type],
                ['username', username]
            ],
            repeatObj: {
                roles: repeatRoles,
                lesson_logs: repeatLessonLogs
                    // account_logs: repeatAccountLog // coming soon
            },
            replaceTags: {
                lesson_logs: 'tr'
            },
            ifConditions: [
                { token: 'parent', valueIfTrue: 1, valueIfFalse: 0, condition: userRoles.includes('parent') },
                { token: 'student', valueIfTrue: 1, valueIfFalse: 0, condition: userRoles.includes('student') }
            ]
        }

        let constructor = new HTMLConstructor(req, res, blankHTML, constructorOptions);
        constructor.render();
    });
});

let transactionJSON = fs.readFileSync(`${root}/transaction_types.json`).toString();
let transactionsObj = JSON.parse(transactionJSON);
router.get('/budget', (req, res) => {
    let html = fs.readFileSync(`${temp}/admin/budget.html`);

    transactions.all('SELECT * FROM income', (err, incomeRows) => {
        if (incomeRows == undefined) {
            incomeRows = {
                "0": {
                    amount: "No_Data",
                    id: "No_Data",
                    type: "No_Data",
                    type: "No_Data",
                    subtype: "No_Data",
                    comments: "No_Data",
                    picture: "No_Data",
                    payment_type: "No_Data"
                }
            }
        };

        transactions.all('SELECT * FROM expenses', (err, expenseRows) => {
            if (expenseRows == undefined) {
                expenseRows = {
                    "0": {
                        amount: "No_Data",
                        id: "No_Data",
                        type: "No_Data",
                        type: "No_Data",
                        subtype: "No_Data",
                        comments: "No_Data",
                        picture: "No_Data",
                        payment_type: "No_Data"
                    }
                }
            };

            let totalIncome = 0;
            let incomeArray = [];

            for (var i in incomeRows) {
                let incomeRow = incomeRows[i];
                incomeArray.push([
                    ['income-amount', incomeRow.amount],
                    ['income-id', incomeRow.id],
                    ['income-type', incomeRow.type],
                    ['income-subtype', incomeRow.subtype],
                    ['income-comments', incomeRow.comments],
                    ['income-picture_src', incomeRow.picture],
                    ['income-payment_type', incomeRow.payment_type]
                ]);
            }

            let totalExpense = 0;
            let expenseArray = [];

            for (var e in expenseRows) {
                let expenseRow = expenseRows[e];
                expenseArray.push([
                    ['expense-amount', expenseRow.amount],
                    ['expense-id', expenseRow.id],
                    ['expense-type', expenseRow.type],
                    ['expense-subtype', expenseRow.subtype],
                    ['expense-comments', expenseRow.comments],
                    ['expense-picture_src', expenseRow.picture],
                    ['expense-payment_type', expenseRow.payment_type],
                    ['expense-tax', expenseRow.payment_type]
                ]);
            }
            const balance = totalIncome - totalExpense;
            let repeatObj = {
                incomeTypeSelection: [],
                expenseTypeSelection: [],
                incomeRows: incomeArray,
                expenseRows: expenseArray
            }

            for (var incomeType in transactionsObj['Income']) {
                repeatObj[`income_${incomeType}`] = transactionsObj['Income'][incomeType].map(incomeSubtype => {
                    return [
                        ['subtype-enc', encodeURI(incomeSubtype)],
                        ['subtype', incomeSubtype]
                    ]
                });

                repeatObj.incomeTypeSelection.push([
                    ['type-enc', encodeURI(incomeType)],
                    ['type', incomeType]
                ]);
            }

            repeatObj.incomeTypeSelection.push([
                ['type-enc', 'Other'],
                ['type', 'Other']
            ]);
            repeatObj.income_Other = [
                [
                    ['subtype', 'Other'],
                    ['subtype-enc', 'Other']
                ]
            ];
            for (var expenseType in transactionsObj['Expense']) {
                repeatObj[`expense_${expenseType}`] = transactionsObj['Expense'][expenseType].map(expenseSubtype => {
                    return [
                        ['subtype-enc', encodeURI(expenseSubtype)],
                        ['subtype', expenseSubtype]
                    ]
                });
                repeatObj.expenseTypeSelection.push([
                    ['type-enc', encodeURI(expenseType)],
                    ['type', expenseType]
                ]);
            }

            repeatObj.expenseTypeSelection.push([
                ['type-enc', 'Other'],
                ['type', 'Other']
            ]);
            repeatObj.expense_Other = [
                [
                    ['subtype', 'Other'],
                    ['subtype-enc', 'Other']
                ]
            ];

            const constructorOptions = {
                sendToClient: true,
                replaceArray: [
                    ['subpage', html],
                    ['balance', balance],
                    ['income', totalIncome],
                    ['expenses', totalExpense]
                ],
                repeatObj: repeatObj
            };

            let constructor = new HTMLConstructor(req, res, blankHTML, constructorOptions);
            constructor.render();
        });
    });
});

router.post('/change-transaction', (req, res) => {

});

router.post('/new-transaction', (req, res) => {
    console.log(req.body);
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        console.log(files);
        const oldPath = files.filetoupload.filepath;
        const newPath = `${stat}/pictures/transactions/${files.filetoupload.originalFilename}`;
        fs.rename(oldPath, newPath, err => {
            if (err) console.error(err);
            res.json({ status: "failed", msg: "File uploaded" });
        });
    });
});

router.post('/delete-transaction', (req, res) => {

});

router.post('/new-log/:username', urlencodedParser, (req, res) => {
    let { date, content } = req.body;
    let { username } = req.params;

    accounts.all("SELECT info FROM users WHERE username = ?", [username], (err, rows) => {
        if (!rows) res.json({ status: "failed", msg: "That user doesn't exist" });
        const account = rows[0];
        let { info } = account;
        info = JSON.parse(info);
        let { logs } = info;

        if (!logs || logs.length == 0) {
            logs = [
                { id: 1, date: date, content: content }
            ]
        } else {
            let nextID = logs.length + 1
            logs.push({ id: nextID, date: date, content: content });
        }

        info.logs = logs;
        info = JSON.stringify(info);

        accounts.all(`UPDATE users SET info = ? WHERE username = ?`, [info, username], (err) => {
            if (err) {
                res.json({ status: "failed", msg: "Something went wrong" });
            } else {
                res.json({ status: "failed", msg: "New Log Created, reload to view/change" });
            }
        })
    })
});

router.post('/change-log/:username', urlencodedParser, (req, res) => {
    let { date, content, id } = req.body;
    let { username } = req.params;

    accounts.all("SELECT info FROM users WHERE username = ?", [username], (err, rows) => {
        if (!rows) res.json({ status: "failed", msg: "That user doesn't exist" });
        const account = rows[0];
        let { info } = account;
        info = JSON.parse(info);
        let { logs } = info;

        if (logs.length < id) {
            res.json({ status: 'failed', msg: "Log does not exist" });
            return;
        }

        if (!logs || logs.length == 0) {
            res.json({ status: 'failed', msg: "There were no logs" });
            return;
        } else {
            let log = logs.find(log => log.id = id);
            if (!log) {
                res.json({ status: 'failed', msg: "Log does not exist" });
                return;
            }
            log.content = content;
            log.date = date;
            logs[log.id - 1] = log;
        }

        info.logs = logs;
        info = JSON.stringify(info);

        accounts.all(`UPDATE users SET info = ? WHERE username = ?`, [info, username], (err) => {
            if (err) {
                res.json({ status: "failed", msg: "Something went wrong" });
            } else {
                res.json({ status: "failed", msg: `Log ${id} Updated, reload to view/change` });
            }
        })
    })
});

router.post('/change-permissions/:username', (req, res) => {
    const { username } = req.params;
    let { role1, role2 } = req.body;
    // console.log(req.body);

    accounts.all('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
        // console.log('creating admin');

        if (err) console.error(err);
        if (!rows) res.json({ status: "failed", msg: "That user doesn't exist" });

        let permissions = ['client'];

        if (role1) permissions.push('parent');
        if (role2) permissions.push('student');

        let roleObj = {
            roles: permissions
        }

        roleObj = JSON.stringify(roleObj);

        accounts.all("UPDATE users SET permissions = ? WHERE username = ?", [roleObj, username], (err, rows) => {
            if (err) res.json({ status: 'failed', msg: 'Something went wrong' });
            else res.json({ status: 'failed', msg: `${username} permissions updated` })
        })
    });
});

module.exports = router;