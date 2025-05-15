document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const brandItems = document.querySelectorAll(".brand-item");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
      });
      const tabId = this.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  brandItems.forEach((item) => {
    item.addEventListener("click", function () {
      brandItems.forEach((el) => {
        el.classList.remove("active");
      });
      this.classList.add("active");

      const selectedBrand = this.getAttribute("data-brand");
      const selectedContentId = selectedBrand + "-content";

      const allContents = document.querySelectorAll(".brand-detail");
      allContents.forEach((content) => {
        content.classList.remove("active");
      });

      const selectedContent = document.getElementById(selectedContentId);
      if (selectedContent) {
        selectedContent.classList.add("active");
      }
    });
  });

  const modal = document.getElementById("videoModal");
  const videoFrame = document.getElementById("videoFrame");
  const closeBtn = document.querySelector(".close-modal");
  const videoThumbnails = document.querySelectorAll(".video-thumbnail");

  videoThumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      const videoUrl = this.getAttribute("data-video-url");
      const embedUrl = convertToEmbedUrl(videoUrl);

      videoFrame.src = embedUrl + "?autoplay=1";
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  closeBtn.addEventListener("click", closeModal);

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  function closeModal() {
    modal.style.display = "none";
    videoFrame.src = "";
    document.body.style.overflow = "auto";
  }

  function convertToEmbedUrl(url) {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&]+)/;
    const match = url.match(regex);
    const videoId = match ? match[1] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  }
});
