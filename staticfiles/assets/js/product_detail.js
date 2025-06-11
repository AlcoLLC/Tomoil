document.addEventListener('DOMContentLoaded', function () {
    // --- Yorum Slider/Carousel Mantığı ---
    const opinionsContainer = document.querySelector('.product-opinions .opinions');

    // SADECE yorumlar için bir konteyner varsa slider'ı çalıştır
    if (opinionsContainer) {
        let currentIndex = 0;
        let autoplayInterval;
        const opinions = document.querySelectorAll('.opinion');
        const totalOpinions = opinions.length;

        function startAutoplay() {
            // Yalnızca birden fazla yorum varsa otomatik oynatmayı başlat
            if (totalOpinions > 1) {
                autoplayInterval = setInterval(() => {
                    nextOpinion();
                }, 4000);
            }
        }

        function nextOpinion() {
            opinions[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % totalOpinions;
            opinions[currentIndex].classList.add('active');
        }

        opinions.forEach((opinion, index) => {
            opinion.addEventListener('click', () => {
                clearInterval(autoplayInterval);
                if (index === currentIndex) {
                    nextOpinion();
                } else {
                    opinions[currentIndex].classList.remove('active');
                    currentIndex = index;
                    opinions[currentIndex].classList.add('active');
                }
                startAutoplay();
            });
        });

        let startX = 0;
        let endX = 0;

        opinionsContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        opinionsContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > swipeThreshold) {
                clearInterval(autoplayInterval);
                if (diff > 0) {
                    nextOpinion();
                } else {
                    opinions[currentIndex].classList.remove('active');
                    currentIndex = (currentIndex - 1 + totalOpinions) % totalOpinions;
                    opinions[currentIndex].classList.add('active');
                }
                startAutoplay();
            }
        }

        // Sayfa yüklendiğinde ve görünür olduğunda slider'ı başlat
        startAutoplay();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(autoplayInterval);
            } else {
                startAutoplay();
            }
        });
    }


    // --- Review Modal (Yorum Ekleme) Mantığı ---
    const openModalBtn = document.getElementById('openReviewModal');
    const modalOverlay = document.getElementById('reviewModalOverlay');
    const closeModalBtn = document.getElementById('closeModal');
    const reviewForm = document.getElementById('review-form');
    const stars = document.querySelectorAll('.star-selector .star');
    const ratingInput = document.getElementById('rating-input');
    
    // YENİ: Hata mesajı elemanını seçiyoruz
    const formErrorMessage = document.getElementById('form-error-message');

    let selectedRating = 0;

    function openModal() {
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Modal kapandığında hata mesajını temizle
            if(formErrorMessage) {
                formErrorMessage.textContent = '';
            }
        }
    }

    if (openModalBtn) {
        openModalBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function (e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    stars.forEach((star) => {
        star.addEventListener('click', function () {
            selectedRating = parseInt(this.dataset.rating);
            if (ratingInput) {
                ratingInput.value = selectedRating;
            }
            // Derecelendirme seçildiğinde hata mesajını temizle
            if (formErrorMessage) {
                formErrorMessage.textContent = '';
            }
            updateStars();
        });

        star.addEventListener('mouseenter', function () {
            const rating = parseInt(this.dataset.rating);
            highlightStars(rating);
        });
    });

    const starSelector = document.querySelector('.star-selector');
    if (starSelector) {
        starSelector.addEventListener('mouseleave', function () {
            updateStars();
        });
    }

    function updateStars() {
        stars.forEach((star, index) => {
            if (index < selectedRating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    function highlightStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            if (formErrorMessage) {
                formErrorMessage.textContent = '';
            }

            if (selectedRating === 0) {
                e.preventDefault(); 

                if (formErrorMessage) {
                    formErrorMessage.textContent = 'Please select a rating before submitting.';
                }
            }
        });
    }
});