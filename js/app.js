// Calender Controller
const calenderController = (() => {
    const d = new Date();
    const calenderInfo = (nextOrPrev = 0) => {
        d.setMonth(d.getMonth() + nextOrPrev);

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
        const monthYear = d.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric',
        });
        const daysInMonth = (drefTo - drefFrom) / 1000 / 60 / 60 / 24;
        const weekStart = drefFrom.getDay();
        const weekEnd = 7 - drefTo.getDay();
        const date = d.getDate();
        const currWeek = d.getDay();

        return {
            year, fullDate, monthYear, daysInMonth, weekStart, weekEnd, date, currWeek,
        };
    };


    return {
        getCalInfo: () => calenderInfo(),

        updateMonth: (action) => (action === 'next' ? calenderInfo(1) : calenderInfo(-1)),
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
    };

    const selector = (elem) => document.querySelector(elem);

    const htmlEmpty = '<span class="empty"></span>';

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

    const addClass = (elem, value) => {
        selector(elem).classList.add(value);
    };


    return {
        // What to see when the App is launched
        preset: ({
            year, fullDate, monthYear, daysInMonth, weekStart, weekEnd, date, currWeek,
        }) => {
            let countOffsetStart = 0;
            let dateCount = 1;
            let countOffsetEnd = 0;
            const noOffsetStart = 0;
            const noOffsetEnd = 7;
            setText(DOMStrings.year, year);
            setText(DOMStrings.fullDate, fullDate);
            setText(DOMStrings.monthYear, monthYear);
            setStyle(DOMStrings.yearSelector, 'display', 'none');


            const offsetStart = offset;
            offsetStart(weekStart, countOffsetStart, noOffsetStart);


            const supplyDates = supply;
            supplyDates(dateCount, daysInMonth, DOMStrings.calNumsDiv);


            const offsetEnd = offset;
            offsetEnd(weekEnd, countOffsetEnd, noOffsetEnd);


            // current date
            setStyle(`#day-${currWeek}`, 'color', 'rgb(138, 43, 266)');
            setStyle(`#date-${date}`, 'color', 'rgb(138, 43, 266)').classList.add('selected');
        },

        updateCalender: ({
            monthYear, daysInMonth, weekStart, weekEnd, date, currWeek,
        }) => {
            let countOffsetStart = 0;
            let dateCount = 1;
            let countOffsetEnd = 0;
            const noOffsetStart = 0;
            const noOffsetEnd = 7;
            selector(DOMStrings.calNumsDiv).innerHTML = '';
            selector(DOMStrings.monthYear).textContent = monthYear;


            const offsetStart = offset;
            offsetStart(weekStart, countOffsetStart, noOffsetStart);


            const supplyDates = supply;
            supplyDates(dateCount, daysInMonth, DOMStrings.calNumsDiv);


            const offsetEnd = offset;
            offsetEnd(weekEnd, countOffsetEnd, noOffsetEnd);

            // While traversing the calender, if current calender === current month year
            // then get the current date selected else we dont't wanna select the date
            // from the code
            if (monthYear === new Date().toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric',
            })) {
                setStyle(`#day-${currWeek}`, 'color', 'rgb(138, 43, 266)');
                setStyle(`#date-${date}`, 'color', 'rgb(138, 43, 266)').classList.add('selected');
            } else {
                setStyle(`#day-${new Date().getDay()}`, 'color', '');
            }
        },

        displayYearSelector: () => {
            const year = selector(DOMStrings.year).textContent;
            setStyle(DOMStrings.calender, 'display', 'none');
            setStyle(DOMStrings.yearSelector, 'display', 'flex');
            
            setStyle(`#year-${year}`, 'color', 'rgb(138, 43, 266)').style.fontSize = '30px';

            const coor = selector(`#year-${year}`).getBoundingClientRect();
            selector(DOMStrings.yearSelector).scrollTo({
                top: coor.top - 275,
                left: coor.left,
                behaviour: 'smooth',
            });
        },

        getDOMStrings: () => DOMStrings,
        getSelectors: (elem) => selector(elem),
    };
})();

// App Controller
const controller = ((clCtrl, UICtrl) => {
    const select = (elem) => UICtrl.getSelectors(elem);
    const DOM = UICtrl.getDOMStrings();
    const setupEventListeners = () => {
        const action = function(event, action) {
            return this.addEventListener(event, action);
        };
        action.call(select(DOM.navRight), 'click', updateCalender);
        action.call(select(DOM.navLeft), 'click', updateCalender);

        action.call(select(DOM.year), 'click', displayYearSelector);

    };

    const updateCalender = (ev) => (ev?.target.id === 'nav-right' ? UICtrl.updateCalender(clCtrl.updateMonth('next')) : UICtrl.updateCalender(clCtrl.updateMonth('prev')));

    const displayYearSelector = (ev) => {
        if (ev) {
            UICtrl.displayYearSelector();
            if (select(DOM.yearSelector).style.display !== 'none') {
                select(DOM.year).removeEventListener('click', displayYearSelector);
            }
        }
    };

    return {
        init() {
            UICtrl.preset(clCtrl.getCalInfo());
            setupEventListeners();
        },
    };
})(calenderController, UIController);
controller.init();
