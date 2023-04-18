// // Data url:
// // Get a reference to the file input
// const fileInput = document.querySelector('input#thing');

// // Listen for the change event so we can capture the file
// fileInput.addEventListener('change', (e) => {
//     // Get a reference to the file
//     const file = e.target.files[0];

//     // Encode the file using the FileReader API
//     const reader = new FileReader();
//     reader.onloadend = () => {
//         console.log(reader.result);
//         // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
//     };
//     reader.readAsDataURL(file);
// });

// function fileUploadToDataUrl(input) {
//     // Get a reference to the file
//     const file = input.files[0];

//     // Encode the file using the FileReader API
//     const reader = new FileReader();
//     reader.onloadend = () => {
//         console.log(reader.result);
//         // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
//     };
//     reader.readAsDataURL(file);
// }





// FileReader:

function fileUpload(file, cb, cbError) {
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function(evt) {
            if (cb) cb(evt);
            // document.getElementById("fileContents").innerHTML = evt.target.result;
        }
        reader.onerror = function(evt) {
            console.log('Error reading file');
            if (cbError) cbError(evt);
            // document.getElementById("fileContents").innerHTML = "error reading file";
        }
    }
}

/**
 * 
 * @param {Element} input File input element 
 * @param {Function} callback Function to call when file is loaded 
 * @param {Array} accept Array of accepted file types ['pdf','png','jpg']
 * @param {Function} unacceptableCb (optional) Function to call when file is unacceptable, else it will create an alert
 */
function readMultipleFiles(input, callback, accept, unacceptableCb) {
    if (!input.querySelector) throw new Error('input must be a node!');
    if (!callback) throw new Error('readMultipleFiles requires a callback!');

    const { files } = input;

    var reader = new FileReader();
    let fileBin = [];

    const readFile = (index) => {
        const file = files[index];

        if (index >= files.length) {
            callback(fileBin);
            return;
        }

        const splitName = file.name.split('.');
        const ext = splitName[splitName.length - 1];
        if (!accept.find(a => a.toLowerCase() == ext.toLowerCase())) {
            if (unacceptableCb) unacceptableCb(file, index);
            else alert('File type not accepted!');
            return;
        }

        reader.onloadend = (e) => {
            // get file content
            fileBin.push({
                filename: file.name,
                data: e.target.result,
                extension: ext
            });
            readFile(index + 1);
        }
        reader.readAsBinaryString(file);
    }
    readFile(0);
}

async function readFiles(input, accept = []) {
    if (!input.querySelector) throw new Error('input must be a node!');
    const { files } = input;

    var reader = new FileReader();
    return await Promise.all(Array.from(files).map(async(file) => {
        const splitName = file.name.split('.');
        const ext = splitName[splitName.length - 1];
        if (!accept.find(a => a.toLowerCase() == ext.toLowerCase())) {
            alert('File type not accepted!');
            return;
        }

        return await new Promise((resolve, reject) => {
            reader.onloadend = (e) => {
                // get file content
                resolve({
                    filename: file.name,
                    data: e.target.result,
                    extension: ext
                });
            }
            reader.readAsBinaryString(file);
        });
    }));
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (parseFloat((bytes / Math.pow(k, i)).toFixed(dm))) + ' ' + sizes[i];
}

function viewImageFromFileUpload(input, target) {
    if (input.files.length > 0) {
        var reader = new FileReader();

        reader.onload = function(e) {
            target.setAttribute('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
    }
}