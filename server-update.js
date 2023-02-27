const start = Date.now();

const args = process.argv.slice(2);

console.log('Update args:', args);
console.log('\x1b[41mThis may take a few seconds, please wait...\x1b[0m');

const { DB } = require('./server-functions/databases');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { getJSON } = require('./server-functions/get-file');

const updates = [];

const daysTimeout = (cb, days) => {
    days = Math.floor(Math.abs(days));
    // 86400 seconds in a day
    let msInDay = 86400 * 1000;

    let dayCount = 0;
    let timer = setInterval(() => {
        dayCount++; // a day has passed

        if (dayCount === days) {
            clearInterval(timer);
            cb();
        }
    }, msInDay);
}

async function initDB() {
    console.log('Checking to see if database exists');

    // check if database exists
    if (fs.existsSync(path.resolve(__dirname, './db/main.db'))) return console.log('Database exists :)');

    console.log('Database does not exist, creating database');

    const tables = getJSON('/tables');
    fs.writeFileSync(path.resolve(__dirname, './db/main.db'), '');
    const DB = new APP_DB('./main.db');

    await DB.init();

    let promises = Object.entries(tables)
        .map(([name, { columns }]) => {
            const query = `
                CREATE TABLE IF NOT EXISTS ${name} (
                    ${Object.values(columns).map(c => c.init).join(',')}
                );
            `;

            return DB.run(query);
        });

    await Promise.all(promises);
}

async function tableTest() {
    console.log('Checking to see if tables exist');

    const tables = getJSON('/tables');

    return await Promise.all(Object.entries(tables).map(async([table, { columns, rows }]) => {
        const columnPromises = Object.entries(columns).map(async([name, { init }]) => {
            // test if column exists
            const query = `
                SELECT ${name}
                FROM ${table}
            `;

            try {
                await DB.all(query);
            } catch (e) {
                console.log(`Column ${name} does not exist in table ${table}, creating column`);
                const query = `
                    ALTER TABLE ${table}
                    ADD COLUMN ${init}
                `;

                await DB.run(query);
            }
        });

        await Promise.all(columnPromises);

        if (!rows) return;

        const rowPromises = rows.map(async(row) => {
            const primaryKey = Object.keys(columns).find(c => columns[c].primaryKey);

            const query = `
                SELECT ${primaryKey}
                FROM ${table}
                WHERE ${primaryKey} = ?
            `;

            const result = await DB.get(query, [row[primaryKey]]);

            if (!result) {
                console.log(`Row ${row[primaryKey]} does not exist in table ${table}, creating row`);

                const query = `
                    INSERT INTO ${table} (
                        ${Object.keys(row).join(',')}
                    ) VALUES (
                        ${Object.keys(row).map(() => '?').join(',')}
                    );
                `;

                await DB.run(query, Object.keys(columns).map(k => {
                    const { type } = columns[k];

                    if (type === 'json') {
                        return JSON.stringify(row[k]);
                    } else {
                        return row[k];
                    }
                }));
            } else if (JSON.stringify(result) !== JSON.stringify(row)) {
                console.log(`Row ${row[primaryKey]} does not match in table ${table}, updating row`);

                const deleteQuery = `
                    DELETE FROM ${table}
                    WHERE ${primaryKey} = ?
                `;

                await DB.run(deleteQuery, [row[primaryKey]]);

                const insertQuery = `
                    INSERT INTO ${table} (
                        ${Object.keys(row).join(',')}
                    ) VALUES (
                        ${Object.keys(row).map(() => '?').join(',')}
                    );
                `;

                await DB.run(insertQuery, Object.keys(columns).map(k => {
                    const { type } = columns[k];

                    if (type === 'json') {
                        return JSON.stringify(row[k]);
                    } else {
                        return row[k];
                    }
                }));
            }
        });

        await Promise.all(rowPromises);
    }));
}

async function makeFilesAndFolders() {
    const folders = [
        '/uploads',
        '/history',
        '/archive'
    ];

    const files = [{
        name: './.env',
        content: `
PORT = '8000'`
    }, {
        name: './history/manifest.txt',
        content: JSON.stringify({
            lastUpdate: Date.now(),
            upates: []
        })
    }];

    folders.forEach(f => {
        const p = path.resolve(__dirname, './', f);
        if (!fs.existsSync(p)) {
            console.log('Folder', p, 'does not exist, creating folder');
            fs.mkdirSync(p);
        }
    });

    files.forEach(f => {
        const p = path.resolve(__dirname, './', f.name);
        if (!fs.existsSync(p)) {
            console.log('File', p, 'does not exist, creating file');
            fs.writeFileSync(p, f.content);
        }
    });
}

async function runUpdates() {
    console.log('Checking for database updates...');

    const manifest = JSON.parse(
        fs.readFileSync(
            path.resolve(__dirname, "./history/manifest.txt"), 'utf8'));

    const {
        lastUpdate,
        updates: _allUpdates
    } = manifest;

    console.log('Last database update:', new Date(lastUpdate).toLocaleString());

    const promises = updates.map(async(u) => {
        const {
            description,
            date,
            test,
            execute
        } = u;

        const foundUpdate = _allUpdates.find(_u => _u.date == date);

        if (foundUpdate) return;

        try {
            if (!await test()) {
                console.log('Running update:', new Date(date).toLocaleString(), '-', description);
                await execute();

                return u;
            }

        } catch (e) {
            console.log('Error running update:', new Date(date).toLocaleString(), '-', description);
            console.log(e);
        }
    });

    await Promise.all(promises);

    const runUpdates = await (await Promise.all(promises)).filter(u => u);

    if (runUpdates.length) {
        console.log('Applied updates:');
        console.log(runUpdates.map(u => '    - ' + u.description).join('\n'));
    } else {
        console.log('Database is up to date :)');
    }

    manifest.lastUpdate = Date.now();
    manifest.updates = manifest.updates.concat(runUpdates);

    fs.writeFileSync(
        path.resolve(__dirname, "./history/manifest.txt"),
        JSON.stringify(manifest, null, 4));
}

async function makeBackup() {
    console.log('Making database backup...');

    const dir = path.resolve(__dirname, './history', `${Date.now()}.txt`);

    fs.copyFileSync(path.resolve(__dirname, './db/main.db'), dir);

    setBackupIntervals();
}

function setBackupIntervals() {
    console.log('Setting backup intervals...');

    const files = fs.readdirSync(path.resolve(__dirname, './history'));

    files.forEach(f => {
        if (f == 'manifest.txt') return;

        const p = path.resolve(__dirname, './history', f);

        const now = new Date();
        const fileDate = new Date(+f.split('.')[0]);
        const diff = now - fileDate;
        const days = Math.floor(7 - diff / (1000 * 60 * 60 * 24));

        daysTimeout(() => {
            fs.rmSync(p);
        }, days);
    });
}


const runFunction = async(cb, name) => {
    const now = Date.now();
    try {
        await cb();
    } catch (e) {
        console.log('Error running function:', name);
        console.log(e);
    }
    console.log(`Finished \x1b[31m${name}\x1b[0m in \x1b[34m${Math.floor(Date.now() - now) / 1000}\x1b[0m seconds`);
    return
}

const updateDotEnv = async() => {
    if (!process.env.PORT) {
        let env;
        if (fs.existsSync(path.resolve(__dirname, './.env'))) env = fs.readFileSync(path.resolve(__dirname, './.env'), 'utf8');
        else env = '';

        const TBA_KEY = 'oULwrAZnkYc3Cg75AO3VVxj2bvYYNxf4ux0rR5gDyjiV9GQMyDVFkyKgBkqElwto';
        const DB_KEY = 'acb6c93741a24352ac0a27aee07320802cd1b6f5c70741458d02d72a84f21dae';
        const ADMIN_KEY = 'a3aff7644a774ab190b5f59325fba74755ecd3bbc6194d899976da529358c997';
        const EVENT_SERVER_KEY = 'bf62b4ef3c5b41f4b0c95e82b687065b15b5c7c317c345c1b4a09c4465327eb1';
        const EVENT_SERVER_ENCRYPTION_KEY = '93595032b8d84293b622358d54ea84918d31ad47ea9a46babeeeb0a933948f0fb0a4647c1eca494f9d2367eb04e480be';
        const PORT = '2122';

        const TEST_DISCORD_CLIENT_ID = '1078761918271074305';
        const TEST_DISCORD_PUBLIC_KEY = 'e2bcd30cf3442a64038fddb045ddd05b92b2dd92a301089cae2535ae1173243a';
        const TEST_DISCORD_CLIENT_SECRET = 'S7VF-h2AlduToQOdAzp4Aq6Dy5iDBENK';
        const TEST_DISCORD_TOKEN = 'MTA3ODc2MTkxODI3MTA3NDMwNQ.Gfga6r.e3XID9M31CiJ6KVlXLsTwc5NXQ6jKRkkvJhpq8';

        const others = Object.keys(process.env).filter(k => {
            const keys = [
                'TBA_KEY',
                'DB_KEY',
                'ADMIN_KEY',
                'EVENT_SERVER_KEY',
                'EVENT_SERVER_ENCRYPTION_KEY',
                'PORT',
                'TEST_DISCORD_CLIENT_ID',
                'TEST_DISCORD_PUBLIC_KEY',
                'TEST_DISCORD_CLIENT_SECRET',
                'TEST_DISCORD_TOKEN',
                'DISCORD_CLIENT_SECRET',
                'DISCORD_TOKEN',
                'DISCORD_CLIENT_ID',
                'DISCORD_PUBLIC_KEY'
            ];

            return !keys.includes(k);
        }).map(k => `${k} = '${process.env[k]}'`).join('\n');

        env = `TBA_KEY='${process.env.TBA_KEY || TBA_KEY}'
            DB_KEY='${process.env.DB_KEY || DB_KEY}'
            ADMIN_KEY='${process.env.ADMIN_KEY || ADMIN_KEY}'
            EVENT_SERVER_KEY='${process.env.EVENT_SERVER_KEY || EVENT_SERVER_KEY}'
            EVENT_SERVER_ENCRYPTION_KEY='${process.env.EVENT_SERVER_ENCRYPTION_KEY || EVENT_SERVER_ENCRYPTION_KEY}'
            PORT='${process.env.PORT || PORT}'
            TEST_DISCORD_CLIENT_ID='${process.env.TEST_DISCORD_CLIENT_ID || TEST_DISCORD_CLIENT_ID}'
            TEST_DISCORD_PUBLIC_KEY='${process.env.TEST_DISCORD_PUBLIC_KEY || TEST_DISCORD_PUBLIC_KEY}'
            
            # Test Discord Bot
            TEST_DISCORD_CLIENT_SECRET='${process.env.TEST_DISCORD_CLIENT_SECRET || TEST_DISCORD_CLIENT_SECRET}'
            TEST_DISCORD_TOKEN='${process.env.TEST_DISCORD_TOKEN || TEST_DISCORD_TOKEN}
            TEST_DISCORD_CLIENT_ID='${process.env.TEST_DISCORD_CLIENT_ID || TEST_DISCORD_CLIENT_ID}'
            TEST_DISCORD_PUBLIC_KEY='${process.env.TEST_DISCORD_PUBLIC_KEY || TEST_DISCORD_PUBLIC_KEY}

            # Live Discord Bot
            LIVE_DISCORD_CLIENT_SECRET='${process.env.DISCORD_CLIENT_SECRET || ''}'
            LIVE_DISCORD_TOKEN='${process.env.DISCORD_TOKEN || ''}'
            LIVE_DISCORD_CLIENT_ID='${process.env.DISCORD_CLIENT_ID || ''}'
            LIVE_DISCORD_PUBLIC_KEY='${process.env.DISCORD_PUBLIC_KEY || ''}'`;


        fs.writeFileSync(path.resolve(__dirname, './.env'), env.replace('   ', ''));
    }
}

(async() => {
    // await runFunction(updateDotEnv, 'updateDotEnv');
    await runFunction(initDB, 'initDB');
    await DB.init();
    await runFunction(tableTest, 'tableTest');
    await runFunction(makeFilesAndFolders, 'makeFilesAndFolders');
    if (args.includes('all')) {
        await runFunction(runUpdates, 'runUpdates');
        await runFunction(makeBackup, 'makeBackup');
    } else {
        if (args.includes('updates')) await runFunction(runUpdates, 'runUpdates');
        if (args.includes('backup')) await runFunction(makeBackup, 'makeBackup');
    }

    await runFunction(setBackupIntervals, 'setBackupIntervals');

    console.log('Finished all update tasks in', Math.floor(Date.now() - start) / 1000, 'seconds');
})();