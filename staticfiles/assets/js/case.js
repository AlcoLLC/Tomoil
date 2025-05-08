document.addEventListener('DOMContentLoaded', function () {
    // Initialize Simple Date Picker
    initSimpleDatePicker();

    // Initialize Pagination
    initPagination();
});

function initSimpleDatePicker() {
    const dateInput = document.getElementById('datepicker');
    const calendarIcon = document.querySelector('.calendar-icon');
    const dateFilterContainer = document.querySelector('.date-input');

    if (!dateInput || !calendarIcon || !dateFilterContainer) return;

    const calendarContainer = document.createElement('div');
    calendarContainer.className = 'simple-calendar';
    dateFilterContainer.appendChild(calendarContainer);

    let currentDate = new Date();
    let selectedDate = null;

    if (dateInput.value) {
        const initialDate = parseInputDate(dateInput.value);
        if (initialDate) {
            selectedDate = initialDate;
            currentDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
        }
    }

    function parseInputDate(dateStr) {
        const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
        const match = dateStr.match(regex);

        if (!match) return null;

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // 0-based month
        const year = parseInt(match[3], 10);

        const date = new Date(year, month, day);

        if (
            date.getDate() !== day ||
            date.getMonth() !== month ||
            date.getFullYear() !== year ||
            year < 1900 ||
            year > 2100
        ) {
            return null;
        }

        return date;
    }

    calendarIcon.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleCalendar();
    });

    dateInput.addEventListener('click', function (e) {
        if (window.getSelection().toString() === '') {
            e.stopPropagation();
            toggleCalendar();
        }
    });

    function toggleCalendar() {
        if (calendarContainer.classList.contains('active')) {
            calendarContainer.classList.remove('active');
        } else {
            renderCalendar();
            calendarContainer.classList.add('active');
        }
    }

    // Close calendar when clicking outside
    document.addEventListener('click', function (e) {
        if (!calendarContainer.contains(e.target) && e.target !== calendarIcon && e.target !== dateInput) {
            calendarContainer.classList.remove('active');

            if (dateInput.value.length > 0) {
                if (dateInput.value.length < 10) {
                    dateFilterContainer.classList.add('error');
                } else {
                    validateDate(dateInput.value);
                }
            }
        }
    });

    // Add keyboard support: Escape to close, Enter to apply
    dateInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            calendarContainer.classList.remove('active');
        } else if (e.key === 'Enter') {
            if (dateInput.value.length === 10) {
                validateDate(dateInput.value);
            }
            calendarContainer.classList.remove('active');
        }
    });

    // Input validation and formatting
    dateInput.addEventListener('input', function (e) {
        let value = e.target.value;

        value = value.replace(/[^\d.]/g, '');

        if (value.length > 2 && value.charAt(2) !== '.') {
            value = value.slice(0, 2) + '.' + value.slice(2);
        }
        if (value.length > 5 && value.charAt(5) !== '.') {
            value = value.slice(0, 5) + '.' + value.slice(5);
        }

        if (value.length > 10) {
            value = value.slice(0, 10);
        }

        e.target.value = value;

        if (value.length === 10) {
            validateDate(value);
        } else {
            dateFilterContainer.classList.remove('error');
        }
    });

    // Add blur event to validate when leaving field
    dateInput.addEventListener('blur', function () {
        if (dateInput.value.length > 0 && dateInput.value.length < 10) {
            dateFilterContainer.classList.add('error');
        } else if (dateInput.value.length === 10) {
            validateDate(dateInput.value);
        }
    });

    // Validate date format
    function validateDate(dateStr) {
        const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
        const match = dateStr.match(regex);

        if (!match) {
            dateFilterContainer.classList.add('error');
            return false;
        }

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const year = parseInt(match[3], 10);

        const date = new Date(year, month, day);

        // Check if date is valid
        if (
            date.getDate() !== day ||
            date.getMonth() !== month ||
            date.getFullYear() !== year ||
            year < 1900 ||
            year > 2100
        ) {
            dateFilterContainer.classList.add('error');
            return false;
        }

        // Valid date
        dateFilterContainer.classList.remove('error');
        selectedDate = date;
        currentDate = new Date(year, month, 1);

        // Filter by this date if needed
        filterByDate(day, month + 1, year);

        // If calendar is open, update the view to match the entered date
        if (calendarContainer.classList.contains('active')) {
            renderCalendar();
        }

        return true;
    }

    // Render the calendar with current month and year
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Calendar structure
        let calendarHTML = `
        <div class="calendar-header">
          <div class="month-year">${monthNames[month]} ${year}</div>
          <div class="calendar-nav">
            <button class="prev-month"><i class="fas fa-chevron-left"></i></button>
            <button class="next-month"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
        <div class="calendar-body">
      `;

        // Weekday headers
        dayNames.forEach(day => {
            calendarHTML += `<div class="weekday">${day}</div>`;
        });

        // Get starting day of week (0 = Sunday, adjusting to Monday start)
        let startDay = firstDay.getDay();
        // Convert Sunday (0) to 6 for proper positioning
        startDay = startDay === 0 ? 6 : startDay - 1;

        // Previous month days
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();

        for (let i = startDay - 1; i >= 0; i--) {
            const day = prevMonthDays - i;
            calendarHTML += `<div class="day other-month">${day}</div>`;
        }

        // Current month days
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const currentDay = today.getDate();

        for (let i = 1; i <= lastDay.getDate(); i++) {
            let classes = 'day';

            // Check if this day is today
            if (i === currentDay && month === currentMonth && year === currentYear) {
                classes += ' today';
            }

            // Check if this day is selected
            if (selectedDate && i === selectedDate.getDate() &&
                month === selectedDate.getMonth() &&
                year === selectedDate.getFullYear()) {
                classes += ' selected';
            }

            calendarHTML += `<div class="${classes}" data-day="${i}">${i}</div>`;
        }

        // Next month days to fill the calendar grid
        const daysShown = startDay + lastDay.getDate();
        const rowsNeeded = Math.ceil(daysShown / 7);
        const totalCells = rowsNeeded * 7;
        const nextMonthDays = totalCells - daysShown;

        for (let i = 1; i <= nextMonthDays; i++) {
            calendarHTML += `<div class="day other-month">${i}</div>`;
        }

        calendarHTML += '</div>';
        calendarContainer.innerHTML = calendarHTML;

        // Add click events to days
        const dayElements = calendarContainer.querySelectorAll('.day:not(.other-month)');
        dayElements.forEach(dayElement => {
            dayElement.addEventListener('click', function () {
                const day = parseInt(this.getAttribute('data-day'), 10);
                selectDate(day, month, year);
            });
        });

        // Add click events to navigation
        const prevButton = calendarContainer.querySelector('.prev-month');
        const nextButton = calendarContainer.querySelector('.next-month');

        prevButton.addEventListener('click', function (e) {
            e.stopPropagation();
            currentDate.setMonth(currentDate.getMonth() - 1);
            // If we go to previous year
            if (currentDate.getMonth() === 11) {
                currentDate.setFullYear(currentDate.getFullYear() - 1);
            }
            renderCalendar();
        });

        nextButton.addEventListener('click', function (e) {
            e.stopPropagation();
            currentDate.setMonth(currentDate.getMonth() + 1);
            // If we go to next year
            if (currentDate.getMonth() === 0) {
                currentDate.setFullYear(currentDate.getFullYear() + 1);
            }
            renderCalendar();
        });

        // Add month/year click to show current month/year
        const monthYearElement = calendarContainer.querySelector('.month-year');
        monthYearElement.addEventListener('click', function (e) {
            e.stopPropagation();
            // Reset to current month/year
            const today = new Date();
            currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
            renderCalendar();
        });
    }

    // Select a date from the calendar
    function selectDate(day, month, year) {
        selectedDate = new Date(year, month, day);

        // Format date as dd.mm.yyyy
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month + 1).padStart(2, '0');

        dateInput.value = `${formattedDay}.${formattedMonth}.${year}`;

        // Hide calendar after selection
        calendarContainer.classList.remove('active');

        // Remove error state if exists
        dateFilterContainer.classList.remove('error');

        // Filter data by selected date
        filterByDate(day, month + 1, year);
    }
}


// Pagination functionality
function initPagination() {
    const totalItems = 127;
    const itemsPerPage = 8;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    let currentPage = 1;
    updatePaginationInfo(currentPage, itemsPerPage, totalItems);
    createPaginationButtons(currentPage, totalPages);

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('page-btn') ||
            e.target.parentElement.classList.contains('page-btn')) {

            let button = e.target.classList.contains('page-btn') ?
                e.target : e.target.parentElement;

            if (!button.classList.contains('active')) {
                currentPage = parseInt(button.textContent);
                updatePaginationInfo(currentPage, itemsPerPage, totalItems);
                createPaginationButtons(currentPage, totalPages);

                document.querySelector('.main-case-section').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
}

function updatePaginationInfo(currentPage, itemsPerPage, totalItems) {
    const paginationInfo = document.querySelector('.pagination-info');
    if (!paginationInfo) return;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    paginationInfo.textContent = `Displaying ${startItem}-${endItem} of ${totalItems} results`;
}

function createPaginationButtons(currentPage, totalPages) {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > 3) {
        if (currentPage <= 2) {
            endPage = 3;
        } else if (currentPage >= totalPages - 1) {
            startPage = totalPages - 2;
        } else {
            startPage = currentPage - 1;
            endPage = currentPage + 1;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement('button');
        button.className = 'page-btn';
        button.textContent = i;

        if (i === currentPage) {
            button.classList.add('active');
        }

        paginationContainer.appendChild(button);
    }
}



function filterByDate(day, month, year) {

    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    console.log(`Filtering by date: ${formattedDate}`);
    initPagination();
}