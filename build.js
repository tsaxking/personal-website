const fs = require('fs');
const path = require('path');
const { getJSON } = require('./server-functions/get-file');
const builder = require('./server-functions/page-builder');

(async() => {
    // if static/js/build not a folder, create it
    if (!fs.existsSync(path.join(__dirname, 'static', 'build'))) {
        fs.mkdirSync(path.join(__dirname, 'static', 'build'));
    }

    const sources = getJSON('/sources');

    const styles = sources.styles.reduce((acc, cur) => {
        if (cur.includes('http')) return acc;
        cur = cur.replace('../', './');
        acc += fs.readFileSync(path.join(__dirname, cur), 'utf8');
        return acc;
    }, '');

    const topScripts = sources.topScripts.reduce((acc, cur) => {
        if (cur.includes('http')) return acc;
        cur = cur.replace('../', './');
        acc += fs.readFileSync(path.join(__dirname, 'static', cur), 'utf8');
        return acc;
    }, '');

    const bottomScripts = sources.bottomScripts.reduce((acc, cur) => {
        if (cur.includes('http')) return acc;
        cur = cur.replace('../', './');
        acc += fs.readFileSync(path.join(__dirname, 'static', cur), 'utf8');
        return acc;
    }, '');


    const openElement = (pathname) => {
        console.log(pathname);
        // if it's a file, add it's relative path to the array
        if (fs.lstatSync(pathname).isFile()) {
            return fs.readFileSync(pathname, 'utf8');
        } else {
            // this is a directory
            return fs.readdirSync(pathname).reduce((acc, file) => {
                acc += openElement(pathname + '/' + file) + ';';
                return acc;
            }, '');
        }
    }

    // get all folders and files in ./static/js/classes
    const classes = openElement('./static/js/classes');

    const topScriptBuild = classes + topScripts;
    const bottomScriptBuild = bottomScripts;
    const stylesBuild = styles;

    fs.writeFileSync(path.join(__dirname, 'static', 'build', 'top.js'), topScriptBuild);
    fs.writeFileSync(path.join(__dirname, 'static', 'build', 'bottom.js'), bottomScriptBuild);
    fs.writeFileSync(path.join(__dirname, 'static', 'build', 'styles.css'), stylesBuild);

    console.log('JS Build complete');

    // if templates/build not a folder, create it
    if (!fs.existsSync(path.join(__dirname, 'templates', 'build'))) {
        fs.mkdirSync(path.join(__dirname, 'templates', 'build'));
    }

    Object.keys(builder).forEach((key) => {
        const html = builder[key]();
        fs.writeFileSync(path.join(__dirname, 'templates', 'build', `${key}.html`), html);
    });
})();