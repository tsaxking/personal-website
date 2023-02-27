const fs = require('fs');
const path = require('path');
const { getJSON, getTemplate } = require('./get-file');
const { render } = require('node-html-constructor').v3;

const builder = {
        'Compositions': () => {
            const compositions = getJSON('/compositions');

            const cstr1Opts = {};
            const cstr2Opts = {};

            cstr1Opts.compositionTypes = Object.keys(compositions).map((type, i) => {
                cstr2Opts['compositions-' + i] = compositions[type].map(c => {
                    return {
                        ...c,
                        compositionTitle: c.title
                    }
                });
                return {
                    compositionType: type,
                    pos: i
                }
            })

            return render(render(getTemplate('/compositions'), cstr1Opts), cstr2Opts);
        },
        "About Me": () => {
                const html = getTemplate('/about/about-me');
                const about = getJSON('/about-me');

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
        const html = getTemplate('/about/portfolio');

        const cstrOpts = {
            allCompositions: Object.values(getJSON('/compositions')).flat().map(c => ({
                compositionTitle: c.title,
                compositionSubtitle: c.subtitle,
                imageSrc: c.picture
            })),
            allProjects: Object.entries(getJSON('/projects')).map(([title, info]) => ({
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
    }
};




module.exports = builder;