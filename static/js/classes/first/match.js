class FIRSTMatch {
    /**
     * Creates a new match with match data and match scouting data as well as custom methods
     * @param {Object} match The blue alliances info on the match
     * @param {Array} matchScouting An array of the different match scouting for each team
     * @param {Array[FIRSTTeam]} teams An array of the teams in the match
     */
    constructor(match, matchScouting, teams) {
        const camelCaseMatch = convertToCamelCase(match);

        Object.keys(camelCaseMatch).forEach(key => {
            this[key] = camelCaseMatch[key];
        })

        // const letters = match.key.split(/\d/).filter(e => e && e != "_");
        const numbers = match.key.split(/[a-z]/).filter(e => e && e != "_");
        // const compLevel = letters[0].split(/^[^_]*_/)[0];

        this.matchNumber = numbers[1];

        this.teamsMatchScouting = {};
        if (matchScouting && Array.isArray(matchScouting) && matchScouting.length) {
            matchScouting.forEach(teamSpecificMatchScouting => {
                teamSpecificMatchScouting.trace = Object.getPrototypeOf(teamSpecificMatchScouting.trace) == String ? new rd_Trace(JSON.parse(teamSpecificMatchScouting.trace)) : teamSpecificMatchScouting.trace;
                Object.keys(teamSpecificMatchScouting).forEach(k => {
                    try {
                        teamSpecificMatchScouting[k] = JSON.parse(teamSpecificMatchScouting[k]);
                    } catch {}
                });
                this.teamsMatchScouting[teamSpecificMatchScouting.teamNumber] = teamSpecificMatchScouting;
            });
        }

        this.teams = teams;
    }

    async getTeamInfo() {
        const red = this.alliances.red.teamKeys.map(t => t.slice(3));
        const blue = this.alliances.blue.teamKeys.map(t => t.slice(3));

        this.teamsMatchScouting = {};
        const matchScouting = await requestFromServer({
            url: '/events/get-match-data',
            method: 'POST',
            body: {
                teamNumbers: [...red, ...blue],
                eventKey: this.eventKey,
                matchNumber: this.matchNumber,
                compLevel: this.compLevel
            }
        });

        matchScouting.forEach(teamSpecificMatchScouting => {
            teamSpecificMatchScouting.trace = Object.getPrototypeOf(teamSpecificMatchScouting.trace) == String ? new rd_Trace(JSON.parse(teamSpecificMatchScouting.trace)) : teamSpecificMatchScouting.trace;
            this.teamsMatchScouting[teamSpecificMatchScouting.teamNumber] = teamSpecificMatchScouting;
        });

        return this.teamsMatchScouting;
    }

    setTeamInfo(match) {
        this.teamsMatchScouting = match.teams;
    }

    hasTeam(number) {
        number = number + "";
        let red = this.alliances.red.teamKeys.map(t => t.slice(3)).includes(number) ? 'red' : false;
        let blue = this.alliances.blue.teamKeys.map(t => t.slice(3)).includes(number) ? 'blue' : false;

        return red || blue;
    }

    get winner() {
        switch (this.winningAlliance) {
            case 'red':
                return 'red';
            case 'blue':
                return 'blue';
            default:
                return 'tie';
        }
    }

    /**
     * 
     * @param {Object} tbaMatch The match object from TBA 
     * @returns {Array[Number]} An array of the teams in the match
     */
    static getTeamsAsArray(tbaMatch) {
        const red = tbaMatch.alliances.red.team_keys.map(t => +t.slice(3));
        const blue = tbaMatch.alliances.blue.team_keys.map(t => +t.slice(3));

        return [...red, ...blue];
    }
}