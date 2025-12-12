  // -----------------------------
        // Mobile Menu Toggle Logic
        // -----------------------------
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        let isMenuOpen = false;

        // Toggle menu on button click
        mobileBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenu.classList.remove('hidden');
                menuIcon.setAttribute('data-lucide', 'x');
            } else {
                mobileMenu.classList.add('hidden');
                menuIcon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons(); // Re-render icon
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                mobileMenu.classList.add('hidden');
                menuIcon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });

         // Initialize Lucide Icons
        lucide.createIcons();

        // -----------------------------
        // Navbar Scroll Effect Logic
        // -----------------------------
        const navbar = document.getElementById('navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                // Add background when scrolled
                navbar.classList.add('bg-slate-950/80', 'backdrop-blur-lg', 'border-b', 'border-slate-800', 'py-4');
                navbar.classList.remove('py-6');
            } else {
                // Transparent background at top
                navbar.classList.remove('bg-slate-950/80', 'backdrop-blur-lg', 'border-b', 'border-slate-800', 'py-4');
                navbar.classList.add('py-6');
            }
        });
