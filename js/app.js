// Calender Controller
const calenderController = (() => {
    const d = new Date();
    const calenderInfo = ({ nextOrPrev, dateSel, yearSel } = { nextOrPrev: 0, dateSel: d.getDate(), yearSel: d.getFullYear() } ) => {
        d.setMonth(d.getMonth() + (nextOrPrev || 0), dateSel || d.getDate() === 31 ? 30 : dateSel || d.getDate());
        d.setDate(dateSel || d.getDate());
        d.setFullYear(yearSel || d.getFullYear());
        

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
        console.log(year, fullDate, monthYear, daysInMonth, weekStart, weekEnd, date, currWeek);
        
        return {
            year, fullDate, monthYear, daysInMonth, weekStart, weekEnd, date, currWeek,
            get forMonthUpdate() {
                return { monthYear, daysInMonth, weekStart, weekEnd };
            },
            get forDateSelect() {
                return { fullDate, monthYear, date };
            },
            get forYearSelect() {
                return { year, fullDate, monthYear, daysInMonth, weekStart, weekEnd, date };
            },
        };
    };


    return {
        getCalInfo: () => calenderInfo(),

        updateMonth: (action) => (action === 'next'
        ? calenderInfo({ nextOrPrev: 1 }).forMonthUpdate : calenderInfo({ nextOrPrev: -1 }).forMonthUpdate),

        updateCalenderOnDateSelect: (value) => calenderInfo({ dateSel: value }).forDateSelect,

        updateCalenderOnYearSelect: (value) => calenderInfo({ yearSel: value }).forYearSelect,

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
    };

    const selector = (elem) => document.querySelector(elem);
    const selectorAll = (elem) => document.querySelectorAll(elem);

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
        preset: ({
            year, fullDate, monthYear, daysInMonth, weekStart, weekEnd, date, currWeek,
        }) => {
            let countOffsetStart = 0;
            let dateCount = 1;
            let countOffsetEnd = 0;
            const noOffsetStart = 0;
            const noOffsetEnd = 7;
            currMonthYear = monthYear;
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

            selected.setDate(date);            
        },

        updateMonth: ({
            monthYear, daysInMonth, weekStart, weekEnd,
        }) => {
            let countOffsetStart = 0;
            let dateCount = 1;
            let countOffsetEnd = 0;
            const noOffsetStart = 0;
            const noOffsetEnd = 7;
            setHtml(DOMStrings.calNumsDiv, '');
            setText(DOMStrings.monthYear, monthYear);

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
                setStyle(`#day-${new Date().getDay()}`, 'color', 'rgb(138, 43, 266)');
                setStyle(`#date-${new Date().getDate()}`, 'color', 'rgb(138, 43, 266)');
            } else {
                setStyle(`#day-${new Date().getDay()}`, 'color', '');
            }
        },

        displayYearSelector: () => {
            const year = selector(DOMStrings.year).textContent;
            setStyle(DOMStrings.calender, 'display', 'none');
            setStyle(DOMStrings.yearSelector, 'display', 'flex');


            [...selectorAll(DOMStrings.allYears)].map((el) => {
                [el.style.fontSize, el.style.color] = ['19px', ''];
            });
            
            
            setStyle(`#year-${year}`, 'color', 'rgb(138, 43, 266)').style.fontSize = '30px';

            const coor = selector(`#year-${year}`).getBoundingClientRect();
            selector(DOMStrings.yearSelector).scrollBy({
                top: coor.top - 275,
                left: coor.left,
                behaviour: 'smooth',
            });
        },

        updateCalenderOnDateSelect: ({
            fullDate, monthYear, date,
        }) => {
            currMonthYear = monthYear;
            setText(DOMStrings.fullDate, fullDate);
            [...selectorAll(DOMStrings.dates)].map((el) => el.classList.remove('selected'));
            setStyle(`#date-${date}`).classList.add('selected');
            selected.setDate(date);
        },

        updateCalenderOnYearSelect: ({
            year, fullDate, monthYear, daysInMonth, weekStart, weekEnd, date,
        }) => {
            UIController.updateMonth({ monthYear, daysInMonth, weekStart, weekEnd, date });

            setText(DOMStrings.fullDate, fullDate);
            setText(DOMStrings.year, year);

            addClass(`#date-${selected.getDate()}`, 'selected');

            if (selector(DOMStrings.yearSelector).style.display !== 'none') {
                setStyle(DOMStrings.calender, 'display', 'block');
                setStyle(DOMStrings.yearSelector, 'display', 'none');
            }
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
        action.call(select(DOM.navRight), 'click', updateMonth);
        action.call(select(DOM.navLeft), 'click', updateMonth);

        action.call(select(DOM.year), 'click', displayYearSelector);


        [...selectAll(DOM.dates)].map((elem) => action.call(elem, 'click', updateCalenderOnDateSelect));
        
        [...selectAll(DOM.allYears)].map((elem) => action.call(elem, 'click', updateCalenderOnYearSelect));
    };
    
    const updateMonth = (ev) => {
        (ev?.target.id === 'nav-right' ? UICtrl.updateMonth(clCtrl.updateMonth('next')) : UICtrl.updateMonth(clCtrl.updateMonth('prev')));
        
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

    return {
        init() {
            UICtrl.preset(clCtrl.getCalInfo());
            setupEventListeners();
        },
    };
})(calenderController, UIController);
controller.init();
