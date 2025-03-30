function getCurrentWeekRange() {
    let today = new Date();
    let dayIndex = today.getDay();
    let daysToMonday = dayIndex === 0 ? 6 : dayIndex - 1;
    let startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
    let endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    let startStr = startOfWeek.toISOString().split('T')[0]; // Format YYYY-MM-DD
    let endStr = endOfWeek.toISOString().split('T')[0]; // Format YYYY-MM-DD
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

function createRow(columns = 2, rowIndex = savedRowCount) {
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
        const rowIndex = Array.from(container.children).indexOf(row); 
        container.removeChild(row);
        removeRowFromStorage(rowIndex);
        updateRowIndices();
        createPermanentChecklist(); 
    };

    const deleteCell = document.createElement('div');
    deleteCell.appendChild(deleteButton);
    deleteCell.style.display = 'flex';
    deleteCell.style.justifyContent = 'center';
    deleteCell.style.alignItems = 'center';
    row.appendChild(deleteCell);

    container.appendChild(row);
}

let savedRowCount = parseInt(localStorage.getItem('savedRowCount') || '0', 10);

localStorage.setItem('savedRowCount', savedRowCount);

function updateRowIndices() {
    const rows = container.children;
    const weekRange = getCurrentWeekRange(); 
    Array.from(rows).forEach((row, rowIndex) => {
        if (rowIndex === 0) return;
        const cells = row.children;
        for (let colIndex = 0; colIndex < cells.length - 1; colIndex++) {
            const oldKey = `cell-${rowIndex + 1}-${colIndex}-${getCurrentWeekRange()}`;
            const newKey = `cell-${rowIndex}-${colIndex}-${weekRange}`;
            const value = localStorage.getItem(oldKey);
            if (value) {
                localStorage.setItem(newKey, value);
                localStorage.removeItem(oldKey);
            }
        }
    });
    savedRowCount = rows.length - 1;
    localStorage.setItem('savedRowCount', savedRowCount);
}

function loadSavedRows() {
    const savedRowCount = parseInt(localStorage.getItem('savedRowCount') || '0', 10);
    container.innerHTML = '';
    createPermanentRow();
    for (let rowIndex = 0; rowIndex < savedRowCount; rowIndex++) {
        createRow(2, rowIndex);
    }
}

loadSavedRows();

function saveCellValue(rowIndex, colIndex, value) {
    const key = `cell-${rowIndex}-${colIndex}`;
    localStorage.setItem(key, value);
}

function getSavedCellValue(row, col) {
    const key = `cell-${row}-${col}`;
    return localStorage.getItem(key) || '';
}

function removeRowFromStorage(rowIndex) {
    const colCount = 2;
    for (let col = 0; col < colCount; col++) {
        const key = `cell-${rowIndex}-${col}`;
        localStorage.removeItem(key); 
    }
    updateRowIndices();
    localStorage.setItem('savedRowCount', savedRowCount - 1); 
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
createRow(2, savedRowCount);
savedRowCount++;
localStorage.setItem('savedRowCount', savedRowCount);
createPermanentChecklist(); // Update headers after adding row
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
    habitTrackerHead.style.fontSize = '18px';
    habitTrackerHead.style.fontWeight = 'bold';

    localStorage.setItem('habitTrackerHeader', habitTrackerHead.innerText);

    const existingChecklist = habitTracker.querySelector('.headChecklist');
    if (existingChecklist) existingChecklist.remove();

    const areaInputs = document.querySelectorAll('.area-input');

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
        dayCell.style.gridColumn = '1';
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
            header.innerText = input.innerText || 'New Area'; // Update the header text
        });
    });

    areaInputs.forEach((input, index) => {
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
            checkbox.dataset.area = input.innerText || 'New Area'; // Add data attribute to identify area
            checkbox.dataset.day = day; // Add data attribute for the day

            // Add event listener to toggle checked state
            checkbox.addEventListener('change', (event) => {
                // Optionally, store state in localStorage if needed
                console.log(`Checkbox for ${event.target.dataset.day} in ${event.target.dataset.area} was ${event.target.checked ? 'checked' : 'unchecked'}`);
            });

            // Append checkbox to the cell
            checkboxCell.appendChild(checkbox);
            headChecklist.appendChild(checkboxCell);
        });
    });

    habitTracker.appendChild(headChecklist);
}

createPermanentChecklist();