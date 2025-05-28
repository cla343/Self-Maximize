import {
    getCurrentWeekRange,
    getPreviousWeekRange,
    createRow,
    saveCellValue
} from './script.js';

function normalizeWeekRange(weekRange) {
    // If previous week uses underscores, convert to spaces and " - "
    // Example: "2025-05-05_to_2025-05-11" → "2025-05-05 - 2025-05-11"
    return weekRange.replace(/_/g, ' ').replace(' to ', ' - ');
}

export function loadLastWeeksData() {
    const areaHeader = document.querySelector('.area-cell');
    const goalHeader = document.querySelector('.goal-cell');

    const currentWeek = getCurrentWeekRange();
    const savedRowCount = parseInt(localStorage.getItem(`savedRowCount-${currentWeek}`)) || 0;

    if (savedRowCount > 0) return;

    const setupHoverAndClick = (headerEl, label) => {
        headerEl.style.cursor = 'pointer';
        headerEl.addEventListener('mouseenter', () => headerEl.style.color = 'blue');
        headerEl.addEventListener('mouseleave', () => headerEl.style.color = '');

        headerEl.addEventListener('click', () => {
            const confirmLoad = confirm(`Load last week's Area + Goal inputs?`);
            if (confirmLoad) loadPreviousWeekData();
        });
    };

    setupHoverAndClick(areaHeader, 'area + goal');
    setupHoverAndClick(goalHeader, 'area + goal');
}

function loadPreviousWeekData() {
    const currentWeek = getCurrentWeekRange();
    let previousWeek = getPreviousWeekRange();
    previousWeek = normalizeWeekRange(previousWeek);  // Normalize previous week format here

    let savedRowCount = 0;
    let rowIndex = 0;
    let rowsLoaded = 0;

    while (true) {
        const area = localStorage.getItem(`cell-${rowIndex}-0-${previousWeek}`);
        const goal = localStorage.getItem(`cell-${rowIndex}-1-${previousWeek}`);

        if (area === null && goal === null) break;

        createRow(2, savedRowCount, currentWeek);

        if (area !== null) saveCellValue(savedRowCount, 0, area, currentWeek);
        if (goal !== null) saveCellValue(savedRowCount, 1, goal, currentWeek);

        savedRowCount++;
        rowsLoaded++;
        rowIndex++;
    }

    if (rowsLoaded > 0) {
        localStorage.setItem(`savedRowCount-${currentWeek}`, savedRowCount);
        createPermanentChecklist();
        console.log(`✅ Loaded ${rowsLoaded} rows from last week into current week.`);
    } else {
        console.log(`⚠️ No previous week data found to load.`);
    }
}
