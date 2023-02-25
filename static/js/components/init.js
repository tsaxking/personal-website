class WeekSet {
    constructor(element) {
        this.days = element.querySelectorAll('.week-day');
        this.type = element.dataset.btnGroupType;
    }

    getSelectedDayIndex() {
        let index = 0;
        this.days.forEach(el => {
            if (el.classList.contains('selected')) index = el.dataset.weekIndex;
        });
        return +index;
    }

    getSelectedDay() {
        let day = this.days[this.getSelectedDayIndex()];
        return day ? day.dataset.weekDay : null;
    }

    getSelectedDays() {
        let days = [];
        this.days.forEach(day => {
            if (day.classList.contains('selected')) days.push(day.dataset.weekDay);
        });
        return days;
    }

    getSelectedIndexes() {
        let indexes = [];
        this.days.forEach(day => {
            if (day.classList.contains('selected')) indexes.push(day.dataset.weekIndex);
        });
        return indexes;
    }

    // Select day from text input
    selectDay(day) {
        this.days.forEach(el => {
            if (el.dataset.weekDay == day) el.classList.add('selected');
        });
    }

    // Select index from text input
    selectIndex(index) {
        this.days.forEach(el => {
            if (el.dataset.weekIndex == index) el.classList.add('selected');
        });
    }
}

const weekSets = {};

// Initialize week sets
document.querySelectorAll('.week-set').forEach(ws => {
    const type = ws.dataset.btnGroupType;
    if (type == 'toggle') {
        ws.querySelectorAll('.week-day').forEach(wd => {
            wd.addEventListener('click', () => {
                let isSelected = wd.classList.contains('selected');
                ws.querySelectorAll('.week-day').forEach(wd => {
                    wd.classList.remove('selected');
                });
                if (isSelected) {
                    ws.dataset.day = null;
                    ws.dataset.index = null;
                } else {
                    wd.classList.add('selected');
                    ws.dataset.day = wd.dataset.weekDay;
                    ws.dataset.index = wd.dataset.weekIndex;
                }
            });
        });
    } else {
        ws.querySelectorAll('.week-day').forEach(wd => {
            wd.addEventListener('click', () => {
                if (wd.dataset.weekDay == 'all') {
                    let time = 0;
                    if (ws.dataset.allSelected == 'true') {
                        ws.querySelectorAll('.week-day').forEach(el => {
                            setTimeout(() => {
                                el.classList.remove('selected');
                            }, time);
                            time += 30;
                        });
                        ws.dataset.allSelected = false;
                    } else {
                        ws.querySelectorAll('.week-day').forEach(el => {
                            setTimeout(() => {
                                el.classList.add('selected');
                            }, time);
                            time += 30;
                        });
                        ws.dataset.allSelected = true;
                    }
                } else {
                    if (wd.classList.contains('selected')) {
                        ws.dataset.allSelected = false;
                        ws.querySelector('.week-day[data-week-day="all"]').classList.remove('selected');
                        wd.classList.remove('selected');
                    } else {
                        let test = true;
                        ws.querySelectorAll('.week-day').forEach(el => {
                            if (el.dataset.weekDay == 'all') return;
                            if (el.dataset.weekDay == wd.dataset.weekDay) return;
                            if (!el.classList.contains('selected')) test = false;
                        });
                        if (test) {
                            ws.dataset.allSelected = true;
                            ws.querySelector('.week-day[data-week-day="all"]').classList.add('selected');
                        } else ws.querySelector('.week-day[data-week-day="all"]').classList.remove('selected');
                        wd.classList.add('selected');
                    }
                }
            });
        });
    }

    // Initialize week set
    weekSets[ws.id] = new WeekSet(ws);
});