document.addEventListener('DOMContentLoaded', function() {

    function initializeCustomSelect(wrapper) {
        const customSelect = wrapper.querySelector('.custom-select');
        const customOptions = wrapper.querySelector('.custom-options');
        const options = wrapper.querySelectorAll('.custom-option');
        const hiddenSelect = wrapper.querySelector('select');

        // Remove any existing event listeners to prevent multiple bindings
        const oldCustomSelect = customSelect.cloneNode(true);
        customSelect.parentNode.replaceChild(oldCustomSelect, customSelect);
        const newCustomSelect = wrapper.querySelector('.custom-select');

        // Toggle dropdown on click
        newCustomSelect.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent immediate closing

            // Close any other open dropdowns
            document.querySelectorAll('.custom-select').forEach(select => {
                if (select !== newCustomSelect) {
                    select.classList.remove('open');
                }
            });

            // Toggle current dropdown
            this.classList.toggle('open');
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', function() {
            newCustomSelect.classList.remove('open');
        });

        // Prevent dropdown from closing when clicking inside options
        customOptions.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Handle option selection
        options.forEach(function(option) {
            option.addEventListener('click', function() {
                // Update selected value text
                const selectedText = this.querySelector('span').innerText.trim();
                newCustomSelect.innerText = selectedText;

                // Update hidden select value
                const value = this.getAttribute('data-value');
                if (hiddenSelect) {
                    for (let i = 0; i < hiddenSelect.options.length; i++) {
                        if (hiddenSelect.options[i].value === value) {
                            hiddenSelect.selectedIndex = i;
                            break;
                        }
                    }
                    // Trigger change event
                    const event = new Event('change');
                    hiddenSelect.dispatchEvent(event);
                }

                // Update selected state
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');

                // Close dropdown
                newCustomSelect.classList.remove('open');
            });
        });
    }

    function reinitializeCustomSelects() {
        const customSelects = document.querySelectorAll('.custom-select-wrapper');
        customSelects.forEach(initializeCustomSelect);
    }

    reinitializeCustomSelects();

    const gridViewBtn = document.querySelector('.grid-view');
    const listViewBtn = document.querySelector('.list-view');
    const newsContent = document.getElementById('newsContent');
    const newsGrid = document.querySelector('.news-grid');
    const newsList = document.querySelector('.news-list');

    newsGrid.style.display = 'grid';
    newsList.style.display = 'none';


    gridViewBtn.addEventListener('click', function () {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');

        newsGrid.style.display = 'grid';
        newsList.style.display = 'none';

        newsContent.classList.add('grid-view-active');
        newsContent.classList.remove('list-view-active');
    });

    listViewBtn.addEventListener('click', function () {
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');

        newsList.style.display = 'flex';
        newsGrid.style.display = 'none';
        newsContent.classList.add('list-view-active');
        newsContent.classList.remove('grid-view-active');
    });


    const filterSortButton = document.querySelector('.filter-sort-button');
    const modalOverlay = document.getElementById('filterSortModalOverlay');

    filterSortButton.addEventListener('click', function () {
        modalOverlay.style.display = 'flex';

        reinitializeCustomSelects();
    });

    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    });

    const filterSortModal = document.querySelector('.filter-sort-modal');
    filterSortModal.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    const filterForm = document.getElementById('filter-form');
    filterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());

        console.log('Form submitted with values:', formValues);

        modalOverlay.style.display = 'none';
    });

    const clearAllButton = document.querySelector('.btn-clear');
    if (clearAllButton) {
        clearAllButton.addEventListener('click', function() {
            filterForm.reset();

            const customSelects = document.querySelectorAll('.custom-select-wrapper');
            customSelects.forEach(wrapper => {
                const customSelect = wrapper.querySelector('.custom-select');
                const options = wrapper.querySelectorAll('.custom-option');
                const initialOption = options[0];

                customSelect.innerText = initialOption.querySelector('span').innerText.trim();

                options.forEach(opt => opt.classList.remove('selected'));
                initialOption.classList.add('selected');

                const hiddenSelect = wrapper.querySelector('select');
                if (hiddenSelect) {
                    hiddenSelect.selectedIndex = 0;
                }
            });

            reinitializeCustomSelects();
        });
    }
});