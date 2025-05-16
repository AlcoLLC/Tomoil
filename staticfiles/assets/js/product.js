document.addEventListener('DOMContentLoaded', function() {
    // Get all filter sections that have "Show more" links
    const filterSections = document.querySelectorAll('.filter-section');

    filterSections.forEach(section => {
        const showMoreLink = section.querySelector('.filter-show-more .show-more');
        const checkboxArea = section.querySelector('.checkbox-area');
        const applicationArea = section.querySelector('.application-area');
        const packSizeArea = section.querySelector('.pack-size-area');

        // Get the area that needs to be toggled (checkbox area or button area)
        const contentArea = checkboxArea || applicationArea || packSizeArea;

        if (showMoreLink && contentArea) {
            // Set initial settings - no scrollbar initially
            contentArea.style.overflowY = 'hidden';

            // Toggle the show more/less functionality
            showMoreLink.addEventListener('click', function(e) {
                e.preventDefault();

                const isExpanded = contentArea.classList.contains('expanded');

                if (isExpanded) {
                    // Hide scrollbar
                    contentArea.style.overflowY = 'hidden';
                    contentArea.classList.remove('expanded');
                    showMoreLink.innerHTML = 'Show more <i class="fas fa-arrow-right"></i>';
                } else {
                    // Show scrollbar
                    contentArea.style.overflowY = 'auto';
                    contentArea.classList.add('expanded');
                    showMoreLink.innerHTML = 'Show less <i class="fas fa-arrow-up"></i>';
                }
            });
        }
    });
});
