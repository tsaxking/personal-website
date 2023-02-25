// PRIORITY_0
class FIRSTYear {
    constructor(year) {
        this.number = year;
        this.events = [];
        this.field = new FIRSTField(year);
    }

    get keys() {
        const keys = {
            2022: {}
        };
        return keys[this.number];
    }

    async getEvents() {
        const events = await requestFromServer({
            url: '/event-info/get-events',
            method: 'POST',
            body: {
                year: this.number
            }
        });
        const _events = [];
        for (const event of events) {
            const e = new Event(event.key);
            await e.getInfo();
            _events.push(e);
        };

        this.events = _events;
        return _events;
    }
}