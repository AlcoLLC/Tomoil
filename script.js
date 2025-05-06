document.addEventListener("DOMContentLoaded", function () {
    initProductSlider();
    initCaseStudiesSlider();
    initBrandLogosRotation();
    initNumberCounters();
});

// Featured Products Slider Functionality
function initProductSlider() {
    const sliderContainer = document.querySelector('.featured-section .slider-container');
    const productCards = document.querySelectorAll('.featured-section .product-card');
    const prevBtn = document.querySelector('.featured-section .prev-btn');
    const nextBtn = document.querySelector('.featured-section .next-btn');

    let currentIndex = 1;
    const totalProducts = productCards.length;

    function updateSlider() {
        productCards.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('active');
        });

        const prevIndex = (currentIndex - 1 + totalProducts) % totalProducts;
        const nextIndex = (currentIndex + 1) % totalProducts;

        productCards[prevIndex].classList.add('visible');
        productCards[currentIndex].classList.add('visible', 'active');
        productCards[nextIndex].classList.add('visible');
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex - 1 > 0) {
            currentIndex = currentIndex - 1;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {

        if (currentIndex + 1 < totalProducts - 1) {
            currentIndex = currentIndex + 1;
            updateSlider();
        }
    });

    updateSlider();

    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            if (currentIndex + 1 < totalProducts - 1) {
                currentIndex = currentIndex + 1;
                updateSlider();
            }
        }

        if (touchEndX > touchStartX + 50) {
            if (currentIndex - 1 > 0) {
                currentIndex = currentIndex - 1;
                updateSlider();
            }
        }
    }
}

// Case Studies Slider Functionality
function initCaseStudiesSlider() {
    const sliderTrack = document.querySelector('.case-studies-track');
    const cards = document.querySelectorAll('.case-study-card');
    const prevBtn = document.querySelector('.prev-case');
    const nextBtn = document.querySelector('.next-case');
    const sliderContainer = document.querySelector('.case-studies-slider');

    let currentIndex = 1;
    const totalCards = cards.length;

    updateSliderHeight();

    function updateSliderHeight() {
        let maxHeight = 0;
        cards.forEach(card => {
            const cardHeight = card.offsetHeight;
            if (cardHeight > maxHeight) {
                maxHeight = cardHeight;
            }
        });
        sliderContainer.style.height = (maxHeight + 40) + 'px';
    }

    cards.forEach((card, index) => {
        card.classList.add('interactive');

        card.addEventListener('click', function() {
            cards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentIndex = index;
        });

        card.addEventListener('mouseenter', function() {
            if (index !== currentIndex) {
                cards[currentIndex].classList.remove('active');
            }
        });

        card.addEventListener('mouseleave', function() {
            if (index !== currentIndex) {
                cards[currentIndex].classList.add('active');
            }
        });
    });

    updateSlider();

    function updateSlider() {
        cards.forEach(card => {
            card.classList.remove('active');
        });

        cards[currentIndex].classList.add('active');

        const cardWidth = cards[0].offsetWidth;
        const gap = 20;
        const scrollPos = (currentIndex * (cardWidth + gap)) - (window.innerWidth / 2) + (cardWidth / 2);

        sliderTrack.style.transform = `translateX(-${scrollPos}px)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalCards;
        updateSlider();
    });

    let touchStartX = 0;
    let touchEndX = 0;

    sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    sliderTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            currentIndex = (currentIndex + 1) % totalCards;
            updateSlider();
        }

        if (touchEndX > touchStartX + 50) {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateSlider();
        }
    }

    window.addEventListener('resize', () => {
        updateSlider();
        updateSliderHeight();
    });
}

// Brand Logos Rotation Functionality
function initBrandLogosRotation() {
    const allLogos = Array.from(document.querySelectorAll(".brand-logo-container"));
    const brandLogosWrapper = document.querySelector(".brand-logos");

    if (!brandLogosWrapper || allLogos.length === 0) return;

    let visibleCount = 4;
    let visibleLogos = allLogos.slice(0, visibleCount);
    let hiddenLogos = allLogos.slice(visibleCount);

    function updateVisibleLogos() {
        brandLogosWrapper.innerHTML = "";

        visibleLogos.forEach(logo => {
            brandLogosWrapper.appendChild(logo);
        });
    }

    function swapLogos() {
        if (hiddenLogos.length === 0) return;

        const visibleIndex = Math.floor(Math.random() * visibleLogos.length);
        const hiddenIndex = Math.floor(Math.random() * hiddenLogos.length);

        const visibleLogo = visibleLogos[visibleIndex];
        const hiddenLogo = hiddenLogos[hiddenIndex];

        visibleLogos[visibleIndex] = hiddenLogo;
        hiddenLogos[hiddenIndex] = visibleLogo;

        visibleLogo.classList.add("changing");
        hiddenLogo.classList.add("changing");

        updateVisibleLogos();

        setTimeout(() => {
            visibleLogo.classList.remove("changing");
            hiddenLogo.classList.remove("changing");
        }, 500);
    }

    updateVisibleLogos();

    setInterval(swapLogos, 1500);
}

// Number counter animation
function initNumberCounters() {
    const statValues = [
        { value: 8, unit: "", startFrom: 0 },
        { value: 1.5, unit: "k", startFrom: 1.0 },
        { value: 82, unit: "", startFrom: 0 },
        { value: 8, unit: "m", startFrom: 0 }
    ];

    const statBoxes = document.querySelectorAll('.section-best-offers .stat-box h3');

    if (statBoxes.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statBoxes.forEach((box, index) => {
                    animateNumber(box, statValues[index]);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const bestOffersSection = document.querySelector('.section-best-offers');
    if (bestOffersSection) {
        observer.observe(bestOffersSection);
    }
}

function animateNumber(element, statInfo) {
    const startValue = statInfo.startFrom;
    const targetValue = statInfo.value;
    const unit = statInfo.unit;

    const duration = 2000;
    const range = targetValue - startValue;
    const increment = range / (duration / 16);

    let currentValue = startValue;
    let startTime = null;

    function updateNumber(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;

        if (elapsedTime < duration) {
            currentValue = startValue + (increment * elapsedTime / 16);

            const formattedValue = Number.isInteger(targetValue)
                ? Math.floor(currentValue).toString()
                : currentValue.toFixed(1);

            element.textContent = formattedValue + unit;

            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = Number.isInteger(targetValue)
                ? targetValue.toString() + unit
                : targetValue.toFixed(1) + unit;
        }
    }

    requestAnimationFrame(updateNumber);
}