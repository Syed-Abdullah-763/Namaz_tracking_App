document.getElementById('menuToggle').addEventListener('click', function() {
    const menu = document.getElementById('menu');
    const menuToggle = document.getElementById('menuToggle');
    
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        menuToggle.textContent = '☰'; // Hamburger icon
    } else {
        menu.classList.add('open');
        menuToggle.textContent = '✖'; // Close icon
    }
});