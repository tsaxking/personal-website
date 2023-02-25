const socket = io();

socket.on('get-alerts', () => {
    getAlerts();
});

socket.on('notification', ({ msg, title, status, length, permanent }) => {
    createNotification(title, msg, status, {
        length,
        permanent
    });
});

socket.on('push-notification', ({ msg, title }) => {
    pushNotification(title, msg);
});

let serverLog, numServerLogs = 0;

document.addEventListener('DOMContentLoaded', () => {
    serverLog = document.querySelector('#server-log');
    serverLog.style.width = '100%';
    // console.log = (...args) => {
    //     addServerLog(args.map(a => {
    //         if (typeof a == 'object') return JSON.stringify(a, null, 2);
    //         else return a;
    //     }).join(' '), 'Client');
    //     if (args.length > 0 && !args[args.length - 1]) {
    //         console.log(...args, true);
    //     }
    // }
});


async function addServerLog(log, from) {
    // return;
    if (!serverLog) await setTimeout(() => {}, 1000);
    if (numServerLogs) serverLog.appendChild(document.createElement('br'));

    const container = createElementFromSelector('div.container-fluid');
    const row = createElementFromSelector('div.row');
    const dateCol = createElementFromSelector('div.col');
    const dateP = document.createElement('p');
    dateP.style.color = '#ff0000';
    dateP.innerText = new Date().toLocaleString() + ' - ' + '[' + from + '] ';
    dateCol.appendChild(dateP);

    const logCol = createElementFromSelector('div.col');
    const logP = document.createElement('p');
    logP.style.color = '#00ff00';
    logP.innerText = log;
    logCol.appendChild(logP);

    row.appendChild(dateCol);
    row.appendChild(logCol);
    container.appendChild(row)
    serverLog.appendChild(container);

    document.querySelector('#server-log-modal .modal-dialog').scrollTop = serverLog.scrollHeight;

    numServerLogs++;
}


socket.on('server-log', (log) => {
    addServerLog(log, 'Server');
});

let latencyTests = [];

const latencyTest = async(id = 0) => {
    return new Promise((res, rej) => {
        socket.emit('latency-test-init', id);
        latencyTests.push({
            id,
            res,
            rej
        });
    });
}

const multiLatencyTest = async(numTests) => {
    const results = await Promise.all(new Array(numTests).fill(0).map(async(_, i) => {
        return await latencyTest(i);
    }));

    const avg = results.reduce((a, b) => a + b, 0) / results.length;
    const frequency = 1000 / avg;

    console.log('Average latency: ' + avg + 'ms');
    console.log('Frequency: ' + frequency + 'Hz');

    console.log(results);
}

socket.on('latency-test-init', ({ date, testId }) => {
    socket.emit('latency-test', { date, testId });
});

socket.on('latency-result', ({ result, testId }) => {
    // console.log('Latency: ' + result + 'ms');
    const test = latencyTests.find(t => t.id == testId);

    if (test) {
        test.res(result);
        latencyTests.splice(latencyTests.indexOf(test), 1);
    }
});

// let pingId = -1;
// const pingInterval = setInterval(() => {
//     pingId++;
//     socket.emit('ping');
//     setTimeout(() => {
//         if (pingId > 0) {
//             alert('Connection lost. Please refresh the page.');
//             pingId = -1;

//             clearInterval(pingInterval);
//         }
//     }, 1000 * 30);
// }, 1000 * 60);

// socket.on('pong', () => {
//     pingId = 0;
// });