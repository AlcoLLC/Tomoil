
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
    };

    const fixedWhatsapp = document.querySelector(".fixed-whatsapp");
    const scrollPosition = window.scrollY;

    if (scrollPosition > 100) {
        fixedWhatsapp.style.opacity = "1";
        fixedWhatsapp.style.visibility = "visible";
    } else {
        fixedWhatsapp.style.opacity = "0";
        fixedWhatsapp.style.visibility = "hidden";

    }
});
