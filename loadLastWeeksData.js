import {
    getCurrentWeekRange,
    getPreviousWeekRange,
    createRow,
    saveCellValue
  } from './script.js';

export function loadLastWeeksData() {
    const areaHeader = document.querySelector('.area-cell');
    const goalHeader = document.querySelector('.goal-cell');

    const currentWeek = getCurrentWeekRange();
    const savedRowCount = parseInt(localStorage.getItem(`savedRowCount-${currentWeek}`)) || 0;

    if (savedRowCount > 0) return; // Exit if there's already content

    const setupHoverAndClick = (headerEl, columnIndex, label) => {
        headerEl.style.cursor = 'pointer';
        headerEl.addEventListener('mouseenter', () => headerEl.style.color = 'blue');
        headerEl.addEventListener('mouseleave', () => headerEl.style.color = '');

        headerEl.addEventListener('click', () => {
            const confirmLoad = confirm(`Load last week's ${label} inputs?`);
            if (confirmLoad) loadPreviousWeekData(columnIndex);
        });
    };

    setupHoverAndClick(areaHeader, 0, 'area');
    setupHoverAndClick(goalHeader, 1, 'goal');
}

function loadPreviousWeekData(colIndex) {
    const currentWeek = getCurrentWeekRange();
    const previousWeek = getPreviousWeekRange();
    let rowIndex = 0;

    while (true) {
        const value = localStorage.getItem(`cell-${rowIndex}-${colIndex}-${previousWeek}`);
        if (value === null) break;

        createRow(2, rowIndex, currentWeek); // create row if needed
        saveCellValue(rowIndex, colIndex, value, currentWeek); // save to current week
        rowIndex++;
    }

    localStorage.setItem(`savedRowCount-${currentWeek}`, rowIndex);
}
