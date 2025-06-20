export function getDisplayedWeek() {
    const raw = document.querySelector('.week-text')?.textContent || '';
    return raw.replace('📅 ', '').trim();
}