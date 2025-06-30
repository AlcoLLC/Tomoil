document.addEventListener("DOMContentLoaded", function () {
  initSimpleDatePicker("datepicker");
  initSimpleDatePicker("datepicker2");
});

function initSimpleDatePicker(inputId) {
  const dateInput = document.getElementById(inputId);
  const calendarIcon = dateInput
    .closest(".date-input")
    .querySelector(".calendar-icon");
  const dateFilterContainer = dateInput.closest(".date-input");

  if (!dateInput || !calendarIcon || !dateFilterContainer) return;

  const calendarContainer = document.createElement("div");
  calendarContainer.className = "simple-calendar";
  dateFilterContainer.appendChild(calendarContainer);

  let currentDate = new Date();
  let selectedDate = null;

  if (dateInput.value) {
    const initialDate = parseInputDate(dateInput.value);
    if (initialDate) {
      selectedDate = initialDate;
      currentDate = new Date(
        initialDate.getFullYear(),
        initialDate.getMonth(),
        1
      );
    }
  }

  function parseInputDate(dateStr) {
    const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = dateStr.match(regex);

    if (!match) return null;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
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

  calendarIcon.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleCalendar();
  });

  dateInput.addEventListener("click", function (e) {
    if (window.getSelection().toString() === "") {
      e.stopPropagation();
      toggleCalendar();
    }
  });

  function toggleCalendar() {
    document.querySelectorAll(".simple-calendar.active").forEach((cal) => {
      if (cal !== calendarContainer) {
        cal.classList.remove("active");
      }
    });

    if (calendarContainer.classList.contains("active")) {
      calendarContainer.classList.remove("active");
    } else {
      renderCalendar();
      calendarContainer.classList.add("active");
    }
  }

  document.addEventListener("click", function (e) {
    if (
      !calendarContainer.contains(e.target) &&
      e.target !== calendarIcon &&
      e.target !== dateInput
    ) {
      calendarContainer.classList.remove("active");

      if (dateInput.value.length > 0) {
        if (dateInput.value.length < 10) {
          dateFilterContainer.classList.add("error");
        } else {
          validateDate(dateInput.value, false);
        }
      }
    }
  });

  dateInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      calendarContainer.classList.remove("active");
    } else if (e.key === "Enter") {
      if (dateInput.value.length === 10) {
        const isValid = validateDate(dateInput.value, true);
        if (isValid) {
          e.preventDefault();
          submitForm();
        }
      }
      calendarContainer.classList.remove("active");
    }
  });

  dateInput.addEventListener("input", function (e) {
    let value = e.target.value;

    value = value.replace(/[^\d.]/g, "");

    if (value.length > 2 && value.charAt(2) !== ".") {
      value = value.slice(0, 2) + "." + value.slice(2);
    }
    if (value.length > 5 && value.charAt(5) !== ".") {
      value = value.slice(0, 5) + "." + value.slice(5);
    }

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    e.target.value = value;

    if (value.length === 10) {
      validateDate(value, false);
    } else {
      dateFilterContainer.classList.remove("error");
    }
  });

  dateInput.addEventListener("blur", function () {
    if (dateInput.value.length > 0 && dateInput.value.length < 10) {
      dateFilterContainer.classList.add("error");
    } else if (dateInput.value.length === 10) {
      validateDate(dateInput.value, false);
    }
  });

  function validateDate(dateStr, submitOnValid = false) {
    const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = dateStr.match(regex);

    if (!match) {
      dateFilterContainer.classList.add("error");
      return false;
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);

    const date = new Date(year, month, day);


    if (
      date.getDate() !== day ||
      date.getMonth() !== month ||
      date.getFullYear() !== year ||
      year < 1900 ||
      year > 2100
    ) {
      dateFilterContainer.classList.add("error");
      return false;
    }
    dateFilterContainer.classList.remove("error");
    selectedDate = date;
    currentDate = new Date(year, month, 1);

    if (submitOnValid) {
      submitForm();
    }

    return true;
  }

  function submitForm() {
    const pageInput = document.querySelector('input[name="page"]');
    if (pageInput) {
      pageInput.remove();
    }
  }

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let calendarHTML = `
      <div class="calendar-header">
        <div class="month-year">${monthNames[month]} ${year}</div>
        <div class="calendar-nav">
          <button type="button" class="prev-month"><i class="fas fa-chevron-left"></i></button>
          <button type="button" class="next-month"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
      <div class="calendar-body">
    `;

    dayNames.forEach((day) => {
      calendarHTML += `<div class="weekday">${day}</div>`;
    });

    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      calendarHTML += `<div class="day other-month">${day}</div>`;
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();

    for (let i = 1; i <= lastDay.getDate(); i++) {
      let classes = "day";

      if (i === currentDay && month === currentMonth && year === currentYear) {
        classes += " today";
      }

      if (
        selectedDate &&
        i === selectedDate.getDate() &&
        month === selectedDate.getMonth() &&
        year === selectedDate.getFullYear()
      ) {
        classes += " selected";
      }

      calendarHTML += `<div class="${classes}" data-day="${i}">${i}</div>`;
    }

    const daysShown = startDay + lastDay.getDate();
    const rowsNeeded = Math.ceil(daysShown / 7);
    const totalCells = rowsNeeded * 7;
    const nextMonthDays = totalCells - daysShown;

    for (let i = 1; i <= nextMonthDays; i++) {
      calendarHTML += `<div class="day other-month">${i}</div>`;
    }

    calendarHTML += "</div>";
    calendarContainer.innerHTML = calendarHTML;

    const dayElements = calendarContainer.querySelectorAll(
      ".day:not(.other-month)"
    );
    dayElements.forEach((dayElement) => {
      dayElement.addEventListener("click", function () {
        const day = parseInt(this.getAttribute("data-day"), 10);
        selectDate(day, month, year);
      });
    });

    const prevButton = calendarContainer.querySelector(".prev-month");
    const nextButton = calendarContainer.querySelector(".next-month");

    prevButton.addEventListener("click", function (e) {
      e.stopPropagation();
      currentDate.setMonth(currentDate.getMonth() - 1);

      if (currentDate.getMonth() === 11) {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
      }
      renderCalendar();
    });

    nextButton.addEventListener("click", function (e) {
      e.stopPropagation();
      currentDate.setMonth(currentDate.getMonth() + 1);
      if (currentDate.getMonth() === 0) {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
      renderCalendar();
    });

    const monthYearElement = calendarContainer.querySelector(".month-year");
    monthYearElement.addEventListener("click", function (e) {
      e.stopPropagation();
      const today = new Date();
      currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
      renderCalendar();
    });
  }
  function selectDate(day, month, year) {
    selectedDate = new Date(year, month, day);
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month + 1).padStart(2, "0");

    dateInput.value = `${formattedDay}.${formattedMonth}.${year}`;
    calendarContainer.classList.remove("active");
    dateFilterContainer.classList.remove("error");
  }
}

function clearDateFilter() {
  document.getElementById("datepicker").value = "";
  document.getElementById("datepicker2").value = "";

  const pageInput = document.querySelector('input[name="page"]');
  if (pageInput) {
    pageInput.remove();
  }

  document.getElementById("filter-form").submit();
}

document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.querySelector(".date-filter-container button");
  if (searchButton) {
    searchButton.addEventListener("click", function (e) {
      e.preventDefault();

      const pageInput = document.querySelector('input[name="page"]');
      if (pageInput) {
        pageInput.remove();
      }

      document.getElementById("filter-form").submit();
    });
  }
});

function initPagination() {
  const totalItems = 127;
  const itemsPerPage = 8;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  let currentPage = 1;
  updatePaginationInfo(currentPage, itemsPerPage, totalItems);
  createPaginationButtons(currentPage, totalPages);

  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("page-btn") ||
      e.target.parentElement.classList.contains("page-btn")
    ) {
      let button = e.target.classList.contains("page-btn")
        ? e.target
        : e.target.parentElement;

      if (!button.classList.contains("active")) {
        currentPage = parseInt(button.textContent);
        updatePaginationInfo(currentPage, itemsPerPage, totalItems);
        createPaginationButtons(currentPage, totalPages);

        document.querySelector(".main-case-section").scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  });
}

function updatePaginationInfo(currentPage, itemsPerPage, totalItems) {
  const paginationInfo = document.querySelector(".pagination-info");
  if (!paginationInfo) return;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  paginationInfo.textContent = `Displaying ${startItem}-${endItem} of ${totalItems} results`;
}

function createPaginationButtons(currentPage, totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

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
    const button = document.createElement("button");
    button.className = "page-btn";
    button.textContent = i;

    if (i === currentPage) {
      button.classList.add("active");
    }

    paginationContainer.appendChild(button);
  }
}

function filterByDate(day, month, year) {
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  const url = new URL(window.location.href);
  url.searchParams.set("created_at", formattedDate);
  url.searchParams.delete("page");

  window.location.href = url.toString();
}
