const fs = require('fs');
const path = require('path');
// const ts = require('typescript');
const { openAllInFolderSync, getJSON } = require('./server-functions/get-file');
const UglifyJS = require("uglify-js");
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const cssDelimiter = '\r\n';
const jsDelimiter = ';\r\n';


const build = () => {
    const styles = fs.createWriteStream(path.resolve(__dirname, './static/build/style.css'));
    const top = fs.createWriteStream(path.resolve(__dirname, './static/build/top.js'));
    const bottom = fs.createWriteStream(path.resolve(__dirname, './static/build/bottom.js'));

    /**
     * 
     * @param {String} pathname 
     * @param {fs.WriteStream} stream 
     * @param {String} delimiter 
     */
    const writeFile = (pathname, stream, delimiter) => {
        openAllInFolderSync(path.resolve(__dirname, pathname), (file) => {
            if (file.endsWith('.md') || file.endsWith('.jpeg')) return;
            // if (toRemove.includes(file.split('\\').pop())) return;
            stream.write(delimiter);
            const fileContent = fs.readFileSync(file);
            stream.write(fileContent);
        }, {
            sort: (a, b) => {
                const aContent = fs.readFileSync(a).toString();
                const bContent = fs.readFileSync(b).toString();

                // look for PRIORITY_(number)
                const aPriority = aContent.match(/PRIORITY_(\d+)/);
                const bPriority = bContent.match(/PRIORITY_(\d+)/);

                if (aPriority && bPriority) {
                    return aPriority[1] - bPriority[1];
                } else if (aPriority) {
                    return -1;
                } else if (bPriority) {
                    return 1;
                }
                return 0;
            }
        });
    }

    [
        { path: './static/css', stream: styles, delimiter: cssDelimiter },
        // { path: './static/js/dependencies', stream: top, delimiter: jsDelimiter },
        { path: './static/js/classes', stream: top, delimiter: jsDelimiter },
        // { path: './static/js/ts-build', stream: top, delimiter: jsDelimiter },
        { path: './static/js/top', stream: top, delimiter: jsDelimiter },
        // { path: './static/js/pre-page', stream: bottom, delimiter: jsDelimiter },
        // { path: './static/js/pages', stream: bottom, delimiter: jsDelimiter },
        { path: './static/js/bottom', stream: bottom, delimiter: jsDelimiter }
    ].forEach((write) => {
        writeFile(path.resolve(__dirname, write.path), write.stream, write.delimiter);
    });

    styles.on('finish', () => {
        console.log('Finished writing to style.css, compressing...');

        const cssContent = fs.readFileSync(path.resolve(__dirname, './static/build/style.css')).toString();

        postcss([autoprefixer, cssnano])
            .process(cssContent, { from: undefined })
            .then(result => {
                fs.writeFileSync(path.resolve(__dirname, './static/build/style.min.css'), result.css);
            });

        styles.close();
    });

    top.on('finish', () => {
        console.log('Finished writing to top.js, compressing...');
        const topContent = fs.readFileSync(path.resolve(__dirname, './static/build/top.js')).toString();
        const topResult = UglifyJS.minify(topContent);
        fs.writeFileSync(path.resolve(__dirname, './static/build/top.min.js'), topResult.code);
        
        top.close();
    });

    bottom.on('finish', () => {
        console.log('Finished writing to bottom.js, compressing...');
        const bottomContent = fs.readFileSync(path.resolve(__dirname, './static/build/bottom.js')).toString();
        const bottomResult = UglifyJS.minify(bottomContent);
        fs.writeFileSync(path.resolve(__dirname, './static/build/bottom.min.js'), bottomResult.code);

        bottom.close();
    });

    styles.end();
    top.end();
    bottom.end();
}

build();