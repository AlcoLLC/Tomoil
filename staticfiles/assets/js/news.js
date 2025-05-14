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

    if (state.sortBy && selectors.sortBySelect) {
      selectors.sortBySelect.value = state.sortBy;
      updateCustomSelect(
        document.querySelector(".sort-by-select"),
        state.sortBy
      );
    }

    if (state.perPage && selectors.perPageSelect) {
      selectors.perPageSelect.value = state.perPage.toString();
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

    if (state.sortBy && state.sortBy !== "relevance") {
      params.set("sort_by", state.sortBy);
    }

    if (state.perPage !== 12) {
      params.set("per_page", state.perPage.toString());
    }

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
        const optValue = opt.getAttribute("data-value");
        if (optValue === value) {
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
    filterForm: document.getElementById("filter-form"),
    clearAllButton: document.querySelector(".btn-clear"),
    paginationContainer: document.querySelector(".pagination-container"),
    paginationInfo: document.querySelector(".pagination-info"),
    pagination: document.querySelector(".pagination"),
    startDateInput: document.getElementById("datepicker3"),
    endDateInput: document.getElementById("datepicker4"),
    viewResultBtn: document.querySelector(".btn-view"),
    sortBySelect: document.querySelector('select[name="sort_by"]'),
    perPageSelect: document.querySelector('select[name="per_page"]'),
  };

  function initializeCustomSelect(wrapper) {
    const customSelect = wrapper.querySelector(".custom-select");
    const customOptions = wrapper.querySelector(".custom-options");
    const options = wrapper.querySelectorAll(".custom-option");
    const hiddenSelect = wrapper.querySelector("select");

    customSelect.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.toggle("open");
    });

    document.addEventListener("click", function () {
      customSelect.classList.remove("open");
    });

    customOptions.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    options.forEach(function (option) {
      option.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const selectedText = this.querySelector("span").innerText.trim();
        customSelect.innerText = selectedText;

        const value = this.getAttribute("data-value");
        if (hiddenSelect) {
          for (let i = 0; i < hiddenSelect.options.length; i++) {
            if (hiddenSelect.options[i].value === value) {
              hiddenSelect.selectedIndex = i;
              break;
            }
          }

          console.log(`Custom select changed to: ${value}`);

          const event = new Event("change", { bubbles: true });
          hiddenSelect.dispatchEvent(event);
        }

        options.forEach((opt) => opt.classList.remove("selected"));
        this.classList.add("selected");

        customSelect.classList.remove("open");
      });
    });
  }

  function reinitializeCustomSelects() {
    const customSelects = document.querySelectorAll(".custom-select-wrapper");
    customSelects.forEach(initializeCustomSelect);
  }

  async function fetchNews() {
    try {
      const response = await fetch("/api/news/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      state.news = data;
      state.filteredNews = [...data];
      applyFilters();
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

  function applyFilters() {
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

    if (state.startDate) {
      const startDate = new Date(parseDate(state.startDate));
      startDate.setHours(0, 0, 0, 0);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= startDate;
      });
    }

    if (state.endDate) {
      const endDate = new Date(parseDate(state.endDate));
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate <= endDate;
      });
    }

    console.log("Applying sort by:", state.sortBy);

    switch (state.sortBy.toLowerCase()) {
      case "relevance":
        filtered.sort((a, b) => b.views_count - a.views_count);
        console.log("Sorted by relevance");
        break;
      case "latest":
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        console.log("Sorted by latest");
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        console.log("Sorted by oldest");
        break;
      case "from a to z":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        console.log("Sorted alphabetically");
        break;
      default:
        console.log("Unknown sort option:", state.sortBy);
        filtered.sort((a, b) => b.views_count - a.views_count);
    }

    state.filteredNews = filtered;
    console.log("Filtered news count:", state.filteredNews.length);
    renderNews();
    updatePagination();

    updateUrl();
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
    return `
            <div class="news-card">
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
                        ${item.description}
                    </p>
                    <a href="/news/${item.id}/" class="read-more">
                        Read More
                        <i class="fas fa-arrow-right-long read-more-icon"></i>
                    </a>
                </div>
            </div>
        `;
  }

  function createNewsListItem(item) {
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
                        ${item.description}
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

  function initializeFilterModal() {
    selectors.filterSortButton.addEventListener("click", function () {
      if (selectors.sortBySelect) {
        selectors.sortBySelect.value = state.sortBy;
        updateCustomSelect(
          document.querySelector(".sort-by-select"),
          state.sortBy
        );
      }

      if (selectors.perPageSelect) {
        selectors.perPageSelect.value = state.perPage.toString();
        updateCustomSelect(
          document.querySelector(".per-page-select"),
          state.perPage.toString()
        );
      }

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
        selectors.modalOverlay.style.display = "none";
      }
    });

    const filterSortModal = document.querySelector(".filter-sort-modal");
    filterSortModal.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    selectors.filterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Form submit event triggered");

      applyFilterFromForm();
    });

    if (selectors.viewResultBtn) {
      selectors.viewResultBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("View Result button clicked!");

        applyFilterFromForm();
        selectors.modalOverlay.style.display = "none";
      });
    } else {
      console.error("View Result button not found in DOM");
    }

    function applyFilterFromForm() {
      if (selectors.sortBySelect) {
        const sortValue = selectors.sortBySelect.value;
        state.sortBy = sortValue;
        console.log("Sort by selected:", sortValue);
      }

      if (selectors.perPageSelect) {
        state.perPage = parseInt(selectors.perPageSelect.value);
        console.log("Per page selected:", state.perPage);
      }

      state.startDate = selectors.startDateInput
        ? selectors.startDateInput.value
        : "";
      state.endDate = selectors.endDateInput
        ? selectors.endDateInput.value
        : "";
      state.currentPage = 1;

      console.log("Filter applied with values:", {
        sortBy: state.sortBy,
        perPage: state.perPage,
        startDate: state.startDate,
        endDate: state.endDate,
      });

      applyFilters();
    }

    if (selectors.clearAllButton) {
      selectors.clearAllButton.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.log("Clear All button clicked");

        selectors.filterForm.reset();

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

              const hiddenSelect = wrapper.querySelector("select");
              if (hiddenSelect) {
                hiddenSelect.selectedIndex = 0;
              }
            }
          });

        if (selectors.startDateInput) selectors.startDateInput.value = "";
        if (selectors.endDateInput) selectors.endDateInput.value = "";

        state.startDate = "";
        state.endDate = "";
        state.sortBy = "relevance";
        state.perPage = 12;
      });
    }
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
  }

  init();
});
