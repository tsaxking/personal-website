const fs = require('fs');
const path = require('path');
const { getJSONSync, getTemplateSync } = require('./files');
const { render } = require('node-html-constructor').v3;



const builder = {
    // put your pages here:
    /*
    example:
        '/account': async (req: Request) => {
            const { account } = req.session;

            if (account) {
                const template = await getTemplate('account', account); // uses node-html-constructor if you pass in the second parameter
                return template;
            }

            return 'You are not logged in.';
        }
    */

        'Compositions': () => {
            const compositions = getJSONSync('compositions');
    
            const cstr1Opts = {};
            const cstr2Opts = {};
    
            cstr1Opts.compositionTypes = Object.keys(compositions).map((type, i) => {
                cstr2Opts['compositions-' + i] = compositions[type].map(c => {
                    if (!c.display) return;
                    return {
                        ...c,
                        compositionTitle: c.title,
                        disableSample: c.sampleAvailable ? '' : 'disabled'
                    }
                }).filter(c => c);
                return {
                    compositionType: type,
                    pos: i
                }
            });
    
            return render(render(getTemplateSync('compositions'), cstr1Opts), cstr2Opts);
        },
        "About Me": () => {
                const html = getTemplateSync('about/about-me');
                const about = getJSONSync('about-me');
    
                const generateLink = (link, text) => {
                    return `<a href="${link}" ${link.includes('mailto') ? '' : 'target="blank"'}>${text}</a>`;
                }
    
                const generateList = (list) => {
                        return `
                        <ul>
                            ${list.map(item => `<li>${generateSection(item)}</li>`).join('')}
                        </ul>
                    `;
                }
    
                const generateSection = (section) => {
                    const {list, link, text, description } = section;
                    return `
                        ${link ? generateLink(link.url, link.text) : text} ${description ? '| ' + description : ''}
                        ${list ? generateList(list) : ''}
                    `;
                }
    
                const cstrOpts = {
                    aboutAccordion: Object.keys(about).map((key) => {
                        return {
                            accordionHeading: key,
                            accordionContent: generateList(about[key]),
                            accordionLowercaseHeading: key.toLowerCase().replace(new RegExp(' ', 'g'), '-')
                        }
                    })
                };
    
                return render(html, cstrOpts);
        },
        'Portfolio': () => {
            const html = getTemplateSync('about/portfolio');
    
            const cstrOpts = {
                allCompositions: Object.values(getJSONSync('compositions')).flat().map(c => ({
                    compositionTitle: c.title,
                    compositionSubtitle: c.subtitle,
                    imageSrc: c.picture
                })),
                allProjects: Object.entries(getJSONSync('projects')).map(([title, info]) => ({
                    projectTitle: title,
                    projectSubtitle: info.subtitle,
                    imageSrc: info.picture
                })),
                // allEvents: Object.entries(getJSON('/events')).map(([title, info]) => ({
                //     eventTitle: title,
                //     eventSubtitle: info.subtitle,
                //     imageSrc: info.picture
                // }))
            };
    
            return render(html, cstrOpts);
        },
        '!CompositionDisplay': (composition) => {
            const html = getTemplateSync('compositions/display');
            const cstrOpts = {
                ...composition,
                compositionDescription: composition.description,
                isComposition: composition.composition,
                compositionTitle: composition.title,
                compositionSubtitle: composition.subtitle,
                audio: composition.audio,
                compositionVideos: composition.videos
            };
            return render(html, cstrOpts);
        },
        '!Film': (film) => {
            const { date, madeFor, html, inProgress } = film;
    
            const filmHTML = getTemplateSync('film');
    
            return render(filmHTML, {
                filmSubtitle: date,
                filmDescription: `Made for: ${madeFor} <br> ${inProgress ? `<span class="text-danger">This is in progress, the video will be available once it is complete!</span>` : ""}`,
                filmVideo: html || ""
            });
        }
};




module.exports = builder;