import {
    getCurrentWeekRange,
    getPreviousWeekRange,
    createPermanentChecklist
} from './script.js';

function normalizeWeekRange(weekRange) {
    // If previous week uses underscores, convert to spaces and " - "
    // Example: "2025-05-05_to_2025-05-11" → "2025-05-05 - 2025-05-11"
    return weekRange.replace(/_/g, ' ').replace(' to ', ' - ');
}

export function loadLastWeeksNotes() {
    const lastWeek = localStorage.getItem('lastWeek');
    console.log('lastWeek:', lastWeek);

    const notes = document.querySelector('.notes');
    const notesHeader = notes.querySelector('.header');

    // Make sure you declare before use
    if (!notesHeader) {
        console.warn('Notes header not found');
        return;
    }

    const currentWeek = getCurrentWeekRange();
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
            const confirmLoad = confirm(`Load last week's Notes inputs?`);
            if (confirmLoad) loadPreviousWeekData();
        });
    };
    

    setupHoverAndClick(notesHeader, 'notes');
}

function loadPreviousWeekData() {
    const currentWeek = getCurrentWeekRange();
    let previousWeek = normalizeWeekRange(getPreviousWeekRange());

    console.log('Normalized previousWeek:', previousWeek);

    const prevValue = localStorage.getItem(`weeklyNotes-${previousWeek}`);

    if (!prevValue) {
        console.log('⚠️ No previous week notes found');
        return;
    }

    // Insert into DOM and localStorage
    const notesInput = document.querySelector('.notes-input');
    if (notesInput) {
        notesInput.innerText = prevValue;
        localStorage.setItem(`weeklyNotes-${currentWeek}`, prevValue);
        console.log(`✅ Loaded notes from ${previousWeek} into ${currentWeek}`);
    } else {
        console.warn('⚠️ .notes-input div not found');
    }

    createPermanentChecklist();
}