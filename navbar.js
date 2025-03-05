document.addEventListener("DOMContentLoaded", function () {
    fetch("./navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;

            // Highlight active link based on current page
            const links = document.querySelectorAll('.nav-link');
            links.forEach(link => {
                if (link.href === window.location.href) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        });
});