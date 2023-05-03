const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
const { getClientIp } = require('request-ip');
const { Session } = require('./server-functions/structure/sessions');
const builder = require('./server-functions/page-builder');
const { getJSONSync, getTemplateSync, getJSON, log } = require('./server-functions/files');
const { detectSpam, emailValidation } = require('./server-functions/middleware/spam-detection');
const Email = require('./server-functions/structure/email');
const { render } = require('node-html-constructor').v3;
const { DB } = require("./server-functions/databases");

require('dotenv').config();
const { PORT, DOMAIN } = process.env;

const [,, env, ...args] = process.argv;


const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    const s = Session.addSocket(socket);
    if (!s) return;
    // your socket code here

    // ▄▀▀ ▄▀▄ ▄▀▀ █▄▀ ██▀ ▀█▀ ▄▀▀ 
    // ▄█▀ ▀▄▀ ▀▄▄ █ █ █▄▄  █  ▄█▀ 





























    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use('/static', express.static(path.resolve(__dirname, './static')));
app.use('/uploads', express.static(path.resolve(__dirname, './uploads')));

app.use((req, res, next) => {
    req.io = io;
    req.start = Date.now();
    req.ip = getClientIp(req);
    next();
});

function stripHtml(body) {
    let files;

    if (body.files) {
        files = JSON.parse(JSON.stringify(body.files));
        delete body.files;
    }

    let str = JSON.stringify(body);
    str = str.replace(/<[^<>]+>/g, '');

    obj = JSON.parse(str);
    obj.files = files;

    return obj;
}

// logs body of post request
app.post('/*', (req, res, next) => {
    req.body = stripHtml(req.body);
    next();
});

app.use(Session.middleware);



// production/testing/development middleward


app.use((req, res, next) => {
    switch (env) {
        case 'prod':
            (() => {
                // This code will only run in production


            })();
            break;
        case 'test':
            (() => {
                // this code will only run in testing
                // you could add features like auto-reloading, automatic sign-in, etc.


            })();
            break;
        case 'dev':
            (() => {
                // this code will only run in development
                // you could add features like auto-reloading, automatic sign-in, etc.


            })();
            break;
    }

    next();
});




// spam detection
app.post('/*', detectSpam(['message'], {
    onSpam: (req, res, next) => {
        console.log('Spam detected: Message');
        req.body.spam = true;
        next();
    },
    onerror: (req, res, next) => {
        res.json({ error: 'error' });
    }
}));

app.post('/*', emailValidation(['email'], {
    onspam: (req, res, next) => {
        console.log('Spam detected: Email');
        req.body.spam = true;
        next();
    },
    onerror: (req, res, next) => {
        res.json({ error: 'error' });
    }
}));





// █▀▄ ██▀ ▄▀▄ █ █ ██▀ ▄▀▀ ▀█▀ ▄▀▀ 
// █▀▄ █▄▄ ▀▄█ ▀▄█ █▄▄ ▄█▀  █  ▄█▀ 

// this can be used to build pages on the fly and send them to the client
// app.use(builder);






app.get('/compositions/:title', async(req, res) => {
    const pages = await getJSON('pages');
    // TODO: build composition display
    const { title } = req.params;
    const compositions = getJSONSync('compositions');

    const composition = Object.keys(compositions).reduce((acc, type) => {
        const c = compositions[type].find(c => c.title == title);
        if (c) return {
            ...c,
            compositionTitle: c.title,
            compositionType: type
        }
        return acc;
    }, {});

    render(
        getTemplateSync('index'), {
            content: builder['!CompositionDisplay'](composition),
            links: pages.map(p => {
                if (p.display === false) return;
                return ({
                    ...p,
                    active: '',
                    _trustEval: true,
                    requestedUrl: req.url
                })
            }).filter(p => p),
            pageScript: 'composition-display.js',
            footer: getTemplateSync('components/footer'),
            year: new Date().getFullYear(),
            pageTitle: composition.title,
            title: composition.title,
            metaDescription: composition.description,
            metaKeywords: [
                'Composer',
                'Music',
                'Taylor King',
                'Taylor Reese King',
                'Composition',
                'Compositions',
                'Music Composition',
                'Music Compositions',
                'Musician',
                composition.title
            ].join(', ')
        },
        res
    );
});

app.get('/films/:title', async(req, res) => {
    const pages = await getJSON('pages');
    const { title } = req.params;
    const films = getJSONSync('/films');

    const film = films[title];

    render(
        getTemplateSync('index'),
        {
            content: builder['!Film'](film),
            links: pages.map(p => {
                if (p.display === false) return;
                return ({
                    ...p,
                    active: '',
                    _trustEval: true,
                    requestedUrl: req.url
                })
            }).filter(p => p),
            pageScript: 'composition-display.js',
            footer: getTemplateSync('components/footer'),
            year: new Date().getFullYear(),
            pageTitle: title,
            title: title,
            metaDescription: film.description,
            metaKeywords: [
                'Composer',
                'Music',
                'Taylor King',
                'Taylor Reese King',
                'Composition',
                'Compositions',
                'Music Composition',
                'Music Compositions',
                'Musician',
                'Film Scoring',
                'Film Music',
                'Sound Engineering',
                title
            ].join(', ')
        }
    )
});

app.get('/projects/:name',async (req, res) => {
    
    const pages = await getJSON('pages');
    const { name } = req.params;
    // TODO: build project display
});

app.get('/search', (req, res) => {
    const { search } = req.query;
    // TODO: search through all json and html files

    const pages = getJSONSync('pages');
    const aboutMe = getJSONSync('about-me');
    const compositions = getJSONSync('compositions');
    const projects = getJSONSync('projects');
});


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let delay = null;

app.post('/send-message', async(req, res) => {
    if (delay) {
        console.log('Delaying message...');
        await delay;
        delay = null;
    }
    delay = sleep(1000 * 10);

    const {
        name,
        email,
        message,
        spam
    } = req.body;

    const e = new Email('taylor.reese.king@gmail.com', 'Message from ' + name + ' (' + email + ')');
    e.message = message;
    if (!spam) e.send();

    const query = `
        INSERT INTO Emails (
            name,
            ip,
            message,
            email,
            date,
            spamResult,
            session
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?
        )
    `;

    DB.run(query, [
        name,
        req.session.ip,
        message,
        email,
        Date.now(),
        spam ? JSON.stringify({
            email: req.body.__emailResults ? req.body.__emailResults[0] : false,
            message: req.body.__spamResults ? req.body.__spamResults[0] : false
        }) : '{ "email": false, "message": false }',
        req.session.id
    ]);

    res.redirect('/home');
});

app.get('/*', async (req, res, next) => {
    const {
        url,
        params
    } = req;

    if (url == '/') return res.redirect('/home');

    const pages = await getJSON('pages');

    let page = pages.find(p => {
        if (url.includes(p.url)) return true;
        if (p.dropdown) {
            return p.dropdown.find(d => url.includes(d.url));
        }
    });
    if (!page) return next();
    if (page.dropdown) {
        page = page.dropdown.find(d => url.includes(d.url));
    }

    if (!page) return next();

    render(
        getTemplateSync('index'), {
            content: page.build ? (() => {
                // if (env === 'production') {
                //     return getTemplateSync('../template-build/' + page.name);
                // }
                return builder[page.name]()
            })() : getTemplateSync(page.name.toLowerCase().replace(/ /g, '-')),
            links: pages.map(p => {
                if (p.display === false) return;
                return ({
                    ...p,
                    active: page.url.includes(p.url) ? 'active' : '',
                    _trustEval: true,
                    requestedUrl: req.url
                })
            }).filter(p => p),
            pageScript: page.script,
            footer: getTemplateSync('components/footer'),
            year: new Date().getFullYear(),
            pageTitle: page.pageTitle || page.name,
            title: page.name,
            metaDescription: page.description,
            metaKeywords: page.keywords.join(', ')
        },
        res
    );
});

app.get('/*', (req, res) => {
    const errors = getJSONSync('error-codes');

    render(
        getTemplateSync('old-error'), {
            ...errors[404]
        },
        res
    );
});


















let logCache = [];

// sends logs to client every 10 seconds
setInterval(() => {
    if (logCache.length) {
        io.to('logs').emit('request-logs', logCache);
        logCache = [];
    }
}, 1000 * 10);

app.use((req, res, next) => {
    const csvObj = {
        date: Date.now(),
        duration: Date.now() - req.start,
        ip: req.session.ip,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        userAgent: req.headers['user-agent'],
        body: req.method == 'post' ? JSON.stringify((() => {
            let { body } = req;
            body = JSON.parse(JSON.stringify(body));
            delete body.password;
            delete body.confirmPassword;
            delete body.files;
            return body;
        })()) : '',
        params: JSON.stringify(req.params),
        query: JSON.stringify(req.query)
    };

    logCache.push(csvObj);

    log('requests', csvObj);
});

server.listen(PORT, () => {
    console.log('------------------------------------------------');
    console.log(`Listening on port \x1b[35m${DOMAIN}...\x1b[0m`);
});