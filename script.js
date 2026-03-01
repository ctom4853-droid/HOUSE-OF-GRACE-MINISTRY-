     
     // Initialize Lucide Icons
        lucide.createIcons();
        
        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        const navText = document.querySelectorAll('.nav-text');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('nav-blur', 'shadow-lg');
                navText.forEach(el => el.classList.remove('text-white'));
                navText.forEach(el => el.classList.add('text-slate-900'));
                navLinks.forEach(el => {
                    el.classList.remove('text-white');
                    el.classList.add('text-slate-700');
                });
            } else {
                navbar.classList.remove('nav-blur', 'shadow-lg');
                navText.forEach(el => el.classList.add('text-white'));
                navText.forEach(el => el.classList.remove('text-slate-900'));
                navLinks.forEach(el => {
                    el.classList.add('text-white');
                    el.classList.remove('text-slate-700');
                });
            }
        });
        
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Copy to clipboard function
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('Account number copied!');
            });
        }
        
        // Show toast notification
        function showToast(message) {
            const toast = document.getElementById('toast');
            document.getElementById('toast-message').textContent = message;
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }
        
        // Handle contact form
        function handleContactSubmit(e) {
            showToast('Message sent successfully!');
            e.target.reset();
        }
        
        // GSAP Animations
       // gsap.registerPlugin(scrolltotrigger);
        
        // Reveal animations
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        revealElements.forEach(el => revealObserver.observe(el));
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: { y: target, offsetY: 80 },
                        ease: "power3.inOut"
                    });
                    mobileMenu.classList.add('hidden');
                }
            });
        });
        
        // Check if church is live (simulated)
        function checkLiveStatus() {
             const now = new Date();
            const day = now.getDay();
            const hour = now.getHours();
            
            // everyday
            const isLive = (day>= 0 && day <= 6) && 
                           (hour >= 20 && hour < 22); // every day 8-10pm daily
            // Update live indicators based on status
            const liveIndicators = document.querySelectorAll('.live-pulse');
            liveIndicators.forEach(el => {
                if (!isLive) {
                    el.style.opacity = '0.5';
                    el.parentElement.querySelector('span:last-child').textContent = 'Offline';
                    el.parentElement.querySelector('span:last-child').classList.remove('text-red-400');
                    el.parentElement.querySelector('span:last-child').classList.add('text-gray-400');
                }
            });
        }
        checkLiveStatus();
        setInterval(checkLiveStatus, 60000); // Check every minute
        console.log("Before checkLiveStatus");
checkLiveStatus();
console.log("After checkLiveStatus");