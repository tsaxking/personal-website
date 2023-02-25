class FIRSTTeam {
    /**
     * Creates a new team object
     * @param {number} teamNumber The team's number
     * @param {string} name The nickname of the team
     * @param {object} param2 
     * @param {[FIRSTMatch]} param2.matches An array of all matches for the event the team was in (the team will automatically filter through the matches and only sotre the ones where the team actually played in the match)
     * @param {Object} param2.event For now this is just an object containing { key: <event key> }
     */
    constructor(teamNumber, name, { matches, event, info, tatorInfo }) {
        this.number = teamNumber;
        this.name = name;
        this.tatorInfo = tatorInfo;

        // Sets matches to either the matches array given or the event's matches
        this.matches = Array.isArray(matches) ? matches : (event ? event.matches : []);
        // Removes any matches that don't have this team in the match
        this.matches = this.matches.filter(m => m.hasTeam(teamNumber));

        // pulls match scouting data for the team
        this.matchScouting = matches.map(m => {
            if (m.teamsMatchScouting && m.teamsMatchScouting[teamNumber]) return m.teamsMatchScouting[teamNumber]
        }).filter(m => m);

        this.eventKey = event ? event.key : "";
        // Info contains all the tba data on the team
        this.info = info;
        this._heatmap;

        this.matchesObj = this.matches.reduce((obj, match) => {
            obj[match.key] = match;
            return obj;
        }, {});
    }

    // TODO: remove the getter and set it to a constant value after it is getted example:https://stackoverflow.com/questions/46832418/javascript-and-memoized-getters?adlt=strict&toWww=1&redig=791EFADA44834E5085283EA37EB28A22
    get heatmap() {
        // returns this teams heatmap if it is already cached otherwise it gets the heatmap and caches it
        if (this._heatmap) return this._heatmap;
        // this will return a promise
        return this.setHeatmap();
    }

    get rankingPoints() {
        return this.matches.reduce((total, match) => {
            const alliance = match.hasTeam(this.number);
            return total + match.scoreBreakdown[alliance].rp;
        }, 0);
    }

    /**
     * Fetches the heatmap from the server caches it on the team. you can't put it in the getter because it is async
     * @returns {Promise || Heatmap}
     */
    async setHeatmap() {
        const heatmapData = await Heatmap.fetchHeatmapDataFromServer(this.number, this.eventKey);
        this._heatmap = new Heatmap(heatmapData);
        return this._heatmap;
    }

    /**
     * Gets the info for a specific match 
     * @param {number} matchNumber the number of the match that you want to find the info of
     * @param {string} compLevel the comp level of the match that you want to find the info of
     * @returns {FIRSTMatch}
     */
    matchInfo(matchNumber, compLevel) {
        return this.matches.find(m => m.number === matchNumber && m.compLevel == compLevel).teams[this.number];
    }

    // drawHeatmap(canvas, segments) {
    //     const ctx = canvas.getContext('2d');
    //     const {
    //         heatmaps
    //     } = this;
    //     let heatmap = [];
    //     segments.forEach(s => {
    //         heatmap = [...heatmap, ...heatmaps[s]];
    //     });

    //     // Getting the width and height of each square that will be drawn
    //     const squareWidth = 1 / 100 * canvas.width;
    //     const squareHeight = 1 / 50 * canvas.height;
    //     // Getting the highest value in the trace array
    //     const max = Math.max(...heatmap.map(e => e[2]));
    //     const average = (heatmap.reduce((a, b) => a + b[2], 0) / heatmap.length);

    //     const findColor = (value) => {
    //         const ratio = value / max;
    //         let r, g, b;
    //         let scale = ratio * (max / average) ** .6;

    //         if (ratio < average / max) {
    //             r = 0;
    //             // g = ratio * max / average;
    //             g = scale;
    //             b = 1 - g;
    //         } else if (ratio > average / max) {
    //             // g = (ratio - average / max) * max / average;
    //             b = 0;
    //             r = scale;
    //             g = 1 - r;
    //         } else {
    //             r = 0;
    //             g = 1;
    //             b = 0;
    //         }
    //         return `rgba(${r*255},${g*255},${b*255},${(scale ** .5) * .75})`;
    //     }

    //     heatmap = heatmap.map(p => {
    //         if (!Array.isArray(p)) return [p.x, p.y, p.value];
    //     });


    //     heatmap.forEach(p => {
    //         // Setting the redness of each heatmap pixel to how many times the robot has been in each place compared to the rest of the graph
    //         ctx.fillStyle = p[2] / average * heatmap.length > .05 ? findColor(p[2]) : `rgba(0,0,0,0)`;
    //         // Getting the x and y positions for this pixel
    //         let x = p[0] / 100 * canvas.width;
    //         let y = p[1] / 50 * canvas.height;
    //         // Drawing the pixel
    //         ctx.fillRect(x, y, squareWidth, squareHeight);

    //     });
    // }

    /**
     * Draws the trace for a specific match onto a canvas
     * @param {HTMLElement} canvas The canvas to draw the trace onto
     * @param {number} matchNumber the number of the match that you want to draw the trace for
     * @param {string} compLevel the comp level of the match that you want to draw the trace for
     */
    drawTrace(canvas, matchNumber, compLevel) {
        const ctx = canvas.getContext('2d');
        this.matches.find(m => m.number === matchNumber && m.compLevel == compLevel).drawTrace(ctx, this.number);
    }

}