const swiper = new Swiper('.home-header .mySwiper', {
  loop: true,
  effect: 'fade',
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  navigation: {
    nextEl: '.home-header .swiper-button-next',
    prevEl: '.home-header .swiper-button-prev'
  },
  pagination: {
    el: '.home-header .swiper-pagination',
    clickable: true
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const commentSwiper = new Swiper('.comments-section .commentSwiper', {
    cssMode: true,
    slidesPerView: 2,
    spaceBetween: 20,
    navigation: {
      nextEl: '.comments-section .swiper-button-next',
      prevEl: '.comments-section .swiper-button-prev'
    },
    pagination: {
      el: '.comments-section .swiper-pagination'
    },
    mousewheel: true,
    keyboard: true
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.cross-reference-content .dropdown');

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector('.dropdown-toggle');

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdowns.forEach((d) => {
        if (d !== dropdown) d.classList.remove('open');
      });
      dropdown.classList.toggle('open');
    });
  });

  document.addEventListener('click', () => {
    dropdowns.forEach((d) => d.classList.remove('open'));
  });
});

function copyToClipboard(element) {
  const url = element.getAttribute('data-url');
  const fullUrl = window.location.origin + url;

  navigator.clipboard
    .writeText(fullUrl)
    .then(() => {
      const cardContent = element.closest('.card-content');
      const messageDiv = cardContent.querySelector('.copy-message');

      if (messageDiv) {
        messageDiv.classList.add('show');
        setTimeout(() => {
          messageDiv.classList.remove('show');
        }, 2000);
      }
    })
    .catch((err) => {
      console.error('Could not copy text: ', err);
    });
}
