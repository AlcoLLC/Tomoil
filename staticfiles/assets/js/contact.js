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
        
        // Clear error message when field is filled
        clearFieldError(hiddenSelect);
        validateForm();
      });
    });
  }

  const submitButton = document.getElementById("submit-button");
  const consentCheckbox = document.getElementById("consent");
  const phoneInput = document.getElementById("contact_number");
  const countryCodeInput = document.getElementById("country_code");
  const phoneValidationMessage = document.getElementById("phone-validation-message");
  const recaptchaError = document.getElementById("recaptcha-error");

  // Field validation error messages
  const errorMessages = {
    first_name: "First name is required",
    last_name: "Last name is required", 
    email: "Please enter a valid email address",
    country_code: "Please select a country code",
    contact_number: "Phone number is required",
    country: "Please select a country",
    enquiry_type: "Please select an enquiry type",
    preferred_contact_method: "Please select a preferred contact method",
    consent: "You must agree to the terms to proceed"
  };

  // Function to show field error
  function showFieldError(field, message) {
    const fieldName = field.name || field.id;
    let errorElement = field.parentElement.querySelector('.field-error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error-message error-message';
      errorElement.style.color = '#e74c3c';
      errorElement.style.fontSize = '12px';
      errorElement.style.marginTop = '5px';
      errorElement.style.display = 'block';
      field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    field.classList.add('error');
  }

  // Function to clear field error
  function clearFieldError(field) {
    const errorElement = field.parentElement.querySelector('.field-error-message');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
    field.classList.remove('error');
  }

  // Function to validate individual field
  function validateField(field) {
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';

    // Clear existing error first
    clearFieldError(field);

    switch (fieldName) {
      case 'first_name':
        if (!field.value.trim()) {
          isValid = false;
          errorMessage = errorMessages.first_name;
        }
        break;
        
      case 'last_name':
        if (!field.value.trim()) {
          isValid = false;
          errorMessage = errorMessages.last_name;
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!field.value.trim()) {
          isValid = false;
          errorMessage = "Email is required";
        } else if (!emailRegex.test(field.value.trim())) {
          isValid = false;
          errorMessage = errorMessages.email;
        }
        break;
        
      case 'country_code':
        if (!field.value) {
          isValid = false;
          errorMessage = errorMessages.country_code;
        }
        break;
        
      case 'contact_number':
        if (!field.value.trim()) {
          isValid = false;
          errorMessage = errorMessages.contact_number;
        }
        break;
        
      case 'country':
        if (!field.value) {
          isValid = false;
          errorMessage = errorMessages.country;
        }
        break;
        
      case 'enquiry_type':
        if (!field.value) {
          isValid = false;
          errorMessage = errorMessages.enquiry_type;
        }
        break;
        
      case 'consent':
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

  // Function to validate radio buttons
  function validateRadioGroup(name) {
    const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
    const isChecked = Array.from(radioButtons).some(radio => radio.checked);
    
    if (!isChecked) {
      const firstRadio = radioButtons[0];
      if (firstRadio) {
        showFieldError(firstRadio, errorMessages[name]);
        return false;
      }
    } else {
      // Clear error if one is selected
      const firstRadio = radioButtons[0];
      if (firstRadio) {
        clearFieldError(firstRadio);
      }
    }
    
    return isChecked;
  }

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

        // Clear error and validate
        if (hiddenInput) {
          clearFieldError(hiddenInput);
          validateField(hiddenInput);
        }
        
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
            phoneValidationMessage.textContent = "Invalid phone number for selected country code";
            phoneValidationMessage.classList.add("invalid");
            phoneInput.classList.add("invalid");
            phoneInput.classList.remove("valid");
            showFieldError(phoneInput, "Invalid phone number for selected country code");
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
    const contactMethod = document.querySelector('input[name="preferred_contact_method"]:checked');
    const phoneValid = phoneInput.classList.contains("valid");

    // Check if reCAPTCHA is completed
    const recaptchaResponse = grecaptcha && grecaptcha.getResponse && grecaptcha.getResponse();

    // Validate all required fields
    let allFieldsValid = true;
    
    if (!validateField(firstName)) allFieldsValid = false;
    if (!validateField(lastName)) allFieldsValid = false;
    if (!validateField(email)) allFieldsValid = false;
    if (!validateField(country)) allFieldsValid = false;
    if (!validateField(enquiryType)) allFieldsValid = false;
    if (!validateField(countryCodeInput)) allFieldsValid = false;
    if (!validateField(phoneInput)) allFieldsValid = false;
    if (!validateField(consentCheckbox)) allFieldsValid = false;
    
    // Validate radio group
    if (!validateRadioGroup('preferred_contact_method')) allFieldsValid = false;

    const isValid = allFieldsValid && 
                   phoneValid && 
                   recaptchaResponse && 
                   recaptchaResponse.length > 0;

    submitButton.disabled = !isValid;

    // Show/hide reCAPTCHA error message
    if (recaptchaError) {
      if (recaptchaResponse && recaptchaResponse.length > 0) {
        recaptchaError.style.display = "none";
      } else if (firstName.value || lastName.value || email.value) {
        recaptchaError.style.display = "block";
      }
    }
  }

  // Handle form submission with additional validation
  form.addEventListener("submit", function (e) {
    // Validate all fields before submission
    let isFormValid = true;
    
    // Validate all input fields
    const requiredFields = [
      'input[name="first_name"]',
      'input[name="last_name"]', 
      'input[name="email"]',
      '#country_code',
      '#contact_number',
      '#country',
      '#enquiry_type',
      '#consent'
    ];

    requiredFields.forEach(selector => {
      const field = document.querySelector(selector);
      if (field && !validateField(field)) {
        isFormValid = false;
      }
    });

    // Validate radio group
    if (!validateRadioGroup('preferred_contact_method')) {
      isFormValid = false;
    }

    // Validate reCAPTCHA
    const recaptchaResponse = grecaptcha && grecaptcha.getResponse && grecaptcha.getResponse();
    if (!recaptchaResponse || recaptchaResponse.length === 0) {
      e.preventDefault();
      if (recaptchaError) {
        recaptchaError.style.display = "block";
      }
      alert("Please complete the reCAPTCHA verification before submitting.");
      return false;
    }

    // If form is not valid, prevent submission
    if (!isFormValid) {
      e.preventDefault();
      alert("Please fill in all required fields correctly.");
      return false;
    }

    // Optional: Show loading state
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
  });

  // Add event listeners for real-time validation
  document.querySelectorAll("input, select, textarea").forEach((input) => {
    input.addEventListener("input", function() {
      validateField(this);
      validateForm();
    });
    
    input.addEventListener("change", function() {
      validateField(this);
      validateForm();
    });
    
    input.addEventListener("blur", function() {
      validateField(this);
    });
  });

  // Special handling for radio buttons
  document.querySelectorAll('input[name="preferred_contact_method"]').forEach(radio => {
    radio.addEventListener("change", function() {
      validateRadioGroup('preferred_contact_method');
      validateForm();
    });
  });

  if (countryCodeInput && phoneInput) {
    countryCodeInput.addEventListener("change", validatePhoneNumber);
    phoneInput.addEventListener("blur", validatePhoneNumber);
  }

  if (consentCheckbox) {
    consentCheckbox.addEventListener("change", function() {
      validateField(this);
      validateForm();
    });
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