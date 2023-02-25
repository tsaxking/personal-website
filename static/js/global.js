'use strict';
let currentPage;
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const interactEvents = [
    'mouseover',
    'mousemove',
    'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'mousewheel',
    'mouseout',
    'contextmenu',
    'keydown',
    'keypress',
    'keyup',
    'touchstart',
    'touchend',
    'touchmove',
    'touchcancel'
];

const manualEvents = [
    'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'contextmenu',
    'keydown',
    'keypress',
    'keyup',
    'touchstart',
    'touchend',
    'touchcancel'
];

/**
 * 
 * @param {Array} matches matches array pulled from database OR thebluealliance API 
 * @returns {Array} sorted array starting with qm1 and ending with finals
 */
function sortMatches(matches) {
    const sortArr = [
        'qm',
        'qf',
        'sf',
        'f'
    ];

    return matches.sort((a, b) => a.number - b.number).sort((a, b) => {
        const aIndex = sortArr.indexOf(a.compLevel || a.comp_level);
        const bIndex = sortArr.indexOf(b.compLevel || b.comp_level);

        if (aIndex > bIndex) {
            return 1;
        } else if (aIndex < bIndex) {
            return -1;
        } else {
            return 0;
        }
    });
}

function filterTatorMatches(matches) {
    return matches.filter((match) => {
        const {
            alliances
        } = match;

        if (alliances.red.teamKeys.includes('frc2122') || alliances.blue.teamKeys.includes('frc2122')) {
            return true;
        } else return false;
    });
}

/**
 * 
 * @param {Date} date Target date object
 * @param {HTMLElement} element Target element to append the date to
 * @param {String} endMessage (OPTIONAL) Message to append to the end of the date
 * @returns {Object} Interval object
 */
function countdownToDate(date, element, endMessage) {
    // set interval to update the countdown
    let cdInterval = setInterval(() => {
        const now = new Date();
        const diff = date - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        element.innerHTML = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

        if (diff < 0) {
            clearInterval(cdInterval);
            element.innerHTML = endMessage ? endMessage : 'Countdown finished';
        }
    }, 1000);

    return cdInterval;
}

function convertDateStrToObj(str) {
    // input is "2022-08-22"
    const dateArr = str.split('-');
    return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
}


const sleep = async(n) => {
    // sleep for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000 * n));
    return 'done';
};


const convertObjToCamelCase = (obj) => {
    try {
        JSON.stringify(obj);
    } catch {
        console.error('Cannot convert to camel case due to circular reference');
        return obj;
    }

    // convert json string to camel case using regex
    // only convert keys
    // if value is object, convert recursively

    if (Array.isArray(obj)) return obj.map(convertObjToCamelCase);

    if (typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                newObj[convertObjToCamelCase(key)] = convertObjToCamelCase(obj[key]);
            } else {
                newObj[convertObjToCamelCase(key)] = obj[key];
            }
        }
        return newObj;
    } else {
        return obj.replace(/(_[a-z])/g, (match) => {
            return match[1].toUpperCase();
        });
    }
}


const mainFunctions = {};

window.isMobile =
    (function(a) {
        return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)));
    })(navigator.userAgent || navigator.vendor || window.opera);

// Chart.register(BoxPlotController, BoxAndWhiskers, LinearScale, CategoryScale);