const crypto = require('crypto');
const { title } = require('process');
const { accounts } = require('./databases');

const timeLast = 1000 * 60 * 60; // 1 hour

const cookieSettings = {
    maxAge: timeLast,
    httpOnly: true
}

function randomKey() {
    let key = crypto.randomBytes(36).toString('base64');
    setInterval(function() {
        roles.roleList.map(role => {
            role.key = crypto.randomBytes(36).toString('base64');
        });
    }, timeLast);
    return key;
}
// let currentSessions = [];
let currentSessions = {};
const roles = {
    rolePaths: [
        { path: '/sign-in', roles: ['user'] },
        { path: '/sign-up', roles: ['user'] },
        { path: '/lesson-logs', roles: ['client', 'student'] },
        { path: '/transactions', roles: ['client', 'student'] },
        { path: '/my-account', roles: ['client'] },
        { path: '/create-account', roles: ['client'] },
        { path: '/admin', roles: ['admin'] },
        { path: '/clients', roles: ['admin'] },
        { path: '/client-profile', roles: ['admin'] },
        { path: '/admin-transactions', roles: ['admin'] }
    ],
    roleList: [{
            key: crypto.randomBytes(36).toString('base64'),
            title: 'user'
        },
        {
            key: crypto.randomBytes(36).toString('base64'),
            title: 'student'
        },
        {
            key: crypto.randomBytes(36).toString('base64'),
            title: 'client'
        },
        {
            key: crypto.randomBytes(36).toString('base64'),
            title: 'admin'
        }
    ],
    checkAuth: (req, titles) => {
        // checkAuth: (req, titles) => {
        if (!currentSessions[req.sessionID]) return false;
        /*
        console.log('checking authentication');
        let allowed = true;
        try {
            let roleKeys = [];
            titles.map(title => {
                let { key } = roles.roleList.find(role => role.title == title);
                console.log('USER NEEDS: ' + title);
                roleKeys.push(key);
            });
            if (!req.keys) roles.resetKeys(req, res);
            let { keys } = JSON.parse(parseCookies(req).keys);
            if (keys == undefined) return false;
            console.log(keys);
            keys.map(cookieKey => {
                let cookieRole = roles.roleList.find(role => role.key == cookieKey);
                try { console.log('USER HAS: ' + cookieRole.title); } catch (err) { console.log("USER HAS INVALID ROLE") }
            });
            roleKeys.map(roleKey => {
                if (!keys.includes(roleKey)) allowed = false;
            });
        } catch (err) {
            console.error(err);
            allowed = false;
        }
        return allowed;
        */
        const userRoles = currentSessions[req.sessionID].roles;
        let allowed = true;

        titles.map(title => {
            if (!userRoles.includes(title)) allowed = false;
        });

        return allowed;
    },
    // authID: (req, id) => {
    authUser: (req, username) => {
        // const cookieId = roles.getID(req);
        // return cookieId == id;
        return currentSessions[req.sessionID].username == username;
    },
    createRoles: (req, res, next) => {
        /*
        if (!currentSessions.includes(req.sessionID)) {
            console.log("Creating Roles");
            var cookie = parseCookies(req);
            let keyObj;
            if (cookie.keys === undefined) {
                // res.clearCookie('keys');
                keyObj = {
                    keys: [
                        roles.roleList[0].key
                    ]
                }
                res.cookie('keys', JSON.stringify(keyObj), cookieSettings);
            } else {
                keyObj = JSON.parse(cookie.keys);
                let userRoles = [];
                for (var k in keyObj.keys) {
                    let keyRole = roles.roleList.find(keyRole => keyRole.key == keyObj.keys[k]);
                    if (!keyRole) {
                        // cookie key is invalid
                        keyObj.keys.splice(k, 1);
                        userRoles.push('user');
                    } else {
                        userRoles.push(keyRole.title);
                    }
                }
                if (keyObj.keys.length == 0) {
                    keyObj.keys = [roles.roleList[0].key];
                }
                // let userRoles = [];
                // req.userRoles = keyObj.keys.map(key => {
                //     let { title } = roles.roleList.find(role => role.key == key);
                //     userRoles.push(title);
                // });
                req.userRoles = userRoles;
                req.userKeys = keyObj.keys;
                // console.log("USER ROLES: " + req.userRoles);
                res.cookie('keys', JSON.stringify(keyObj), cookieSettings);
            }
            if (!currentSessions.includes(req.sessionID)) currentSessions.push(req.sessionID);
        }
        console.log(currentSessions);
        console.log(keyObj);
        if (next) next();
        else return;
        */
        if (!currentSessions[req.sessionID]) {
            currentSessions[req.sessionID] = {
                roles: ['user']
            };
        }

        if (next) next();
        else return;
    },
    // addKey: (req, res, title, keys) => {
    addKey: (req, key) => {
        if (!currentSessions[req.sessionID]) roles.createRoles(req, null, null);
        /*
        let giveRole = roles.roleList.find(role => role.title == title);
        let keyObj = {};
        if (keys == undefined) {
            let cookieKeys = parseCookies(req);
            if (!cookieKeys.keys) keys = [];
            else keys = JSON.parse(cookieKeys.keys).keys;
        }
        keys.push(giveRole.key);
        keyObj.keys = keys;
        res.cookie('keys', JSON.stringify(keyObj), cookieSettings);
        */
        if (currentSessions[req.sessionID]) currentSessions[req.sessionID].roles.push(key);
    },
    resetKeys: (req) => {
        if (!currentSessions[req.sessionID]) roles.createRoles(req);
        // res.clearCookie('keys');
        currentSessions[req.sessionID].roles = ['user'];
        // roles.addKey(req, res, 'user');
    },
    removeKey: (req, key) => {
        if (!currentSessions[req.sessionID]) roles.createRoles(req);
        // removeKey: (req, res, title) => {
        /*
        let role = roles.roleList.find(role => role.title == title);
        let cookieKeys = parseCookies(req);
        let { keys } = JSON.parse(cookieKeys.keys);
        let index = keys.indexOf(role.key);
        keys.splice(index, 1);
        let keyObj = { keys: keys }
        res.cookie('keys', JSON.stringify(keyObj), cookieSettings);
        return keys;
        */
        // if (!currentSessions[sessionID]);
        const pos = currentSessions[req.sessionID].roles.indexOf(key);
        currentSessions[req.sessionID].roles.splice(pos, 1);
    },
    // getRoles: (req) {
    getRoles: (req) => {
        if (!currentSessions[req.sessionID]) return null;
        /*
        let userRoles;
        let keys;
        if (req.userRoles) {
            userRoles = req.userRoles;
            keys = req.userKeys;
        } else {
            let cookieKeys = parseCookies(req);
            keys = JSON.parse(cookieKeys.keys).keys;
            console.log(roles.roleList);
            userRoles = keys.map(key => {
                let role = roles.roleList.find(role => role.key == key);
                // if (!role) return { keys: undefined, userRoles: ['user'] }
                return role.title;
            });
        }
        return { keys: keys, userRoles: userRoles }
        */
        return currentSessions[req.sessionID].roles;
    },
    getUsername(req) {
        if (!currentSessions[req.sessionID]) return null;
        /*
        try {
            let cookies = parseCookies(req);
            const { id } = cookies;
            if (!id) return undefined;
            accounts.all('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
                const account = rows[0];
                if (err) return undefined;
                return account.username;
            })
        } catch (err) {
            return undefined;
        }
        */
        return currentSessions[req.sessionID].username;
    },
    addUsername(req, username) {
        if (!currentSessions[req.sessionID]) throw new Error('No Session Exists');
        else currentSessions[req.sessionID].username = username;
    }
}



function parseCookies(req) {
    var list = {},
        rc = req.headers.cookie;
    rc = decodeURI(rc);
    rc = replaceAll(rc, '%3A', ':');
    rc = replaceAll(rc, '%2C', ',');
    rc = replaceAll(rc, '%2F', '/');
    rc = replaceAll(rc, '%2B', '+');

    rc && rc.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    // console.log(list);
    return list;
}

function replaceAll(str, searchValue, value) {
    while (str.indexOf(searchValue) != -1) {
        str = str.replace(searchValue, value);
    }
    return str;
}

exports = module.exports = roles;