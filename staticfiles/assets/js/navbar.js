

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


document.addEventListener("DOMContentLoaded", function () {
  const langDropdownBtn = document.querySelector(".lang-dropdown-btn");
  const languageDropdown = document.getElementById("languageDropdown");
  const desktopLangOptions = document.querySelectorAll("#languageDropdown .lang-option");
  const mobileLangButtons = document.querySelectorAll(".mobile-languages .lang-btn");

  if (langDropdownBtn && languageDropdown) {
    langDropdownBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      languageDropdown.classList.toggle("show");
    });

    document.addEventListener("click", function(e) {
      if (!langDropdownBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
        languageDropdown.classList.remove("show");
      }
    });
  }

  desktopLangOptions.forEach((option) => {
    option.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const selectedLang = this.getAttribute("data-lang");
      
      if (languageDropdown) {
        languageDropdown.classList.remove("show");
      }
      
      switchLanguage(selectedLang);
    });
  });

  mobileLangButtons.forEach((button) => {
    button.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const selectedLang = this.getAttribute("data-lang");
      mobileLangButtons.forEach((btn) => btn.classList.remove('active'));
      this.classList.add('active');
      
      switchLanguage(selectedLang);
    });
  });

  function switchLanguage(langCode) {
    let csrfValue = getCsrfToken();
    const newPath = calculateNewPath(langCode);

    const currentQueryString = window.location.search;
    const nextUrl = newPath + currentQueryString;

    if (csrfValue) {
      submitLanguageForm(langCode, nextUrl, csrfValue);
    } else {
      window.location.href = nextUrl;
    }
  }

  function getCsrfToken() {
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    if (csrfMeta) {
      return csrfMeta.getAttribute("content");
    }

    const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
    if (csrfInput) {
      return csrfInput.value;
    }

    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "csrftoken") {
        return value;
      }
    }

    return null;
  }

  function calculateNewPath(langCode) {
    const currentPath = window.location.pathname;
    const supportedLangs = ['de', 'es', 'fr', 'it', 'ca', 'zh-hans'];
    
    let pathWithoutLang = currentPath;
    let currentLang = 'en';

    for (let lang of supportedLangs) {
      if (currentPath.startsWith(`/${lang}/`)) {
        currentLang = lang;
        pathWithoutLang = currentPath.substring(lang.length + 1);
        break;
      } else if (currentPath === `/${lang}`) {
        currentLang = lang;
        pathWithoutLang = '/';
        break;
      }
    }

    if (langCode === 'en') {
      return pathWithoutLang;
    } else {
      if (pathWithoutLang === '/') {
        return `/${langCode}/`;
      } else if (pathWithoutLang.startsWith('/')) {
        return `/${langCode}${pathWithoutLang}`;
      } else {
        return `/${langCode}/${pathWithoutLang}`;
      }
    }
  }

  function submitLanguageForm(langCode, nextUrl, csrfToken) {    
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/i18n/setlang/";
    form.style.display = "none";

    const csrfInput = document.createElement("input");
    csrfInput.type = "hidden";
    csrfInput.name = "csrfmiddlewaretoken";
    csrfInput.value = csrfToken;
    form.appendChild(csrfInput);

    const langInput = document.createElement("input");
    langInput.type = "hidden";
    langInput.name = "language";
    langInput.value = langCode;
    form.appendChild(langInput);

    const nextInput = document.createElement("input");
    nextInput.type = "hidden";
    nextInput.name = "next";
    nextInput.value = nextUrl;
    form.appendChild(nextInput);

    document.body.appendChild(form);
    form.submit();
  }

  function setActiveLanguageButton() {
    const currentPath = window.location.pathname;
    let currentLang = "en";

    const supportedLangs = ['de', 'es', 'fr', 'it', 'ca', 'zh-hans'];
    for (let lang of supportedLangs) {
      if (currentPath.startsWith(`/${lang}/`) || currentPath === `/${lang}`) {
        currentLang = lang;
        break;
      }
    }
    
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.classList.remove("active");
    });

    document.querySelectorAll(`[data-lang="${currentLang}"]`).forEach(btn => {
      btn.classList.add("active");
    });

    if (langDropdownBtn) {
      const langTexts = {
        'en': 'EN', 'de': 'DE', 'es': 'ES', 'fr': 'FR', 
        'it': 'IT', 'ca': 'CA', 'zh-hans': '汉语'
      };
      
      const currentLangText = langTexts[currentLang] || 'EN';
      langDropdownBtn.innerHTML = `${currentLangText} <i class="fa-solid fa-angle-down"></i>`;
    }
  }

  function applyActiveClasses() {
    let currentPath = window.location.pathname;
    if (currentPath.length > 1 && currentPath.endsWith('/')) {
      currentPath = currentPath.slice(0, -1);
    }

    const desktopNavLinks = document.querySelectorAll(
      '.navbar .nav-section ul li a'
    );
    desktopNavLinks.forEach((link) => {
      let linkPath = link.getAttribute('href');
      if (linkPath && linkPath.length > 1 && linkPath.endsWith('/')) {
        linkPath = linkPath.slice(0, -1);
      }

      if (linkPath === currentPath) {
        link.classList.add('active');
        const parentLi = link.closest('li');
        if (parentLi && parentLi.classList.contains('dropdown')) {
          parentLi.classList.add('active');
        }
      } else {
        link.classList.remove('active'); 
        const parentLi = link.closest('li');
        if (parentLi && parentLi.classList.contains('dropdown')) {
          const activeDropdownItem = parentLi.querySelector(
            '.dropdown-content a.active'
          );
          if (!activeDropdownItem) {
            parentLi.classList.remove('active');
          }
        }
      }
    });

    const mobileNavLinks = document.querySelectorAll('.mobile-nav-list a');
    mobileNavLinks.forEach((link) => {
      let linkPath = link.getAttribute('href');
      if (linkPath && linkPath.length > 1 && linkPath.endsWith('/')) {
        linkPath = linkPath.slice(0, -1);
      }

      if (linkPath === currentPath) {
        link.classList.add('active');
        const parentDropdownContent = link.closest('.mobile-dropdown-content');
        if (parentDropdownContent) {
          parentDropdownContent.classList.add('active'); 
          const parentDropdown =
            parentDropdownContent.closest('.mobile-dropdown');
          if (parentDropdown) {
            parentDropdown.classList.add('active'); 
          }
        }
      } else {
        link.classList.remove('active'); 
        const parentDropdownContent = link.closest('.mobile-dropdown-content');
        if (parentDropdownContent) {
          const activeChildren =
            parentDropdownContent.querySelectorAll('a.active');
          if (activeChildren.length === 0) {
            parentDropdownContent.classList.remove('active');
            const parentDropdown =
              parentDropdownContent.closest('.mobile-dropdown');
            if (parentDropdown) {
              parentDropdown.classList.remove('active');
            }
          }
        }
      }
    });
  }

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (hamburger && mobileMenu) {
    const hamburgerIcon = hamburger.querySelector('i');
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);

    function openMobileMenu() {
      mobileMenu.classList.add('active');
      overlay.classList.add('active');
      if (hamburgerIcon) {
        hamburgerIcon.className = 'fa-solid fa-xmark';
      }
      document.body.style.overflow = 'hidden';
      applyActiveClasses(); 
    }

    function closeMobileMenu() {
      mobileMenu.classList.remove('active');
      overlay.classList.remove('active');
      if (hamburgerIcon) {
        hamburgerIcon.className = 'fas fa-bars';
      }
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    overlay.addEventListener('click', function () {
      closeMobileMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');

  mobileDropdowns.forEach((dropdown) => {
    const dropdownHead = dropdown.querySelector('.mobile-dropdown-head');
    const dropdownContent = dropdown.querySelector('.mobile-dropdown-content');

    if (dropdownHead && dropdownContent) {
      dropdownHead.addEventListener('click', function (e) {
        e.preventDefault();

        mobileDropdowns.forEach((otherDropdown) => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
            const otherContent = otherDropdown.querySelector('.mobile-dropdown-content');
            if (otherContent) {
              otherContent.classList.remove('active');
            }
          }
        });

        dropdown.classList.toggle('active');
        dropdownContent.classList.toggle('active');
      });
    }
  });
  setActiveLanguageButton();
  
  applyActiveClasses();

  window.testLanguageSwitch = function(lang) {
    switchLanguage(lang);
  };
});