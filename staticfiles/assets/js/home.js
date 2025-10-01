let swiper = new Swiper(".home-header .mySwiper", {
  loop: !0,
  effect: "fade",
  autoplay: { delay: 5e3, disableOnInteraction: !1 },
  navigation: {
    nextEl: ".home-header .swiper-button-next",
    prevEl: ".home-header .swiper-button-prev",
  },
  pagination: { el: ".home-header .swiper-pagination", clickable: !0 },
});
function copyToClipboard(t) {
  var e = t.getAttribute("data-url"),
    e = window.location.origin + e;
  navigator.clipboard
    .writeText(e)
    .then(() => {
      let e = t.closest(".card-content").querySelector(".copy-message");
      e &&
        (e.classList.add("show"),
        setTimeout(() => {
          e.classList.remove("show");
        }, 2e3));
    })
    .catch((e) => {
      console.error("Could not copy text: ", e);
    });
}
document.addEventListener("DOMContentLoaded", function () {
  new Swiper(".comments-section .commentSwiper", {
    cssMode: !0,
    slidesPerView: 2,
    spaceBetween: 20,
    navigation: {
      nextEl: ".comments-section .swiper-button-next",
      prevEl: ".comments-section .swiper-button-prev",
    },
    pagination: { el: ".comments-section .swiper-pagination" },
    mousewheel: !0,
    keyboard: !0,
  });
}),
  document.addEventListener("DOMContentLoaded", function () {
   new Swiper(".product-range .mySwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  navigation: {
    nextEl: ".product-range .swiper-button-next",
    prevEl: ".product-range .swiper-button-prev",
  },
  autoplay: { delay: 5000, disableOnInteraction: false },
});

  }),
  document.addEventListener("DOMContentLoaded", () => {
    let o = document.querySelectorAll(".cross-reference-content .dropdown");
    o.forEach((t) => {
      t.querySelector(".dropdown-toggle").addEventListener("click", (e) => {
        e.stopPropagation(),
          o.forEach((e) => {
            e !== t && e.classList.remove("open");
          }),
          t.classList.toggle("open");
      });
    }),
      document.addEventListener("click", () => {
        o.forEach((e) => e.classList.remove("open"));
      });
  });
