document.addEventListener("DOMContentLoaded", function () {
  // Remove the duplicate initialization - keep only the comprehensive one below

  const submitButton = document.getElementById("submit-button");
  const consentCheckbox = document.getElementById("consent");
  const phoneInput = document.getElementById("contact_number");
  const countryCodeInput = document.getElementById("country_code");
  const phoneValidationMessage = document.getElementById(
    "phone-validation-message"
  );
  const recaptchaError = document.getElementById("recaptcha-error");

  const errorMessages = {
    first_name: "First name is required",
    last_name: "Last name is required",
    email: "Please enter a valid email address",
    country_code: "Please select a country code",
    contact_number: "Phone number is required",
    country: "Please select a country",
    enquiry_type: "Please select an enquiry type",
    preferred_contact_method: "Please select a preferred contact method",
    consent: "You must agree to the terms to proceed",
  };

  function showFieldError(field, message) {
    const fieldName = field.name || field.id;
    let errorElement;
    let targetContainer;

    // Special handling for consent checkbox
    if (fieldName === "consent") {
      targetContainer = field.closest(".checkbox");
      errorElement = targetContainer.querySelector(".field-error-message");
    } else {
      targetContainer = field.parentElement;
      errorElement = targetContainer.querySelector(".field-error-message");
    }

    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "field-error-message error-message";
      errorElement.style.color = "#e74c3c";
      errorElement.style.fontSize = "12px";
      errorElement.style.marginTop = "5px";
      errorElement.style.display = "block";
      targetContainer.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = "block";
    field.classList.add("error");
  }

  function clearFieldError(field) {
    const fieldName = field.name || field.id;
    let targetContainer;

    // Special handling for consent checkbox
    if (fieldName === "consent") {
      targetContainer = field.closest(".checkbox");
    } else {
      targetContainer = field.parentElement;
    }

    const errorElement = targetContainer.querySelector(".field-error-message");
    if (errorElement) {
      errorElement.remove();
    }
    field.classList.remove("error");
  }

  function validateField(field) {
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = "";

    clearFieldError(field);

    switch (fieldName) {
      case "first_name":
        if (!field.value.trim()) {
          isValid = false;
          errorMessage = errorMessages.first_name;
        }
        break;

      case "last_name":
        if (!field.value.trim()) {
          isValid = false;
          errorMessage = errorMessages.last_name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!field.value.trim()) {
          isValid = false;
          errorMessage = "Email is required";
        } else if (!emailRegex.test(field.value.trim())) {
          isValid = false;
          errorMessage = errorMessages.email;
        }
        break;

      case "country_code":
        if (!field.value) {
          isValid = false;
          errorMessage = errorMessages.country_code;
        }
        break;

      case "contact_number":
        if (!field.value.trim()) {
          isValid = false;
          errorMessage = errorMessages.contact_number;
        }
        break;

      case "country":
        if (!field.value) {
          isValid = false;
          errorMessage = errorMessages.country;
        }
        break;

      case "enquiry_type":
        if (!field.value) {
          isValid = false;
          errorMessage = errorMessages.enquiry_type;
        }
        break;

      case "consent":
        if (!field.checked) {
          isValid = false;
          errorMessage = errorMessages.consent;
        }
        break;
    }

    if (!isValid) {
      showFieldError(field, errorMessage);
    }

    return isValid;
  }

  function showRadioGroupError(container, message) {
    let errorElement = container.querySelector(".field-error-message");

    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.className = "field-error-message error-message";
      errorElement.style.color = "#e74c3c";
      errorElement.style.fontSize = "12px";
      errorElement.style.marginTop = "5px";
      errorElement.style.display = "block";
      container.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = "block";
    container.classList.add("error");
  }

  function clearRadioGroupError(container) {
    const errorElement = container.querySelector(".field-error-message");
    if (errorElement) {
      errorElement.style.display = "none";
    }
    container.classList.remove("error");
  }

  function validateRadioGroup(name) {
    const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
    const isChecked = Array.from(radioButtons).some((radio) => radio.checked);
    const radioContainer = document.querySelector(
      ".form-group:has(.radio-options)"
    );

    if (!isChecked) {
      showRadioGroupError(radioContainer, errorMessages[name]);
      return false;
    } else {
      clearRadioGroupError(radioContainer);
    }

    return isChecked;
  }

  // FIXED: Single initialization for all custom selects
  document.querySelectorAll(".custom-select-wrapper").forEach((wrapper) => {
    const select = wrapper.querySelector(".custom-select");
    const options = wrapper.querySelector(".custom-options");
    const customOptions = wrapper.querySelectorAll(".custom-option");
    const hiddenInput = wrapper.querySelector('input[type="hidden"]');

    // Toggle dropdown visibility
    select.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close other dropdowns first
      document
        .querySelectorAll(".custom-select-wrapper")
        .forEach((otherWrapper) => {
          if (otherWrapper !== wrapper) {
            const otherOptions = otherWrapper.querySelector(".custom-options");
            const otherSelect = otherWrapper.querySelector(".custom-select");
            otherOptions.classList.remove("active");
            otherSelect.classList.remove("active");
          }
        });

      options.classList.toggle("active");
      select.classList.toggle("active");
    });

    // Handle option selection
    customOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopPropagation();

        // Get all data attributes - more robust approach
        const value =
          option.getAttribute("data-value") || option.textContent.trim();
        const short = option.getAttribute("data-short");
        const countryCode = option.getAttribute("data-country-code");
        const flag = option.getAttribute("data-flag");
        const dataCode = option.getAttribute("data-code");

        console.log("Option clicked:", {
          value,
          short,
          countryCode,
          flag,
          dataCode,
          element: option,
          allAttributes: Array.from(option.attributes).map((attr) => ({
            name: attr.name,
            value: attr.value,
          })),
        });

        // Set hidden input value
        if (hiddenInput) {
          hiddenInput.value = value || dataCode || countryCode;
        }

        // Handle country selection
        if (wrapper.classList.contains("country-select")) {
          // Direct selection by ID
          const selectedFlag = document.getElementById("selected-flag");
          const countryNameDiv = document.getElementById(
            "selected-country-name"
          );

          console.log("Country select - Elements found:");
          console.log("Selected flag element:", selectedFlag);
          console.log("Country name div:", countryNameDiv);
          console.log("Flag URL to set:", flag);
          console.log("Country name to set:", value);

          // Update country name first
          if (countryNameDiv) {
            console.log(
              "Before update - Country name:",
              countryNameDiv.textContent
            );
            countryNameDiv.textContent = value;
            console.log(
              "After update - Country name:",
              countryNameDiv.textContent
            );
          } else {
            console.error("Country name update failed - Element not found");
          }

          // Update flag if we have both elements and flag URL
          if (selectedFlag && flag) {
            console.log("Before update - Flag src:", selectedFlag.src);

            // Create a new image to test if the URL is valid
            const testImg = new Image();
            testImg.onload = function () {
              // URL is valid, update the flag
              selectedFlag.setAttribute("src", flag);
              selectedFlag.setAttribute("alt", `${value} Flag`);
              selectedFlag.src = flag;
              selectedFlag.alt = `${value} Flag`;

              console.log("After update - Flag src:", selectedFlag.src);
              console.log("Flag updated successfully!");
            };
            testImg.onerror = function () {
              console.error("Flag URL is invalid or cannot be loaded:", flag);
            };
            testImg.src = flag;
          } else {
            console.error("Flag update failed!");
            console.error("Flag element found:", !!selectedFlag);
            console.error("Flag URL provided:", !!flag);
            console.error("Flag URL value:", flag);

            // Try to get flag from the clicked option's img element
            const optionImg = option.querySelector("img");
            if (selectedFlag && optionImg) {
              const imgSrc = optionImg.src;
              console.log("Fallback: Using img src from option:", imgSrc);
              selectedFlag.src = imgSrc;
              selectedFlag.alt = `${value} Flag`;
              console.log("Fallback flag update completed with:", imgSrc);
            }
          }
        }
        // Handle phone code selection
        else if (countryCode && short) {
          select.textContent = short;
          console.log("Updated phone code to:", short);
        }
        // Handle other selects
        else {
          select.textContent = option.textContent.trim();
          console.log("Updated select text to:", option.textContent.trim());
        }

        // Update selected state
        customOptions.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");

        // Close dropdown
        options.classList.remove("active");
        select.classList.remove("active");

        // Validate and update form
        if (hiddenInput) {
          clearFieldError(hiddenInput);
          validateField(hiddenInput);
        }

        validateForm();

        // Validate phone if this is country code selection
        if (wrapper.querySelector("#country_code")) {
          validatePhoneNumber();
        }
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        options.classList.remove("active");
        select.classList.remove("active");
      }
    });
  });

  // Country search functionality
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

    if (!code) {
      showFieldError(countryCodeInput, errorMessages.country_code);
      return false;
    }

    if (!number.trim()) {
      showFieldError(phoneInput, errorMessages.contact_number);
      return false;
    }

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
            clearFieldError(phoneInput);
          } else {
            phoneValidationMessage.textContent =
              "Invalid phone number for selected country code";
            phoneValidationMessage.classList.add("invalid");
            phoneInput.classList.add("invalid");
            phoneInput.classList.remove("valid");
            showFieldError(
              phoneInput,
              "Invalid phone number for selected country code"
            );
          }
          validateForm();
        })
        .catch((err) => {
          console.error("Phone validation error:", err);
          showFieldError(phoneInput, "Error validating phone number");
        });
    }
  }

  function validateForm() {
    const firstName = document.querySelector('input[name="first_name"]');
    const lastName = document.querySelector('input[name="last_name"]');
    const email = document.querySelector('input[name="email"]');
    const country = document.getElementById("country");
    const enquiryType = document.getElementById("enquiry_type");
    const contactMethod = document.querySelector(
      'input[name="preferred_contact_method"]:checked'
    );
    const phoneValid = phoneInput.classList.contains("valid");

    const recaptchaResponse =
      grecaptcha && grecaptcha.getResponse && grecaptcha.getResponse();

    let allFieldsValid = true;

    if (!validateField(firstName)) allFieldsValid = false;
    if (!validateField(lastName)) allFieldsValid = false;
    if (!validateField(email)) allFieldsValid = false;
    if (!validateField(country)) allFieldsValid = false;
    if (!validateField(enquiryType)) allFieldsValid = false;
    if (!validateField(countryCodeInput)) allFieldsValid = false;
    if (!validateField(phoneInput)) allFieldsValid = false;
    if (!validateField(consentCheckbox)) allFieldsValid = false;

    if (!validateRadioGroup("preferred_contact_method")) allFieldsValid = false;

    const isValid =
      allFieldsValid &&
      phoneValid &&
      recaptchaResponse &&
      recaptchaResponse.length > 0;

    submitButton.disabled = !isValid;

    if (recaptchaError) {
      if (recaptchaResponse && recaptchaResponse.length > 0) {
        recaptchaError.style.display = "none";
      } else if (firstName.value || lastName.value || email.value) {
        recaptchaError.style.display = "block";
      }
    }
  }
  if (form) {
    form.addEventListener("submit", function (e) {
      let isFormValid = true;

      const requiredFields = [
        'input[name="first_name"]',
        'input[name="last_name"]',
        'input[name="email"]',
        "#country_code",
        "#contact_number",
        "#country",
        "#enquiry_type",
        "#consent",
      ];

      requiredFields.forEach((selector) => {
        const field = document.querySelector(selector);
        if (field && !validateField(field)) {
          isFormValid = false;
        }
      });

      if (!validateRadioGroup("preferred_contact_method")) {
        isFormValid = false;
      }

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

      if (!isFormValid) {
        e.preventDefault();
        alert("Please fill in all required fields correctly.");
        return false;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    });
  }
  document.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", function () {
      validateField(this);
      validateForm();
    });

    input.addEventListener("change", function () {
      validateField(this);
      validateForm();
    });

    input.addEventListener("blur", function () {
      validateField(this);
    });
  });

  document
    .querySelectorAll('input[name="preferred_contact_method"]')
    .forEach((radio) => {
      radio.addEventListener("change", function () {
        validateRadioGroup("preferred_contact_method");
        validateForm();
      });
    });

  if (countryCodeInput && phoneInput) {
    countryCodeInput.addEventListener("change", validatePhoneNumber);
    phoneInput.addEventListener("blur", validatePhoneNumber);
  }

  if (consentCheckbox) {
    consentCheckbox.addEventListener("change", function () {
      validateField(this);
      validateForm();
    });
  }

  validateForm();

  const checkRecaptcha = setInterval(() => {
    if (typeof grecaptcha !== "undefined") {
      clearInterval(checkRecaptcha);
      validateForm();
    }
  }, 100);
});

function enableSubmitButton() {
  const recaptchaError = document.getElementById("recaptcha-error");
  if (recaptchaError) {
    recaptchaError.style.display = "none";
  }
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
