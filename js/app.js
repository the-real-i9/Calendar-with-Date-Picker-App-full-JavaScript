// Calender Controller
const calenderController = (() => {
    const d = new Date();
    let apply = null;
    const yearHome = d.getFullYear();
    const fullDateHome = d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
    const defaultDate = () => ({ fullDateHome, yearHome });

    const calenderInfo = ({ nextOrPrev = 0, dateSel = d.getDate(), yearSel = d.getFullYear() } = { nextOrPrev, dateSel, yearSel }) => {
        d.setFullYear(yearSel, d.getMonth() + nextOrPrev, dateSel);


        // Algorith to get the number of days in a month
        const drefFrom = new Date(d.getFullYear(), d.getMonth());
        const drefTo = new Date(d.getFullYear(), d.getMonth() + 1);

        // Date details to be used by the App
        const year = d.getFullYear();
        const fullDate = d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
        const fullDateSel = d.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
        const monthYear = d.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric',
        });
        const daysInMonth = (drefTo - drefFrom) / 1000 / 60 / 60 / 24;
        const weekStart = drefFrom.getDay();
        const weekEnd = 7 - drefTo.getDay();
        const date = d.getDate();
        const currWeek = d.getDay();
        // console.log(year, fullDate, monthYear, daysInMonth, weekStart, weekEnd, date, currWeek);

        apply = () => ({ fullDateSel, year });

        return {
            year, fullDate, monthYear, daysInMonth, weekStart, weekEnd, date, currWeek,
            get forMonthUpdate() {
                return { monthYear, daysInMonth, weekStart, weekEnd };
            },
            get forDateSelect() {
                return { year, fullDate, monthYear, date };
            },
            get forYearSelect() {
                return { year, fullDate, monthYear, daysInMonth, weekStart, weekEnd, date };
            },
        };
    };


    return {
        getDefaultDate: () => defaultDate(),

        getCalInfo: () => calenderInfo({}),

        updateMonth: (action) => (action === 'next'
        ? calenderInfo({ nextOrPrev: 1 }).forMonthUpdate : calenderInfo({ nextOrPrev: -1 }).forMonthUpdate),

        updateCalenderOnDateSelect: (value) => calenderInfo({ dateSel: value }).forDateSelect,

        updateCalenderOnYearSelect: (value) => calenderInfo({ yearSel: value }).forYearSelect,

        applyChanges: () => apply(),
    };
})();

// UI Controller
const UIController = (() => {
    const DOMStrings = {
        calBox: '.c-box',
        year: '.year',
        fullDate: '.full-date',
        navLeft: '#nav-left',
        navRight: '#nav-right',
        monthYear: '.my',
        weekDays: '.day',
        calNumsDiv: '.cal-nums',
        dates: '.date',
        cancelBtn: '#cancel',
        okBtn: '#ok',
        yearSelector: '.yearSelector',
        calender: '.calender',
        allYears: '.allYears',
        dateSelBtn: '.datesel-btn',
        home: '.date-disp',
        homeDate: '.sel-date',
    };

    const selector = (elem) => document.querySelector(elem);
    const selectorAll = (elem) => document.querySelectorAll(elem);

    const htmlEmpty = '<span class="empty"></span>';

    const primCol = '#1a73e8';

    const offset = (week, count, num) => {
        if (week === num) return;
        selector(DOMStrings.calNumsDiv).insertAdjacentHTML('beforeend', htmlEmpty);
        count++;
        if (count === week) return;
        offset(week, count, num);
    };

    const supply = (count, compareTo, elem) => {
        selector(elem).insertAdjacentHTML('beforeend', elem === DOMStrings.calNumsDiv ? `<span class='date' id='date-${count}'>${count}</span>` : `<span class="allYears" id='year-${count}'>${count}</span>`);
        count++;
        if (count > compareTo) return;
        supply(count, compareTo, elem);
    };

    let yearsCountFrom = 1845;
    let yearsCountTo = 2100;
    const supplyYears = supply;
    supplyYears(yearsCountFrom, yearsCountTo, DOMStrings.yearSelector);

    const setStyle = (elem, prop, value) => {
        selector(elem).style[prop] = value;
        return selector(elem);
    };

    const setText = (elem, value) => {
        selector(elem).textContent = value;
    };

    const setHtml = (elem, value) => {
        selector(elem).innerHTML = value;
    };

    const addClass = (elem, value) => {
        selector(elem).classList.add(value);
    };

    const removeClass = (elem, value) => {
        selector(elem).classList.remove(value);
    };

    // Locals needed for last memory
    let selected = new Date();
    let currMonthYear = null;


    return {
        // What to see when the App is launched
        preset({ fullDateHome, yearHome }) {
            setStyle(DOMStrings.calBox, 'display', 'none');
            const [day, md] = fullDateHome.split(', ');
            setHtml(DOMStrings.homeDate, `<span class='p'>${day}</span>, <span class='g'>${md}</span>, <span class='p'>${yearHome}</span>`)
        },

        showCalender() {
            setStyle(DOMStrings.home, 'display', 'none');
            setStyle(DOMStrings.calBox, 'display', 'block');
            setStyle(DOMStrings.calBox, 'opacity', '0');
            setStyle(DOMStrings.calBox, 'transform', 'translateY(20px)');
            setTimeout(() => {
                setStyle(DOMStrings.calBox, 'transform', 'translateY(0)');
                setStyle(DOMStrings.calBox, 'opacity', '1');
            }, 10);
        },

        theCalender({
            year, fullDate, monthYear, daysInMonth, weekStart, weekEnd, date, currWeek,
        }) {
            let countOffsetStart = 0;
            let dateCount = 1;
            let countOffsetEnd = 0;
            const noOffsetStart = 0;
            const noOffsetEnd = 7;
            currMonthYear = monthYear;
            setStyle(DOMStrings.yearSelector, 'display', 'none');
            setText(DOMStrings.year, year);
            setText(DOMStrings.fullDate, fullDate);
            setText(DOMStrings.monthYear, monthYear);

            const offsetStart = offset;
            offsetStart(weekStart, countOffsetStart, noOffsetStart);

            const supplyDates = supply;
            supplyDates(dateCount, daysInMonth, DOMStrings.calNumsDiv);

            const offsetEnd = offset;
            offsetEnd(weekEnd, countOffsetEnd, noOffsetEnd);

            // current date
            setStyle(`#day-${currWeek}`, 'color', primCol);
            setStyle(`#date-${date}`, 'color', primCol).classList.add('selected');

            selected.setDate(date);
        },


        updateMonth({
            monthYear, daysInMonth, weekStart, weekEnd,
        }) {
            let countOffsetStart = 0;
            let dateCount = 1;
            let countOffsetEnd = 0;
            const noOffsetStart = 0;
            const noOffsetEnd = 7;
            setHtml(DOMStrings.calNumsDiv, '');
            setText(DOMStrings.monthYear, monthYear);

            [...selectorAll(DOMStrings.dates)].map((elem) => elem.classList.remove('selected'));

            const offsetStart = offset;
            offsetStart(weekStart, countOffsetStart, noOffsetStart);

            const supplyDates = supply;
            supplyDates(dateCount, daysInMonth, DOMStrings.calNumsDiv);

            const offsetEnd = offset;
            offsetEnd(weekEnd, countOffsetEnd, noOffsetEnd);

            const locale = new Date().toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric',
            });


            // While traversing the calender, if current calender === current month year
            // then get the current date selected else we dont't wanna select the date
            // from the code
            if (monthYear === currMonthYear) {
                addClass(`#date-${selected.getDate()}`, 'selected');
            }
            if (monthYear === locale) {
                setStyle(`#day-${new Date().getDay()}`, 'color', primCol);
                setStyle(`#date-${new Date().getDate()}`, 'color', primCol);
            } else {
                setStyle(`#day-${new Date().getDay()}`, 'color', '');
            }
        },

        displayYearSelector() {
            const year = selector(DOMStrings.year).textContent;
            setStyle(DOMStrings.calender, 'display', 'none');
            setStyle(DOMStrings.yearSelector, 'display', 'flex');
            setStyle(DOMStrings.yearSelector, 'opacity', '0');
            setTimeout(() => {
                setStyle(DOMStrings.yearSelector, 'opacity', '1');
            }, 10);


            [...selectorAll(DOMStrings.allYears)].map((el) => {
                [el.style.fontSize, el.style.color] = ['19px', ''];
            });


            setStyle(`#year-${year}`, 'color', primCol).style.fontSize = '30px';

            const coor = selector(`#year-${year}`).getBoundingClientRect();
            selector(DOMStrings.yearSelector).scrollBy({
                top: coor.top - 275,
                left: coor.left,
                behaviour: 'smooth',
            });
        },

        updateCalenderOnDateSelect({
            year, fullDate, monthYear, date,
        }) {
            currMonthYear = monthYear;
            setText(DOMStrings.fullDate, fullDate);
            setText(DOMStrings.year, year);
            [...selectorAll(DOMStrings.dates)].map((el) => el.classList.remove('selected'));
            setStyle(`#date-${date}`).classList.add('selected');
            selected.setDate(date);
        },

        updateCalenderOnYearSelect({
            year, fullDate, monthYear, daysInMonth, weekStart, weekEnd, date,
        }) {
            this.updateMonth({ monthYear, daysInMonth, weekStart, weekEnd, date });

            setText(DOMStrings.fullDate, fullDate);
            setText(DOMStrings.year, year);

            addClass(`#date-${selected.getDate()}`, 'selected');

            if (selector(DOMStrings.yearSelector).style.display !== 'none') {
                setStyle(DOMStrings.calender, 'display', 'block');
                setStyle(DOMStrings.yearSelector, 'display', 'none');
            }
        },

        applyChanges({ fullDateSel, year }) {
            setStyle(DOMStrings.calBox, 'transform', 'translateY(20px)');
            setStyle(DOMStrings.calBox, 'opacity', '0');
            setTimeout(() => {
                setStyle(DOMStrings.calBox, 'display', 'none');
                setStyle(DOMStrings.home, 'display', 'flex');
            }, 200);
            const [day, md] = fullDateSel.split(', ');
            setHtml(DOMStrings.homeDate, `<span class='p'>${day}</span>, <span class='g'>${md}</span>, <span class='p'>${year}</span>`);
        },

        discardChanges() {
            setStyle(DOMStrings.calBox, 'transform', 'translateY(20px)');
            setStyle(DOMStrings.calBox, 'opacity', '0');
            setTimeout(() => {
                setStyle(DOMStrings.calBox, 'display', 'none');
                setStyle(DOMStrings.home, 'display', 'flex');
            }, 200);
        },

        getDOMStrings: () => DOMStrings,
        getSelectors: (elem) => selector(elem),
        getAllSelector: (elem) => selectorAll(elem),
    };
})();

// App Controller
const controller = ((clCtrl, UICtrl) => {
    const select = (elem) => UICtrl.getSelectors(elem);
    const selectAll = (elem) => UICtrl.getAllSelector(elem);
    const DOM = UICtrl.getDOMStrings();
    const action = function(event, action) {
        return this.addEventListener(event, action);
    };
    const setupEventListeners = () => {
        action.call(select(DOM.dateSelBtn), 'click', showCalender);

        action.call(select(DOM.navRight), 'click', updateMonth);
        action.call(select(DOM.navLeft), 'click', updateMonth);
        action.call(document, 'keydown', updateMonth);

        action.call(select(DOM.year), 'click', displayYearSelector);

        [...selectAll(DOM.dates)].map((elem) => action.call(elem, 'click', updateCalenderOnDateSelect));

        [...selectAll(DOM.allYears)].map((elem) => action.call(elem, 'click', updateCalenderOnYearSelect));

        action.call(select(DOM.okBtn), 'click', applyChanges);
        action.call(select(DOM.cancelBtn), 'click', discardChanges);
    };

    const showCalender = (ev) => {
        if (ev) {
            UICtrl.showCalender();
            [...selectAll(DOM.dates)].map((elem) => action.call(elem, 'click', updateCalenderOnDateSelect));
        }
    };

    const updateMonth = (ev) => {
        if (ev?.type === 'click') {
            (ev.target.id === 'nav-right' ? UICtrl.updateMonth(clCtrl.updateMonth('next')) : UICtrl.updateMonth(clCtrl.updateMonth('prev')));
        } else if(ev?.type === 'keydown' && select(DOM.calBox).style.display !== 'none') {
            if (ev.keyCode === 37) {
                UICtrl.updateMonth(clCtrl.updateMonth('prev'));
            } else if(ev.keyCode === 39) {
                UICtrl.updateMonth(clCtrl.updateMonth('next'));
            }
        }

        [...selectAll(DOM.dates)].map((elem) => action.call(elem, 'click', updateCalenderOnDateSelect));

    }

    const displayYearSelector = (ev) => {
        if (ev) {
            UICtrl.displayYearSelector();
            if (select(DOM.yearSelector).style.display !== 'none') {
                select(DOM.year).removeEventListener('click', displayYearSelector);
            }
        }
    };

    const updateCalenderOnDateSelect = (ev) => {
        if (ev) {
            const [selected, value] = ev.target.id.split('-');
            UICtrl.updateCalenderOnDateSelect(clCtrl.updateCalenderOnDateSelect(Number(value)));
            action.call(select(DOM.year), 'click', displayYearSelector);
        }
    };

    const updateCalenderOnYearSelect = (ev) => {
        if (ev) {
            const [selected, value] = ev.target.id.split('-');
            UICtrl.updateCalenderOnYearSelect(clCtrl.updateCalenderOnYearSelect(Number(value)));
            action.call(select(DOM.year), 'click', displayYearSelector);
            [...selectAll(DOM.dates)].map((elem) => action.call(elem, 'click', updateCalenderOnDateSelect));
        }
    };


    const discardChanges = (ev) => {
        if (ev) {
            UICtrl.discardChanges();
        }
    };

    const applyChanges = (ev) => {
        if (ev) {
            UICtrl.applyChanges(clCtrl.applyChanges());
        }
    };


    return {
        init() {
            UICtrl.preset(clCtrl.getDefaultDate());
            UICtrl.theCalender(clCtrl.getCalInfo());
            setupEventListeners();
        },
    };
})(calenderController, UIController);
controller.init();
