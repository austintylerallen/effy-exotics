document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('age-popup');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
  
    // Set a cookie
    function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
    }
  
    // Get a cookie
    function getCookie(name) {
      const nameEQ = `${name}=`;
      const cookies = document.cookie.split(';');
      for (let c of cookies) {
        c = c.trim();
        if (c.startsWith(nameEQ)) return c.substring(nameEQ.length);
      }
      return null;
    }
  
    // Show popup if not already verified
    if (getCookie('ageVerified') !== 'true') {
      popup.style.display = 'flex';
    }
  
    yesButton.addEventListener('click', () => {
      setCookie('ageVerified', 'true', 30);
      popup.style.display = 'none';
    });
  
    noButton.addEventListener('click', () => {
      alert('You must be at least 21 years old to enter this site.');
      window.location.href = 'https://www.google.com';
    });
  });
  
  // Simple toggle for mobile menu
  function openMenu() {
    document.querySelector('menu').classList.toggle('active');
  }
  