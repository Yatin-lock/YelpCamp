const navBtns = document.querySelectorAll('.nav-link');

for (let navButton of navBtns) {
    navButton.addEventListener('click', () => {
        const active = document.querySelector('.active');
        active.classList.toggle('active');
        navButton.classList.toggle('active');
    })
}