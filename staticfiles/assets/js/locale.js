// document.addEventListener("DOMContentLoaded", function () {
//   const langDropdownBtn = document.querySelector(".lang-dropdown-btn");
//   const languageDropdown = document.getElementById("languageDropdown");
//   const desktopLangOptions = document.querySelectorAll("#languageDropdown .lang-option");
//   const mobileLangButtons = document.querySelectorAll(".mobile.lang-btn");

//   // Desktop dropdown açma/kapama
//   if (langDropdownBtn && languageDropdown) {
//     langDropdownBtn.addEventListener("click", function(e) {
//       e.preventDefault();
//       e.stopPropagation();
//       console.log("Dropdown button clicked"); // Debug için
//       languageDropdown.classList.toggle("show");
//     });

//     // Dropdown dışına tıklayınca kapat
//     document.addEventListener("click", function(e) {
//       if (!langDropdownBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
//         languageDropdown.classList.remove("show");
//       }
//     });
//   }

//   // Desktop dil seçenekleri
//   desktopLangOptions.forEach((option) => {
//     option.addEventListener("click", function(e) {
//       e.preventDefault();
//       e.stopPropagation();
      
//       const selectedLang = this.getAttribute("data-lang");
//       console.log("Desktop language selected:", selectedLang); // Debug için
      
//       if (languageDropdown) {
//         languageDropdown.classList.remove("show");
//       }
      
//       switchLanguage(selectedLang);
//     });
//   });

//   // Mobile dil butonları
//   mobileLangButtons.forEach((button) => {
//     button.addEventListener("click", function(e) {
//       e.preventDefault();
//       e.stopPropagation();
      
//       const selectedLang = this.getAttribute("data-lang");
//       console.log("Mobile language selected:", selectedLang); // Debug için
//       switchLanguage(selectedLang);
//     });
//   });

//   function switchLanguage(langCode) {
//     console.log("Switching to language:", langCode); // Debug için
//     let csrfValue = getCsrfToken();
//     const newPath = calculateNewPath(langCode);
//     console.log("New path:", newPath); // Debug için

//     if (csrfValue) {
//       console.log("CSRF token found, submitting form"); // Debug için
//       submitLanguageForm(langCode, newPath, csrfValue);
//     } else {
//       console.log("No CSRF token, redirecting directly"); // Debug için
//       window.location.href = newPath;
//     }
//   }

//   function getCsrfToken() {
//     // Meta tag'den CSRF token'ı al
//     const csrfMeta = document.querySelector('meta[name="csrf-token"]');
//     if (csrfMeta) {
//       return csrfMeta.getAttribute("content");
//     }

//     // Form input'undan CSRF token'ı al
//     const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
//     if (csrfInput) {
//       return csrfInput.value;
//     }

//     // Cookie'den CSRF token'ı al
//     const cookies = document.cookie.split(";");
//     for (let cookie of cookies) {
//       const [name, value] = cookie.trim().split("=");
//       if (name === "csrftoken") {
//         return value;
//       }
//     }

//     return null;
//   }

//   function calculateNewPath(langCode) {
//     const currentPath = window.location.pathname;
//     const supportedLangs = ['de', 'es', 'fr', 'it', 'ca', 'zh-hans'];
    
//     let pathWithoutLang = currentPath;
//     let currentLang = 'en';

//     // Mevcut dili tespit et
//     for (let lang of supportedLangs) {
//       if (currentPath.startsWith(`/${lang}/`)) {
//         currentLang = lang;
//         pathWithoutLang = currentPath.substring(lang.length + 1);
//         break;
//       } else if (currentPath === `/${lang}`) {
//         currentLang = lang;
//         pathWithoutLang = '/';
//         break;
//       }
//     }

//     // Yeni path'i oluştur
//     if (langCode === 'en') {
//       return pathWithoutLang === '/' ? '/' : pathWithoutLang;
//     } else {
//       return `/${langCode}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
//     }
//   }

//   function submitLanguageForm(langCode, nextUrl, csrfToken) {    
//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = "/i18n/setlang/";
//     form.style.display = "none";

//     const csrfInput = document.createElement("input");
//     csrfInput.type = "hidden";
//     csrfInput.name = "csrfmiddlewaretoken";
//     csrfInput.value = csrfToken;
//     form.appendChild(csrfInput);

//     const langInput = document.createElement("input");
//     langInput.type = "hidden";
//     langInput.name = "language";
//     langInput.value = langCode;
//     form.appendChild(langInput);

//     const nextInput = document.createElement("input");
//     nextInput.type = "hidden";
//     nextInput.name = "next";
//     nextInput.value = nextUrl;
//     form.appendChild(nextInput);

//     document.body.appendChild(form);
//     form.submit();
//   }

//   function setActiveLanguageButton() {
//     const currentPath = window.location.pathname;
//     let currentLang = "en";

//     const supportedLangs = ['de', 'es', 'fr', 'it', 'ca', 'zh-hans'];
//     for (let lang of supportedLangs) {
//       if (currentPath.startsWith(`/${lang}/`) || currentPath === `/${lang}`) {
//         currentLang = lang;
//         break;
//       }
//     }
    
//     // Tüm dil butonlarından active class'ını kaldır
//     document.querySelectorAll('[data-lang]').forEach(btn => {
//       btn.classList.remove("active");
//     });

//     // Aktif dil butonuna active class'ını ekle
//     document.querySelectorAll(`[data-lang="${currentLang}"]`).forEach(btn => {
//       btn.classList.add("active");
//     });

//     // Dropdown butonunun metnini güncelle
//     if (langDropdownBtn) {
//       const langTexts = {
//         'en': 'EN', 'de': 'DE', 'es': 'ES', 'fr': 'FR', 
//         'it': 'IT', 'ca': 'CA', 'zh-hans': '汉语'
//       };
      
//       const currentLangText = langTexts[currentLang] || 'EN';
//       langDropdownBtn.innerHTML = `${currentLangText} <i class="fa-solid fa-angle-down"></i>`;
//     }
//   }

//   // Sayfa yüklendiğinde aktif dil butonunu ayarla
//   setActiveLanguageButton();

//   // Test fonksiyonu
//   window.testLanguageSwitch = function(lang) {
//     switchLanguage(lang);
//   };
// });