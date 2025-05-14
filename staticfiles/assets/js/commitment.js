document.addEventListener('DOMContentLoaded', function () {
    const commitmentItems = document.querySelectorAll('.commitment-item');

    commitmentItems.forEach(item => {
        item.addEventListener('click', function () {
            commitmentItems.forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');

            const selectedCommitment = this.getAttribute('data-commitment');
            const selectedContentId = selectedCommitment + '-content';

            const allContents = document.querySelectorAll('.commitment-detail');
            allContents.forEach(content => {
                content.classList.remove('active');
            });

            const selectedContent = document.getElementById(selectedContentId);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
        });
    });

});