document.addEventListener('DOMContentLoaded', () => {
    countDown();
});

let time = 3;

const username = getCookie('username');

function countDown() {
    setTimeout(function() {
        if (time == 1) location.pathname = `/account/my-account/${username}`;
        time--;
        document.querySelector('#countdown').innerHTML = time;
        console.log('shit')
        countDown();
    }, 1000);
}