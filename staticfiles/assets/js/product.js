document.addEventListener('DOMContentLoaded', function() {
    const filterSections = document.querySelectorAll('.filter-section');

    // Handle show more/less functionality
    filterSections.forEach(section => {
        const showMoreLink = section.querySelector('.filter-show-more .show-more');
        const checkboxArea = section.querySelector('.checkbox-area');
        const applicationArea = section.querySelector('.application-area');
        const packSizeArea = section.querySelector('.pack-size-area');

        const contentArea = checkboxArea || applicationArea || packSizeArea;

        if (showMoreLink && contentArea) {
            contentArea.style.overflowY = 'hidden';

            showMoreLink.addEventListener('click', function(e) {
                e.preventDefault();

                const isExpanded = contentArea.classList.contains('expanded');

                if (isExpanded) {
                    contentArea.style.overflowY = 'hidden';
                    contentArea.classList.remove('expanded');
                    showMoreLink.innerHTML = 'Show more <i class="fas fa-arrow-right"></i>';
                } else {
                    contentArea.style.overflowY = 'auto';
                    contentArea.classList.add('expanded');
                    showMoreLink.innerHTML = 'Show less <i class="fas fa-arrow-up"></i>';
                }
            });
        }
    });

    // Auto-update product count when filters change
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const searchInput = document.querySelector('input[name="search"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProductCount);
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(updateProductCount, 500));
    }
});

// Apply filters function
function applyFilters() {
    document.getElementById('filterForm').submit();
}

// Toggle application area function
function toggleApplicationArea(id) {
    const button = document.querySelector(`[data-type="app-${id}"]`);
    const checkbox = document.getElementById(`app-${id}`);
    
    if (checkbox && button) {
        checkbox.checked = !checkbox.checked;
        button.classList.toggle('active', checkbox.checked);
    }
}

// Toggle pack size function
function togglePackSize(id) {
    const button = document.querySelector(`[data-type="size-${id}"]`);
    const checkbox = document.getElementById(`size-${id}`);
    
    if (checkbox && button) {
        checkbox.checked = !checkbox.checked;
        button.classList.toggle('active', checkbox.checked);
    }
}

// Reset filters function
function resetFilters() {
    const form = document.getElementById('filterForm');
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else if (input.type === 'text') {
            input.value = '';
        }
    });
    
    // Reset active states on buttons
    const activeButtons = document.querySelectorAll('.icon-button.active');
    activeButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Submit form to show all products
    form.submit();
}

// Update product count function (optional - for real-time count update)
function updateProductCount() {
    const button = document.getElementById('filterResultsBtn');
    const formData = new FormData(document.getElementById('filterForm'));
    
    // You can make an AJAX call here to get updated count
    // For now, we'll just update the button text
    button.textContent = 'View Results';
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle Enter key in search input
document.addEventListener('keypress', function(e) {
    if (e.target.name === 'search' && e.key === 'Enter') {
        e.preventDefault();
        applyFilters();
    }
});