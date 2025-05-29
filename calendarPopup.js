export function createCalendarPopup(onDateSelect) {
    const popup = document.createElement('div');
    popup.className = 'calendar-popup';
    popup.style.position = 'absolute';
    popup.style.top = '60px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '10px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = '9999';

    let selectedDate = new Date();
    renderCalendar();

    function renderCalendar() {
        popup.innerHTML = '';

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';

        const prevYearBtn = document.createElement('button');
        const prevMonthBtn = document.createElement('button');
        const nextMonthBtn = document.createElement('button');
        const nextYearBtn = document.createElement('button');
        const closeBtn = document.createElement('button');

        [prevYearBtn, prevMonthBtn, nextMonthBtn, nextYearBtn, closeBtn].forEach(btn => {
            btn.style.border = 'none';
            btn.style.background = 'none';
            btn.style.fontSize = '16px';
            btn.style.cursor = 'pointer';
        });

        prevYearBtn.textContent = '<<';
        prevMonthBtn.textContent = '<';
        nextMonthBtn.textContent = '>';
        nextYearBtn.textContent = '>>';
        closeBtn.textContent = '✖';

        const monthYear = document.createElement('span');
        monthYear.textContent = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthYear.style.fontWeight = 'bold';

        prevYearBtn.onclick = () => { selectedDate.setFullYear(selectedDate.getFullYear() - 1); renderCalendar(); };
        prevMonthBtn.onclick = () => { selectedDate.setMonth(selectedDate.getMonth() - 1); renderCalendar(); };
        nextMonthBtn.onclick = () => { selectedDate.setMonth(selectedDate.getMonth() + 1); renderCalendar(); };
        nextYearBtn.onclick = () => { selectedDate.setFullYear(selectedDate.getFullYear() + 1); renderCalendar(); };
        closeBtn.onclick = () => popup.remove();

        const headerLeft = document.createElement('div');
        headerLeft.append(prevYearBtn, prevMonthBtn);

        const headerRight = document.createElement('div');
        headerRight.append(nextMonthBtn, nextYearBtn, closeBtn);

        header.append(headerLeft, monthYear, headerRight);

        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        grid.style.gap = '5px';

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const cell = document.createElement('div');
            cell.textContent = day;
            cell.style.fontWeight = 'bold';
            cell.style.textAlign = 'center';
            grid.appendChild(cell);
        });

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            grid.appendChild(empty);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.textContent = day;
            cell.style.textAlign = 'center';
            cell.style.cursor = 'pointer';
            cell.style.padding = '5px';
            cell.style.borderRadius = '5px';

            cell.onmouseenter = () => cell.style.background = '#eee';
            cell.onmouseleave = () => cell.style.background = '';
            cell.onclick = () => {
                const selected = new Date(year, month, day);
                onDateSelect(selected);
                popup.remove();
            };

            grid.appendChild(cell);
        }

        popup.appendChild(header);
        popup.appendChild(grid);
    }

    return popup;
}
