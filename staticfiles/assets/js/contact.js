// Add this to your existing JavaScript file or in a script tag at the bottom of your HTML
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all custom selects (keep your existing code)
    const customSelects = document.querySelectorAll('.custom-select-wrapper');
    customSelects.forEach(function(wrapper) {
      initializeCustomSelect(wrapper);
    });

    function initializeCustomSelect(wrapper) {
      const customSelect = wrapper.querySelector('.custom-select');
      const customOptions = wrapper.querySelector('.custom-options');
      const options = wrapper.querySelectorAll('.custom-option');
      const hiddenSelect = wrapper.querySelector('select');

      // Toggle dropdown on click
      customSelect.addEventListener('click', function() {
        this.classList.toggle('open');
      });

      // Close all other dropdowns when clicking outside
      document.addEventListener('click', function(e) {
        if (!wrapper.contains(e.target)) {
          customSelect.classList.remove('open');
        }
      });

      // Handle option selection
      options.forEach(function(option) {
        option.addEventListener('click', function() {
          // Update selected value text
          const selectedText = this.innerText;
          customSelect.innerText = selectedText;

          // Update hidden select value
          const value = this.getAttribute('data-value');
          if (hiddenSelect) {
            for (let i = 0; i < hiddenSelect.options.length; i++) {
              if (hiddenSelect.options[i].value === value) {
                hiddenSelect.selectedIndex = i;
                break;
              }
            }
            // Trigger change event
            const event = new Event('change');
            hiddenSelect.dispatchEvent(event);
          }

          // Update selected state
          options.forEach(opt => opt.classList.remove('selected'));
          this.classList.add('selected');

          // Close dropdown
          customSelect.classList.remove('open');
        });
      });
    }

    // Country code input enhancement
    const countryCodeInput = document.querySelector('input[name="country_code"]');
    if (countryCodeInput) {
      // Set placeholder to AZ (+994)
      countryCodeInput.placeholder = 'AZ (+994)';

      // When input is focused, convert from formatted to editable format
      countryCodeInput.addEventListener('focus', function() {
        // Check if the value is in formatted format with country code prefix and "(+XXX)"
        const codeRegex = /^[A-Z]{2}\s\(\+\d+\)$/; // Matches pattern like "AZ (+994)"

        if (codeRegex.test(this.value)) {
          // Extract just the digits with plus sign
          const numericPart = this.value.match(/\+\d+/)[0];
          this.value = numericPart;
        } else if (this.value.startsWith('(+') && this.value.endsWith(')')) {
          // Convert from "(+XXX)" to "+XXX" for editing
          const codeWithoutParens = this.value.replace(/[() ]/g, '');
          this.value = codeWithoutParens;
        } else if (!this.value) {
          // If empty, set to "+" to start typing
          this.value = '+';
        }

        // Position the cursor at the end
        setTimeout(() => {
          this.selectionStart = this.selectionEnd = this.value.length;
        }, 0);
      });

      // Format the input when user types
      countryCodeInput.addEventListener('input', function() {
        // Ensure the input always starts with "+"
        if (!this.value.startsWith('+')) {
          this.value = '+' + this.value;
        }

        // Remove any non-digit characters except for the leading "+"
        const digitsOnly = this.value.replace(/[^\d+]/g, '');
        this.value = digitsOnly;

        // Position the cursor at the end
        setTimeout(() => {
          this.selectionStart = this.selectionEnd = this.value.length;
        }, 0);
      });

      // Format the input when user leaves the field
      countryCodeInput.addEventListener('blur', function() {
        if (this.value === '+') {
          // If only "+" is entered, restore the placeholder
          this.value = '';
        } else {
          // Format the number as "(+XXX)" - without country code prefix for now
          // API integration can be added here later to get country code prefix
          const code = this.value.replace(/[^0-9+]/g, '');
          if (code) {
     
            this.value = '(+' + code.replace('+', '') + ')';

          }
        }
      });
    }
  });