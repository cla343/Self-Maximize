import {
    getCurrentWeekRange,
    getPreviousWeekRange,
    createRow,
    saveCellValue,
    createPermanentChecklist
} from './script.js';

function normalizeWeekRange(weekRange) {
    // If previous week uses underscores, convert to spaces and " - "
    // Example: "2025-05-05_to_2025-05-11" → "2025-05-05 - 2025-05-11"
    return weekRange.replace(/_/g, ' ').replace(' to ', ' - ');
}

export function loadLastWeeksData() {
    const lastWeek = localStorage.getItem('lastWeek');
    console.log('lastWeek:', lastWeek);

    const areaHeader = document.querySelector('.area-cell');
    const goalHeader = document.querySelector('.goal-cell');

    // Make sure you declare before use
    if (!areaHeader || !goalHeader) {
        console.warn('Area or Goal header not found');
        return;
    }

    const currentWeek = getCurrentWeekRange();
    const savedRowCount = parseInt(localStorage.getItem(`savedRowCount-${currentWeek}`)) || 0;

    if (savedRowCount > 0) return;
    console.log(savedRowCount, 'savedRowCount for current week'); 

    const setupHoverAndClick = (headerEl, label) => {
        headerEl.style.cursor = 'pointer';
    
        headerEl.addEventListener('mouseenter', () => {
            console.log('mouseenter on', headerEl);
            headerEl.style.color = 'blue';
        });
    
        headerEl.addEventListener('mouseleave', () => {
            console.log('mouseleave on', headerEl);
            headerEl.style.color = '';
        });
    
        headerEl.addEventListener('click', () => {
            console.log('clicked on', headerEl);
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

    console.log('Normalized previousWeek:', previousWeek);
    console.log('Raw previousWeek:', getPreviousWeekRange());
    console.log('Normalized previousWeek:', previousWeek);

    let savedRowCount = 0;
    let rowIndex = 0;
    let rowsLoaded = 0;

    console.log('Trying to load from previousWeek:', previousWeek);

    while (true) {
        const area = localStorage.getItem(`cell-${rowIndex}-0-${previousWeek}`);
        const goal = localStorage.getItem(`cell-${rowIndex}-1-${previousWeek}`);

        if (area === null && goal === null) break;

        createRow(2, savedRowCount, currentWeek);

        // Copy previous week values into the new week
for (let colIndex = 0; colIndex < 2; colIndex++) {
    const prevValue = localStorage.getItem(`cell-${rowIndex}-${colIndex}-${previousWeek}`);
    if (prevValue !== null) {
        saveCellValue(savedRowCount, colIndex, prevValue, currentWeek);
        // Also update the contentEditable divs that were just created
        const cellKey = `cell-${savedRowCount}-${colIndex}-${currentWeek}`;
        const editDiv = document.querySelector(`[data-key="${cellKey}"]`);
        if (editDiv) editDiv.innerText = prevValue;
    }
}
rowIndex++;
savedRowCount++;
rowsLoaded++;
createPermanentChecklist();
    }

    if (rowsLoaded > 0) {
        localStorage.setItem(`savedRowCount-${currentWeek}`, savedRowCount);
        createPermanentChecklist();
        console.log(`✅ Loaded ${rowsLoaded} rows from last week into current week.`);
    } else {
        console.log(`⚠️ No previous week data found to load.`);
    }
}
