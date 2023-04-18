/**
 * 
 * @param {Date} date Date object
 * @returns Time in am/pm instead of 24hr
 */
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function AMPMtoMinutes(time) {
    const [t, ap] = time.split(' ');
    const [h, m] = t.split(':');
    const delta = ap == 'AM' ? 0 : 12;

    let minutes = ((+h + +delta) * 60) + +m;
    return minutes;
}

function minutesToAMPM(minutes) {
    let h = Math.floor(minutes / 60);
    let m = minutes % 60;
    let ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    m = m < 10 ? '0' + m : m;
    var strTime = h + ':' + m + ' ' + ap;
    return strTime;
}

function convertDayToDate(dayInput) {
    try {
        // dayInput is a string in the format of '07/19/2022, 5:30 PM'
        // output must be a Date object
        const [date, time] = dayInput.split(', ');
        const [month, day, year] = date.split('/');
        const [_time, ampm] = time.split(' ');
        const [hour, minute] = _time.split(':');
        const delta = ampm.toUpperCase() == 'AM' ? 0 : 12;
        const hours = (+hour + +delta);
        const minutes = +minute;
        const seconds = 0;
        const milliseconds = 0;
        return new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
    } catch (e) {
        console.log(e);
        alert('Your date input is invalid, it must be in the format of: "mm/dd/yyyy, hh:mm AM/PM"');
    }
}