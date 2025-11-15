async function initializeLanguageSelector() {
    let currentLang = localStorage.getItem('selectedLanguage') || 'en';
    const languages = ['en', 'ge', 'ru'];
    
    // Load translations
    const translations = {};
    for (const lang of languages) {
        try {
            const response = await fetch(`../translations/${lang}.json`);
            translations[lang] = await response.json();
        } catch (err) {
            console.error(`Failed to load ${lang} translations:`, err);
        }
    }

    function updateLanguageDisplay(lang) {
        document.querySelectorAll('.current-lang').forEach(el => {
            el.textContent = lang.toUpperCase();
        });
    }

    function translatePage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        localStorage.setItem('selectedLanguage', lang);
        updateLanguageDisplay(lang);
    }

    // Set up language option click handlers
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            translatePage(lang);
            document.querySelectorAll('.language-dropdown').forEach(el => {
                el.classList.remove('active');
            });
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Set up language button click handlers
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            document.querySelectorAll('.language-dropdown').forEach(el => {
                if (el !== dropdown) {
                    el.classList.remove('active');
                }
            });
            dropdown.classList.toggle('active');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-selector')) {
            document.querySelectorAll('.language-dropdown').forEach(el => {
                el.classList.remove('active');
            });
        }
    });

    // Initial translation
    translatePage(currentLang);
}

// Add this to handle paths correctly based on page location
function getTranslationPath() {
    const path = window.location.pathname;
    return path.includes('/') ? '../translations/' : './translations/';
}
