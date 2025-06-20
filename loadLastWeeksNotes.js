import { createPermanentChecklist } from './script.js';

function getDisplayedWeek() {
    const raw = document.querySelector('.week-text')?.textContent || '';
    return raw.replace('📅 ', '').trim();
}

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

function getAllNoteIndicesForWeek(week) {
    const indices = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const match = key.match(/^notes-(\d+)-(.+)$/);
        if (match && match[2] === week) {
            indices.push(Number(match[1]));
        }
    }
    return indices.sort((a, b) => a - b);
}

export function loadLastWeeksNotes() {
    const notesHeader = document.querySelector('.notes .header');
    if (!notesHeader) {
        console.warn('❌ .notes .header not found');
        return;
    }

    // Avoid binding multiple times
    if (notesHeader.dataset.bound === 'true') return;

    notesHeader.style.cursor = 'pointer';

    notesHeader.addEventListener('mouseenter', () => {
        notesHeader.style.color = 'blue';
    });

    notesHeader.addEventListener('mouseleave', () => {
        notesHeader.style.color = '';
    });

    notesHeader.addEventListener('click', () => {
        const currentWeek = getDisplayedWeek();
        const previousWeek = getPreviousWeekFrom(currentWeek);

        // Check if notes already exist for current week
        const existingIndices = getAllNoteIndicesForWeek(currentWeek);
        if (existingIndices.length > 0) {
            alert("🛑 This week's notes already exist and won't be overwritten.");
            return;
        }

        // Get previous week notes indices
        const prevIndices = getAllNoteIndicesForWeek(previousWeek);
        if (prevIndices.length === 0) {
            alert("⚠️ No notes found for last week.");
            return;
        }

        prevIndices.forEach(i => {
            const prevNote = localStorage.getItem(`notes-${i}-${previousWeek}`);
            localStorage.setItem(`notes-${i}-${currentWeek}`, prevNote);

            // Update corresponding notes input if exists
            const noteInput = document.querySelector(`.notes-input[data-index="${i}"]`);
            if (noteInput) noteInput.innerText = prevNote;
        });

        createPermanentChecklist();
        alert("✅ Last week's notes loaded.");
        console.log(`📝 Loaded notes from ${previousWeek} into ${currentWeek}`);
    });

    notesHeader.dataset.bound = 'true';
}
