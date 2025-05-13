document.addEventListener("DOMContentLoaded", function () {
  const customSelects = document.querySelectorAll(".custom-select-wrapper");

  customSelects.forEach(function (wrapper) {
    initializeCustomSelect(wrapper);
  });

  function initializeCustomSelect(wrapper) {
    const customSelect = wrapper.querySelector(".custom-select");
    const customOptions = wrapper.querySelector(".custom-options");
    const options = wrapper.querySelectorAll(".custom-option");
    const hiddenSelect = wrapper.querySelector("input[type='hidden']");

    customSelect.addEventListener("click", function () {
      this.classList.toggle("open");
    });

    document.addEventListener("click", function (e) {
      if (!wrapper.contains(e.target)) {
        customSelect.classList.remove("open");
      }
    });
    options.forEach(function (option) {
      option.addEventListener("click", function () {
        const code = this.getAttribute("data-country-code");
        const short = this.getAttribute("data-short");
        const countryName = this.innerText;

        customSelect.innerText = short;

        hiddenSelect.value = code;

        options.forEach((opt) => opt.classList.remove("selected"));
        this.classList.add("selected");

        customSelect.classList.remove("open");
      });
    });
  }

  const submitButton = document.getElementById("submit-button");
  const consentCheckbox = document.getElementById("consent");
  const phoneInput = document.getElementById("contact_number");
  const countryCodeInput = document.getElementById("country_code");
  const phoneValidationMessage = document.getElementById(
    "phone-validation-message"
  );

  document.querySelectorAll(".custom-select-wrapper").forEach((wrapper) => {
    const select = wrapper.querySelector(".custom-select");
    const options = wrapper.querySelector(".custom-options");
    const customOptions = wrapper.querySelectorAll(".custom-option");
    const hiddenInput = wrapper.querySelector('input[type="hidden"]');

    select.addEventListener("click", () => {
      options.classList.toggle("active");
      select.classList.toggle("active");
    });

    customOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.getAttribute("data-value");
        const short = option.getAttribute("data-short");
        const countryCode = option.getAttribute("data-country-code");
        const flag = option.getAttribute("data-flag");

        if (hiddenInput) hiddenInput.value = value;

        // Different behavior based on input name
        if (select && option.closest(".country-select")) {
          select.innerHTML = `<img class="selected-flag" src="${flag}" alt="${value} Flag" /> ${value}`;
        } else if (select && countryCode && short) {
          select.textContent = countryCode;
        } else if (select) {
          select.textContent = option.textContent.trim();
        }

        customOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");

        options.classList.remove("active");
        select.classList.remove("active");

        validateForm();
        if (wrapper.querySelector("#country_code")) validatePhoneNumber();
      });
    });

    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        options.classList.remove("active");
        select.classList.remove("active");
      }
    });
  });

  const countrySearchInput = document.getElementById("country-search");
  if (countrySearchInput) {
    countrySearchInput.addEventListener("input", function () {
      const searchValue = this.value.toLowerCase();
      document
        .querySelectorAll(".country-options .custom-option")
        .forEach((option) => {
          const optionText = option.textContent.toLowerCase();
          option.style.display = optionText.includes(searchValue)
            ? "block"
            : "none";
        });
    });

    countrySearchInput.addEventListener("click", (e) => e.stopPropagation());
  }

  const form = document.querySelector(".contact-form");

  function validatePhoneNumber() {
    const code = countryCodeInput.value;
    const number = phoneInput.value;

    phoneValidationMessage.textContent = "";
    phoneValidationMessage.className = "validation-message";
    phoneInput.classList.remove("valid", "invalid");

    if (code && number) {
      const form = new FormData();
      form.append("country_code", code);
      form.append("phone_number", number);
      form.append(
        "csrfmiddlewaretoken",
        document.querySelector("[name=csrfmiddlewaretoken]").value
      );

      fetch("/validate-phone/", {
        method: "POST",
        body: form,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.valid) {
            phoneValidationMessage.classList.add("valid");
            phoneInput.classList.add("valid");
            phoneInput.classList.remove("invalid");
          } else {
            phoneValidationMessage.textContent =
              "Invalid phone number for selected country code";
            phoneValidationMessage.classList.add("invalid");
            phoneInput.classList.add("invalid");
            phoneInput.classList.remove("valid");
          }
          validateForm();
        })
        .catch((err) => {
          console.error("Phone validation error:", err);
        });
    }
  }

  function validateForm() {
    const firstName = document
      .querySelector('input[name="first_name"]')
      .value.trim();
    const lastName = document
      .querySelector('input[name="last_name"]')
      .value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const country = document.getElementById("country").value;
    const enquiryType = document.getElementById("enquiry_type").value;
    const contactMethod = document.querySelector(
      'input[name="preferred_contact_method"]:checked'
    );
    const phoneValid = phoneInput.classList.contains("valid");

    const isValid =
      firstName &&
      lastName &&
      email &&
      country &&
      enquiryType &&
      contactMethod &&
      phoneValid &&
      consentCheckbox.checked;

    submitButton.disabled = !isValid;
  }

  document.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", validateForm);
    input.addEventListener("change", validateForm);
  });

  if (countryCodeInput && phoneInput) {
    countryCodeInput.addEventListener("change", validatePhoneNumber);
    phoneInput.addEventListener("blur", validatePhoneNumber);
  }

  if (consentCheckbox) {
    consentCheckbox.addEventListener("change", validateForm);
  }

  validateForm();
});
