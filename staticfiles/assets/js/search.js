document.addEventListener("DOMContentLoaded", function () {
    const cancelButton = document.querySelector(".cancel-button");
    const searchInput = document.querySelector(".search-input");

    cancelButton.addEventListener("click", function () {
        searchInput.value = "";
    });
});