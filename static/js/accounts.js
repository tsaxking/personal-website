import GetPage from "./views/get_page.mjs";

const username = getCookie('username');
console.log(username);

document.addEventListener("DOMContentLoaded", () => {
    // Initial routing
    navigateTo(location.pathname);

    document.body.addEventListener("click", (e) => {
        clickEvent(e);

        if (e.target.getAttribute('data-link') === 'nav') {
            if (e.target.href == `http://localhost:8080${location.pathname}` ||
                e.target.href == `http://tsaxking.studio${location.pathname}` ||
                e.target.href == `https://kingmusicstudio.herokuapp.com/${location.pathname}` ||
                e.target.href == `https://taylorreeseking.com/${location.pathname}`) {
                e.preventDefault();
            } else {
                addAnimations();
                currentPage.HTML = docPage.innerHTML;
                e.preventDefault();
                navigateTo($(e.target)[0].pathname + `/${username}`);
            }
        }
    });
    document.querySelector('#covid_button').addEventListener('click', (e) => {
        e.target.classList.replace('note', 'hover_primaryLight');
        e.target.classList.remove('animate__animated');
    });
});

// Page the website is currently on
let currentPage;

// All Pages
let routes = [
    { path: "/account/my-account/:username", name: "My Account", view: GetPage },
    { path: "/account/account-info/:username", name: "Account Information", view: GetPage },
    { path: "/account/lessons/:username", name: "Lessons", view: GetPage },
    { path: "/account/lesson-logs/:username", name: "Lesson Logs", view: GetPage },
    { path: "/account/schedule/:username", name: "Transactions", view: GetPage },
    { path: "/account/projects/:username", name: "Projects", view: GetPage },
];


const router = async(url) => {
    // console.log(routes);
    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: url.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0]
        }
        url = '/home';
    }

    const view = new match.route.view(getParams(match));
    currentPage = match.route;
    currentPage.position = routes.indexOf(currentPage);

    if (currentPage.HTML == undefined) {
        currentPage.HTML = await view.getHtml(url);
    }

    var page = document.querySelector("#page");
    page.innerHTML = currentPage.HTML;
    setScripts();
};



const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
    const values = match.result.slice(1); // pathname without first /
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
}

const navigateTo = async(url, forBack) => {
    await router(url);

    if (!forBack) {
        history.pushState(null, null, url);
    }

    removeAnimations();

    try {
        addSelectedNavbutton(url);
    } catch (error) {}
}

function setScripts() {
    setGeneralScripts();

    try { readURL("select-profile_picture", "create-account_temp_display") } catch (err) {}
    try { signOut(); } catch (err) {}
    return;
}

function signOut() {
    document.querySelector('#sign-out').addEventListener('click', () => {
        document.querySelector('#i-am-sure').addEventListener('click', () => {
            fetch('/sign-out', { method: "POST" })
                .then(res => res.json())
                .then(json => { location.pathname = json.url });
        });
    })
}


// Navbuttons
function removeSelectedNavbuttons() {
    document.querySelectorAll('.navbutton').forEach(navbutton => {
        if (navbutton.classList.contains('selected')) {
            navbutton.classList.remove('selected');
        }

        if (navbutton.classList.contains('semi-selected')) {
            navbutton.classList.remove('semi-selected');
        }
    });
}

function addSelectedNavbutton(pathname) {
    removeSelectedNavbuttons();
    let navbutton

    if (pathname.split(':')[1] != undefined) {
        navbutton = document.querySelector("#composition_my-compositions-navbutton");
        navbutton.classList.add('semi-selected');
    } else {
        navbutton = document.querySelector(`.navbutton[href="${pathname}"]`);
        navbutton.classList.add('selected');
    }

    let parentNavbutton = navbutton.parentNode.parentNode.parentNode.children[1].children[0];

    if (parentNavbutton.tagName == 'A') parentNavbutton.classList.add('selected');
}

window.addEventListener("popstate", () => {
    navigateTo(location.pathname, true);
});