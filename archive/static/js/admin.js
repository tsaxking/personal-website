import GetPage from "./views/get_page.mjs";

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

                if ($(e.target)[0].pathname == "/about/project") {
                    currentProject = e.target.dataset.project;

                    try { document.querySelector(`[data-project="${currentProject}"`).click(); } catch (err) {}
                }
                navigateTo($(e.target)[0].pathname);
            }
        }
    });
});

// Page the website is currently on
let currentPage;

// All Pages
let routes = [
    { path: "/admin/home", name: "Admin", view: GetPage },
    { path: "/admin/admin-transactions", name: "client-transactions", view: GetPage },
    { path: "/admin/site-info", name: "Site Info", view: GetPage },
    { path: "/admin/clients", name: "Client Accounts", view: GetPage },
    { path: "/admin/client-profile/:username", name: "Client Profile", view: GetPage },
    { path: "/admin/budget", name: "Budget", view: GetPage },
];

const router = async(url) => {
    var page = document.querySelector("#page");
    // console.log(url);

    if (url == '/donate') {
        window.location.href = 'https://www.paypal.com/donate?hosted_button_id=F97RRGFJQQW92';
        return;
    }

    if (url.split('/')[2] == "client-profile") {
        currentPage = { path: url, view: new GetPage };
        currentPage.HTML = await currentPage.view.getHtml(url);
        page.innerHTML = currentPage.HTML;
        setScripts();
        return;
    }

    // console.log(routes);
    // if (url.split('/')[2] == "client-profile") {
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
        match = {
            route: routes[0]
        }
        url = '/home';
    }

    const view = new match.route.view(getParams(match));
    currentPage = match.route;
    currentPage.position = routes.indexOf(currentPage);
    // console.log(currentPage);

    if (currentPage.HTML == undefined) {
        currentPage.HTML = await view.getHtml(url);
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
    populateTransaction();
    setClientTableScript();
    newTransactionScript();

    try { readURL("transaction-picture", "create-transaction_temp_display") } catch (err) {}
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
        navbutton = document.querySelector(`.navbutton[href="${pathname}"]`)
        navbutton.classList.add('selected');
    }

    let parentNavbutton = navbutton.parentNode.parentNode.parentNode.children[1].children[0];

    if (parentNavbutton.tagName == 'A') parentNavbutton.classList.add('selected');
}

window.addEventListener("popstate", () => {
    navigateTo(location.pathname, true);
});

function setClientTableScript() {
    document.querySelectorAll('.client-row').forEach(row => {
        row.addEventListener('click', (e) => {
            e.preventDefault();
            const clientUsername = row.dataset.username;
            navigateTo(`/admin/client-profile/${clientUsername}`);
        })
    });
}

let transactions = [];

function populateTransaction() {
    document.querySelectorAll('[data-transaction]').forEach(transactionRow => {
        if (!transactions.includes(transactionRow.id)) {
            transactionRow.addEventListener('click', () => {
                let { transaction } = transactionRow.dataset;
                transaction = JSON.parse(transaction);

                for (var x in transaction) {
                    console.log(x);
                    document.querySelector(`#transaction-${x}`).innerText = transaction[x];
                }
            });
        }
    });
}

function newTransactionScript() {
    document.querySelectorAll('.open-form_sect').forEach(input => {
        input.addEventListener('change', () => {
            document.querySelectorAll('.form_sect').forEach(formSect => {
                document.querySelectorAll('.form_subsect').forEach(formSubSect => {
                    formSubSect.value = '';
                    hideElement(formSubSect);
                });

                formSect.value = '';
                hideElement(formSect);
            });

            let selectedVal = input.value;
            let selectedFormSect = document.querySelector(`#${selectedVal}-form_section`);
            showElement(selectedFormSect);
        });
    });
    document.querySelectorAll('.open-form_subsect').forEach(input => {
        input.addEventListener('change', () => {
            document.querySelectorAll('.form_subsect').forEach(formSubSect => {
                formSubSect.value = '';
                hideElement(formSubSect);
            });

            let selectedVal = input.value;
            let formSectID = input.dataset.form_sect;
            let selectedFormSubSect = document.querySelector(`#${formSectID}_${selectedVal}-form_subsect`);

            if (!selectedFormSubSect) selectedFormSubSect = document.querySelectorAll(`#${formSectID}_Other-form_subsect`);

            showElement(selectedFormSubSect);
        });
    });
}