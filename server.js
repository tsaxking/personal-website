const express = require('express');
const { getJSON, getTemplate } = require('./server-functions/get-file');
const { render } = require('node-html-constructor').v3;
const builder = require('./server-functions/page-builder');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Email = require('./server-functions/email');
const env = process.argv[2];

const app = express();

app.use((req, res, next) => {
    console.log(new Date().toDateString(), req.method, req.url);
    next();
});

app.use('/static', express.static('static'));
app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(express.json({
    limit: '50mb'
}));

const pages = getJSON('/pages');
const {
    bottomScripts,
    topScripts,
    fonts,
    styles
} = getJSON('/sources');


// generate classes array
const allClasses = [];

const openElement = async(pathname) => {
    // if it's a file, add it's relative path to the array
    if (fs.lstatSync(pathname).isFile()) {
        return allClasses.push({
            script: '.' + pathname
        });
    } else {
        // this is a directory
        fs.readdirSync(pathname).forEach(async(file) => {
            openElement(pathname + '/' + file);
        });
    }
}

// get all folders and files in ./static/js/classes
openElement('./static/js/classes');


app.get('/compositions/:title', (req, res) => {
    // TODO: build composition display
    const { title } = req.params;
    const compositions = getJSON('/compositions');

    const composition = Object.keys(compositions).reduce((acc, type) => {
        const c = compositions[type].find(c => c.title == title);
        if (c) return {
            ...c,
            compositionTitle: c.title,
            compositionType: type
        }
        return acc;
    }, {})

    render(
        getTemplate('/index'), {
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
            bottomScripts: env === 'production' ? [
                ...bottomScripts.filter(s => s.includes('http')).map(s => ({ script: s })),
                {
                    script: '../static/build/bottom.js'
                }
            ] : bottomScripts.map(s => ({ script: s })),
            topScripts: env === 'production' ? [
                ...topScripts.filter(s => s.includes('http')).map(s => ({ script: s })),
                {
                    script: '../static/build/top.js'
                }
            ] : topScripts.map(s => ({ script: s })),
            styles: env === 'production' ? [
                ...styles.filter(s => s.includes('http')).map(s => ({ style: s })),
                {
                    style: '../static/build/style.css'
                }
            ] : styles.map(s => ({ style: s })),
            pageScript: '/composition-display.js',
            footer: getTemplate('/components/footer'),
            year: new Date().getFullYear(),
            pageTitle: composition.title,
            title: composition.title,
            allClasses: env === 'production' ? [] : allClasses
        },
        res
    );
});

app.get('/projects/:name', (req, res) => {
    const { name } = req.params;
    // TODO: build project display
});

app.get('/search', (req, res) => {
    const { search } = req.query;
    // TODO: search through all json and html files

    const pages = getJSON('/pages');
    const aboutMe = getJSON('/about-me');
    const compositions = getJSON('/compositions');
    const projects = getJSON('/projects');
});

app.post('/send-message', (req, res) => {
    console.log(req.body);

    const {
        name,
        email,
        message
    } = req.body;

    const e = new Email('taylor.reese.king@gmail.com', 'Message from ' + name + ' (' + email + ')');

    e.message = message;

    e.send();

    res.redirect('/home');
});

app.get('/*', (req, res, next) => {
    const {
        url,
        params
    } = req;

    if (url == '/') return res.redirect('/home');
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
        getTemplate('/index'), {
            content: page.build ? (() => {
                if (env === 'production') {
                    return getTemplate('/build/' + page.name);
                }
                return builder[page.name]()
            })() : getTemplate(page.url),
            links: pages.map(p => {
                if (p.display === false) return;
                return ({
                    ...p,
                    active: page.url.includes(p.url) ? 'active' : '',
                    _trustEval: true,
                    requestedUrl: req.url
                })
            }).filter(p => p),
            bottomScripts: env === 'production' ? [
                ...bottomScripts.filter(s => s.includes('http')).map(s => ({ script: s })),
                {
                    script: '../static/build/bottom.js'
                }
            ] : bottomScripts.map(s => ({ script: s })),
            topScripts: env === 'production' ? [
                ...topScripts.filter(s => s.includes('http')).map(s => ({ script: s })),
                {
                    script: '../static/build/top.js'
                }
            ] : topScripts.map(s => ({ script: s })),
            styles: env === 'production' ? [
                ...styles.filter(s => s.includes('http')).map(s => ({ style: s })),
                {
                    style: '../static/build/style.css'
                }
            ] : styles.map(s => ({ style: s })),
            pageScript: page.script,
            footer: getTemplate('/components/footer'),
            year: new Date().getFullYear(),
            pageTitle: page.pageTitle || page.name,
            title: page.name,
            allClasses: env === 'production' ? [] : allClasses
        },
        res
    );
});

app.get('/*', (req, res) => {
    const errors = getJSON('/error-codes');

    render(
        getTemplate('/error'), {
            ...errors[404],
            bottomScripts: bottomScripts.map(s => ({ script: s })),
            topScripts: topScripts.map(s => ({ script: s })),
            styles: styles.map(s => ({ style: s }))
        },
        res
    );
});



app.listen(8000, () => console.log('Server started on port 8000'));