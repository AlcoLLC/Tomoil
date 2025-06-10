let currentLanguage = 'EN';
const allLanguages = ['EN', 'DE', 'ES', 'FR', 'IT', 'RM', '汉语'];

function changeLanguage(lang) {
  currentLanguage = lang;
  const langButton = document.querySelector('.language-dropdown button');
  langButton.innerHTML = `${lang} <i class="fa-solid fa-angle-down"></i>`;

  updateMobileLanguageButtons(lang);
  updateDropdownContent();
}

function updateMobileLanguageButtons(selectedLang) {
  const langButtons = document.querySelectorAll('.mobile-languages .lang-btn');
  langButtons.forEach((button) => {
    button.classList.remove('active');
    if (button.getAttribute('data-lang') === selectedLang) {
      button.classList.add('active');
    }
  });
}

function updateDropdownContent() {
  const dropdown = document.getElementById('languageDropdown');
  dropdown.innerHTML = '';

  allLanguages.forEach((lang) => {
    if (lang !== currentLanguage) {
      const button = document.createElement('button');
      button.textContent = lang;
      button.onclick = () => changeLanguage(lang);
      dropdown.appendChild(button);
    }
  });
}

// URL-ə əsasən aktiv klassları tətbiq edən funksiya
function applyActiveClasses() {
  let currentPath = window.location.pathname;
  // Sondakı '/' işarəsini silir (əgər kök URL '/' deyilsə)
  if (currentPath.length > 1 && currentPath.endsWith('/')) {
    currentPath = currentPath.slice(0, -1);
  }

  // Masaüstü Naviqasiya üçün
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
      link.classList.remove('active'); // Digər linklərdən aktiv klassı silir
      const parentLi = link.closest('li');
      if (parentLi && parentLi.classList.contains('dropdown')) {
        // Dropdown parent-i silməzdən əvvəl, daxilində aktiv element olmadığını yoxlayın
        const activeDropdownItem = parentLi.querySelector(
          '.dropdown-content a.active'
        );
        if (!activeDropdownItem) {
          parentLi.classList.remove('active');
        }
      }
    }
  });

  // Mobil Naviqasiya üçün
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
        parentDropdownContent.classList.add('active'); // Mobil dropdown məzmununu açır
        const parentDropdown =
          parentDropdownContent.closest('.mobile-dropdown');
        if (parentDropdown) {
          parentDropdown.classList.add('active'); // Mobil dropdownun özünü aktiv edir
        }
      }
    } else {
      link.classList.remove('active'); // Digər mobil linklərdən aktiv klassı silir
      // Mobil dropdown içində aktiv olmayan linklər üçün parent aktivliyini yoxlayın
      const parentDropdownContent = link.closest('.mobile-dropdown-content');
      if (parentDropdownContent) {
        const activeChildren =
          parentDropdownContent.querySelectorAll('a.active');
        if (activeChildren.length === 0) {
          // Əgər daxilində aktiv element yoxdursa
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

document.addEventListener('DOMContentLoaded', function () {
  updateDropdownContent();
  applyActiveClasses(); // Səhifə yüklənəndə aktiv klassları tətbiq et

  // Mobile hamburger menu functionality
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = hamburger.querySelector('i');
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  document.body.appendChild(overlay);

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    overlay.classList.add('active');
    hamburgerIcon.className = 'fa-solid fa-xmark';
    document.body.style.overflow = 'hidden';
    applyActiveClasses(); // Mobil menyu açıldıqda yenidən aktiv klassları tətbiq et
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
    hamburgerIcon.className = 'fas fa-bars';
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

  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');

  mobileDropdowns.forEach((dropdown) => {
    const dropdownHead = dropdown.querySelector('.mobile-dropdown-head');
    const dropdownContent = dropdown.querySelector('.mobile-dropdown-content');

    dropdownHead.addEventListener('click', function (e) {
      e.preventDefault();

      mobileDropdowns.forEach((otherDropdown) => {
        if (otherDropdown !== dropdown) {
          otherDropdown.classList.remove('active');
          otherDropdown
            .querySelector('.mobile-dropdown-content')
            .classList.remove('active');
        }
      });

      dropdown.classList.toggle('active');
      dropdownContent.classList.toggle('active');
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  const langButtons = document.querySelectorAll('.mobile-languages .lang-btn');
  langButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const selectedLang = this.getAttribute('data-lang');
      langButtons.forEach((btn) => btn.classList.remove('active'));
      this.classList.add('active');
      changeLanguage(selectedLang);
    });
  });
});
