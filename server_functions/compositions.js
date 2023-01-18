'use strict';

const { Router } = require('express');
const fs = require('fs');
const HTMLConstructor = require('./html_constructor');

const locations = require("../locations");

const { temp, stat, root } = locations;

let rawData = fs.readFileSync('static/composition_information.json').toString();
const compInfo = JSON.parse(rawData);

let compositions = [];

const router = Router();

for (var comp in compInfo.my_compositions) {
    compositions.push({ id: comp, title: compInfo.my_compositions[comp].title });
}


router.get("/", (req, res) => {
    console.log('shit');
    compFunctions.populateAssortments(req, res);
});

router.get("/display:id", (req, res) => {
    const { id } = req.params;
    try {
        compFunctions.compDisplay(id.split(':')[1], res);
    } catch (error) {
        console.error(error);
        res.status(404).send(`<h3 class="center"><span class="note">404 Composition not found:</span>There is no composition of that ID or name :(</h3>`);
    }
});

const compFunctions = {
    location: `/static/compositions/`,
    compDisplay: function(compId, res) {
        let html = fs.readFileSync(`${temp}/composition/display.html`);
        let blankHTML = fs.readFileSync(`${temp}/blank.html`).toString();

        if (compId.split("_")[1] == undefined) {
            var tempComp = compositions.find((tempComp) => tempComp.title.toLowerCase() == compId.toLowerCase());
            compId = tempComp.id;
        }

        var composition = compInfo.my_compositions[compId];
        // var replaceArray = 
        // var html = HTMLConstructor.render("composition/display.html", replaceArray);
        // console.log(compId);
        var composition = compInfo.my_compositions[compId];
        // if (composition.composer_if_arranged != null) {
        //     html = HTMLConstructor.replaceToken('composer_if_arranged', ` composed by: ${composition.composer_if_arranged}`, html)
        // } else {
        //     html = HTMLConstructor.replaceToken('composer_if_arranged', '', html);
        // }
        // if (composition.popup === true) {
        //     html = HTMLConstructor.replaceToken('disclaimer_status', '', html);
        // } else {
        //     html = HTMLConstructor.replaceToken('disclaimer_status', 'hidden', html)
        // }
        console.log(composition);

        const constructorOptions = {
            replaceArray: [
                ['subpage', html],
                ['title', composition.title],
                ['youtube', composition.youtube],
                ['subtitle', composition.subtitle],
                ['description', composition.description],
                ['pdf', `${this.location}${compId}`],
                ['audio', `${this.location}${compId}`]
            ],
            ifConditions: [
                { token: "composer_if_arranged", valueIfTrue: ` composed by: ${composition.composer_if_arranged}`, valueIfFalse: '', condition: composition.composer_if_arranged != null },
                { token: "disclaimer_status", valueIfTrue: "", valueIfFalse: "hidden", condition: composition.popup }
            ],
            sendToClient: true
        }

        let constructor = new HTMLConstructor(null, res, blankHTML, constructorOptions);
        return constructor.render();
    },
    populateAssortments: function(req, res) {
        var compositions = compInfo.my_compositions;
        var ensemblesUsed = []; // same length as assortments, titles of each
        var assortments = []; // htmls
        var iteration = 1;

        for (var id in compositions) {
            let assortment;
            var assortmentExists = false;

            if (compositions[id].display) {
                var splitId = id.split('_');
                var ensemble = compInfo.composition_keys.ensembles[splitId[0]];

                if (iteration == 1) {
                    assortment = this.newAssortment(ensemble);
                    ensemblesUsed.push(splitId[0]);
                } else {
                    if (ensemblesUsed.includes(splitId[0])) {
                        // Assortment already exists
                        assortment = assortments[ensemblesUsed.indexOf(splitId[0])];
                        assortmentExists = true;
                    } else {
                        // New horizontal assortment
                        assortment = this.newAssortment(ensemble);
                        ensemblesUsed.push(splitId[0]);
                    }
                }
                // Populate last assortment
                assortment = this.populateAssortment(assortment, id);

                if (assortmentExists) {
                    assortments[ensemblesUsed.indexOf(splitId[0])] = assortment;
                } else {
                    assortments.push(assortment);
                }
            }
            iteration++;
        }

        let blankHTML = fs.readFileSync(`${temp}/blank.html`).toString();
        let str = '';
        let html = fs.readFileSync(`${temp}/my-compositions.html`).toString();

        assortments.map(assortment => {
            assortment = assortment.replace('@CARD@', '');
            str = str + assortment;
        });

        const constructorOptions = {
            replaceArray: [
                ['subpage', html],
                ['assortments', str]
            ],
            sendToClient: true
        }

        let constructor = new HTMLConstructor(req, res, blankHTML, constructorOptions);
        return constructor.render();
    },
    newAssortment: function(ensemble) {
        var assortment = fs.readFileSync(`${temp}/composition/assortment.html`).toString();
        return assortment.replace('@ENSEMBLE@', ensemble);
    },
    populateAssortment: function(assortment, id) {
        // console.log(assortment)
        let card = fs.readFileSync(`${temp}/composition/card.html`).toString();
        // console.log(assortment);
        let ensemble = compInfo.my_compositions[id].ensemble;
        // console.log(ensemble);

        const constructorOptions = {
            replaceArray: [
                ['id', id],
                ['title', compInfo.my_compositions[id].title]
            ],
            sendToClient: false,
            ifConditions: [
                { token: "ensemble", valueIfTrue: `(${compInfo.my_compositions[id].ensemble})`, valueIfFalse: '', condition: compInfo.my_compositions[id].ensemble != "" }
            ]
        }

        let constructor = new HTMLConstructor(null, null, card, constructorOptions)
        card = constructor.render();
        assortment = assortment.replace('@CARD@', card);
        return assortment;
    }
}


module.exports = router;