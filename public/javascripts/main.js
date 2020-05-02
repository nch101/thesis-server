var navbar = document.getElementById('navbar-container');
var navbarItems = navbar.getElementsByClassName('navbar-item');

for (var navbarItem of navbarItems) {
    navbarItem.addEventListener('click', function() {
        var current = document.getElementsByClassName('active');
        current[0].className = current[0].className.replace(' active', '');
        this.className += ' active';
    });
}