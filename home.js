const swiper = new Swiper(".home-header .mySwiper", {
  loop: true,
  effect: "fade",
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".home-header .swiper-button-next",
    prevEl: ".home-header .swiper-button-prev",
  },
  pagination: {
    el: ".home-header .swiper-pagination",
    clickable: true,
  },
});

document.addEventListener("DOMContentLoaded", function () {
  const commentSwiper = new Swiper(".comments-section .commentSwiper", {
    cssMode: true,
    slidesPerView: 2,
    spaceBetween: 20,
    navigation: {
      nextEl: ".comments-section .swiper-button-next",
      prevEl: ".comments-section .swiper-button-prev",
    },
    pagination: {
      el: ".comments-section .swiper-pagination",
    },
    mousewheel: true,
    keyboard: true,
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const rangeswiper = new Swiper(".product-range .mySwiper", {
    slidesPerView: "auto",
    spaceBetween: 30,
    navigation: {
      nextEl: ".product-range .swiper-button-next",
      prevEl: ".product-range .swiper-button-prev",
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    loop: true,
    centeredSlides: false,
    loopedSlides: 8,
  });
});

const gap = 120;
const itemWidth = 100;
const scrollAmount = itemWidth + gap;

const carousel = document.getElementById("carousel");
const content = document.getElementById("content");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

const cloneContent = content.cloneNode(true);
cloneContent.setAttribute("aria-hidden", "true");
content.appendChild(cloneContent);

let isScrolling = false;

next.addEventListener("click", () => {
  if (isScrolling) return;
  isScrolling = true;
  carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });

  setTimeout(() => {
    if (carousel.scrollLeft >= content.scrollWidth - carousel.clientWidth) {
      carousel.scrollLeft = 0;
    }
    isScrolling = false;
  }, 400);
});

prev.addEventListener("click", () => {
  if (isScrolling) return;
  isScrolling = true;
  carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" });

  setTimeout(() => {
    if (carousel.scrollLeft <= 0) {
      carousel.scrollLeft = content.scrollWidth / 2;
    }
    isScrolling = false;
  }, 400);
});

// dropdown menu

document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(
    ".cross-reference-content .dropdown"
  );

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-toggle");

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdowns.forEach((d) => {
        if (d !== dropdown) d.classList.remove("open");
      });
      dropdown.classList.toggle("open");
    });
  });

  document.addEventListener("click", () => {
    dropdowns.forEach((d) => d.classList.remove("open"));
  });
});

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  const nav = document.querySelector("nav");

  if (window.scrollY > 20) {
    navbar.classList.remove("transparent");
    navbar.classList.add("scrolled");
    nav.classList.add("scrolled-nav");
  } else {
    navbar.classList.add("transparent");
    navbar.classList.remove("scrolled");
    nav.classList.remove("scrolled-nav");
  }
});

window.addEventListener("scroll", function () {
  const headerWhatsapp = document.querySelector(".header-whatsapp");
  const fixedWhatsapp = document.querySelector(".fixed-whatsapp");
  const scrollPosition = window.scrollY;
  const headerHeight = document.querySelector(
    ".placeholder-header"
  ).offsetHeight;

  if (scrollPosition > 100) {
    fixedWhatsapp.style.opacity = "1";
    fixedWhatsapp.style.visibility = "visible";

    if (headerWhatsapp) {
      headerWhatsapp.style.opacity = "0";
      headerWhatsapp.style.visibility = "hidden";
    }
  } else {
    fixedWhatsapp.style.opacity = "0";
    fixedWhatsapp.style.visibility = "hidden";

    if (headerWhatsapp) {
      headerWhatsapp.style.opacity = "1";
      headerWhatsapp.style.visibility = "visible";
    }
  }
});

