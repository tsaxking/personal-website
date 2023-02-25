document.querySelectorAll('.connection-button').forEach(c => {
    c.addEventListener('click', () => {
        requestFromServer({
            url: '/account/set-interaction',
            method: 'POST',
            body: {
                intId: c.dataset.connect
            }
        });
    });
});

interactEvents.forEach(e => {
    document.addEventListener(e, () => {
        prevActivitySet = Date.now();
        setTimeout(() => {
            socket.emit('activity');
        }, 1000 * 60 * 5);
    });
});

let prevActivitySet = Date.now();

// function setActivity(now) {
//     if (!now) {
//         if (Date.now() - prevActivitySet < 500) return;
//     }
//     if (activityTimeout) clearTimeout(activityTimeout);
//     if (activityInterval) clearInterval(activityInterval);
//     document.querySelector('#activity-popup').style.display = 'none';

//     activityTimeout = setTimeout(() => {
//         activityCountdown();
//     }, (60 * 60 * 1000) - (5 * 60 * 1000)); // 1 hour - 5 minutes

//     prevActivitySet = Date.now();
// }

socket.on('activity-countdown', ({ countdown }) => {
    // activityCountdown(countdown);
});

let activityInterval;
// TODO: Stay signed in changes session length to a week instead of an hour
function activityCountdown(delta) {
    // document.querySelector('#activity-popup').style.display = 'block';
    showElement(document.querySelector('#activity-popup'));

    document.querySelector('#activity-progress-bar').style.width = '0%';
    document.querySelector('#activity-countdown').innerText = '';

    let targetDate = Date.now() + delta; // 5 minutes from now
    activityInterval = setInterval(() => {
        let timeLeft = targetDate - Date.now();

        document.querySelector('#activity-progress-bar').style.width = (100 - (((timeLeft / delta)) * 100)) + '%';

        var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)); //conversion miliseconds on minutes 
        if (minutes < 10) minutes = "0" + minutes;

        var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000); //conversion miliseconds on seconds
        if (seconds < 10) seconds = "0" + seconds;
        try {
            document.querySelector('#activity-countdown').innerText = minutes + "m " + seconds + "s";
        } catch (e) {
            // console.log(e);
        }

        if (timeLeft <= 0) {
            clearInterval(activityInterval);
            document.querySelector('#activity-countdown-container').innerHTML = "Session expired, you must reload and log in again";
        }
    }, 1000);
}