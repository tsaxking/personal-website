'use strict';
const locations = {
    temp: `${__dirname}/templates`.replace(/\\/g, "/"),
    stat: `${__dirname}/static`.replace(/\\/g, "/"),
    root: __dirname.replace(/\\/g, "/")
}

console.log(locations);

exports = module.exports = locations;