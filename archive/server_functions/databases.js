const locations = require("../locations");
const fs = require('fs');
const sqlLite3 = require('sqlite3').verbose();
// const axios = require('axios');
// const { open } = require('sqlite');
const crypto = require('crypto');

const { temp, stat, root } = locations;
/*
class Database {
    constructor(name, table, headers) {
        this.name = name;
        this.initDatabase();
    }

    initDatabase() {
        let path = `${root}/db/${this.name}.db`
        fs.writeFile(path, '', { flag: 'wx' }, function(err) {

        });
    }

    readDatabase() {
        this.data = new sqlLite3.Database(`db/${this.name}.db`, sqlLite3.OPEN_READWRITE, (err) => {
            if (err) // console.error(err.message);
        });
    }

    createTable(table, headers) {
        this[table].headersInsert = new Array(headers.length);
        for (x in this[table].headersInsert) {
            this[table].headersInsert[x] = '?'
        }
        headers = headers.toString();
        const sqlHeader = `CREATE TABLE IF NOT EXISTS ${table}(${headers})`;
        this.run(sqlHeader, (err) => {
            if (err) // console.error(err.message);
        });

    }

    async findRows(table, returnCols, testCol, value) {
        return await this.all(`SELECT ${returnCols.toString()} FROM ${table} WHERE ${testCol} = ?`, [value], async(err, rows) => {
            return rows;
        });
    }

    insertValues(table, values) {
        this.run(`INSERT INTO ${table} VALUES ${this[table].headersInsert}`, values);
    }
}
*/

let testNum = 0;
let Databases = {
    accounts: new sqlLite3.Database(`db/accounts.db`, sqlLite3.OPEN_READWRITE, (err) => {
        // console.log(1)
        if (err) {
            // console.log(2)
            initFile('accounts', '', createAdmin);
        } else {
            testNum = 1;
        }
    }),
    ips: new sqlLite3.Database(`db/ips.db`, sqlLite3.OPEN_READWRITE, (err) => {
        if (err) initFile('tuning', '', createTuning);
    }),
    tuning: new sqlLite3.Database(`db/tuning.db`, sqlLite3.OPEN_READWRITE, (err) => {
        if (err) initFile('ips', '', createIPS);
    }),
    transactions: new sqlLite3.Database(`db/transactions.db`, sqlLite3.OPEN_READWRITE, (err) => {
        if (err) initFile('transactions', '', createTransactions);
    }),
}


function initFile(dbName, data, callback) {
    // console.log(3);
    fs.writeFile(`${root}/db/${dbName}.db`, data, { flag: 'wx' }, (err) => {
        // console.log(4);
        Databases[dbName] = new sqlLite3.Database(`db/${dbName}.db`, sqlLite3.OPEN_READWRITE, (err) => {
            // console.log(5);
            callback();
            // console.log(6);
        });
    });
}

function createAdmin() {
    // console.log(7);
    Databases.accounts.run("CREATE TABLE IF NOT EXISTS users(first_name,last_name,username,email,permissions,phone_number,password,id,info)", (err) => {
        // console.log(8);
        // if (err) // console.log(9);
        const adminUsername = 'tsaxking';
        const adminPwd = 'Colorblin6dPresent/ationFluctuati*onInfrast%ructure';
        const adminSalt = crypto.randomBytes(36).toString('base64');

        Databases.accounts.all("SELECT username FROM users WHERE username = ?", [adminUsername], (err, rows) => {
            // console.log(10);
            // if (err) // console.log(10.5);
            if (rows[0] == undefined) {
                // console.log(11);
                crypto.pbkdf2(adminPwd, adminSalt, 2000000, 64, 'sha512', (err, derivedKey) => {
                    // if (err) // console.log(12.5);
                    // console.log(12);
                    const adminPasswordJson = JSON.stringify({
                        password: derivedKey.toString('base64'),
                        salt: adminSalt,
                        iterations: 2000000
                    });

                    let adminInsert = [
                        "Taylor",
                        "King",
                        adminUsername,
                        "taylor.reese.king@gmail.com",
                        '{"roles":["admin"]}',
                        "(208) 392-8139",
                        adminPasswordJson,
                        crypto.randomBytes(36).toString('base64'),
                        JSON.stringify({ account_type: "admin" })
                    ];

                    Databases.accounts.all("INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?)", adminInsert, (err) => {
                        console.log("USERS CREATED");
                        Databases.accounts.close();
                        testNum = 1;
                        // if (err) // console.log(13.5);
                    });
                    // console.log(14);
                });
                // console.log(15);
            }
        });
        // console.log(16);
    });
    // console.log(17);
}

function createTuning() {
    Databases.tuning.all('CREATE TABLE IF NOT EXISTS notes(username,notes)', (err) => {
        // Databases.tuning.close()
    });
}

function createIPS() {
    Databases.ips.all('CREATE TABLE IF NOT EXISTS ips(ip)', (err) => {
        // Databases.ips.close();
    });
}

function createTransactions() {
    Databases.ips.all('CREATE TABLE IF NOT EXISTS income(id,date,amount,category,subcategory,payment_type,comments,picture)', (err) => {
        // Databases.transactions.close();
    });
    Databases.ips.all('CREATE TABLE IF NOT EXISTS expenses(id,date,amount,category,subcategory,payment_type,comments,tax,picture)', (err) => {
        // Databases.transactions.close();
    });
}


exports = module.exports = {
    accounts: new sqlLite3.Database(`db/accounts.db`, sqlLite3.OPEN_READWRITE, (err) => {}),
    ips: new sqlLite3.Database(`db/ips.db`, sqlLite3.OPEN_READWRITE, (err) => {}),
    tuning: new sqlLite3.Database(`db/tuning.db`, sqlLite3.OPEN_READWRITE, (err) => {}),
    transactions: new sqlLite3.Database(`db/transactions.db`, sqlLite3.OPEN_READWRITE, (err) => {})
};