document.addEventListener('DOMContentLoaded', function() {
    const serviceItems = document.querySelectorAll('.service-item');
    const serviceDetails = document.querySelectorAll('.service-detail');

    serviceItems.forEach(item => {
      item.addEventListener('click', function() {
        serviceItems.forEach(si => si.classList.remove('active'));
        serviceDetails.forEach(sd => sd.classList.remove('active'));

        this.classList.add('active');

        const serviceId = this.getAttribute('data-service');
        document.getElementById(`${serviceId}-content`).classList.add('active');
      });
    });
  });