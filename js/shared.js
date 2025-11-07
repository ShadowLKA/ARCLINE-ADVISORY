// Language selector functionality
async function initializeLanguageSelector() {
    // Support either 'selectedLanguage' (new) or 'site_lang' (older pages)
    let currentLang = localStorage.getItem('selectedLanguage') || localStorage.getItem('site_lang') || 'en';
    const languages = ['en', 'ge', 'ru'];

    // Load translations using relative path based on current page location
    const translations = {};
    const baseUrl = window.location.pathname.includes('/Program') || 
                   window.location.pathname.includes('/Strategic') || 
                   window.location.pathname.includes('/Execution') ? '../' : '';

    // Diagnostic: show computed baseUrl so it's easy to debug fetch path issues
    console.debug('[i18n] computed baseUrl =', baseUrl, 'current pathname=', window.location.pathname);

    for (const lang of languages) {
        try {
            console.debug(`[i18n] Loading translations for ${lang} from ${baseUrl}translations/${lang}.json`);
            const response = await fetch(`${baseUrl}translations/${lang}.json`);
            if (!response.ok) {
                console.warn(`[i18n] fetch ${baseUrl}translations/${lang}.json returned status ${response.status}`);
                translations[lang] = {};
                if (lang !== 'en') {
                    // Try to load English as fallback
                    const enResponse = await fetch(`${baseUrl}translations/en.json`);
                    if (enResponse.ok) {
                        translations[lang] = await enResponse.json();
                        console.debug(`[i18n] Loaded English translations as fallback for ${lang}`);
                    }
                }
            } else {
                translations[lang] = await response.json();
                console.debug(`[i18n] Successfully loaded ${Object.keys(translations[lang]).length} translations for ${lang}`);
            }
        } catch (err) {
            console.error(`[i18n] Failed to load ${lang} translations from ${baseUrl}translations/${lang}.json:`, err);
            translations[lang] = {};
            if (lang !== 'en') {
                try {
                    // Try to load English as fallback
                    const enResponse = await fetch(`${baseUrl}translations/en.json`);
                    if (enResponse.ok) {
                        translations[lang] = await enResponse.json();
                        console.debug(`[i18n] Loaded English translations as fallback for ${lang}`);
                    }
                } catch (fallbackErr) {
                    console.error(`[i18n] Failed to load English fallback translations:`, fallbackErr);
                }
            }
        }
    }

    function updateLanguageDisplay(lang) {
        document.querySelectorAll('.current-lang').forEach(el => {
            el.textContent = lang.toUpperCase();
        });
    }

    function translatePage(lang) {
        console.debug(`[i18n] Translating page to ${lang}`);
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            } else {
                console.warn(`[i18n] Missing translation for key "${key}" in language "${lang}"`);
                // Fall back to English if key exists there
                if (translations['en'] && translations['en'][key]) {
                    element.textContent = translations['en'][key];
                }
            }
        });
        // Persist language for both legacy and new keys
        localStorage.setItem('selectedLanguage', lang);
        localStorage.setItem('site_lang', lang);
        updateLanguageDisplay(lang);
        
        // Update active states on all language options
        document.querySelectorAll('.language-option').forEach(option => {
            if (option.getAttribute('data-lang') === lang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
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

    // Set initial active states and translate
    document.querySelectorAll('.language-option').forEach(option => {
        if (option.getAttribute('data-lang') === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    translatePage(currentLang);
}

// Shared mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu on link click
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// Shared navigation function
function navigateToSection(section) {
    window.location.href = '../#' + section;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageSelector();
    initializeMobileMenu();
});