'use strict';

(() => {
    const header = document.getElementById('mainNav');
    const navigation = document.querySelector('.navigation');
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('navbarResponsive');
    const links = [...document.querySelectorAll('.site-nav-link')];
    const mobile = window.matchMedia('(max-width: 700px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function closeMenu(returnFocus = false) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelector('.menu-label').textContent = 'Menu';
        menu.classList.remove('is-open');
        if (returnFocus) toggle.focus();
    }

    function syncMenu() {
        toggle.hidden = !mobile.matches;
        if (mobile.matches && menu.contains(document.activeElement)) toggle.focus();
        closeMenu();
    }

    navigation.classList.add('is-enhanced');
    syncMenu();
    mobile.addEventListener('change', syncMenu);
    toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        toggle.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
        menu.classList.toggle('is-open', open);
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    document.addEventListener('click', event => {
        if (!navigation.contains(event.target)) closeMenu();
    });
    document.addEventListener('focusin', event => {
        if (!navigation.contains(event.target)) closeMenu();
    });

    // Retain native anchor URLs and history; move focus to the destination.
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            const target = document.getElementById(link.getAttribute('href').slice(1));
            if (!target) return;
            closeMenu();
            if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });

    const sections = links.map(link => document.querySelector(link.getAttribute('href')));
    let scrollQueued = false;
    function updateScroll() {
        header.classList.toggle('is-scrolled', window.scrollY > 12);
        let current = sections[0];
        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= 160) current = section;
        });
        links.forEach(link => {
            const active = link.getAttribute('href') === '#' + current.id;
            link.classList.toggle('is-active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        scrollQueued = false;
    }
    window.addEventListener('scroll', () => {
        if (!scrollQueued) {
            scrollQueued = true;
            window.requestAnimationFrame(updateScroll);
        }
    }, { passive: true });
    window.addEventListener('resize', updateScroll);
    updateScroll();

    // Keep verified capabilities visible when JavaScript is unavailable.
    const capabilitiesToggle = document.querySelector('.project-details-toggle');
    const capabilities = document.getElementById(capabilitiesToggle.getAttribute('aria-controls'));
    let collapseTimer;
    capabilities.classList.add('is-animated');
    capabilities.hidden = true;
    capabilities.inert = true;
    capabilities.setAttribute('aria-hidden', 'true');
    capabilitiesToggle.hidden = false;
    capabilitiesToggle.setAttribute('aria-expanded', 'false');
    capabilitiesToggle.addEventListener('click', () => {
        const expanded = capabilitiesToggle.getAttribute('aria-expanded') !== 'true';
        window.clearTimeout(collapseTimer);
        capabilitiesToggle.setAttribute('aria-expanded', String(expanded));
        capabilities.inert = !expanded;
        capabilities.setAttribute('aria-hidden', String(!expanded));
        if (expanded) {
            capabilities.hidden = false;
            // Establish the collapsed size before the CSS grid expands.
            capabilities.getBoundingClientRect();
            capabilities.classList.add('is-expanded');
        } else {
            capabilities.classList.remove('is-expanded');
            if (reducedMotion.matches) capabilities.hidden = true;
            else collapseTimer = window.setTimeout(() => { capabilities.hidden = true; }, 320);
        }
    });
    reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) {
            window.clearTimeout(collapseTimer);
            capabilities.hidden = capabilitiesToggle.getAttribute('aria-expanded') !== 'true';
        }
    });

    // Static accessible text accompanies the purely visual role rotation.
    const role = document.getElementById('rotating-role');
    const roles = ['IT Infrastructure', 'Network & Systems', 'Security & Automation', 'Building Useful Things'];
    let index = 0;
    let roleTimer;
    function scheduleRole() {
        window.clearTimeout(roleTimer);
        role.classList.remove('is-changing');
        if (reducedMotion.matches || document.hidden) return;
        roleTimer = window.setTimeout(() => {
            role.classList.add('is-changing');
            roleTimer = window.setTimeout(() => {
                index = (index + 1) % roles.length;
                role.textContent = roles[index];
                role.classList.remove('is-changing');
                scheduleRole();
            }, 180);
        }, 3600);
    }
    reducedMotion.addEventListener('change', scheduleRole);
    document.addEventListener('visibilitychange', scheduleRole);
    scheduleRole();

    // Do not hide content in unsupported browsers or for reduced motion.
    if ('IntersectionObserver' in window && !reducedMotion.matches) {
        const reveals = [...document.querySelectorAll('.reveal')];
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('is-pending');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: .08 });
        reveals.forEach(element => {
            element.classList.add('is-pending');
            observer.observe(element);
        });
        reducedMotion.addEventListener('change', () => {
            if (reducedMotion.matches) {
                reveals.forEach(element => element.classList.remove('is-pending'));
                observer.disconnect();
            }
        });
    }
})();
