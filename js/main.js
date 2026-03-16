document.addEventListener('DOMContentLoaded', () => {
    // ---- Smooth Scrolling & Mobile Menu Selection ----
    const links = document.querySelectorAll('nav a, .hero-buttons a, .footer-widget a[href^="#"]');
    const menuToggle = document.querySelector('.menu-toggle');
    const headerMain = document.querySelector('.header-main');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.includes('http')) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (headerMain) headerMain.classList.remove('nav-open');

                // Adjust for sticky header height
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    if (menuToggle && headerMain) {
        menuToggle.addEventListener('click', () => {
            headerMain.classList.toggle('nav-open');
        });
    }

    // ---- Intersection Observer for Reveal Animations ----
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // ---- Language Switching Logic ----
    const langBtns = document.querySelectorAll('.lang-btn');
    const savedLang = localStorage.getItem('site_lang') || 'ru';
    
    function setLanguage(lang) {
        if (!translations[lang]) return;
        
        // Update active button
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update texts
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });

        // Save preference
        localStorage.setItem('site_lang', lang);
        
        // Trigger calc update for translated texts
        updateCalculator();
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });

    // Initialize Language
    if (typeof translations !== 'undefined') {
        setLanguage(savedLang);
    }

    // ---- Calculator Logic ----
    const calcGrade = document.getElementById('calc-grade');
    const calcVolume = document.getElementById('calc-volume');
    const calcTotal = document.getElementById('calc-total');
    const calcOrderBtn = document.getElementById('calc-order-btn');

    function formatNumberStr(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function updateCalculator() {
        if (!calcGrade || !calcVolume || !calcTotal) return;

        const price = parseInt(calcGrade.value);
        const volume = parseFloat(calcVolume.value) || 0;

        const total = price * volume;
        calcTotal.textContent = formatNumberStr(total);

        // Update WhatsApp Link
        const gradeText = calcGrade.options[calcGrade.selectedIndex].text.split('-')[0].trim();
        const message = `Ğ—Ğ´Ñ€Ğ°Ğ²Ñ Ñ‚Ğ²ÑƒĞ¹Ñ‚Ğµ! ĞœĞ¾Ğ¶ĞµÑ‚Ğµ Ñ€Ğ°Ñ Ñ Ñ‡Ğ¸Ñ‚Ğ°Ñ‚ÑŒ Ğ·Ğ°ĞºĞ°Ğ·?%0AĞœĞ°Ñ€ĞºĞ°: ${gradeText}%0AĞžĞ±ÑŠĞµĞ¼: ${volume} Ğ¼Â³%0AĞŸÑ€Ğ¸Ğ¼ĞµÑ€Ğ½Ğ°Ñ  Ñ†ĞµĞ½Ğ° (Ğ±ĞµĞ· Ğ´Ğ¾Ñ Ñ‚Ğ°Ğ²ĞºĞ¸): ${formatNumberStr(total)} â‚¸`;

        calcOrderBtn.setAttribute('href', `https://wa.me/77027520605?text=${message}`);
    }

    if (calcGrade && calcVolume) {
        calcGrade.addEventListener('change', updateCalculator);
        calcVolume.addEventListener('input', updateCalculator);
        updateCalculator();
    }
});
