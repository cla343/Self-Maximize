import {
    createRow,
    saveCellValue,
    createPermanentChecklist
} from './script.js';

function getPreviousWeekFrom(weekRange) {
    const startStr = weekRange.split(' - ')[0];
    const [year, month, day] = startStr.split('-').map(Number);
    const startDate = new Date(year, month - 1, day);
    startDate.setDate(startDate.getDate() - 7);

    const previousStart = startDate.toLocaleDateString('en-CA');
    const previousEnd = new Date(startDate);
    previousEnd.setDate(previousEnd.getDate() + 6);
    const previousEndStr = previousEnd.toLocaleDateString('en-CA');

    return `${previousStart} - ${previousEndStr}`;
}

export function loadLastWeeksData() {
    const currentWeek = getDisplayedWeek();
    const previousWeek = getPreviousWeekFrom(currentWeek);
    console.log('📆 Displayed Week:', currentWeek);
    console.log('⏪ Previous Week:', previousWeek);

    const areaHeader = document.querySelector('.area-cell');
    const goalHeader = document.querySelector('.goal-cell');

    if (!areaHeader || !goalHeader) {
        console.warn('Area or Goal header not found');
        return;
    }

    const savedRowCount = parseInt(localStorage.getItem(`savedRowCount-${currentWeek}`)) || 0;
    if (savedRowCount > 0) return;

    const setupHoverAndClick = (headerEl) => {
        headerEl.style.cursor = 'pointer';

        headerEl.addEventListener('mouseenter', () => headerEl.style.color = 'blue');
        headerEl.addEventListener('mouseleave', () => headerEl.style.color = '');

        headerEl.addEventListener('click', () => {
            const confirmLoad = confirm(`Load last week's Area + Goal inputs?`);
            if (confirmLoad) loadPreviousWeekData(currentWeek, previousWeek);
        });
    };

    setupHoverAndClick(areaHeader);
    setupHoverAndClick(goalHeader);
}

function loadPreviousWeekData(currentWeek, previousWeek) {
    let rowIndex = 0;
    let savedRowCount = 0;
    let rowsLoaded = 0;

    while (true) {
        const area = localStorage.getItem(`cell-${rowIndex}-0-${previousWeek}`);
        const goal = localStorage.getItem(`cell-${rowIndex}-1-${previousWeek}`);
        if (area === null && goal === null) break;

        createRow(2, savedRowCount, currentWeek);

        for (let colIndex = 0; colIndex < 2; colIndex++) {
            const prevValue = localStorage.getItem(`cell-${rowIndex}-${colIndex}-${previousWeek}`);
            if (prevValue !== null) {
                saveCellValue(savedRowCount, colIndex, prevValue, currentWeek);
                const cellKey = `cell-${savedRowCount}-${colIndex}-${currentWeek}`;
                const editDiv = document.querySelector(`[data-key="${cellKey}"]`);
                if (editDiv) editDiv.innerText = prevValue;
            }
        }

        rowIndex++;
        savedRowCount++;
        rowsLoaded++;
    }

    if (rowsLoaded > 0) {
        localStorage.setItem(`savedRowCount-${currentWeek}`, savedRowCount);
        createPermanentChecklist();
        console.log(`✅ Loaded ${rowsLoaded} rows from ${previousWeek} into ${currentWeek}.`);
    } else {
        console.log(`⚠️ No data found for ${previousWeek}.`);
    }
}
