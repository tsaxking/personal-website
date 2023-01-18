import GetPage from "./views/get_page.mjs";

document.addEventListener("DOMContentLoaded", () => {
    // Initial routing
    navigateTo(location.pathname);
    document.body.addEventListener("click", (e) => {
        clickEvent(e);

        if (e.target.getAttribute('data-link') === 'nav') {
            e.preventDefault();
            if ($(e.target)[0].pathname != location.pathname) {
                addAnimations();
                currentPage.HTML = docPage.innerHTML;
                // if ($(e.target)[0].pathname.split(':')[0] != '/composition/display') e.preventDefault();
                if ($(e.target)[0].pathname == "/about/project") {
                    currentProject = e.target.dataset.project;

                    try { document.querySelector(`[data-project="${currentProject}"`).click(); } catch (err) {}
                }

                navigateTo($(e.target)[0].pathname);
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
    { path: "/home", name: "Home", view: GetPage },
    { path: "/thank-you", name: "Thank You", view: GetPage },
    { path: "/about", name: "About Me", view: GetPage },
    { path: "/about/portfolio", name: "Portfolio", view: GetPage },
    { path: "/about/projects", name: "Project", view: GetPage },
    // { path: "/about/contact", name: "Contact", view: GetPage },
    { path: "/contact", name: "Contact", view: GetPage },
    { path: "/lessons", name: "Lessons", view: GetPage },
    // { path: "/lessons/saxophone", name: "Saxophone Lessons", view: GetPage },
    // { path: "/lessons/composition", name: "Composition Lessons", view: GetPage },
    { path: "/my-compositions", name: "My Compositions", view: GetPage },
    // { path: "/composition/commissions", name: "Commissions", view: GetPage },
    // { path: "/composition/my-compositions", name: "My Compositions", view: GetPage },
    { path: "/recording-studio", name: "Recording Studio", view: GetPage },
    // { path: "/recording-studio/recording", name: "Recording", view: GetPage },
    // { path: "/recording-studio/mixing", name: "Mixing", view: GetPage },
    // { path: "/recording-studio/mockups", name: "Mockups", view: GetPage },
    { path: "/performance", name: "Performance", view: GetPage },
    // { path: "/other", name: "Other", view: GetPage },
    { path: "/covid-19", name: "Covid-19 Policies", view: GetPage },
    // { path: "/other/score-editing", name: "Score Editing", view: GetPage },
    // { path: "/other/take-note", name: "Take Note Podcast", view: GetPage },
    { path: "/account/sign-up", name: "Sign Up", view: GetPage },
    { path: "/account/sign-in", name: "Sign In", view: GetPage },
    { path: "/sign-out", name: "Sign Out", view: GetPage },
    { path: '/account/change-password', name: "Change Password", view: GetPage }
];

// All Aliases
const aliasRoutes = [
    { in: "/", out: "/home" },
    { in: "/covid", out: "/covid-19" },
    { in: "/about-me", out: "/about" },
    { in: "/taylor", out: "/about" },
    { in: "/projects", out: "/about/projects" },
    // { in: "/contact", out: "/about/contact" },
    { in: "/about/contact", out: "/contact" },
    { in: "/comp", out: "/my-compositions" },
    { in: "/composition", out: "my-compositions" },
    { in: "/portfolio", out: "/about/portfolio" },
    // { in: "/saxophone", out: "/lessons/saxophone" },
    // { in: "/sax", out: "lessons/saxophone" },
    // { in: "/comp", out: "/lessons/composition" },
    // { in: "/commissions", out: "/composition/commissions" },
    { in: "/compositions", out: "/my-compositions" },
    // { in: "/composition", out: "/my-compositions" },
    // { in: "/studio", out: "/recording-studio" },
    // { in: "/mixing", out: "/recording-studio/mixing" },
    // { in: "/mockups", out: "/recording-studio/mockups" },
    // { in: "take-note", out: "/other/take-note" },
    // { in: "/score-editing", out: "/other/score-editing" },
    // { in: "/score", out: "/other/score-editing" },
    { in: "/sign-up", out: "/account/sign-up" },
    { in: "/sign-in", out: "/account/sign-in" },
    // {in: "", out: ""}
];

// Changes URL based on Alias
function redirect(url) {
    const route = aliasRoutes.find((route) => route.in == url);

    if (route) {
        url = route.out;
    }

    return url;
}

const router = async(url) => {
    var page = document.querySelector("#page");

    if (url == '/donate') {
        window.location.href = 'https://www.paypal.com/donate?hosted_button_id=F97RRGFJQQW92';
        return;
    }

    if (url.split(':')[0] === "/") {
        location.pathname = `/my-compositions/display${url.split('/')[1]}`;
    }

    // console.log(url);
    // console.log(url.split('/'));
    if (url.split(':')[0] === "/my-compositions/display") {
        currentPage = { path: url, view: new GetPage };
        currentPage.HTML = await currentPage.view.getHtml(url);

        if (window.mobileAndTabletCheck()) {
            currentPage.HTML = currentPage.HTML.replace("@MOBILE_HIDDEN@", "hidden");
        } else {
            currentPage.HTML = currentPage.HTML.replace("@MOBILE_HIDDEN@", "hidden");
        }

        page.innerHTML = currentPage.HTML;
        setScripts();
        // console.log('display');
        return;
    }
    // return;
    // if (url.split(':')[0] === "/composition/display") {
    //     let compRoute = routes.find(route => route.path == url);
    //     if (!compRoute) {
    //         routes.push({ path: url, view: GetPage });
    //     }
    // }
    // Test each route for potential match

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: url.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        location.pathname = '/home';
    }

    const view = new match.route.view(getParams(match));
    currentPage = match.route;
    currentPage.position = routes.indexOf(currentPage);

    if (currentPage.HTML == undefined) {
        currentPage.HTML = await view.getHtml(url);

        if (currentPage.HTML.substr(0, 3) === "<!D") {
            location.pathname = "/home";
            return;
        }
    }

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
    url = redirect(url);
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
    const url = location.pathname;

    if (url == "/about/projects") {
        setProjectsNavigation();
    } else if (url == '/about') {
        setAboutProjectButtons();
    } else if (url == "/thank-you") {
        setTimeout(function() { navigateTo('/home', false) }, 5000);
    }

    if (url == "/my-compositions") {
        setCompositionScripts();
    }

    if (url == "/home") {
        try {
            document.querySelector('#show_settings').addEventListener('click', () => {
                openPopup('settings-popup');
            });
        } catch (error) {}
    }

    setGeneralScripts();

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
    // console.log(pathname);
    removeSelectedNavbuttons();
    let navbutton

    if (pathname.split(':')[1] != undefined) {
        navbutton = document.querySelector("#composition_my-compositions-navbutton");
        navbutton.classList.add('semi-selected');
    } else {
        navbutton = document.querySelector(`.navbutton[href="${pathname}"]`)
        navbutton.classList.add('selected');
    }

    let parentNavbutton = navbutton.parentNode.parentNode.parentNode.children[1].children[0];

    if (parentNavbutton.tagName == 'A') parentNavbutton.classList.add('selected');
}

window.addEventListener("popstate", () => {
    navigateTo(location.pathname, true);
});

let currentProject;