const locations = require("../locations");
const fs = require('fs');
const sqlLite3 = require('sqlite3').verbose();
// const axios = require('axios');
// const { open } = require('sqlite');
// const crypto = require('crypto');

const { root, temp, stat } = locations;

class DatabaseReader {
    createNew(title, callback) {
        fs.writeFile(`${root}/db/${title}.db`, '', { flag: 'wx' }, (err) => {
            if (err) console.error(err);
            this.data = new sqlLite3.Database(`db/${title}.db`, sqlLite3.OPEN_READWRITE, (err) => {
                if (callback) callback();
            });
        });
    }
    readDatabase(title, callback) {
        this.data = new sqlLite3.Database(`db/${title}.db`, sqlLite3.OPEN_READWRITE, (err) => {
            if (err) this.createNew(title, callback);
            else if (callback) callback();
        });
    }
    createTable(table, headers, callback) {
        this.tables[table].headers = headers;
        this.data.run(`CREATE TABLE IF NOT EXISTS ${table}(${headers.toString()})`, (err) => {
            if (err) console.error(err);
            if (callback) callback();
        });
    }
    insertIntoTable(table, info, callback) {
        // sort info into the right order
        const { headers } = this.tables[table]
        let headerInsert = headers.map(() => {
            return '?';
        });
        let insert = new Array(headers.length);
        let pos;
        for (var x in info) {
            if (!headers.includes(x)) throw new Error('Headers do not match');
            pos = headers.indexOf(x);
            insert[pos] = info[x];
        }
        this.data.run(`INSERT INTO ${table} VALUES (${headerInsert.toString()})`, insert, (err) => {
            if (err) console.error(err);
            console.log("Data inserted");
            if (callback) callback();
        });
    }
    deleteInTable(table, sqlConditions) {
        this.data.all(`DELETE FROM ${table} WHERE ${sqlConditions}`, (err) => {
            if (err) console.error(err);
        });
    }
    updateInTable() {}
    readFromTable() {}
}

exports = module.exports = DatabaseConstructor;