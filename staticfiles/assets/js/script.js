document.addEventListener('DOMContentLoaded', function () {
  initCaseStudiesSlider();
  initBrandLogosRotation();
  initNumberCounters();
  initProductSlider();
});

function initProductSlider() {
  const sliderContainer = document.querySelector(
    '.featured-section .slider-container'
  );
  const productCards = document.querySelectorAll(
    '.featured-section .product-card'
  );
  const prevBtn = document.querySelector('.featured-section .prev-btn');
  const nextBtn = document.querySelector('.featured-section .next-btn');

  const originalProductCount = productCards.length;
  let autoplayInterval;

  // Orijinal elementləri kopyalayıb əvvələ və sona əlavə et
  function createInfiniteLoop() {
    // Sonuncu elementləri əvvələ əlavə et
    for (let i = originalProductCount - 1; i >= 0; i--) {
      const clone = productCards[i].cloneNode(true);
      sliderContainer.insertBefore(clone, sliderContainer.firstChild);
    }

    // İlk elementləri sona əlavə et
    for (let i = 0; i < originalProductCount; i++) {
      const clone = productCards[i].cloneNode(true);
      sliderContainer.appendChild(clone);
    }
  }

  createInfiniteLoop();

  // Yenilənmiş card listini al
  const allCards = document.querySelectorAll('.featured-section .product-card');
  const totalCards = allCards.length;

  // Başlanğıc pozisiyası - orijinal ilk element (ortadakı grup)
  let currentIndex = originalProductCount + 1; // İkinci qrupdan başla (orijinal mərkəz)

  function updateSlider() {
    allCards.forEach((card) => {
      card.classList.remove('visible', 'active');
    });

    const prevIndex = currentIndex - 1;
    const nextIndex = currentIndex + 1;

    if (allCards[prevIndex]) allCards[prevIndex].classList.add('visible');
    if (allCards[currentIndex])
      allCards[currentIndex].classList.add('visible', 'active');
    if (allCards[nextIndex]) allCards[nextIndex].classList.add('visible');
  }

  function nextSlide() {
    currentIndex++;

    // Sona çatdıqda başa qayıt
    if (currentIndex >= totalCards - originalProductCount) {
      currentIndex = originalProductCount;
    }

    updateSlider();
  }

  function prevSlide() {
    currentIndex--;

    // Başa çatdıqda sona qayıt
    if (currentIndex < originalProductCount) {
      currentIndex = totalCards - originalProductCount - 1;
    }

    updateSlider();
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      nextSlide();
    }, 3000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  prevBtn.addEventListener('click', () => {
    prevSlide();
    restartAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    restartAutoplay();
  });

  updateSlider();
  startAutoplay();

  let touchStartX = 0;
  let touchEndX = 0;

  sliderContainer.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    },
    false
  );

  sliderContainer.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      restartAutoplay();
    },
    false
  );

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      nextSlide();
    }

    if (touchEndX > touchStartX + 50) {
      prevSlide();
    }
  }

  sliderContainer.addEventListener('mouseenter', stopAutoplay);
  sliderContainer.addEventListener('mouseleave', startAutoplay);
}

function initCaseStudiesSlider() {
  const sliderTrack = document.querySelector('.case-studies-track');
  const originalCards = document.querySelectorAll(
    '.case-study-card:not(.clone)'
  );
  const prevBtn = document.querySelector('.prev-case');
  const nextBtn = document.querySelector('.next-case');
  const sliderContainer = document.querySelector('.case-studies-slider');

  if (
    !sliderTrack ||
    !originalCards.length ||
    !prevBtn ||
    !nextBtn ||
    !sliderContainer
  ) {
    return;
  }

  const totalCards = originalCards.length;
  const visibleCards = 5; // Ekranda görünən kart sayı
  const cloneCount = Math.max(visibleCards * 2, totalCards); // Daha çox klon
  let currentIndex = 0;
  let isTransitioning = false;
  let autoplayInterval;
  const autoplayDelay = 4000;

  // Köhnə klonları silir
  function removeOldClones() {
    document.querySelectorAll('.case-study-card.clone').forEach((clone) => {
      clone.remove();
    });
  }

  // Smooth sonsuz dövrü üçün çox klon yaradır
  function createSmoothInfiniteClones() {
    removeOldClones();

    if (totalCards <= 1) return;

    // Sol tərəfə 2 dəfə tam set əlavə edirik
    for (let round = 0; round < 2; round++) {
      for (let i = totalCards - 1; i >= 0; i--) {
        const clone = originalCards[i].cloneNode(true);
        clone.classList.add('clone', 'clone-left');
        sliderTrack.insertBefore(clone, sliderTrack.firstChild);
      }
    }

    // Sağ tərəfə 2 dəfə tam set əlavə edirik
    for (let round = 0; round < 2; round++) {
      for (let i = 0; i < totalCards; i++) {
        const clone = originalCards[i].cloneNode(true);
        clone.classList.add('clone', 'clone-right');
        sliderTrack.appendChild(clone);
      }
    }
  }

  // Başlanğıc
  createSmoothInfiniteClones();

  // Bütün kartları seçirik
  let allCards = document.querySelectorAll('.case-study-card');

  // Başlanğıc indeksi - orta hissədə başlayırıq
  currentIndex = totalCards * 2 + Math.floor(totalCards / 2);

  console.log(
    `Total original: ${totalCards}, Total with clones: ${allCards.length}, Start index: ${currentIndex}`
  );

  // Slider hündürlüyü
  function updateSliderHeight() {
    let maxHeight = 0;
    originalCards.forEach((card) => {
      const cardHeight = card.offsetHeight;
      if (cardHeight > maxHeight) {
        maxHeight = cardHeight;
      }
    });
    sliderContainer.style.height = maxHeight + 40 + 'px';
  }

  updateSliderHeight();

  // Autoplay
  function startAutoplay() {
    if (totalCards <= 1) return;
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, autoplayDelay);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Kart qarşılıqlı əlaqələri
  function setupCardInteractions() {
    allCards.forEach((card, index) => {
      card.classList.add('interactive');

      card.addEventListener('mouseenter', function () {
        stopAutoplay();
        allCards.forEach((c) => c.classList.remove('active'));
        this.classList.add('active');
      });

      card.addEventListener('mouseleave', function () {
        if (totalCards > 1) {
          startAutoplay();
        }
        allCards.forEach((c) => c.classList.remove('active'));
        if (allCards[currentIndex]) {
          allCards[currentIndex].classList.add('active');
        }
      });
    });
  }

  setupCardInteractions();

  // Slideri yeniləyən əsas funksiya
  function updateSlider(withTransition = true) {
    if (withTransition) {
      sliderTrack.classList.add('transitioning');
    } else {
      sliderTrack.classList.remove('transitioning');
    }

    // Aktiv kartı təyin edirik
    allCards.forEach((card) => card.classList.remove('active'));
    if (allCards[currentIndex]) {
      allCards[currentIndex].classList.add('active');
    }

    // Kart ölçülərini hesablayırıq
    const cardWidth = allCards[0] ? allCards[0].offsetWidth : 150;
    const expandedWidth = 330;
    const gap = 20;
    const containerWidth = sliderContainer.offsetWidth;

    // Aktiv kartı mərkəzə çəkirik
    const activeCardOffset = currentIndex * (cardWidth + gap);
    const centerOffset = containerWidth / 2 - expandedWidth / 2;
    const translateX = centerOffset - activeCardOffset;

    sliderTrack.style.transform = `translateX(${translateX}px)`;
  }

  // Smooth sonsuz dövrü - pozisiya yoxlanışı
  function checkAndResetPosition() {
    if (totalCards <= 1) return;

    // Transition bitdikdən sonra pozisiyaları yoxlayırıq
    setTimeout(() => {
      const originalStart = totalCards * 2; // Əsl kartların başlanğıcı
      const originalEnd = totalCards * 3 - 1; // Əsl kartların sonu
      const safeZoneStart = totalCards; // Təhlükəsiz zona başlanğıcı
      const safeZoneEnd = totalCards * 4 - 1; // Təhlükəsiz zona sonu

      let needsReset = false;
      let newIndex = currentIndex;

      // Çox sağa getdikdə
      if (currentIndex >= safeZoneEnd - totalCards) {
        const relativePosition = currentIndex - originalStart;
        newIndex = originalStart + (relativePosition % totalCards);
        needsReset = true;
      }
      // Çox sola getdikdə
      else if (currentIndex <= safeZoneStart + totalCards) {
        const relativePosition = currentIndex - originalStart;
        newIndex = originalStart + (relativePosition % totalCards);
        if (newIndex < originalStart) {
          newIndex += totalCards;
        }
        needsReset = true;
      }

      if (needsReset) {
        sliderTrack.classList.remove('transitioning');
        currentIndex = newIndex;
        updateSlider(false);
        console.log(`Reset to index: ${currentIndex}`);
      }
    }, 350); // Transition müddətindən bir az çox
  }

  // Növbəti slayda keç
  function nextSlide() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex++;

    updateSlider(true);
    checkAndResetPosition();

    setTimeout(() => {
      isTransitioning = false;
    }, 350);
  }

  // Əvvəlki slayda keç
  function prevSlide() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex--;

    updateSlider(true);
    checkAndResetPosition();

    setTimeout(() => {
      isTransitioning = false;
    }, 350);
  }

  // İlk göstəriş
  updateSlider(false);

  // Button event listeners
  nextBtn.addEventListener('click', () => {
    if (totalCards <= 1) return;
    stopAutoplay();
    nextSlide();
    setTimeout(() => {
      if (totalCards > 1) startAutoplay();
    }, 1000);
  });

  prevBtn.addEventListener('click', () => {
    if (totalCards <= 1) return;
    stopAutoplay();
    prevSlide();
    setTimeout(() => {
      if (totalCards > 1) startAutoplay();
    }, 1000);
  });

  // Touch/Swipe dəstəyi
  let touchStartX = 0;
  let touchEndX = 0;

  sliderTrack.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  sliderTrack.addEventListener(
    'touchend',
    (e) => {
      if (isTransitioning || totalCards <= 1) return;
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      stopAutoplay();
      if (swipeDistance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setTimeout(() => {
        if (totalCards > 1) startAutoplay();
      }, 1000);
    }
  }

  // Mouse hover events
  sliderContainer.addEventListener('mouseenter', stopAutoplay);
  sliderContainer.addEventListener('mouseleave', () => {
    if (totalCards > 1) startAutoplay();
  });

  // Window resize
  window.addEventListener('resize', () => {
    updateSliderHeight();
    updateSlider(false);
  });

  // Autoplay başlat
  if (totalCards > 1) {
    startAutoplay();
  }

  console.log(`Smooth infinite slider initialized`);
}
function initBrandLogosRotation() {
  const allLogos = Array.from(
    document.querySelectorAll('.brand-logo-container')
  );
  const brandLogosWrapper = document.querySelector('.brand-logos');

  if (!brandLogosWrapper || allLogos.length === 0) return;

  let visibleCount = 4;
  let visibleLogos = allLogos.slice(0, visibleCount);
  let hiddenLogos = allLogos.slice(visibleCount);

  function updateVisibleLogos() {
    brandLogosWrapper.innerHTML = '';

    visibleLogos.forEach((logo) => {
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

    visibleLogo.classList.add('changing');
    hiddenLogo.classList.add('changing');

    updateVisibleLogos();

    setTimeout(() => {
      visibleLogo.classList.remove('changing');
      hiddenLogo.classList.remove('changing');
    }, 500);
  }

  updateVisibleLogos();

  setInterval(swapLogos, 1500);
}

function initNumberCounters() {
  const statValues = [
    { value: 8, unit: '', startFrom: 0 },
    { value: 1.5, unit: 'k', startFrom: 1.0 },
    { value: 82, unit: '', startFrom: 0 },
    { value: 8, unit: 'm', startFrom: 0 },
  ];

  const statBoxes = document.querySelectorAll(
    '.section-best-offers .stat-box h3'
  );

  if (statBoxes.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statBoxes.forEach((box, index) => {
            animateNumber(box, statValues[index]);
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

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
      currentValue = startValue + (increment * elapsedTime) / 16;

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
