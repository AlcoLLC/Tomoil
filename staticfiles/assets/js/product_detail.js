let currentIndex = 0;
let autoplayInterval;
const opinions = document.querySelectorAll('.opinion');
const opinionsContainer = document.querySelector('.product-opinions .opinions');
const totalOpinions = opinions.length;

function startAutoplay() {
  autoplayInterval = setInterval(() => {
    nextOpinion();
  }, 4000);
}

function nextOpinion() {
  opinions[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + 1) % totalOpinions;
  opinions[currentIndex].classList.add('active');
}

opinions.forEach((opinion, index) => {
  opinion.addEventListener('click', () => {
    clearInterval(autoplayInterval);

    if (index === currentIndex) {
      nextOpinion();
    } else {
      opinions[currentIndex].classList.remove('active');
      currentIndex = index;
      opinions[currentIndex].classList.add('active');
    }

    startAutoplay();
  });
});
   

let startX = 0;
let endX = 0;

opinionsContainer.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

opinionsContainer.addEventListener('touchend', (e) => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = startX - endX;

  if (Math.abs(diff) > swipeThreshold) {
    clearInterval(autoplayInterval);
    if (diff > 0) {
      nextOpinion();
    } else {
      opinions[currentIndex].classList.remove('active');
      currentIndex = (currentIndex - 1 + totalOpinions) % totalOpinions;
      opinions[currentIndex].classList.add('active');
    }
    startAutoplay();
  }
}

startAutoplay();

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(autoplayInterval);
  } else {
    startAutoplay();
  }
});

const openModalBtn = document.getElementById('openReviewModal'); 
const modalOverlay = document.getElementById('reviewModalOverlay');
const closeModalBtn = document.getElementById('closeModal');
const reviewForm = document.getElementById('review-form');
const stars = document.querySelectorAll('.star-selector .star');

let selectedRating = 0;


function openModal() {
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}


function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}


if (openModalBtn) {
  openModalBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openModal();
  });
}


closeModalBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

stars.forEach((star, index) => {
  star.addEventListener('click', function () {
    selectedRating = parseInt(this.dataset.rating);
    updateStars();
  });

  star.addEventListener('mouseenter', function () {
    const rating = parseInt(this.dataset.rating);
    highlightStars(rating);
  });
});

document
  .querySelector('.star-selector')
  .addEventListener('mouseleave', function () {
    updateStars();
  });

function updateStars() {
  stars.forEach((star, index) => {
    if (index < selectedRating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

function highlightStars(rating) {
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}
