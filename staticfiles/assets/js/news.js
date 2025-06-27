document.addEventListener("DOMContentLoaded", function () {
  // Translation object - will be populated from Django context
  const translations = window.newsTranslations || {
    "No news items found matching your criteria.":
      "No news items found matching your criteria.",
    Displaying: "Displaying",
    of: "of",
    results: "results",
    "Failed to load news data. Please try again later.":
      "Failed to load news data. Please try again later.",
    "Read More": "Read More",
    Share: "Share",
  };

  // Translation function
  function _(key) {
    return translations[key] || key;
  }

  const state = {
    currentPage: 1,
    perPage: 12,
    sortBy: "relevance",
    searchQuery: "",
    startDate: "",
    endDate: "",
    view: "grid",
    currentLanguage: document.documentElement.lang || "en",
  };

  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    state.sortBy = params.get("sort_by") || "relevance";
    state.perPage = parseInt(params.get("per_page") || "12");
    state.currentPage = parseInt(params.get("page") || "1");
    state.searchQuery = params.get("search") || "";
    state.startDate = params.get("from_date") || "";
    state.endDate = params.get("to_date") || "";
    updateFormWithUrlParams();
  }

  function updateFormWithUrlParams() {
    // Update search input
    if (state.searchQuery && selectors.searchInput) {
      selectors.searchInput.value = state.searchQuery;
    }

    // Update sort by dropdown
    if (state.sortBy) {
      updateCustomSelect(
        document.querySelector(".sort-by-select"),
        state.sortBy
      );
    }

    // Update per page dropdown
    if (state.perPage) {
      updateCustomSelect(
        document.querySelector(".per-page-select"),
        state.perPage.toString()
      );
    }

    // Update date inputs
    if (state.startDate && selectors.startDateInput) {
      selectors.startDateInput.value = state.startDate;
    }

    if (state.endDate && selectors.endDateInput) {
      selectors.endDateInput.value = state.endDate;
    }
  }

  function updateUrl() {
    const params = new URLSearchParams();

    // Add search parameter
    if (state.searchQuery) {
      params.set("search", state.searchQuery);
    }

    // Add sort parameter
    params.set("sort_by", state.sortBy);

    // Add per page parameter
    params.set("per_page", state.perPage.toString());

    // Add page parameter only if not page 1
    if (state.currentPage > 1) {
      params.set("page", state.currentPage.toString());
    }

    // Add date parameters
    if (state.startDate) {
      params.set("from_date", state.startDate);
    }

    if (state.endDate) {
      params.set("to_date", state.endDate);
    }

    const newUrl =
      window.location.pathname +
      (params.toString() ? "?" + params.toString() : "");

    // Navigate to new URL
    window.location.href = newUrl;
  }

  function updateCustomSelect(wrapper, value) {
    if (!wrapper) return;

    const customSelect = wrapper.querySelector(".custom-select");
    const options = wrapper.querySelectorAll(".custom-option");

    if (customSelect) {
      options.forEach((opt) => {
        const optValue = opt.getAttribute("data-value");
        if (optValue && optValue.toLowerCase() === value.toLowerCase()) {
          const span = opt.querySelector("span");
          if (span) {
            customSelect.textContent = span.textContent.trim();
          }
          // Update selected state
          options.forEach((o) => o.classList.remove("selected"));
          opt.classList.add("selected");
        }
      });
    }
  }

  const selectors = {
    searchInput: document.querySelector(".search-input"),
    searchButton: document.querySelector(".search-button"),
    gridViewBtn: document.querySelector(".grid-view"),
    listViewBtn: document.querySelector(".list-view"),
    newsContent: document.getElementById("newsContent"),
    newsGrid: document.querySelector(".news-grid"),
    newsList: document.querySelector(".news-list"),
    filterSortButton: document.querySelector(".filter-sort-button"),
    modalOverlay: document.getElementById("filterSortModalOverlay"),
    filterForm: document.getElementById("filter-form-news"),
    clearAllButton: document.querySelector(".btn-clear"),
    paginationContainer: document.querySelector(".pagination-container"),
    paginationInfo: document.querySelector(".pagination-info"),
    pagination: document.querySelector(".pagination"),
    startDateInput: document.getElementById("datepicker3"),
    endDateInput: document.getElementById("datepicker4"),
    viewResultBtn: document.querySelector(".btn-view"),
  };

  function initializeCustomSelect(wrapper) {
    if (!wrapper) return;

    const customSelect = wrapper.querySelector(".custom-select");
    const customOptions = wrapper.querySelector(".custom-options");
    const options = wrapper.querySelectorAll(".custom-option");

    if (!customSelect || !customOptions || !options) return;

    // Clone elements to remove existing event listeners
    const newCustomSelect = customSelect.cloneNode(true);
    customSelect.parentNode.replaceChild(newCustomSelect, customSelect);

    newCustomSelect.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Close other dropdowns
      document.querySelectorAll(".custom-select").forEach((select) => {
        if (select !== newCustomSelect) {
          select.classList.remove("open");
        }
      });

      this.classList.toggle("open");
    });

    // Update options with new event listeners
    const newOptions = customOptions.cloneNode(false);

    options.forEach(function (option) {
      const newOption = option.cloneNode(true);

      newOption.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const span = this.querySelector("span");
        if (span) {
          newCustomSelect.textContent = span.textContent.trim();
        }

        const value = this.getAttribute("data-value");
        console.log(`Custom select changed to: ${value}`);

        // Update state based on wrapper class
        if (wrapper.classList.contains("sort-by-select")) {
          state.sortBy = value;
        } else if (wrapper.classList.contains("per-page-select")) {
          state.perPage = parseInt(value);
        }

        // Update selected state
        wrapper
          .querySelectorAll(".custom-option")
          .forEach((opt) => opt.classList.remove("selected"));
        this.classList.add("selected");

        // Close dropdown
        newCustomSelect.classList.remove("open");
      });

      newOptions.appendChild(newOption);
    });

    customOptions.parentNode.replaceChild(newOptions, customOptions);
  }

  function reinitializeCustomSelects() {
    const customSelects = document.querySelectorAll(".custom-select-wrapper");
    customSelects.forEach(initializeCustomSelect);

    // Close dropdowns when clicking outside
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".custom-select-wrapper")) {
        document.querySelectorAll(".custom-select").forEach((select) => {
          select.classList.remove("open");
        });
      }
    });
  }

  function applyFilters() {
    console.log("Applying filters with state:", state);
    updateUrl();
  }

  function initializeViewButtons() {
    if (!selectors.gridViewBtn || !selectors.listViewBtn) return;

    selectors.gridViewBtn.addEventListener("click", function () {
      state.view = "grid";
      selectors.gridViewBtn.classList.add("active");
      selectors.listViewBtn.classList.remove("active");

      if (selectors.newsGrid && selectors.newsList) {
        selectors.newsGrid.style.display = "grid";
        selectors.newsList.style.display = "none";
      }

      if (selectors.newsContent) {
        selectors.newsContent.classList.add("grid-view-active");
        selectors.newsContent.classList.remove("list-view-active");
      }
    });

    selectors.listViewBtn.addEventListener("click", function () {
      state.view = "list";
      selectors.listViewBtn.classList.add("active");
      selectors.gridViewBtn.classList.remove("active");

      if (selectors.newsGrid && selectors.newsList) {
        selectors.newsList.style.display = "flex";
        selectors.newsGrid.style.display = "none";
      }

      if (selectors.newsContent) {
        selectors.newsContent.classList.add("list-view-active");
        selectors.newsContent.classList.remove("grid-view-active");
      }
    });
  }

  function initializeSearch() {
    if (!selectors.searchButton || !selectors.searchInput) return;

    selectors.searchButton.addEventListener("click", function () {
      state.searchQuery = selectors.searchInput.value.trim();
      state.currentPage = 1;
      console.log("Search button clicked with query:", state.searchQuery);
      applyFilters();
    });

    selectors.searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        state.searchQuery = selectors.searchInput.value.trim();
        state.currentPage = 1;
        console.log("Search enter pressed with query:", state.searchQuery);
        applyFilters();
      }
    });
  }

  function closeModal() {
    if (selectors.modalOverlay) {
      selectors.modalOverlay.style.display = "none";
    }
  }

  function initializeFilterModal() {
    if (!selectors.filterSortButton || !selectors.modalOverlay) return;

    selectors.filterSortButton.addEventListener("click", function () {
      // Update modal with current state
      updateCustomSelect(
        document.querySelector(".sort-by-select"),
        state.sortBy
      );

      updateCustomSelect(
        document.querySelector(".per-page-select"),
        state.perPage.toString()
      );

      if (selectors.startDateInput) {
        selectors.startDateInput.value = state.startDate;
      }

      if (selectors.endDateInput) {
        selectors.endDateInput.value = state.endDate;
      }

      selectors.modalOverlay.style.display = "flex";
      reinitializeCustomSelects();
    });

    // Close modal when clicking overlay
    selectors.modalOverlay.addEventListener("click", function (e) {
      if (e.target === selectors.modalOverlay) {
        closeModal();
      }
    });

    // Close modal on escape key
    document.addEventListener("keydown", function (e) {
      if (
        e.key === "Escape" &&
        selectors.modalOverlay.style.display === "flex"
      ) {
        closeModal();
      }
    });

    // Prevent modal from closing when clicking inside
    const filterSortModal = document.querySelector(".filter-sort-modal");
    if (filterSortModal) {
      filterSortModal.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    // Initialize view result button
    initializeViewResultButton();

    // Initialize clear all button
    initializeClearAllButton();
  }

  function initializeViewResultButton() {
    const viewResultBtn = document.querySelector(".btn-view");
    if (!viewResultBtn) return;

    // Clone to remove existing listeners
    const newViewResultBtn = viewResultBtn.cloneNode(true);
    viewResultBtn.parentNode.replaceChild(newViewResultBtn, viewResultBtn);
    selectors.viewResultBtn = newViewResultBtn;

    selectors.viewResultBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      console.log("View Result button clicked");

      // Get values from form
      const sortByWrapper = document.querySelector(".sort-by-select");
      if (sortByWrapper) {
        const selectedOption = sortByWrapper.querySelector(
          ".custom-option.selected"
        );
        if (selectedOption) {
          state.sortBy = selectedOption.getAttribute("data-value");
        }
      }

      const perPageWrapper = document.querySelector(".per-page-select");
      if (perPageWrapper) {
        const selectedOption = perPageWrapper.querySelector(
          ".custom-option.selected"
        );
        if (selectedOption) {
          state.perPage = parseInt(selectedOption.getAttribute("data-value"));
        }
      }

      // Get date values
      if (selectors.startDateInput) {
        state.startDate = selectors.startDateInput.value.trim();
      }

      if (selectors.endDateInput) {
        state.endDate = selectors.endDateInput.value.trim();
      }

      // Reset to first page
      state.currentPage = 1;

      console.log("Applying filters with values:", {
        sortBy: state.sortBy,
        perPage: state.perPage,
        startDate: state.startDate,
        endDate: state.endDate,
        searchQuery: state.searchQuery,
      });

      applyFilters();
      closeModal();
    });
  }

  function initializeClearAllButton() {
    const clearAllBtn = document.querySelector(".btn-clear");
    if (!clearAllBtn) return;

    // Clone to remove existing listeners
    const newClearAllBtn = clearAllBtn.cloneNode(true);
    clearAllBtn.parentNode.replaceChild(newClearAllBtn, clearAllBtn);
    selectors.clearAllButton = newClearAllBtn;

    selectors.clearAllButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      console.log("Clear All button clicked");

      // Reset form
      if (selectors.filterForm) {
        selectors.filterForm.reset();
      }

      // Reset custom selects to default values
      document.querySelectorAll(".custom-select-wrapper").forEach((wrapper) => {
        const customSelect = wrapper.querySelector(".custom-select");
        const options = wrapper.querySelectorAll(".custom-option");
        const firstOption = options[0];

        if (customSelect && firstOption) {
          const span = firstOption.querySelector("span");
          if (span) {
            customSelect.textContent = span.textContent.trim();
          }

          options.forEach((opt) => opt.classList.remove("selected"));
          firstOption.classList.add("selected");
        }
      });

      // Clear date inputs
      if (selectors.startDateInput) selectors.startDateInput.value = "";
      if (selectors.endDateInput) selectors.endDateInput.value = "";

      // Clear search input
      if (selectors.searchInput) {
        selectors.searchInput.value = "";
      }

      // Reset state
      state.startDate = "";
      state.endDate = "";
      state.sortBy = "relevance";
      state.perPage = 12;
      state.searchQuery = "";
      state.currentPage = 1;

      console.log("State reset to:", state);

      applyFilters();
      closeModal();
    });
  }

  function initializeDatepickers() {
    if (typeof flatpickr === "undefined") return;

    const dateConfig = {
      dateFormat: "d.m.Y",
      allowInput: true,
      locale: state.currentLanguage === "ru" ? "ru" : "default",
      onChange: function (selectedDates, dateStr, instance) {
        if (instance.element) {
          const dateInputId = instance.element.id;
          if (dateInputId === "datepicker3") {
            state.startDate = dateStr;
            console.log("Start date changed to:", dateStr);
          } else if (dateInputId === "datepicker4") {
            state.endDate = dateStr;
            console.log("End date changed to:", dateStr);
          }
        }
      },
    };

    if (selectors.startDateInput) {
      flatpickr(selectors.startDateInput, dateConfig);
    }

    if (selectors.endDateInput) {
      flatpickr(selectors.endDateInput, dateConfig);
    }
  }

  // Global function for clearing date filters
  window.clearDateFilter = function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const parentInput = e.target.closest(".date-input");
    if (parentInput) {
      const input = parentInput.querySelector("input");
      if (input) {
        input.value = "";

        if (input.id === "datepicker3") {
          state.startDate = "";
        } else if (input.id === "datepicker4") {
          state.endDate = "";
        }

        // Trigger flatpickr clear if it exists
        if (input._flatpickr) {
          input._flatpickr.clear();
        }
      }
    }

    console.log("Date filter cleared");
    return false;
  };

  function init() {
    console.log("Initializing news page JavaScript");

    // Set initial language
    state.currentLanguage = document.documentElement.lang || "en";

    // Get URL parameters and update state
    getUrlParams();

    // Initialize components
    reinitializeCustomSelects();
    initializeViewButtons();
    initializeSearch();
    initializeFilterModal();
    initializeDatepickers();

    // Set initial view state
    if (selectors.newsGrid && selectors.newsList) {
      selectors.newsGrid.style.display = "grid";
      selectors.newsList.style.display = "none";
    }

    console.log("News page initialized with state:", state);
  }

  // Initialize when DOM is ready
  init();
});