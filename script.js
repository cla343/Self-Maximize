function getCurrentWeekRange(date = new Date()) {
    let dayIndex = date.getDay();
    let daysToMonday = dayIndex === 1 ? 0 : (dayIndex === 0 ? 6 : dayIndex - 1);
    let startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    let startStr = startOfWeek.toISOString().split('T')[0]; // Format YYYY-MM-DD
    let endStr = endOfWeek.toISOString().split('T')[0]; // Format YYYY-MM-DD
    return `${startStr} - ${endStr}`;
}

const lastWeek = localStorage.getItem('lastWeek') || getCurrentWeekRange();
const week = document.querySelector('.week');
const weekContainer = document.createElement('div');
weekContainer.style.display = 'flex';
weekContainer.style.justifyContent = 'center';
weekContainer.style.alignItems = 'center';
const weekText = document.createElement('span');
weekText.textContent = lastWeek;
weekText.style.margin = '0 10px';
weekText.style.fontWeight = 'bold';
const weekTogglePrevious = document.createElement('button');
weekTogglePrevious.textContent = '<';
const weekToggleNext = document.createElement('button');
weekToggleNext.textContent = '>';
[weekTogglePrevious, weekToggleNext].forEach(button => {
    button.style.fontWeight = 'bold';
    button.style.margin = '0 10px';
    button.style.backgroundColor = 'lightgrey';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '5px';
    button.style.padding = '5px 10px';
});

function getStartDateFromWeekText(weekTextContent) {
    const weekStartDate = weekTextContent.split(' - ')[0];
    const parts = weekStartDate.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

weekTogglePrevious.onclick = () => {
    let currentStartDate = getStartDateFromWeekText(weekText.textContent);
    currentStartDate.setDate(currentStartDate.getDate() - 7);
    let previousWeek = getCurrentWeekRange(currentStartDate);
    weekText.textContent = previousWeek;
    localStorage.setItem('lastWeek', previousWeek);
    loadWeekData(previousWeek); 
};

weekToggleNext.onclick = () => {
    let currentStartDate = getStartDateFromWeekText(weekText.textContent);
    currentStartDate.setDate(currentStartDate.getDate() + 7);
    let nextWeek = getCurrentWeekRange(currentStartDate);
    weekText.textContent = nextWeek;        
    localStorage.setItem('lastWeek', nextWeek);
    loadWeekData(nextWeek);
};

function loadWeekData(weekRange) {
    input.innerText = localStorage.getItem(`primaryFocus-${weekRange}`) || '';
    notesInput.innerText = localStorage.getItem(`weeklyNotes-${weekRange}`) || '';
    const weekReview = document.querySelector('.recap');
    if (weekReview) {
        const recapInput = weekReview.querySelector('.recap-input');
        if (recapInput) {
            recapInput.innerText = localStorage.getItem(`weekRecap-${weekRange}`) || '';
        }
    }

    container.innerHTML = '';
    createPermanentRow();
    const rowCount = parseInt(localStorage.getItem(`savedRowCount-${weekRange}`) || '0', 10);
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const hasArea = localStorage.getItem(`cell-${rowIndex}-0-${weekRange}`) !== null;
        const hasGoal = localStorage.getItem(`cell-${rowIndex}-1-${weekRange}`) !== null;
        if (hasArea || hasGoal) {
            createRow(2, rowIndex, weekRange);
        }
}

savedRowCount = rowCount;
createPermanentChecklist();
}

weekContainer.appendChild(weekTogglePrevious);
weekContainer.appendChild(weekText);
weekContainer.appendChild(weekToggleNext);
week.appendChild(weekContainer);

const focus = document.querySelector('.primary-focus');
focus.innerHTML = '<span>Primary Focus:</span> <div class="focus-input" contenteditable="true"></div>';
const input = document.querySelector('.focus-input');
input.addEventListener('input', () => {
    const currentWeek = weekText.textContent;
    localStorage.setItem(`primaryFocus-${currentWeek}`, input.innerText);
});
focus.style.justifyContent = 'center';

const notes = document.querySelector('.notes');
const notesHeader = notes.querySelector('.header');
notesHeader.innerHTML = '<span>Notes & Adjustments for the Week</span> <div class="notes-input" contenteditable="true"></div>';
notesHeader.querySelector('span').style.fontSize = '20px';
notesHeader.querySelector('span').style.fontWeight = 'bold';
notesHeader.style.marginTop = '20px'; // Adjust the value as needed

const notesInput = notesHeader.querySelector('.notes-input');
const currentWeekRange =  getCurrentWeekRange();
notesInput.innerText = localStorage.getItem(`weeklyNotes-${currentWeekRange}`) || '';
notesInput.addEventListener('input', () => {
    const weekRange = getCurrentWeekRange();
    localStorage.setItem(`weeklyNotes-${weekRange}`, notesInput.innerText);
});

const container = document.createElement('div');
container.classList.add('grid');
document.querySelector('.grid-1').appendChild(container);

function createPermanentRow() {
    const row = document.createElement('div');
    row.classList.add('grid-row', 'grid-header');
    row.style.display = 'grid';
    row.style.columnGap = '10px';
    row.style.gridTemplateColumns = '.5fr 1fr auto';
    row.style.fontWeight = 'bold';
    row.style.backgroundColor = '#f0f0f0';

    const areaCell = document.createElement('div');
    areaCell.innerText = 'Area';
    areaCell.style.padding = '10px';
    areaCell.style.textAlign = 'center';
    row.appendChild(areaCell);
    areaCell.style.border = '1px solid lightgrey';

    const goalCell = document.createElement('div');
    goalCell.innerText = 'Goal';
    goalCell.style.padding = '10px';
    goalCell.style.textAlign = 'center';
    row.appendChild(goalCell);
    goalCell.style.border = '1px solid lightgrey';

    const emptyCell = document.createElement('div');
    emptyCell.innerText = '';
    emptyCell.style.padding = '0 44px';
    emptyCell.style.textAlign = 'center';
    row.appendChild(emptyCell);

    container.appendChild(row);
}

createPermanentRow();

    function createRow(columns = 2, rowIndex = savedRowCount, weekRange = getCurrentWeekRange()) {
    const row = document.createElement('div');
    row.classList.add('grid-row');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '.5fr 1fr auto';
    row.style.columnGap = '10px';

    for (let colIndex = 0; colIndex < columns; colIndex++) {
        const cell = document.createElement('div');
        const editDiv = document.createElement('div');
        editDiv.contentEditable = 'true';
        editDiv.classList.add(colIndex === 0 ? 'area-input' : 'goal-input');
        editDiv.innerText = getSavedCellValue(rowIndex, colIndex, weekRange);
        editDiv.dataset.key = `cell-${rowIndex}-${colIndex}-${weekRange}`;
        editDiv.addEventListener('input', () => saveCellValue(rowIndex, colIndex, editDiv.innerText, weekRange));
        cell.appendChild(editDiv);
        cell.style.border = '1px solid lightgrey';
        cell.style.padding = '10px';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Row';
    deleteButton.style.backgroundColor = 'red';
    deleteButton.style.color = 'black';
    deleteButton.style.border = 'none';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.borderRadius = '5px';
    deleteButton.style.padding = '5px 10px';
    deleteButton.onclick = () => {
        const rowIndex = Array.from(container.children).indexOf(row); 
        container.removeChild(row);
        updateRowIndices(); // Important
        rows.forEach((row, index) => {
        const area = row.querySelector('.area-input')?.innerText || '';
        const goal = row.querySelector('.goal-input')?.innerText || '';

        localStorage.setItem(`cell-${index}-0-${weekRange}`, area);
        localStorage.setItem(`cell-${index}-1-${weekRange}`, goal);
    });

    savedRowCount = rows.length - 1;
    localStorage.setItem(`savedRowCount-${weekRange}`, savedRowCount);
}

    const deleteCell = document.createElement('div');
    deleteCell.appendChild(deleteButton);
    deleteCell.style.display = 'flex';
    deleteCell.style.justifyContent = 'center';
    deleteCell.style.alignItems = 'center';
    row.appendChild(deleteCell);

    container.appendChild(row);
}

const weekRange = getCurrentWeekRange();
let savedRowCount = localStorage.getItem(`savedRowCount-${weekRange}`);
if (savedRowCount === null) {
    savedRowCount = 0;
    localStorage.setItem(`savedRowCount-${weekRange}`, savedRowCount);
} else {
    savedRowCount = parseInt(savedRowCount, 10);
}

function updateRowIndices() {
    const weekRange = getCurrentWeekRange(); 
    const rows = container.querySelectorAll('.grid-row');

    rows.forEach((row, newIndex) => {
        if (newIndex === 0) return; // Skip permanent row
        const area = row.querySelector('.area-input')?.innerText || '';
        const goal = row.querySelector('.goal-input')?.innerText || '';
        
        localStorage.setItem(`cell-${newIndex}-0-${weekRange}`, area);
        localStorage.setItem(`cell-${newIndex}-1-${weekRange}`, goal);
    });

    savedRowCount = rows.length -1;
    localStorage.setItem(`savedRowCount-${weekRange}`, savedRowCount);
}

function loadSavedRows() {
    const weekRange = getCurrentWeekRange();
    const savedRowCount = parseInt(localStorage.getItem(`row-count-${weekRange}`)) || 0;
    container.innerHTML = '';
    createPermanentRow();
    for (let rowIndex = 0; rowIndex < savedRowCount; rowIndex++) {
        createRow(2, rowIndex, weekRange);
    }
}

loadSavedRows();

function saveCellValue(rowIndex, colIndex, value, weekRange = getCurrentWeekRange()) {
    const key = `cell-${rowIndex}-${colIndex}-${weekRange}`;
    localStorage.setItem(key, value);
}

function getSavedCellValue(row, col, weekRange = getCurrentWeekRange()) {
    const key = `cell-${row}-${col}-${weekRange}`;
    return localStorage.getItem(key) || '';
}

function removeRowFromStorage(rowIndex, weekRange = getCurrentWeekRange()) {
    const colCount = 2;
    for (let col = 0; col < colCount; col++) {
        const key = `cell-${rowIndex}-${col}-${weekRange}`;
        localStorage.removeItem(key); 
    }
}

const addRowButton = document.createElement('button');
addRowButton.textContent = 'Add Row';
addRowButton.style.backgroundColor = 'green';
addRowButton.style.color = 'white';
addRowButton.style.border = 'none';
addRowButton.style.cursor = 'pointer';
addRowButton.style.borderRadius = '5px';
addRowButton.style.padding = '5px 10px';
addRowButton.onclick = () => {
    const weekRange = weekText.textContent;
    createRow(2, savedRowCount, weekRange);
    savedRowCount++;
    localStorage.setItem(`savedRowCount-${weekRange}`, savedRowCount);
    createPermanentChecklist();
};
const grid1 = document.querySelector('.grid-1');
grid1.appendChild(addRowButton);

const currentWeek = getCurrentWeekRange();

if (currentWeek !== lastWeek) {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('weekly-') && !key.includes(currentWeek)) {
            localStorage.removeItem(key);
        }
    });
    localStorage.setItem('lastWeek', currentWeek);
}

notesHeader.appendChild(notesInput);

const savedFocus = localStorage.getItem('primaryFocus');
if (savedFocus) {
    input.innerText = savedFocus;
}

function createPermanentChecklist() {
    const habitTracker = document.querySelector('.habit-tracker');
    if (!habitTracker) return;

    let habitTrackerHead = habitTracker.querySelector('.header');
    
    // Create the header if it doesn't exist
    if (!habitTrackerHead) {
        habitTrackerHead = document.createElement('div');
        habitTrackerHead.classList.add('header');
        habitTracker.appendChild(habitTrackerHead);
    }

    //Style the header
    habitTrackerHead.innerHTML = 'Daily Habit Tracker';
    habitTrackerHead.style.marginTop = '30px'; 
    habitTrackerHead.style.marginBottom = '20px'; 
    habitTrackerHead.style.fontSize = '20px';
    habitTrackerHead.style.fontWeight = 'bold';

    localStorage.setItem('habitTrackerHeader', habitTrackerHead.innerText);

    const existingChecklist = habitTracker.querySelector('.headChecklist');
    if (existingChecklist) existingChecklist.remove();

    const areaInputs = document.querySelectorAll('.area-input');
    areaInputs.forEach((input, index) => {
        const savedName = localStorage.getItem(`areaName-${index}`);
        if (savedName) input.innerText = savedName;
    });

    const headChecklist = document.createElement('div');
    headChecklist.classList.add('headChecklist');
    headChecklist.style.backgroundColor = '#f0f0f0';
    headChecklist.style.fontWeight = 'bold';
    headChecklist.style.display = 'grid';
    headChecklist.style.gridTemplateColumns = `minmax(100px, 20%) repeat(${areaInputs.length}, 1fr)`;
    headChecklist.style.gridTemplateRows = 'repeat(8, auto)';  

    const dayHead = document.createElement('div');
    dayHead.innerText = 'Day';
    dayHead.style.border = '1px solid lightgrey';
    dayHead.style.padding = '10px';
    dayHead.style.textAlign = 'center';
    dayHead.style.gridRow = '1';
    dayHead.style.gridColumn = '1';
    headChecklist.appendChild(dayHead);

    const daysArray = 'Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split(' ');
    daysArray.forEach((day, rowIndex) => {
        const dayCell = document.createElement('div');
        dayCell.innerText = day;
        dayCell.style.padding = '10px';
        dayCell.style.textAlign = 'center';
        dayCell.style.border = '1px solid lightgrey';
        dayCell.style.gridColumn = '1';
        dayCell.style.gridRow = `${rowIndex + 2}`; // Start below headers
        headChecklist.appendChild(dayCell);
});

    areaInputs.forEach((input, index) => {
        const header = document.createElement('div');
        header.innerText = input.innerText || 'New Area';
        header.style.padding = '10px';
        header.style.textAlign = 'center';
        header.style.border = '1px solid lightgrey';
        header.style.gridRow = '1'; // Make sure it's on the first row
        header.style.gridColumn = `${index + 2}`; 
        headChecklist.appendChild(header);

        input.addEventListener('input', () => {
            const areaIndex = index;
            localStorage.setItem(`areaName-${areaIndex}`, input.innerText);
            header.innerText = input.innerText || 'New Area';
        });
    });

    areaInputs.forEach((input, index) => {
        const areaName = input.innerText || `New Area ${index + 1}`;
        // Loop through days and create checkboxes for each areaInput
        daysArray.forEach((day, rowIndex) => {
            const checkboxCell = document.createElement('div');
            checkboxCell.style.padding = '10px';
            checkboxCell.style.textAlign = 'center';
            checkboxCell.style.border = '1px solid lightgrey';
            checkboxCell.style.gridRow = `${rowIndex + 2}`;
            checkboxCell.style.gridColumn = `${index + 2}`;

            // Create a checkbox input
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('habit-checkbox');
            checkbox.dataset.area = areaName;
            checkbox.dataset.day = day; // Add data attribute for the day
            const key = `weekly-${currentWeek}-${areaName}-${day}`;
            checkbox.checked = localStorage.getItem(key) === 'true';
            checkbox.addEventListener('change', (event) => {
                const isChecked = event.target.checked;
                localStorage.setItem(key, isChecked);
            });

            const date = new Date();
            const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
            const days = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
            const weekNumber = Math.ceil((days + 1) / 7);

            // Append checkbox to the cell
            checkboxCell.appendChild(checkbox);
            headChecklist.appendChild(checkboxCell);

        });
    });

    habitTracker.appendChild(headChecklist);
    applyDarkModeStyles(document.body.classList.contains('dark-mode'));
}

createPermanentChecklist();

document.addEventListener('DOMContentLoaded', () => {
const weekReview = document.querySelector('.recap');
if (!weekReview) return;
weekReview.innerHTML = '<span>End of Week Review</span> <div class="recap-input" contenteditable="true"></div>';
const recapInput = weekReview.querySelector('.recap-input');
const currentWeekRange = getCurrentWeekRange(); // ✅ Call the function
recapInput.innerText = localStorage.getItem(`weekRecap-${currentWeekRange}`) || '';
recapInput.addEventListener('input', () => {
    const weekRange = getCurrentWeekRange(); // Recalculate in case the week changed
    localStorage.setItem(`weekRecap-${weekRange}`, recapInput.innerText);
});
weekReview.style.marginTop = '30px'; // Adjust the value as needed
weekReview.querySelector('span').style.fontSize = '20px';
weekReview.querySelector('span').style.fontWeight = 'bold'; 
recapInput.style.marginTop = '30px'; // Adjust the value as needed
});

document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');

    if (darkModeToggle) {
        const savedMode = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.checked = savedMode;
        document.body.classList.toggle('dark-mode', savedMode);

        applyDarkModeStyles(savedMode);

        darkModeToggle.addEventListener('change', () => {
            const isDarkMode = darkModeToggle.checked;
            document.body.classList.toggle('dark-mode', isDarkMode);
            localStorage.setItem('darkMode', isDarkMode);
            applyDarkModeStyles(isDarkMode);
            });
    }
});

function applyDarkModeStyles(isDarkMode) {
    document.querySelectorAll('.grid-row').forEach(row => {
        row.style.backgroundColor = isDarkMode ? 'black' : '#fff';
    });

    document.querySelectorAll('.grid-header').forEach(header => {
        header.style.backgroundColor = isDarkMode ? '#333' : '#f0f0f0';
        header.style.color = isDarkMode ? '#fff' : '#000';
    });

    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.backgroundColor = isDarkMode ? '#444' : '#fff';
        cell.style.color = isDarkMode ? '#ddd' : '#000';
    });

    /* document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.style.accentColor = isDarkMode ? '#555' : '##89CFF0';
    }); */

    const recapInput = document.querySelector('.recap-input');
    if (recapInput) {
        recapInput.style.backgroundColor = isDarkMode ? 'black' : 'white';
        recapInput.style.color = isDarkMode ? '#fff' : '#000';
    }

    const weekReview = document.querySelector('.recap');
    if (weekReview) {
        weekReview.style.backgroundColor = isDarkMode ? 'black' : 'white';  // Adjust for dark mode
        weekReview.style.color = isDarkMode ? '#fff' : '#000';  // Adjust for dark mode text color
    }
}

document.body.style.transition = 'background-color 0.3s, color 0.3s';

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const prefersDark = e.matches;
    document.body.classList.toggle('dark-mode', prefersDark);
    localStorage.setItem('darkMode', prefersDark);
    applyDarkModeStyles(prefersDark);
});

const savedMode = localStorage.getItem('darkMode') === 'true';
applyDarkModeStyles(savedMode); // Apply saved mode on page load

loadWeekData(lastWeek);
