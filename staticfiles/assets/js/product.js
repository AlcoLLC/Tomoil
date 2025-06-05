document.addEventListener('DOMContentLoaded', function() {
    const filterSections = document.querySelectorAll('.filter-section');

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
});
