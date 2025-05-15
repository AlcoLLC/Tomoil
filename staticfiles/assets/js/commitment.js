document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".commitment-item");
  const contents = document.querySelectorAll(".commitment-detail");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");
      contents[index].classList.add("active");
    });
  });
});
