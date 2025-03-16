function getCurrentWeekRange() {
    let today = new Date();
    let dayIndex = today.getDay();

    let daysToMonday = dayIndex === 0 ? 6 : dayIndex - 1;

    let startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);

    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    let options = {
        month: 'short', day: 'numeric'
    };
    let startStr = startOfWeek.toLocaleDateString('en-US', options);
    let endStr = endOfWeek.toLocaleDateString('en-US', options);

    return `${startStr} - ${endStr}`;
}

const lastWeek = localStorage.getItem('lastWeek');

const week = document.querySelector('.week');
week.textContent = getCurrentWeekRange();

const focus = document.querySelector('.primary-focus');
focus.innerHTML = '<span>Primary Focus:</span> <div class="focus-input" contenteditable="true"></div>';

const input = document.querySelector('.focus-input');
input.addEventListener('input', () => {
    localStorage.setItem('primaryFocus', input.innerText);
});

const notes = document.querySelector('.notes');
const notesHeader = notes.querySelector('.header');

notesHeader.innerHTML = '<span>Notes & Adjustments for the Week</span> <div class="notes-input" contenteditable="true"></div>';
notesHeader.querySelector('span').style.fontSize = '18px';
notesHeader.querySelector('span').style.fontWeight = 'bold';

const notesInput = notesHeader.querySelector('.notes-input');
notesInput.innerText = localStorage.getItem('weeklyNotes') || '';
notesInput.addEventListener('input', () => {
    localStorage.setItem('weeklyNotes', notesInput.innerText);
});

const container = document.createElement('div');
container.classList.add('grid');
document.querySelector('.grid-1').appendChild(container);

function createPermanentRow() {
    const row = document.createElement('div');
    row.classList.add('grid-row');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '.5fr 1fr';
    row.style.fontWeight = 'bold';
    row.style.backgroundColor = '#f0f0f0';

    const areaCell = document.createElement('div');
    areaCell.innerText = 'Area';
    areaCell.style.padding = '10px';
    areaCell.style.textAlign = 'center';
    row.appendChild(areaCell);

    const goalCell = document.createElement('div');
    goalCell.innerText = 'Goal';
    goalCell.style.padding = '10px';
    goalCell.style.textAlign = 'center';
    row.appendChild(goalCell);

    container.appendChild(row);
}

createPermanentRow();

function createRow(columns = 2, rowIndex = container.children.length) {
    const row = document.createElement('div');
    row.classList.add('grid-row');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '.5fr 1fr auto';

    for (let colIndex = 0; colIndex < columns; colIndex++) {
        const cell = document.createElement('div');
        const editDiv = document.createElement('div');
        editDiv.contentEditable = 'true';
        editDiv.classList.add(colIndex === 0 ? 'area-input' : 'goal-input');
        editDiv.innerText = getSavedCellValue(rowIndex, colIndex);
        editDiv.addEventListener('input', () => saveCellValue(rowIndex, colIndex, editDiv.innerText));
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
        const rowIndex = Array.from(container.children).indexOf(row); // **Updated deletion logic**
        container.removeChild(row);
        removeRowFromStorage(rowIndex);
        updateRowIndices();
    };

    const deleteCell = document.createElement('div');
    deleteCell.appendChild(deleteButton);
    deleteCell.style.display = 'flex';
    deleteCell.style.justifyContent = 'center';
    deleteCell.style.alignItems = 'center';
    row.appendChild(deleteCell);

    container.appendChild(row);
}

function updateRowIndices() {
    const rows = container.children;
    rows.forEach((row, rowIndex) => {
        const cells = row.children;
        for (let colIndex = 0; colIndex < cells.length - 1; colIndex++) {
            const oldKey = `cell-${rowIndex + 1}-${colIndex}-${getCurrentWeekRange()}`;
            const newKey = `cell-${rowIndex}-${colIndex}-${getCurrentWeekRange()}`;
            const value = localStorage.getItem(oldKey);
            if (value) {
                localStorage.setItem(newKey, value);
                localStorage.removeItem(oldKey);
            }
        }
    });
}

function loadSavedRows() {
    let rowIndex = 0;
    while (true) {
        let cellValue = getSavedCellValue(rowIndex, 0);
        if (!cellValue && !getSavedCellValue(rowIndex, 1)) break;
        createRow(2, rowIndex);
        rowIndex++;
    }
}

function saveCellValue(row, col, value) {
    const key = `cell-${row}-${col}-${getCurrentWeekRange()}`;
    localStorage.setItem(key, value);
}

function getSavedCellValue(row, col) {
    const key = `cell-${row}-${col}-${getCurrentWeekRange()}`;
    return localStorage.getItem(key) || '';
}

function removeRowFromStorage(row) {
    const rowElement = container.children[row];
    if (!rowElement) return;

    const colCount = rowElement.children.length;

    for (let col = 0; col < colCount; col++) {
        const key = `cell-${row}-${col}-${getCurrentWeekRange()}`;
        localStorage.removeItem(key); // **Correctly removing stored row data**
    }
}

loadSavedRows();

const addRowButton = document.createElement('button');
addRowButton.textContent = 'Add Row';
addRowButton.style.backgroundColor = 'green';
addRowButton.style.color = 'white';
addRowButton.style.border = 'none';
addRowButton.style.cursor = 'pointer';
addRowButton.style.borderRadius = '5px';
addRowButton.style.padding = '5px 10px';
addRowButton.onclick = () => createRow(2, container.children.length);
const grid1 = document.querySelector('.grid-1');
grid1.appendChild(addRowButton);

const currentWeek = getCurrentWeekRange();

if (currentWeek !== lastWeek) {
    Object.keys(localStorage).forEach(key => {
        if (key !== 'lastWeek') localStorage.removeItem(key); // **Clearing out old week data**
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
    const habitTrackerHead = habitTracker.querySelector('.header');

    habitTrackerHead.innerHTML = 'Daily Habit Tracker';
    habitTrackerHead.style.fontSize = '18px';
    habitTrackerHead.style.fontWeight = 'bold';

    const existingChecklist = habitTracker.querySelector('.headChecklist');
    if (existingChecklist) existingChecklist.remove();

    const headChecklist = document.createElement('div');
    headChecklist.classList.add('headChecklist');
    headChecklist.style.backgroundColor = '#f0f0f0';
    headChecklist.style.fontWeight = 'bold';
    headChecklist.style.display = 'grid';
    headChecklist.style.gridTemplateColumns = 'repeat(auto-fit, minmax(100px, 1fr))';

    const dayHead = document.createElement('div');
    dayHead.innerText = 'Day';
    dayHead.style.padding = '10px';
    dayHead.style.textAlign = 'center';
    headChecklist.appendChild(dayHead);

    if (document.querySelectorAll('.area-input').length === 0) {
        createRow();
    }

    const areaInputs = document.querySelectorAll('.area-input');

    areaInputs.forEach(input => {
        const header = document.createElement('div');
        header.innerText = input.innerText || 'New Area';
        header.style.padding = '10px';
        header.style.textAlign = 'center';
        headChecklist.appendChild(header);
    });

    habitTracker.appendChild(headChecklist);
}

createPermanentChecklist();

localStorage.setItem(`habitTracker-${index}`, header.innerText);

createRow();
saveCellValue(0, 0, '');
saveCellValue(0, 1, '');
