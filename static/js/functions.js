function setGeneralScripts() {
    setSlideshowScripts();
    fullScreenPDF();
    setCookieCode();
    setPopulateFormScripts();
    setDropdownFunctions();
    setToAccountButton();
    closeAllPopups();
    setPopupFunctions();
    setFormScripts();
    populateLogScripts()
    viewPortAnimations();
    setProjectsNavigation();
    delayAnimations();
    try { passwordStrengthCheck(); } catch (err) {}
    window.scrollTo(0, 0);
}

let docBody,
    docPage,
    bodyClasses,
    navClasses;
document.addEventListener("DOMContentLoaded", () => {
    // sets up where pages will be input
    docPage = document.querySelector("#page");
    docBody = document.querySelector('body');
    bodyClasses = docBody.classList;
    navClasses = document.querySelector('nav').classList;

    // Initial routing
    document.body.addEventListener("touchstart", handleTouchStart);
    document.body.addEventListener("touchmove", handleTouchMove);
    let dropNum = 0;
    document.querySelectorAll(".navbutton_container").forEach(navBtnCtnr => {
        try {
            const expand = navBtnCtnr.children[0],
                dropdown = navBtnCtnr.children[2];
            dropdown.id = `drop-${dropNum}`;
            expand.id = `expand-${dropNum}`;
            expand.addEventListener('click', () => {
                expand.classList.toggle('rotate180');
                dropdown.classList.toggle('hidden');
                document.querySelectorAll('.nav_dropdown').forEach(drop => {
                    if (dropdown.id != drop.id) hideElement(drop);
                });
                document.querySelectorAll('.nav_expand').forEach(exp => {
                    if (expand.id != exp.id) exp.classList.remove('rotate180');
                });
            });
            dropNum++;
        } catch (error) {}
    });

    // Slideshow Swiping
    // Mobile vs. desktop
    if (window.mobileAndTabletCheck()) {
        // Mobile
        bodyClasses.add('mobile');
        navClasses.add('hidden');
        document.querySelectorAll('.nav_dropdown').forEach(drop => {
            hideElement(drop);
        });
    } else {
        // Desktop
        bodyClasses.add('desktop');
        // Hide dropdown after clicking
        document.querySelectorAll('.navbutton_container').forEach(el => el.addEventListener('mouseover', e => {
            let targ = e.target.classList.contains('navbutton_container') ? e.target : e.target.closest('.navbutton_container');
            if (bodyClasses.contains('desktop') && targ.querySelector('.nav_dropdown') != null) {
                targ.querySelector('.nav_dropdown').classList.remove('hold');
            }
        }));
        document.addEventListener('click', e => {
            if (e.target.closest('.nav_dropdown') && bodyClasses.contains('desktop')) {
                e.target.closest('.nav_dropdown').classList.add('hold');
            }
        });
        switchMobileDesktopView(bodyClasses, navClasses);
        $(window).resize(function() { switchMobileDesktopView(bodyClasses, navClasses) });
    };

    document.querySelectorAll('.scroll_top').forEach(scrollTop => {
        scrollTop.addEventListener('click', () => {
            window.scrollTo(0, 0);
        });
    });

    removeAnimations();

    document.addEventListener('keydown', (event) => {
        var code = event.code;
        if (code === "Escape") {
            document.querySelectorAll('.popup').forEach(popup => {
                if (!(popup.classList.contains('hidden'))) {
                    closePopup(popup.id)
                }
            });
            try { closeFullScreenPdf(); } catch (error) {}
        }
    }, false);

    setPopupFunctions();
    setPopulateFormScripts();

    document.querySelector('#bake_cookie-yes').addEventListener('click', (e) => {
        bakeCookie();
    });
    setCookieCode();
    document.querySelector('#dyslexia_button').addEventListener('click', dyslexiaSettings);
    document.querySelector('#cookie-bake').addEventListener('click', () => {
        let cookieButton = document.querySelector('#cookie-choice');
        showElement(cookieButton);
        document.querySelector('#cookie-bake').classList.add('static');
    });
    document.querySelector('#bake_cookie-no').addEventListener('click', () => {
        let cookieButton = document.querySelector('#cookie-choice');
        hideElement(cookieButton);
        document.querySelector('#cookie-bake').classList.remove('static');
    });

    // document.querySelector('#eat_cookie').addEventListener('click', () => { eatCookie(false) });
    document.querySelector('#scroll_top').addEventListener('click', () => {
        window.scroll(0, 0);
    });

    document.querySelector('#collapse_header').addEventListener('click', (e) => {
        collapseHeader(e.target)
    });

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    docBody = document.querySelector('body');
    bodyClasses = docBody.classList;
    allSettings(currentSettings);
});



function removeDoctype(htmlStr, htmlClass) {
    var htmlObject = document.createElement('html');
    htmlObject.innerHTML = htmlStr;
    var html = htmlObject.querySelector(htmlClass).innerHTML;
    return html;
}

// Functions
// General Functions
function replaceSpace(string, delimiter) {
    var array = string.split("");
    for (var i in array) {
        if (array[i] === " ") {
            array[i] = delimiter;
        } else {
            array[i] = array[i].toLowerCase();
        }
    }
    return array.join("");
}

function bakeCookie() {
    hideElement(document.querySelector('#cookie-choice'));
    hideElement(document.querySelector('#settings-cookie'));
    eatCookie(false);

    document.cookie = `settings=${JSON.stringify(currentSettings)}`;
    createNotification('Cookie Baked in Oven: Your settings have been saved');
    setCookieCode();
}

function eatCookie(message) {
    (function() {
        var cookies = document.cookie.split("; ");
        for (var c = 0; c < cookies.length; c++) {
            var d = window.location.hostname.split(".");
            while (d.length > 0) {
                var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
                var p = location.pathname.split('/');
                document.cookie = cookieBase + '/';

                while (p.length > 0) {
                    document.cookie = cookieBase + p.join('/');
                    p.pop();
                };
                d.shift();
            }
        }
    })();

    if (!message) {
        createNotification('Cookies: Your last cookie has been eaten');
    };

    setCookieCode();
}

function replaceDelimiter(string, delimiter) {
    var array = string.split("");
    for (var i in array) {
        if (i == 0 && array[i] != delimiter) {
            array[i] = array[i].toUpperCase();
        } else if (i == 0 && array[i] == delimiter) {
            array[i] = "";
            array[Number(i) + 1] = array[Number(i) + 1].toUpperCase()
        } else if (array[i] === delimiter) {
            array[i] = " ";
            array[Number(i) + 1] = array[Number(i) + 1].toUpperCase();
            i++;
        }
    }
    return array.join("");
}

function swapIfFirstIsValue(string, value) {
    if (string.substr(1, value.length) === value) {
        var array = string.split(' ');
        string = array[2] + ' ' + array[1];
    }
    return string;
}

// Animations
function removeAnimations() {
    document.querySelectorAll('.animate__animated').forEach(animation => {
        animation.addEventListener('animationend', () => {
            if (animation.classList.contains('index_animation')) {
                if (animation.id == 'covid_button') {
                    animation.classList.remove('animate__bounceInRight');
                    animation.classList.remove('animate__delay-quarter-s');

                    animation.classList.add('animate__bounce');
                    animation.classList.add('animate__delay-2s');
                    animation.classList.add('animate__repeat-3');

                    // } else if (animation.id == 'account-dropdown') {

                } else {
                    animation.classList.remove('animate__animated');
                }
            } else if (!(animation.classList.contains('popup') || animation.classList.contains('popup-content'))) {
                animation.classList.replace('animate__animated', 'nonIndex_animation');
            }
        });
    });
}

function addAnimations() {
    document.querySelectorAll('.nonIndex_animation').forEach(animation => {
        animation.classList.replace('nonIndex_animation', 'animate__animated');
    });
}

function viewPortAnimations() {
    const inViewport = (entries, observer) => {
        entries.forEach(entry => {
            entry.target.classList.toggle("animate__animated");
        });
    };

    const Obs = new IntersectionObserver(inViewport);
    const obsOptions = {}; //See: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#Intersection_observer_options

    // Attach observer to every [data-inviewport] element:
    const ELs_inViewport = document.querySelectorAll('[data-inviewport]');
    ELs_inViewport.forEach(EL => {
        Obs.observe(EL, obsOptions);
    });
}

function delayAnimations() {
    let delay;
    document.querySelectorAll('.animate__delay-block').forEach(delayBlock => {
        console.log(delayBlock);
        delay = 0;
        for (var i in delayBlock.children) {
            try {
                if (!delayBlock.children[i].classList.contains('animate__delay-var')) continue;
                delayBlock.children[i].classList.add(`animate__delay-${delay}`);
            } catch (error) { continue; }
            delay++;
        }
        delayBlock.classList.remove('animate__delay-block');
    });

    document.querySelectorAll('.animate__delay-reverse_block').forEach(delayBlock => {
        delay = delayBlock.children.length;
        for (var i in delayBlock.children) {
            try {
                if (!delayBlock.children[i].classList.contains('animate__delay-var')) continue;
                delayBlock.children[i].classList.add(`animate__delay-${delay}`)
            } catch (error) { continue; }
            delay--;
        }
        delayBlock.classList.remove('animate__delay-reverse_block')
    });
}

// Close dropdowns
function clickEvent(event) {
    const targ = event.target;
    // [mobile/desktop/irrelevant,toChange,onClick,[exceptions],[[class,action],[class,action]]]
    var list = [
        ['mobile', 'nav', '#mobile_nav', ['nav', '.navdrop_expand', '.nav_expand', '.nav_dropdown', '.navbutton_container'],
            [
                ['hidden', false]
            ]
        ],
        ['irrelevant', '#account-dropdown', '#account-button', ['.account-dropdown_text'],
            [
                ['hidden', false]
            ]
        ]
    ]

    list.map(listSet => {
        if ((listSet[0] == 'mobile' && bodyClasses.contains('mobile')) ||
            (listSet[0] == 'desktop' && bodyClasses.contains('desktop')) ||
            listSet[0] == 'irrelevant') {
            let apply = true;

            // Check if the user clicked an exception
            listSet[3].map(exceptionSelector => {
                try {
                    document.querySelectorAll(exceptionSelector).forEach(exceptionElement => {
                        if (targ == exceptionElement) {
                            // User clicked an exception
                            apply = false;
                        }
                    });
                } catch (error) {}
            });

            if (apply) {
                // User did not click an exception
                let remain = true;
                listSet[4].map(valueToApply => {
                    document.querySelectorAll(listSet[1]).forEach(elementToChange => {
                        // Check if on click off screen it needs to apply the class change
                        if (elementToChange.classList.contains(valueToApply[0]) != valueToApply[1]) {
                            document.querySelectorAll(listSet[2]).forEach(elementToClick => {
                                if (targ != elementToClick) {
                                    // Don't change class
                                    remain = false;
                                }
                            });
                        }
                    });

                    if (remain) {
                        // Change Class
                        document.querySelectorAll(listSet[1]).forEach(element => {
                            element.classList.toggle(valueToApply[0]);
                        });
                    }
                });
            }
        }
    });
}

// Display scroll to top button
$(function() {
    var lastScrollTop = 0,
        delta = 5;

    $(window).scroll(function() {
        var nowScrollTop = $(this).scrollTop();
        if (Math.abs(lastScrollTop - nowScrollTop) >= delta) {
            if (nowScrollTop > lastScrollTop) {
                document.querySelectorAll('.scroll_top').forEach(el => {
                    hideElement(el);
                });
            } else {
                document.querySelectorAll('.scroll_top').forEach(el => {
                    showElement(el)
                });
            }
        }

        if (nowScrollTop == 0) {
            document.querySelectorAll('.scroll_top').forEach(el => {
                hideElement(el);
            });
        }
        lastScrollTop = nowScrollTop;
    });
});
// Mobile/Desktop
window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);

    if (check) {
        bodyClasses.add('only_mobile');
    } else {
        bodyClasses.add('only_desktop');
    }
    return check;
};

let view;

function switchMobileDesktopView() {
    var currentView;
    // console.log(window.innerWidth)
    if (window.innerWidth <= 950) {
        currentView = "mobile";
    } else {
        currentView = "desktop";
    }
    if (currentView != view) {
        changeView(currentView);
    }
}

function changeView(mobOrDesk) {
    if (mobOrDesk == "desktop") {
        view = "desktop";
        try {
            bodyClasses.replace('mobile', 'desktop');
            navClasses.remove('hidden');
            document.querySelectorAll('.nav_dropdown').forEach(dropdown => {
                showElement(dropdown);
            });

            document.querySelectorAll('.nav_expand').forEach(expand => {
                hideElement(expand);
            });

            document.querySelector("#covid-19_front-navbutton").innerText = "COVID-19";
        } catch (error) {}
    } else {
        view = "mobile";
        try {
            try { closeFullScreenPdf(); } catch (error) {}
            bodyClasses.replace('desktop', 'mobile');
            navClasses.add('hidden');
            document.querySelectorAll('.nav_dropdown').forEach(dropdown => {
                hideElement(dropdown)
            });

            document.querySelectorAll('.nav_expand').forEach(expand => {
                showElement(expand);
            });

            showElement(document.querySelector('#heading'));
        } catch (error) {}
    }
    view = mobOrDesk;
}

let slideObjs = {
    homeSlide: {
        slideShow: 'home',
        value: 1,
        created: false
    },
    taylorSlide: {
        slideShow: 'taylor',
        value: 1,
        created: false
    },
    designSlide: {
        slideShow: 'design',
        value: 1,
        created: false
    },
    buildSlide: {
        slideShow: 'build',
        value: 1,
        created: false
    },
    acceptanceSlide: {
        slideShow: 'acceptance',
        value: 1,
        created: false
    },
    websiteSlide: {
        slideShow: 'website',
        value: 1,
        created: false
    }
}

function scrollToTop() {
    window.scrollTo(0);
}
// Swiping
let direction = '';
var xDown = null;
var yDown = null;

function getTouches(e) {
    return e.touches || // browser API
        e.originalEvent.touches; // jQuery
}

function handleTouchStart(e) {
    const firstTouch = getTouches(e)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(e) {
    if (!xDown || !yDown) {
        return;
    }
    var xUp = e.touches[0].clientX;
    var yUp = e.touches[0].clientY;
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
    var vert;
    var hori;

    if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
        if (xDiff > 0) {
            direction = 'left';
            hori = -1;
        } else if (xDiff < 0) {
            direction = 'right';
            hori = 1;
        }
    } else {
        if (yDiff > 0) {
            direction = 'up';
            vert = 1;
        } else if (yDiff < 0) {
            direction = 'down';
            vert = -1;
        }
    }

    let a = e.target;
    do {
        a = a.parentNode;
    } while (!(a.classList.contains('slideshow')) && a != document.querySelector('html'));
    if (a.classList.contains('slideshow') && (direction == 'right' || direction == 'left')) {
        var slideshow = slideObjs[`${a.id.split("_")[0]}Slide`];
        plusSlides(hori * -1, slideshow);
    }

    /* reset values */
    hori = null;
    vert = null;
    xDown = null;
    yDown = null;
    direction = null;
};
// Slideshow
// Next/previous controls
function plusSlides(n, slideObj) {
    slideObj.value += n
    var index = showSlides(slideObj.value, `${slideObj.slideShow}_slides`, `${slideObj.slideShow}_dot`);
    slideObj.value = index;
}

// Thumbnail image controls
function currentSlide(n, slideObj) {
    var index = showSlides(n, `${slideObj.slideShow}_slides`, `${slideObj.slideShow}_dot`);
    slideObj.value = index;
}

function showSlides(slideIndex, slideShow, slideDot) {
    // console.log("START SLIDE INDEX: " + slideIndex);
    let i = 1,
        dots = document.querySelectorAll(`.${slideDot}`),
        slides = document.querySelectorAll(`.${slideShow}`);
    if (slideIndex < 1) slideIndex = dots.length;
    else if (slideIndex > dots.length) slideIndex = 1;

    dots.forEach(dot => {
        if (dot.classList.contains('active')) prevSlide = i;
        dot.classList.remove('active');
        if (i == slideIndex) dot.classList.add('active');
        i++;
    });

    let dir, oppDir;
    if (slideIndex < prevSlide) {
        dir = "Left";
        oppDir = "Right";
    } else {
        dir = "Right";
        oppDir = "Left"
    }

    // console.log("DIRECTION: " + dir);
    slideNum = 1;
    slides.forEach(slide => {
        if (slideNum == slideIndex) {
            showElement(slide);
            //     slide.classList.add('animate__animated');
            //     slide.classList.add(`animate__slideIn${dir}`);
        } else {
            //     slide.classList.add('closed')
            //     slide.classList.remove(`animate__slideIn${dir}`);
            //     slide.classList.add('animate__animated');
            //     slide.classList.add(`animate__slideOut${oppDir}`);
            //     slide.addEventListener('animationend', () => {
            //         slide.classList.remove('animate__animated');
            //         slide.classList.remove(`animate__slideOut${oppDir}`);
            //         if (slide.classList.contains('closed')) {
            hideElement(slide);
            //             slide.classList.remove('closed');
            //         }
            //     });
        }
        slideNum++;
    });
    return slideIndex;
}

function setSlideshowScripts() {
    document.querySelectorAll('.slideshow').forEach(slideShow => {
        const slideID = slideShow.id.split("_")[0];
        // Set Numbers
        const numSlides = document.querySelector(`#${slideID}_slides`).children.length;
        let slideNum = 1;

        // console.log(slideID);
        if (slideObjs[`${slideID}Slide`].created == false) {
            document.querySelectorAll(`.${slideID}_slide-num`).forEach(slideFrac => {
                // console.log(slideFrac);
                var p = document.createElement('p');
                p.innerText = `${slideNum} / ${numSlides}`
                slideFrac.appendChild(p);
                var span = document.createElement('span');
                // console.log(span);
                span.classList.add(`${slideID}_dot`);
                // console.log(span);
                span.classList.add('slide-dot');
                // console.log(span);
                span.dataset.dot = slideNum;
                if (slideNum == 1) span.classList.add('active');
                document.querySelector(`#${slideID}_slide_dot-container`).appendChild(span);
                // console.log(span);
                slideNum++;
            });

            document.querySelector(`#${slideID}_next`).addEventListener('click', () => {
                // console.log('slide change forward');
                plusSlides(1, slideObjs[`${slideID}Slide`]);
            });

            document.querySelector(`#${slideID}_prev`).addEventListener('click', () => {
                // console.log('slide change backwards');
                plusSlides(-1, slideObjs[`${slideID}Slide`]);
            });

            slideObjs[`${slideID}Slide`].value = 1;
            // document.querySelectorAll(`.${slideID}_slides`).forEach(slidePic => {
            //     // console.log(slideNum);
            //     if (slideNum < 1) hideElement(slidePic);
            //     // slidePic.classList.add('animate__animated');
            //     slideNum++;
            // });
            document.querySelectorAll(`.${slideID}_dot`).forEach(slideDot => {
                slideDot.addEventListener('click', () => {
                    let dotNum = slideDot.dataset.dot;
                    currentSlide(dotNum, slideObjs[`${slideID}Slide`]);
                });
            });

            slideObjs[`${slideID}Slide`].created = true;
            currentSlide(1, slideObjs[`${slideID}Slide`]);
        }
    });
}

// Hover over sound
function playSound(soundElId) {
    if (play) {
        var soundEl = document.getElementById(soundElId);
        try {
            soundEl.volume = 1;
            soundEl.play();
        } catch (error) {}
    }
}

function stopSound(soundElId) {
    var soundEl = document.getElementById(soundElId);
    let fadeAudio;

    try {
        const fadePoint = soundEl.currentTime;
        fadeAudio = setInterval(() => {
            if (soundEl.currentTime >= fadePoint &&
                soundEl.volume != 0) soundEl.volume -= .01;

            if (soundEl.volume < 0.01) {
                soundEl.pause();
                soundEl.currentTime = 0;
                clearInterval(fadeAudio);
            }
        }, 1);
    } catch (error) {
        soundEl.volume = 0;
        try { clearInterval(fadeAudio); } catch (err) {}
    }
}


function pauseSound(soundElId) {
    var soundEl = document.getElementById(soundElId);
    if (play) {
        try {
            soundEl.pause();
        } catch (error) {}
    }
}

var play = true;

function closePopup(popupId) {
    var popup = document.querySelector(`#${popupId}`);
    popup.classList.add('closed');
    popup.classList.remove('open');
    popup.classList.add('animate__fadeOut');
    popup.children[0].classList.add('animate__backOutRight');

    popup.addEventListener('animationend', () => {
        popup.classList.remove('animate__fadeOut');
        popup.children[0].classList.remove('animate__backOutRight');
        if (popup.classList.contains('closed')) {
            hideElement(popup);
        }
    });
}

function closeAllPopups() {
    document.querySelectorAll('.popup').forEach(popup => {
        if (!popup.classList.contains('hidden') && popup.id != "mobile_display-popup") closePopup(popup.id);
    });
}

function openPopup(popupId) {
    var popup = document.querySelector(`#${popupId}`);
    popup.classList.add('open');
    popup.classList.remove('closed');
    showElement(popup);
    popup.classList.add('animate__fadeIn');
    popup.children[0].classList.add('animate__backInRight');

    popup.addEventListener('animationend', () => {
        if (popup.classList.contains('open')) {
            popup.classList.remove('animate__fadeIn');
            popup.children[0].classList.remove('animate__backInRight');
        }
    });
}

let fullScreens = [];

function fullScreenPDF() {
    document.querySelectorAll('.pdf_full_small-container').forEach(pdfContainer => {
        if (!fullScreens.includes(location.pathname)) {
            // console.log(pdfContainer);
            // console.log('setting pdf fullscreen');
            const id = pdfContainer.id.split("-")[0];
            var icon = document.querySelector(`#${id}_open_fullscreen_pdf`);

            icon.addEventListener('click', () => {
                var pdfEl = document.querySelector(`#${id}_pdf`);
                pdfEl.classList.toggle('fullscreen-pdf');
                var containerEl = document.querySelector(`#${id}_pdf_container`);
                containerEl.classList.toggle('fullscreen-pdf-container');

                if (pdfEl.classList.contains('fullscreen-pdf')) {
                    icon.innerText = "close_fullscreen";
                    icon.classList.replace('open-fullscreen_pdf', 'close-fullscreen_pdf')
                } else {
                    icon.innerText = "open_in_full";
                    icon.classList.replace('close-fullscreen_pdf', 'open-fullscreen_pdf');
                }
            });
            fullScreens.push(location.pathname);
        }
    });
}

function closeFullScreenPdf() {
    var pdfEl = document.querySelector(`.fullscreen-pdf`);
    pdfEl.classList.toggle('fullscreen-pdf');
    var containerEl = document.querySelector(`.fullscreen-pdf-container`);
    containerEl.classList.toggle('fullscreen-pdf-container');
    var icon = document.querySelector(`.close-fullscreen_pdf`);
    icon.innerText = "open_in_full";
    icon.classList.replace('close-fullscreen_pdf', 'open-fullscreen_pdf');
}

function switchPlay(elId) {
    var elText = document.querySelector(`#${elId}`).innerText;
    if (elText == 'play_arrow') {
        elText = 'pause';
        playSound(`${elId}_audio`);
    } else if (elText == "pause") {
        elText = 'play_arrow';
        pauseSound(`${elId}_audio`);
    }
}

function showProfile() {
    // Get all elements with .mobile_hidden
    // Add mobile_show
    // Remove mobile hidden
    if (document.querySelector('body').classList.contains('mobile')) {
        document.querySelectorAll(".mobile_hidden").forEach(el => {
            el.classList.remove('mobile_hidden');
            el.classList.add('mobile_show');
        });
    }
}

// function readURL(inputID, accountDisplay) {
//     let input = document.querySelector(`#${inputID}`)
//     input.addEventListener('change', () => {
//         if (input.files && input.files[0]) {
//             var reader = new FileReader();
//             reader.onload = function(e) {
//                 var img = document.querySelector(`#${accountDisplay}`);
//                 img.style.backgroundImage = `url(${e.target.result})`;
//                 hideElement(img.children[0]);
//             };
//             reader.readAsDataURL(input.files[0]);
//         }
//     })
// }

function readURL(inputId, displayId) {
    const imgInp = document.querySelector(`#${inputId}`);
    const display = document.querySelector(`#${displayId}`);

    imgInp.onchange = (evt) => {
        const [file] = imgInp.files

        if (file) {
            display.src = URL.createObjectURL(file);
            hideElement(document.querySelector('#no-file'));
        }
    }
}


function collapseHeader(el) {
    el.classList.add('selected');
    var headerClasses = document.querySelector('#heading').classList;
    if (headerClasses.contains('hidden')) {
        headerClasses.remove('hidden');
        el.setAttribute('title', 'Collapse Header');
    } else {
        headerClasses.add('hidden');
        el.setAttribute('title', 'Expand Header');
    }
}

let dropdownSet = [];

function setDropdownFunctions() {
    document.querySelectorAll('.js-dd-ctnr').forEach(container => {
        if (!dropdownSet.includes(container.id)) {
            dropdownSet.push(container.id);
            const { id } = container;
            const dropLabel = id.split('-')[0];
            const dropClass = `.js-${dropLabel}-dd`;
            let num = 0;

            document.querySelectorAll(dropClass).forEach(dropdown => {
                hideElement(dropdown.children[1])
                dropdown.children[0].classList.remove('selected');
                dropdown.children[0].children[1].classList.remove('rotate180');
                dropdown.id = `${dropLabel}-dd-${num}`;

                dropdown.children[0].addEventListener('click', () => {
                    dropdown.children[1].classList.toggle('hidden');
                    dropdown.children[0].classList.toggle('selected');
                    dropdown.children[0].children[1].classList.toggle('rotate180');

                    document.querySelectorAll(dropClass).forEach(drop => {
                        if (dropdown != drop) hideElement(drop.children[1]);
                        if (dropdown != drop) drop.children[0].classList.remove('selected');
                        if (dropdown != drop) drop.children[0].children[1].classList.remove('rotate180');
                    });
                });
            });
            try { dropdownsSet.push(id); } catch (error) {}
        }
    });
}


// Settings
let currentSettings = {
    mode: 'darkmode',
    animations: true,
    font: 'roboto',
    lineSpacing: '6',
    fontSize: '5',
    hover: true,
    backgroundSolid: false,
    pallette: 'secondary',
    notifications: true
};

var settingsCookie = getCookie('settings');
if (settingsCookie) currentSettings = JSON.parse(settingsCookie);

function allSettings(currentSettings) {
    // Notifications
    var notifSwitch = document.querySelector('#setting-notifications');
    notifSwitch.checked = currentSettings.notifications;

    notifSwitch.addEventListener('change', () => {
        showElement(document.querySelector('#settings-cookie'));
        currentSettings.notifications = notifSwitch.checked;
        createNotification('Settings: Notifications have been turned on')
    });

    // primary/secondary
    var palletteSwitch = document.querySelector('#setting-pallette');
    bodyClasses.add(currentSettings.pallette);
    palletteSwitch.checked = currentSettings.pallette == "primary";

    palletteSwitch.addEventListener('change', () => {
        showElement(document.querySelector('#settings-cookie'));
        if (palletteSwitch.checked) {
            bodyClasses.replace('secondary', 'primary');
            currentSettings.pallette = "primary";
            createNotification('Pallette: Primary');
        } else {
            bodyClasses.replace('primary', 'secondary');
            currentSettings.pallette = "secondary";
            createNotification('Pallette: Secondary');
        }
    });

    // Light/darkmode
    var modeSwitch = document.querySelector('#setting-darkmode');
    bodyClasses.add(currentSettings.mode);

    modeSwitch.checked = currentSettings.mode == "darkmode";
    modeSwitch.addEventListener('change', () => {
        showElement(document.querySelector('#settings-cookie'));
        if (modeSwitch.checked) {
            bodyClasses.replace('lightmode', 'darkmode');
            currentSettings.mode = "darkmode";
            createNotification('Settings: Darkmode is on');
        } else {
            bodyClasses.replace('darkmode', 'lightmode');
            currentSettings.mode = "lightmode";
            createNotification('Settings: Lightmode is on');
        }
    });

    // Hover
    var hoverSwitch = document.querySelector('#setting-hover_audio');
    hoverSwitch.checked = currentSettings.hover;

    hoverSwitch.addEventListener('change', () => {
        showElement(document.querySelector('#settings-cookie'));
        if (hoverSwitch.checked) {
            createNotification("Settings: Sample audio will play on hover");
            play = true;
        } else {
            createNotification("Settings: Sample audio won't play on hover");
            play = false;
        }
        currentSettings.hover = hoverSwitch.checked;
    });

    // Animations
    var animationsSwitch = document.querySelector('#setting-animations');
    animationsSwitch.checked = currentSettings.animations;

    if (!currentSettings.animations) {
        bodyClasses.add('no_animation');
    }

    animationsSwitch.addEventListener('change', () => {
        showElement(document.querySelector('#settings-cookie'));
        bodyClasses.toggle('no_animation');
        currentSettings.animations = animationsSwitch.checked;
        if (currentSettings.animations) {
            createNotification('Settings: Animations are on');
        } else {
            createNotification('Settings: Animations are off');
        }
    });

    // Font Size
    var sizeSlider = document.querySelector('#setting-font_size');
    sizeSlider.value = currentSettings.fontSize;
    bodyClasses.add(`font_size-${currentSettings.fontSize}`);

    sizeSlider.addEventListener('input', () => {
        showElement(document.querySelector('#settings-cookie'));
        bodyClasses.replace(`font_size-${currentSettings.fontSize}`, `font_size-${sizeSlider.value}`);
        currentSettings.fontSize = sizeSlider.value;
        createNotification(`Settings: Font size + ${sizeSlider.value}`);
    });

    // Line Spacing
    var spacingSlider = document.querySelector('#setting-line_spacing');
    spacingSlider.value = currentSettings.lineSpacing;
    bodyClasses.add(`line_spacing-${currentSettings.lineSpacing}`);

    spacingSlider.addEventListener('input', () => {
        showElement(document.querySelector('#settings-cookie'));
        bodyClasses.replace(`line_spacing-${currentSettings.lineSpacing}`, `line_spacing-${spacingSlider.value}`);
        currentSettings.lineSpacing = spacingSlider.value;
        createNotification(`Settings: Line spacing + ${spacingSlider.value}`);
    });

    // Font
    var fontDropdown = document.querySelector('#setting-font');
    bodyClasses.add(`font-${currentSettings.font}`);
    fontDropdown.value = currentSettings.font;

    fontDropdown.addEventListener('input', () => {
        showElement(document.querySelector('#settings-cookie'));
        bodyClasses.replace(`font-${currentSettings.font}`, `font-${fontDropdown.value}`);
        currentSettings.font = fontDropdown.value;
        createNotification(`Settings: Font is now_${currentSettings.font}`);
    });

    var backgroundSwitch = document.querySelector('#setting-background_color');
    backgroundSwitch.checked = currentSettings.backgroundSolid;
    if (currentSettings.backgroundSolid) {
        bodyClasses.add('solid_backgrounds');
    }

    backgroundSwitch.addEventListener('change', () => {
        showElement(document.querySelector('#settings-cookie'));
        bodyClasses.toggle('solid_backgrounds');
        currentSettings.backgroundSolid = backgroundSwitch.checked;

        if (currentSettings.backgroundSolid) {
            createNotification('Settings: All backgrounds are solid');
        } else {
            createNotification('Settings: All backgrounds are default');
        }
    });
}

function dyslexiaSettings() {
    var modeSwitch = document.querySelector('#setting-darkmode');
    modeSwitch.checked = true;
    bodyClasses.replace(currentSettings.mode, 'darkmode');
    currentSettings.mode = "darkmode";

    var palletteSwitch = document.querySelector('#setting-pallette');
    palletteSwitch.checked = true;
    bodyClasses.replace(currentSettings.pallette, 'primary');
    currentSettings.pallette = "primary";

    var backgroundSwitch = document.querySelector('#setting-background_color');
    backgroundSwitch.checked = true;
    currentSettings.backgroundSolid = true;
    bodyClasses.add('solid_backgrounds');

    var fontDropdown = document.querySelector('#setting-font');
    fontDropdown.value = "roboto";
    bodyClasses.replace(`font-${currentSettings.font}`, 'font-roboto');
    currentSettings.font = "roboto";

    var spacingSlider = document.querySelector('#setting-line_spacing');
    spacingSlider.value = 12;
    bodyClasses.replace(`line_spacing-${currentSettings.lineSpacing}`, 'line_spacing-12');
    currentSettings.lineSpacing = 12;

    var sizeSlider = document.querySelector('#setting-font_size');
    sizeSlider.value = 5;
    bodyClasses.replace(`font_size-${currentSettings.fontSize}`, 'font_size-5')
    currentSettings.fontSize = 5;

    var animationsSwitch = document.querySelector('#setting-animations');
    animationsSwitch.checked = false;
    bodyClasses.add('no_animation');
    currentSettings.animations = false;

    createNotification('Settings: Dyslexia settings turned on');
}

let numNotifs = 1;

function createNotification(message) {
    if (!currentSettings.notifications) {
        return;
    }

    message = replaceDelimiter(message, '_');
    var notifs = document.querySelector('#notifications');

    var div = document.createElement('div');
    div.classList.add('notification');
    div.classList.add('animate__animated');
    div.classList.add('animate__fadeIn');
    div.id = "notification-" + numNotifs;
    numNotifs++;

    var h5 = document.createElement('h5');
    h5.classList.add('notification-message');
    h5.innerText = message;
    div.appendChild(h5);

    div.addEventListener('animationend', () => {
        setTimeout(() => {
            removeNotification(div.id);
        }, 1000);
    });

    notifs.appendChild(div);
}

function removeNotification(id) {
    var notification = document.getElementById(id)
    notification.classList.remove('animate__fadeIn');
    notification.classList.add('animate__fadeOutUp');

    notification.addEventListener('animationend', () => {
        notification.remove();
    });
}


let projectNavigationSet = false;

function setProjectsNavigation() {
    // if (!projectNavigationSet) {
    document.querySelectorAll(".project-navbutton").forEach(projectButton => {
        projectButton.addEventListener('click', () => {
            document.querySelectorAll('.project').forEach(project => {
                hideElement(project);
            });

            let projectId = projectButton.dataset.project;
            currentProject = projectId;
            let projectEl = document.querySelector(`#project-${projectId}`);
            showElement(projectEl);
        });
    });

    projectNavigationSet = true;
    // }
    try { populateProject(); } catch (err) {}
}

function populateProject() {
    let projectEl = document.querySelector(`#project-${currentProject}`);
    showElement(projectEl);
    setSlideshowScripts();
    fullScreenPDF();
}

function setAboutProjectButtons() {
    document.querySelectorAll("[data-project]").forEach(link => {
        link.addEventListener('click', () => {
            currentProject = link.getAttribute('data-project');
        });
    })
}

function setCompositionScripts() {
    document.querySelectorAll('.card_transparent_cover').forEach(card => {
        card.addEventListener('mouseover', () => {
            playSound(card.dataset.audio);
        });

        card.addEventListener('mouseout', () => {
            stopSound(card.dataset.audio);
        });
    });
}

let openPops = [];
let closePops = [];

function setPopupFunctions() {
    // console.log('seting popup functions');
    document.querySelectorAll('.open-popup').forEach(openPop => {
        if (!openPops.includes(openPop)) {
            // console.log(openPop);
            openPop.addEventListener('click', () => {
                openPopup(`${openPop.dataset.popup}-popup`);
                // console.log(`Opening popup: ${openPop.dataset.popup}`);
            });

            openPops.push(openPop);
        }
    });
    document.querySelectorAll('.close-popup').forEach(closePop => {
        if (!closePops.includes(closePop)) {
            // console.log(closePop);
            closePop.addEventListener('click', () => {
                closePopup(`${closePop.dataset.popup}-popup`);
                // console.log(`Closing popup: ${closePop.dataset.popup}`)
            });

            closePops.push(closePop);
        }
    });
}

let formPops = [];

function setPopulateFormScripts() {
    // console.log('setting form scripts');
    document.querySelectorAll('[data-form]').forEach(formPop => {
        if (!formPops.includes(formPop.dataset.form)) {
            formPop.addEventListener('click', () => {
                let formJSON = formPop.dataset.form;
                let formObj = JSON.parse(formJSON);
                const { data, formID } = formObj;
                // console.log(formID);

                let form = document.querySelector(`form#${formID}`);
                for (var dataName in data) {
                    if (dataName == 'checkboxes') {
                        let { checkboxes } = data;

                        for (var checkbox in checkboxes) {
                            try {
                                form.querySelector(`[name="${checkbox}"]`).checked = checkboxes[checkbox] == 1;
                            } catch (err) { console.error(err) }
                        }
                        continue;
                    }

                    try {
                        form.querySelector(`[name="${dataName}"]`).value = decodeURI(data[dataName]);
                    } catch (err) { console.error(err) }
                }
            });
            formPops.push(formPop.dataset.form);
        }
    })
}

function setCookieCode() {
    const cookie = getCookie('settings');
    if (!cookie) document.querySelector('#cookie-code').innerText = '// You have no cookie';
    else document.querySelector('#cookie-code').innerText = `Your cookie looks like this: ${cookie}`;
}

let setForms = [];

function setFormScripts() {
    document.querySelectorAll('form').forEach(form => {
        if (!form.classList.contains('default')) {
            if (form.getAttribute('action') == "/admin/new-transaction") {
                setTransactionFormScript(form);
                return;
            } else if (!setForms.includes(form)) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    let formObj = {};

                    for (var pair of formData.entries()) {
                        formObj[pair[0]] = encodeURI(pair[1]);
                    }

                    let url = form.getAttribute('action');

                    fetch(url, {
                            method: "POST",
                            body: JSON.stringify(formObj),
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": 'application/json, text/plain, */*'
                            }
                        })
                        .then(res => { return res.json() })
                        .then(json => {
                            if (json.status == "failed") {
                                createNotification(json.msg);
                                if (json.recUsername) document.querySelector('[name="username"]').value = json.recUsername;
                            } else if (json.satus == "blocked") alert(json.msg);
                            else if (json.satus == "success-msg") { createNotification(json.msg); return } else location.pathname = json.url;
                        });
                });
                setForms.push(form);
            }
        }
    });
}

function setTransactionFormScript(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.querySelectorAll('input').forEach(input => {
            console.log(input);
        });
    });
}



function hideElement(el) {
    el.classList.add('hidden');
}

function showElement(el) {
    el.classList.remove('hidden');
}

function setToAccountButton() {
    try {
        document.querySelector('#to-my-account').addEventListener('click', (e) => {
            e.preventDefault();
            const username = getCookie('username');
            // console.log(username);
            location.pathname = `/account/my-account/${username}`;
        })
    } catch (err) {}
}

let setLogs = [];

function populateLogScripts() {
    document.querySelectorAll('.populate-log').forEach(logRow => {
        if (!setLogs.includes(logRow.id)) {
            logRow.addEventListener('click', () => {
                let { log } = logRow.dataset;
                log = JSON.parse(log);
                for (var x in log) {
                    document.querySelector(`#log-${x}`).innerText = decodeURI(log[x]);
                }
            })
            setLogs.push(logRow.id);
        }
    })
}

function passwordStrengthCheck() {
    let timeout;
    let password = document.getElementById('create_password');
    let strengthBadge = document.getElementById('password_strength');

    password.addEventListener("input", () => {
        strengthBadge.style.display = 'block';
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            const PasswordParameter = password.value;
            let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
            let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');

            if (strongPassword.test(PasswordParameter)) {
                strengthBadge.classList.add('strong');
                strengthBadge.classList.remove('medium');
                strengthBadge.classList.remove('weak');
                strengthBadge.textContent = 'Strength: Strong';
            } else if (mediumPassword.test(PasswordParameter)) {
                strengthBadge.classList.add('medium');
                strengthBadge.classList.remove('weak');
                strengthBadge.classList.remove('strong');
                strengthBadge.textContent = 'Strength: Medium';
            } else {
                strengthBadge.classList.add('weak');
                strengthBadge.classList.remove('medium');
                strengthBadge.classList.remove('strong');
                strengthBadge.textContent = 'Strength: Weak';
            }
        }, 500);

        if (password.value.length !== 0) {
            showElement(strengthBadge);
        } else {
            hideElement(strengthBadge);
        }
    });
}

function getCookie(key) {
    const { cookie } = document;
    let cookieObj = {};
    cookie.split('; ').map(c => {
        let k = c.split('=')[0],
            v = decodeURI(c.split('=')[1]);
        cookieObj[k] = v;
    });
    return cookieObj[key];
}


// var loadingTask = PDFJS.getDocument('/test.pdf');
// loadingTask.promise.then(
//     function (pdf) {
//         pdf.getPage().then(function (page) {
//             var scale = 1,
//             viewport = page.getViewport(scale);

//             var canvas = document.querySelector('canvas#composition_pdf');
//             var context = canvas.getContext('2d');
//             canvas.height = viewport.height;
//             canvas.width = viewport.width;

//             var renderContext = {
//                 canvasContext: context,
//                 viewport: viewport
//             }
//             page.render(renderContext).then(function () {
//                 console.log('page rendered!');
//             })
//         })
//     },
//     function (reason) {
//         console.error(reason);
//     }
// )