// Add this to your JavaScript file or in a script tag at the bottom of your HTML
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all custom selects
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
  });