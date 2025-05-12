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

  let currentIndex = 0;
  const totalCards = cards.length;

  // İlkin olaraq bütün kartları interaktiv edək
  cards.forEach(card => {
    card.classList.add('interactive');
  });

  // İlk kartı aktiv edək
  cards[currentIndex].classList.add('active');

  // Slider'in hündürlüyünü təyin edək
  function updateSliderHeight() {
    let maxHeight = 0;
    cards.forEach(card => {
      const height = card.offsetHeight;
      if (height > maxHeight) {
        maxHeight = height;
      }
    });
    sliderContainer.style.height = (maxHeight + 40) + 'px';
  }

  updateSliderHeight();

  // Kartlara klik edildikdə aktiv etmək üçün hadisə dinləyicilərini əlavə edək
  cards.forEach((card, index) => {
    card.addEventListener('click', function() {
      cards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      currentIndex = index;
      updateSliderPosition();
    });
  });

  // Slider-i yeniləmək və mərkəzləşdirmə funksiyası
  function updateSliderPosition() {
    // Əvvəlcə bütün kartlardan 'active' sinifini silib
    cards.forEach(card => {
      card.classList.remove('active');
    });

    // Cari kartı aktiv edək
    cards[currentIndex].classList.add('active');

    // Kart genişliyi və boşluğu hesablayaq
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 20; // CSS-də təyin edilmiş boşluq

    // Slider konteynerinin genişliyi
    const containerWidth = sliderContainer.getBoundingClientRect().width;

    // Hesablanan pozisiyanı mərkəzləşdirmək üçün düzəliş
    const offset = (containerWidth - cardWidth) / 2;

    // Cari kartın mövqeyini hesablayaq
    let scrollPos = (currentIndex * (cardWidth + gap)) - offset;

    // Minimum və maksimum sərhədlər üçün yoxlama
    const trackWidth = ((cardWidth + gap) * totalCards) - gap;
    const maxScroll = trackWidth - containerWidth;

    // Sliderın sərhədlərini aşmamasını təmin edək
    if (scrollPos < 0) scrollPos = 0;
    if (scrollPos > maxScroll) scrollPos = maxScroll;

    // Sliderı yeniləyək
    sliderTrack.style.transition = 'transform 0.5s ease';
    sliderTrack.style.transform = `translateX(-${scrollPos}px)`;
  }

  // İlkin pozisiyanı təyin edək
  updateSliderPosition();

  // Sağa və sola sürüşdürmə üçün düymələri əlavə edək
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalCards - 1; // Dövrə keçmək üçün
    }
    updateSliderPosition();
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalCards - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Dövrə keçmək üçün
    }
    updateSliderPosition();
  });

  // Toxunma hadisələri üçün dəstək əlavə edək
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
      // Sola sürüşdürmə (növbəti kart)
      if (currentIndex < totalCards - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateSliderPosition();
    }

    if (touchEndX > touchStartX + 50) {
      // Sağa sürüşdürmə (əvvəlki kart)
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = totalCards - 1;
      }
      updateSliderPosition();
    }
  }

  // Ekran ölçüsü dəyişdikdə slideri yeniləyək
  window.addEventListener('resize', () => {
    updateSliderHeight();
    updateSliderPosition();
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

    let animationInProgress = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationInProgress) {
                animationInProgress = true;

                let completedAnimations = 0;
                statBoxes.forEach((box, index) => {
                    animateNumber(box, statValues[index], () => {
                        completedAnimations++;
                        // Bütün animasiyalar bitəndə statusu sıfırla
                        if (completedAnimations === statBoxes.length) {
                            animationInProgress = false;
                        }
                    });
                });
            }
            else if (!entry.isIntersecting) {
                statBoxes.forEach((box, index) => {
                    // Bu elementləri ilkin vəziyyətə qaytarır (opsiyonal)
                    if (statValues[index].startFrom === 0) {
                        box.textContent = "0" + statValues[index].unit;
                    } else {
                        box.textContent = statValues[index].startFrom.toFixed(1) + statValues[index].unit;
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    const bestOffersSection = document.querySelector('.section-best-offers');
    if (bestOffersSection) {
        observer.observe(bestOffersSection);
    }
}

function animateNumber(element, statInfo, callback) {
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

            if (callback) callback();
        }
    }

    requestAnimationFrame(updateNumber);
}