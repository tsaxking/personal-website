class FIRSTEvent {
    /**
     * Converts a bunch of teams and matches for an event into FIRSTTeams and FIRSTMatches so that you can pass them into the FIRSTEvent constructor. This is separate from the constructor because the constructor is async
     * @param {[Object]} teams An array of team objects from the blue alliance
     * @param {[Object]} matches An array of match objects from the blue alliance
     * @param {String} eventKey The event key of the event these teams and matches are from
     * @returns 
     */
    static async convertToClasses(teams, matches, eventKey) {
        let _matches = [],
            __teams = [];
        if (!matches || !Array.isArray(matches) || !matches.length) console.warn("Matches is empty");
        else {
            // Gets all match scouting for the entire event
            const {
                matches: _matchScouting,
                teams
            } = await requestFromServer({
                url: '/events/get-event-scouting',
                method: 'POST',
                body: {
                    eventKey: eventKey
                }
            });

            // Converts all the match scouting and match data into FIRSTMatches
            _matches = matches.map(match => {
                // TODO: use regex to do this because the way this currently works is very bad
                const matchScouting = match.comp_level == "qm" ? _matchScouting.filter(scouting => scouting.eventKey + "_" + scouting.compLevel + scouting.matchNumber == match.key) : [];

                const matchTeams = FIRSTMatch.getTeamsAsArray(match);

                const m = new FIRSTMatch(match, matchScouting, matchTeams);
                return m;
            });

            __teams = teams;
        }

        // Converts teams into FIRSTTeams
        const _teams = teams.map(team => {
            const foundTeam = __teams.find(t => t.number == team.team_number);
            const t = new FIRSTTeam(
                team.team_number,
                team.nickname, {
                    matches: _matches,
                    event: {
                        key: eventKey
                    },
                    info: team,
                    tatorInfo: foundTeam ? {
                        ...foundTeam,
                        heatmap: new Heatmap(JSON.parse(foundTeam.heatmap)),
                        preScouting: JSON.parse(foundTeam.preScouting),
                        pitScouting: JSON.parse(foundTeam.pitScouting)
                    } : {}
                });

            // Adds matches onto the team in case it didn't have any (though the same thing is done inside the team constructor so I'm not sure why it's here)
            if (!Array.isArray(t.matches) || !t.matches.length) {
                t.matches = _matches.filter(m => m.hasTeam(t.number));
            }

            return t;
        });

        _matches = _matches.map(m => {
            m.teams = m.teams.map(t => _teams.find(team => team.number == t));

            m.teamsObj = {
                red1: m.teams[0],
                red2: m.teams[1],
                red3: m.teams[2],
                blue1: m.teams[3],
                blue2: m.teams[4],
                blue3: m.teams[5]
            }
            return m;
        });

        return {
            teams: _teams,
            matches: _matches
        };
    }

    constructor(eventKey, teams = [], matches = [], info = {}) {
        this.key = eventKey;
        this.teams = teams;
        this.matches = matches; //.map(m => new FIRSTMatch(m));
        this.info = convertToCamelCase(info);

        this.matchesObj = this.matches.reduce((acc, match) => {
            acc[match.key] = match;
            return acc;
        }, {});

        this.teamsObj = this.teams.reduce((acc, team) => {
            acc[team.number] = team;
            return acc;
        }, {});
    }

    get preScoutQuestions () {
        Object.defineProperty(this, "preScoutingQuestions", { value: (async () => {
            return await requestFromServer({
                url: "robot-display/get-pre-scout-questions",
                body: {
                    eventKey: this.key,
                }
            });
        })(), writable: true });
        
        return this.preScoutingQuestions;
    }

    get pitScoutQuestions () {
        Object.defineProperty(this, "pitScoutingQuestions", { value: (async () => {
            return  await requestFromServer({
                url: "robot-display/get-pit-scout-questions",
                body: {
                    eventKey: currentEvent.info.key
                }
            });
        })(), writable: true });
        
        return this.preScoutingQuestions;
    }

    async getInfo() {
        const {
            teams,
            matches,
            info
        } = await requestFromServer({
            url: '/events/get-event-info',
            method: 'POST',
            body: {
                eventKey: this.key
            }
        });

        const {
            teams: _teams,
            matches: _matches
        } = await this.convertToClasses(teams, matches);

        this.teams = _teams;
        this.matches = _matches;
        this.info = info;

        return {
            teams: this.teams,
            matches: this.matches,
            info
        };
    }

    async addMatchScouting(matchScouting) {
        const { teamNumber, matchNumber } = matchScouting;

        Object.entries(matchScouting).forEach(([k, v]) => {
            try {
                if (k.includes("Info")) k = k.slice(0, k.length - 4);
                matchScouting[k] = JSON.parse(v);
            } catch (e) {}
        })
        const team = this.teams.find(t => t.number == teamNumber);
        const match = this.matches.find(m => m.compLevel == "qm" && m.matchNumber == matchNumber);
        team.matchScouting = team.matchScouting.filter(m => m.matchNumber != matchNumber);
        team && team.matchScouting.push(matchScouting);
        if (match && team) match.teamsMatchScouting[team] = matchScouting;

        const heatmapInfo = await Heatmap.fetchHeatmapDataFromServer(teamNumber, this.key);
        team.tatorInfo.heatmap = new Heatmap(heatmapInfo);
    }
}