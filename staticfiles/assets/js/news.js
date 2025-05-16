document.addEventListener("DOMContentLoaded", function () {
  const state = {
    news: [],
    filteredNews: [],
    currentPage: 1,
    perPage: 12,
    sortBy: "relevance",
    searchQuery: "",
    startDate: "",
    endDate: "",
    view: "grid",
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
    if (state.searchQuery && selectors.searchInput) {
      selectors.searchInput.value = state.searchQuery;
    }

    if (state.sortBy) {
      updateCustomSelect(
        document.querySelector(".sort-by-select"),
        state.sortBy
      );
    }

    if (state.perPage) {
      updateCustomSelect(
        document.querySelector(".per-page-select"),
        state.perPage.toString()
      );
    }

    if (state.startDate && selectors.startDateInput) {
      selectors.startDateInput.value = state.startDate;
    }

    if (state.endDate && selectors.endDateInput) {
      selectors.endDateInput.value = state.endDate;
    }
  }

  function updateUrl() {
    const params = new URLSearchParams();

    if (state.searchQuery) {
      params.set("search", state.searchQuery);
    }

    params.set("sort_by", state.sortBy);

    params.set("per_page", state.perPage.toString());

    if (state.currentPage > 1) {
      params.set("page", state.currentPage.toString());
    }

    if (state.startDate) {
      params.set("from_date", state.startDate);
    }

    if (state.endDate) {
      params.set("to_date", state.endDate);
    }

    const newUrl =
      window.location.pathname +
      (params.toString() ? "?" + params.toString() : "");
    window.history.pushState({ path: newUrl }, "", newUrl);
  }

  function updateCustomSelect(wrapper, value) {
    if (!wrapper) return;

    const customSelect = wrapper.querySelector(".custom-select");
    const options = wrapper.querySelectorAll(".custom-option");

    if (customSelect) {
      options.forEach((opt) => {
        const optValue = opt.getAttribute("data-value").toLowerCase();
        if (optValue === value.toLowerCase()) {
          customSelect.innerText = opt.querySelector("span").innerText.trim();
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

    const newOptions = document.createElement("div");
    newOptions.className = "custom-options";
    customOptions.parentNode.replaceChild(newOptions, customOptions);

    const newCustomSelect = customSelect.cloneNode(true);
    customSelect.parentNode.replaceChild(newCustomSelect, customSelect);

    newCustomSelect.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.toggle("open");
    });

    options.forEach(function (option) {
      const newOption = document.createElement("div");
      newOption.className = option.className;
      newOption.setAttribute("data-value", option.getAttribute("data-value"));
      newOption.innerHTML = option.innerHTML;
      if (option.classList.contains("selected")) {
        newOption.classList.add("selected");
      }

      newOption.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const selectedText = this.querySelector("span").innerText.trim();
        newCustomSelect.innerText = selectedText;

        const value = this.getAttribute("data-value");

        console.log(`Custom select changed to: ${value}`);

        if (wrapper.classList.contains("sort-by-select")) {
          state.sortBy = value;
        } else if (wrapper.classList.contains("per-page-select")) {
          state.perPage = parseInt(value);
        }

        wrapper
          .querySelectorAll(".custom-option")
          .forEach((opt) => opt.classList.remove("selected"));
        this.classList.add("selected");

        newCustomSelect.classList.remove("open");
      });

      newOptions.appendChild(newOption);
    });
  }

  function reinitializeCustomSelects() {
    const customSelects = document.querySelectorAll(".custom-select-wrapper");
    customSelects.forEach(initializeCustomSelect);

    document.addEventListener("click", function () {
      document.querySelectorAll(".custom-select").forEach((select) => {
        select.classList.remove("open");
      });
    });

    document.querySelectorAll(".custom-options").forEach((options) => {
      options.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    });
  }

  async function fetchNews() {
    try {
      let apiUrl = "/api/news/";
      const params = new URLSearchParams();

      params.set("sort_by", state.sortBy);

      if (state.searchQuery) {
        params.set("search", state.searchQuery);
      }

      if (state.startDate) {
        params.set("from_date", state.startDate);
      }

      if (state.endDate) {
        params.set("to_date", state.endDate);
      }

      if (params.toString()) {
        apiUrl += "?" + params.toString();
      }

      console.log("Fetching news from: " + apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      state.news = data;
      state.filteredNews = [...data];

      applyClientFilters();

      renderNews();
      updatePagination();
      updateUrl();
    } catch (error) {
      console.error("Error fetching news:", error);
      displayErrorMessage("Failed to load news data. Please try again later.");
    }
  }

  function displayErrorMessage(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    const newsContent = document.getElementById("newsContent");
    newsContent.innerHTML = "";
    newsContent.appendChild(errorDiv);
  }

  function applyClientFilters() {
    let filtered = [...state.news];

    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.header_text && item.header_text.toLowerCase().includes(query))
      );
    }

    state.filteredNews = filtered;
    console.log("Filtered news count:", state.filteredNews.length);
  }

  function applyFilters() {
    fetchNews();
  }

  function parseDate(dateStr) {
    if (!dateStr) return null;

    const parts = dateStr.split(".");

    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return dateStr;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  function createNewsCard(item) {
    const shortDescription =
      item.description.length > 120
        ? item.description.substring(0, 120) + "..."
        : item.description;
    return `
            <div class="news-card">
            <a  href="/news/${item.id}/">
            <img src="${
              item.image_one
            }" alt="${item.title}" class="card-image" />
                <div class="card-content">
                    <div class="card-meta">
                        <div class="card-date">
                            <i class="far fa-calendar-alt date-icon"></i>
                            ${formatDate(item.created_at)}
                        </div>
                        <div class="share-button">
                            <i class="fas fa-share-alt share-icon"></i>
                            Share
                        </div>
                    </div>
                    <h3 class="card-title">
                        ${item.title}
                    </h3>
                    <p class="card-description">
                        ${shortDescription}
                    </p>
                    <a href="/news/${item.id}/" class="read-more">
                        Read More
                        <i class="fas fa-arrow-right-long read-more-icon"></i>
                    </a>
                </div>
                </a>
            </div>
        `;
  }

  function createNewsListItem(item) {
    const shortDescription =
      item.description.length > 100
        ? item.description.substring(0, 100) + "..."
        : item.description;
    return `
            <div class="news-list-item">
                <div class="list-item-image">
                    <img src="${item.image_one}" alt="${item.title}" />
                </div>
                <div class="list-item-content">
                    <div class="card-meta">
                        <div class="card-date">
                            <i class="far fa-calendar-alt date-icon"></i>
                            ${formatDate(item.created_at)}
                        </div>
                        <div class="share-button">
                            <i class="fas fa-share-alt share-icon"></i>
                            Share
                        </div>
                    </div>
                    <h3 class="card-title">
                        ${item.title}
                    </h3>
                    <p class="card-description">
                        ${shortDescription}
                    </p>
                    <a href="/news/${item.id}/" class="read-more">
                        Read More
                        <i class="fas fa-arrow-right-long read-more-icon"></i>
                    </a>
                </div>
            </div>
        `;
  }

  function renderNews() {
    const startIndex = (state.currentPage - 1) * state.perPage;
    const endIndex = startIndex + state.perPage;
    const paginatedNews = state.filteredNews.slice(startIndex, endIndex);

    if (paginatedNews.length === 0) {
      selectors.newsGrid.innerHTML =
        '<div class="no-results">No news items found matching your criteria.</div>';
      selectors.newsList.innerHTML =
        '<div class="no-results">No news items found matching your criteria.</div>';
    } else {
      const gridHTML = paginatedNews.map(createNewsCard).join("");
      selectors.newsGrid.innerHTML = gridHTML;

      const listHTML = paginatedNews.map(createNewsListItem).join("");
      selectors.newsList.innerHTML = listHTML;
    }

    if (state.view === "grid") {
      selectors.newsGrid.style.display = "grid";
      selectors.newsList.style.display = "none";
    } else {
      selectors.newsGrid.style.display = "none";
      selectors.newsList.style.display = "flex";
    }
  }

  function updatePagination() {
    const totalItems = state.filteredNews.length;
    const totalPages = Math.ceil(totalItems / state.perPage);

    if (totalPages < state.currentPage && totalPages > 0) {
      state.currentPage = Math.max(1, totalPages);
    }

    const startIndex = (state.currentPage - 1) * state.perPage + 1;
    const endIndex = Math.min(startIndex + state.perPage - 1, totalItems);

    selectors.paginationInfo.textContent = `Displaying ${
      totalItems > 0 ? startIndex : 0
    }–${endIndex} of ${totalItems} results`;

    let paginationHTML = "";

    if (state.currentPage > 1) {
      paginationHTML += `<a href="#" class="page-btn prev" data-page="${
        state.currentPage - 1
      }">«</a>`;
    } else {
      paginationHTML += `<span class="page-btn prev disabled">«</span>`;
    }

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        if (i === state.currentPage) {
          paginationHTML += `<span class="page-btn active">${i}</span>`;
        } else {
          paginationHTML += `<a href="#" class="page-btn" data-page="${i}">${i}</a>`;
        }
      }
    } else {
      const showEllipsisStart = state.currentPage > 3;
      const showEllipsisEnd = state.currentPage < totalPages - 2;

      if (state.currentPage === 1) {
        paginationHTML += `<span class="page-btn active">1</span>`;
      } else {
        paginationHTML += `<a href="#" class="page-btn" data-page="1">1</a>`;
      }

      if (showEllipsisStart) {
        paginationHTML += `<span class="page-btn ellipsis">...</span>`;
      }

      const rangeStart = Math.max(2, state.currentPage - 1);
      const rangeEnd = Math.min(totalPages - 1, state.currentPage + 1);

      for (let i = rangeStart; i <= rangeEnd; i++) {
        if (i === state.currentPage) {
          paginationHTML += `<span class="page-btn active">${i}</span>`;
        } else {
          paginationHTML += `<a href="#" class="page-btn" data-page="${i}">${i}</a>`;
        }
      }

      if (showEllipsisEnd) {
        paginationHTML += `<span class="page-btn ellipsis">...</span>`;
      }

      if (state.currentPage === totalPages) {
        paginationHTML += `<span class="page-btn active">${totalPages}</span>`;
      } else {
        paginationHTML += `<a href="#" class="page-btn" data-page="${totalPages}">${totalPages}</a>`;
      }
    }

    if (state.currentPage < totalPages) {
      paginationHTML += `<a href="#" class="page-btn next" data-page="${
        state.currentPage + 1
      }">»</a>`;
    } else {
      paginationHTML += `<span class="page-btn next disabled">»</span>`;
    }

    selectors.pagination.innerHTML = paginationHTML;

    document
      .querySelectorAll(
        ".pagination .page-btn:not(.active):not(.disabled):not(.ellipsis)"
      )
      .forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          state.currentPage = parseInt(this.getAttribute("data-page"));
          renderNews();
          updatePagination();
          updateUrl();
          window.scrollTo(0, selectors.newsContent.offsetTop - 100);
        });
      });
  }

  function initializeViewButtons() {
    selectors.gridViewBtn.addEventListener("click", function () {
      state.view = "grid";
      selectors.gridViewBtn.classList.add("active");
      selectors.listViewBtn.classList.remove("active");

      selectors.newsGrid.style.display = "grid";
      selectors.newsList.style.display = "none";

      selectors.newsContent.classList.add("grid-view-active");
      selectors.newsContent.classList.remove("list-view-active");
    });

    selectors.listViewBtn.addEventListener("click", function () {
      state.view = "list";
      selectors.listViewBtn.classList.add("active");
      selectors.gridViewBtn.classList.remove("active");

      selectors.newsList.style.display = "flex";
      selectors.newsGrid.style.display = "none";

      selectors.newsContent.classList.add("list-view-active");
      selectors.newsContent.classList.remove("grid-view-active");
    });
  }

  function initializeSearch() {
    selectors.searchButton.addEventListener("click", function () {
      state.searchQuery = selectors.searchInput.value.trim();
      state.currentPage = 1;
      applyFilters();
    });

    selectors.searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        state.searchQuery = selectors.searchInput.value.trim();
        state.currentPage = 1;
        applyFilters();
      }
    });
  }

  function closeModal() {
    selectors.modalOverlay.style.display = "none";
  }

  function initializeFilterModal() {
    selectors.filterSortButton.addEventListener("click", function () {
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

    selectors.modalOverlay.addEventListener("click", function (e) {
      if (e.target === selectors.modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (
        e.key === "Escape" &&
        selectors.modalOverlay.style.display === "flex"
      ) {
        closeModal();
      }
    });

    const filterSortModal = document.querySelector(".filter-sort-modal");
    if (filterSortModal) {
      filterSortModal.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    const setupViewResultButton = () => {
      const viewResultBtn = document.querySelector(".btn-view");
      if (!viewResultBtn) {
        console.error("View Result button not found");
        return;
      }

      const newViewResultBtn = viewResultBtn.cloneNode(true);
      viewResultBtn.parentNode.replaceChild(newViewResultBtn, viewResultBtn);

      selectors.viewResultBtn = newViewResultBtn;

      selectors.viewResultBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("View Result button clicked!");

        const sortByWrapper = document.querySelector(".sort-by-select");
        if (sortByWrapper) {
          const selectedOption = sortByWrapper.querySelector(
            ".custom-option.selected"
          );
          if (selectedOption) {
            state.sortBy = selectedOption.getAttribute("data-value");
            console.log("Applied sort_by:", state.sortBy);
          }
        }

        const perPageWrapper = document.querySelector(".per-page-select");
        if (perPageWrapper) {
          const selectedOption = perPageWrapper.querySelector(
            ".custom-option.selected"
          );
          if (selectedOption) {
            state.perPage = parseInt(selectedOption.getAttribute("data-value"));
            console.log("Applied per_page:", state.perPage);
          }
        }

        if (document.getElementById("datepicker3")) {
          state.startDate = document.getElementById("datepicker3").value;
        }

        if (document.getElementById("datepicker4")) {
          state.endDate = document.getElementById("datepicker4").value;
        }

        state.currentPage = 1;

        console.log("Filter applied with values:", {
          sortBy: state.sortBy,
          perPage: state.perPage,
          startDate: state.startDate,
          endDate: state.endDate,
        });

        applyFilters();
        closeModal();
      });
    };

    setupViewResultButton();

    const setupClearAllButton = () => {
      const clearAllBtn = document.querySelector(".btn-clear");
      if (!clearAllBtn) {
        console.error("Clear All button not found");
        return;
      }

      const newClearAllBtn = clearAllBtn.cloneNode(true);
      clearAllBtn.parentNode.replaceChild(newClearAllBtn, clearAllBtn);

      selectors.clearAllButton = newClearAllBtn;

      selectors.clearAllButton.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("Clear All button clicked");

        if (selectors.filterForm) {
          selectors.filterForm.reset();
        }

        document
          .querySelectorAll(".custom-select-wrapper")
          .forEach((wrapper) => {
            const customSelect = wrapper.querySelector(".custom-select");
            const options = wrapper.querySelectorAll(".custom-option");
            const initialOption = options[0];

            if (customSelect && initialOption) {
              const span = initialOption.querySelector("span");
              if (span) {
                customSelect.innerText = span.innerText.trim();
              }

              options.forEach((opt) => opt.classList.remove("selected"));
              initialOption.classList.add("selected");
            }
          });

        if (selectors.startDateInput) selectors.startDateInput.value = "";
        if (selectors.endDateInput) selectors.endDateInput.value = "";

        state.startDate = "";
        state.endDate = "";
        state.sortBy = "relevance";
        state.perPage = 12;

        applyFilters();
        closeModal();
      });
    };

    setupClearAllButton();
  }

  function initializeDatepickers() {
    if (typeof flatpickr !== "undefined") {
      const dateConfig = {
        dateFormat: "d.m.Y",
        allowInput: true,
        onChange: function (selectedDates, dateStr, instance) {
          if (instance.element) {
            const dateInputId = instance.element.id;
            if (dateInputId === "datepicker3") {
              state.startDate = dateStr;
              console.log("Start date selected:", dateStr);
            } else if (dateInputId === "datepicker4") {
              state.endDate = dateStr;
              console.log("End date selected:", dateStr);
            }
          }
        },
        onClose: function (selectedDates, dateStr, instance) {
          return false;
        },
      };

      if (selectors.startDateInput) {
        const startPicker = flatpickr(selectors.startDateInput, dateConfig);
      }

      if (selectors.endDateInput) {
        const endPicker = flatpickr(selectors.endDateInput, dateConfig);
      }
    }
  }

  window.clearDateFilter = function (e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const parentInput = e.target.closest(".date-input").querySelector("input");
    if (parentInput) {
      parentInput.value = "";

      if (parentInput.id === "datepicker3") {
        state.startDate = "";
      } else if (parentInput.id === "datepicker4") {
        state.endDate = "";
      }
    }

    console.log("Date filter cleared");
    return false;
  };

  function init() {
    getUrlParams();

    reinitializeCustomSelects();
    initializeViewButtons();
    initializeSearch();
    initializeFilterModal();
    initializeDatepickers();

    selectors.newsGrid.style.display = "grid";
    selectors.newsList.style.display = "none";

    fetchNews();

    document.addEventListener("click", function () {
      document.querySelectorAll(".custom-select").forEach(function (select) {
        select.classList.remove("open");
      });
    });
  }

  init();
});
