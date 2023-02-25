document.addEventListener('DOMContentLoaded', () => {
    countDown();
});

let time = 3;

function countDown() {
    setTimeout(function() {
        if (time == 1) location.pathname = `/admin`;
        time--;
        document.querySelector('#countdown').innerHTML = time;
        console.log('shit')
        countDown();
    }, 1000);
}