const fs = require('fs');
const path = require('path');
const uuid = require('uuid').v4;

/**
 * 
 * @param {Sting} fileName /path/to/filename (no .json)
 * @returns {Object} Parsed JSON or if no .json, then false
 */
function getJSON(fileName) {
    const dir = path.resolve(__dirname, '../jsons', '.' + fileName + '.json');
    try {
        return JSON.parse(fs.readFileSync(dir).toString('utf-8'));
    } catch (err) { return false; }
}

let jsonWrites = [];

/**
 * 
 * @param {String} fileName /path/to/filename (no .json)
 * @param {Object} data Will be stringified (Can be a Class too)
 */
async function saveJSON(fileName, data) {
    const date = Date.now();
    jsonWrites.push({ fileName, data, date });

    let dataType = typeof data;
    let newData;

    // new Directory
    const dir = path.resolve(__dirname, '../jsons', '.' + fileName + '.json');

    if (Array.isArray(data)) {
        // Stringify data, add spaces and new lines to make it readable
        newData = data.map(d => {
            let x = JSON.stringify(d, null, 4);
            x += '\r\n';
            return x;
        });

        // Places data in new array (similar to .toString() but includes the [])
        newData = `[${newData}]`;
    } else newData = JSON.stringify(data, null, 4);

    // checks if file is in use
    let check = jsonWrites.filter(j => j.fileName == fileName);
    while (check.length > 1) console.log('file in use!');

    // Writes the file, creates directory if it doesn't exist
    try {
        writeFile(dir, newData);
    } catch (err) {
        createDir(dir);
        writeFile(dir, newData);
    }
    let json = jsonWrites.find(j => j.date == date);
    const i = jsonWrites.indexOf(json);
    jsonWrites.splice(i, 1);
}

function writeFile(fileNameAndDir, data) {
    fs.writeFileSync(fileNameAndDir, data);
}

function createDir(d) {
    fs.mkdirSync(d);
}

function getTemplate(fileName) {
    let dir = path.resolve(__dirname, '../templates', '.' + fileName + '.html');
    try {
        const html = fs.readFileSync(dir).toString('utf-8');
        return html;
    } catch (err) { return false }
}

let tempWrites = [];

async function saveTemplate(fileName, data) {
    const date = Date.now();
    tempWrites.push({ fileName, data, date });
    const dir = path.resolve(__dirname, '../templates', '.' + fileName + '.html');


    // checks if file is in use
    let check = jsonWrites.filter(j => j.fileName == fileName);
    while (check.length > 1) console.log('file in use!');

    try {
        writeFile(dir, data);
    } catch (err) {
        createDir(dir);
        writeFile(dir, data);
    }
    let json = tempWrites.find(j => j.date == date);
    const i = tempWrites.indexOf(json);
    tempWrites.splice(i, 1);
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return {
        int: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
        type: sizes[i]
    };
}

/**
 * 
 * @param {String} data Binary Data
 * @param {String} filename Name of file
 * @returns {Promise}
 */
async function saveUpload(data, filename) {
    return new Promise((resolve, reject) => {
        data = Buffer.from(data, 'binary');

        fs.writeFile(path.resolve(__dirname, '../uploads', filename), data, err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

/**
 * 
 * @param {Array} files Files to upload in the format of { data: binaryData, filename: filename, ext: fileExtension }
 * @returns {Promise}
 */
async function uploadMultipleFiles(files) {
    return new Promise((resolve, reject) => {
        let promises = [];
        files.forEach(file => {
            promises.push(saveUpload(file.data, file.filename + file.ext));
        });

        Promise.all(promises).then(() => resolve()).catch(err => reject(err));
    });
}

function getUpload(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, '../uploads', filename), (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}






/**
 * 
 * @param {String} pathname Path to write the file to
 * @returns {Function} Express Middleware
 */
const fileStream = (pathname, {
    maxFileSize = 1000000000,
    extensions
} = {}) => {
    return (req, res, next) => {
        const fileId = uuid() + '-' + Date.now();
        const {
            headers: {
                    'x-content-type': contentType,
                    'x-file-name': fileName,
                    'x-file-size': fileSize,
                    'x-file-type': fileType,
                    'x-file-ext': fileExt
                }
        } = req;

        if (maxFileSize && fileSize > maxFileSize) {
            console.log('File size is too large', fileSize, maxFileSize);
            return res.json({
                status: 'danger',
                msg: 'File size is too large',
                title: 'File Upload Error'
            });
        }

        if (extensions && !extensions.includes(fileExt)) {
            console.log('File type is not allowed', fileExt, extensions);
            return res.json({
                status: 'danger',
                msg: 'File type is not allowed',
                title: 'File Upload Error'
            });
        }

        console.log('File upload started: ' + fileName + ' (' + fileSize + ' bytes)');
        const file = fs.createWriteStream(path.resolve(__dirname, pathname, fileId + '.' + fileExt));

        let total = 0;
        req.on('data', (chunk) => {
            file.write(chunk);
            total += chunk.length;
            console.log('Received chunk: ' + chunk.length + ' bytes out of ' + fileSize + ' bytes. Progress: ( ' + Math.round((total / fileSize) * 100) + '% )');
        });

        req.on('end', () => {
            file.end();
            req.file = {
                id: fileId,
                name: fileName,
                type: fileType,
                ext: fileExt,
                size: fileSize,
                contentType
            }
            next();
        });

        req.on('error', (err) => {
            console.log(err);

            res.json({
                status: 'danger',
                msg: 'An error occured while uploading the file.',
                title: 'File Upload Error'
            });
        });

    }
}



/**
 * 
 * @param {String} dir Directory to open 
 * @param {Function} cb Callback function to run on each file 
 * @param {Object} options Options
 * @returns {Void}
 */
const openAllInFolderSync = (dir, cb, options = {}) => {
    if (!dir) throw new Error('No directory specified');
    if (!cb) throw new Error('No callback function specified');

    if (!fs.existsSync(dir)) return;
    if (!fs.lstatSync(dir).isDirectory()) return;
    const files = fs.readdirSync(dir);
    files.sort((a, b) => {
        // put directories first
        const aIsDir = fs.lstatSync(path.resolve(dir, a)).isDirectory();
        const bIsDir = fs.lstatSync(path.resolve(dir, b)).isDirectory();

        return aIsDir ? 1 : bIsDir ? -1 : 0;
    });

    if (options.sort) {
        files.sort((a, b) => {
            if (fs.lstatSync(path.resolve(dir, a)).isDirectory() || fs.lstatSync(path.resolve(dir, b)).isDirectory()) return 0;
            return options.sort(path.resolve(dir, a), path.resolve(dir, b));
        });
    }
    files.forEach(file => {
        const filePath = path.resolve(dir, file);
        if (fs.lstatSync(filePath).isDirectory()) openAllInFolderSync(filePath, cb, options);
        else cb(filePath);
    });
}

/**
 * 
 * @param {String} dir 
 * @param {Function} cb
 * @param {Object} options 
 * @returns {Promise}
 */
const openAllInFolder = async(dir, cb) => {
    if (!dir) throw new Error('No directory specified');
    if (!cb) throw new Error('No callback function specified');
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(dir)) return resolve();
        if (!fs.lstatSync(dir).isDirectory()) return resolve();

        fs.readdir(dir, (err, files) => {
            if (err) return reject(err);
            files.forEach(file => {
                const filePath = path.resolve(dir, file);
                if (fs.lstatSync(filePath).isDirectory()) openAllInFolder(filePath, cb);
                else cb(filePath);
            });
        });
    });
}

module.exports = {
    getJSON,
    saveJSON,
    createDir,
    getTemplate,
    saveTemplate,
    formatBytes,
    saveUpload,
    getUpload,
    uploadMultipleFiles,
    fileStream,
    openAllInFolderSync,
    openAllInFolder
}
