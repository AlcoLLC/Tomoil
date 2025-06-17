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
  const recaptchaError = document.getElementById("recaptcha-error");

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
      const formData = new FormData();
      formData.append("country_code", code);
      formData.append("phone_number", number);
      formData.append(
        "csrfmiddlewaretoken",
        document.querySelector("[name=csrfmiddlewaretoken]").value
      );

      fetch("/validate-phone/", {
        method: "POST",
        body: formData,
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

    // Check if reCAPTCHA is completed
    const recaptchaResponse =
      grecaptcha && grecaptcha.getResponse && grecaptcha.getResponse();

    const isValid =
      firstName &&
      lastName &&
      email &&
      country &&
      enquiryType &&
      contactMethod &&
      phoneValid &&
      consentCheckbox.checked &&
      recaptchaResponse &&
      recaptchaResponse.length > 0;

    submitButton.disabled = !isValid;

    // Show/hide reCAPTCHA error message
    if (recaptchaError) {
      if (recaptchaResponse && recaptchaResponse.length > 0) {
        recaptchaError.style.display = "none";
      } else if (firstName || lastName || email) {
        // Only show error if user has started filling the form
        recaptchaError.style.display = "block";
      }
    }
  }

  // Handle form submission with additional validation
  form.addEventListener("submit", function (e) {
    const recaptchaResponse =
      grecaptcha && grecaptcha.getResponse && grecaptcha.getResponse();

    if (!recaptchaResponse || recaptchaResponse.length === 0) {
      e.preventDefault();
      if (recaptchaError) {
        recaptchaError.style.display = "block";
      }
      alert("Please complete the reCAPTCHA verification before submitting.");
      return false;
    }

    // Optional: Show loading state
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
  });

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

  // Initialize form validation
  validateForm();

  // Check for reCAPTCHA periodically if it's loaded
  const checkRecaptcha = setInterval(() => {
    if (typeof grecaptcha !== "undefined") {
      clearInterval(checkRecaptcha);
      validateForm();
    }
  }, 100);
});

// Global reCAPTCHA callback functions (called from HTML)
function enableSubmitButton() {
  const recaptchaError = document.getElementById("recaptcha-error");
  if (recaptchaError) {
    recaptchaError.style.display = "none";
  }
  // Trigger form validation
  const event = new Event("change");
  document.querySelector(".contact-form").dispatchEvent(event);
}

function disableSubmitButton() {
  const submitButton = document.getElementById("submit-button");
  const recaptchaError = document.getElementById("recaptcha-error");

  if (submitButton) {
    submitButton.disabled = true;
  }
  if (recaptchaError) {
    recaptchaError.style.display = "block";
  }
}
