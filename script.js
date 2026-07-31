document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.matchMedia('(max-width: 768px) and (pointer: coarse)').matches;

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-links a, .nav-btn');

    const toggleMenu = () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Navbar Scroll Hide/Show
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Hide if scrolling down past 50px, show if scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // Only hide if menu is not currently open
            if (!mainNav.classList.contains('active')) {
                header.classList.add('nav-hidden');
            }
        } else if (currentScrollY < lastScrollY) {
            header.classList.remove('nav-hidden');
        }
        
        lastScrollY = currentScrollY;
    });

    // Community Thread (Pulse Line & Nodes)
    const pulsePath = document.querySelector('.pulse-path');
    if (!isMobile && pulsePath && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        const length = pulsePath.getTotalLength();
        gsap.set(pulsePath, { strokeDasharray: length, strokeDashoffset: length });
        
        gsap.to(pulsePath, {
            strokeDashoffset: 0,
            scrollTrigger: {
                trigger: '.pulse-container',
                start: 'top center',
                end: 'bottom top',
                scrub: 1
            }
        });
    }

    // Scroll-drawn thread lines
    const threadLines = document.querySelectorAll('.thread-line');
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        threadLines.forEach(line => {
            const length = line.getTotalLength();
            gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
            
            gsap.to(line, {
                strokeDashoffset: 0,
                scrollTrigger: {
                    trigger: line.closest('.thread-container').parentElement,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1
                }
            });
        });
    }

    // JazzCash Copy to Clipboard functionality
    const copyBtn = document.getElementById('copyJazzcash');
    
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const numberToCopy = copyBtn.getAttribute('data-clipboard');
            const copyTextSpan = copyBtn.querySelector('.copy-text');
            
            navigator.clipboard.writeText(numberToCopy).then(() => {
                // Visual feedback
                copyBtn.classList.add('copied');
                const originalText = copyTextSpan.textContent;
                copyTextSpan.textContent = 'Copied!';
                
                // Revert back after 2 seconds
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyTextSpan.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                copyTextSpan.textContent = 'Failed to copy';
            });
        });
    }

    // Scroll Reveal Animation via IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -10% 0px', // Trigger slightly before it comes fully into view
            threshold: 0.1
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // Raised So Far Data Fetch
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const amountEl = document.getElementById('raised-amount');
            const purposeEl = document.getElementById('raised-purpose');
            const updatedEl = document.getElementById('raised-updated');
            
            if (amountEl && data.amount) {
                // Ensure proper Pakistani Rupee format
                const formattedAmount = new Intl.NumberFormat('en-PK').format(data.amount);
                amountEl.textContent = `Rs. ${formattedAmount}`;
            }
            if (purposeEl && data.purpose) {
                purposeEl.textContent = data.purpose;
            }
            if (updatedEl && data.updatedAt) {
                updatedEl.textContent = `Updated ${data.updatedAt}`;
            }
        })
        .catch(err => console.error('Error fetching donation data:', err));

    // State of Care Typographic Transition
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const socFill = document.querySelector('.soc-fill');
        if (socFill) {
            gsap.to(socFill, {
                scrollTrigger: {
                    trigger: '.state-of-care-transition',
                    start: 'top 80%',
                    end: 'bottom 40%',
                    scrub: 1, // Smooth scrubbing
                },
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                ease: 'none'
            });
        }
        // Color Bloom Transitions
        const heroSectionElement = document.querySelector('.hero');
        if (!isMobile && heroSectionElement) {
            gsap.fromTo('.hero',
                { '--gray-val': 1 },
                {
                    '--gray-val': 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.hero',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );
        }

        const missionSectionElement = document.querySelector('.mission-section');
        if (missionSectionElement) {
            gsap.fromTo('.mission-section',
                { '--gray-val': 0.8 },
                {
                    '--gray-val': 0,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.mission-section',
                        start: 'top bottom',
                        end: 'top center',
                        scrub: true
                    }
                }
            );
        }
    }

    // Blob Cursor Animation
    const blobs = document.querySelectorAll('.blob');
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 860;

    if (isTouchDevice) {
        const blobContainer = document.querySelector('.blob-container');
        if (blobContainer) blobContainer.style.display = 'none';
    }

    if (blobs.length > 0 && typeof gsap !== 'undefined' && !isTouchDevice) {
        const fastDuration = 0.1;
        const slowDuration = 0.5;
        const fastEase = 'power3.out';
        const slowEase = 'power1.out';
        
        const handleMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            blobs.forEach((el, i) => {
                const isLead = i === 0;
                gsap.to(el, {
                    x: x,
                    y: y,
                    duration: isLead ? fastDuration : slowDuration,
                    ease: isLead ? fastEase : slowEase
                });
            });
        };
        
        window.addEventListener('mousemove', handleMove);

        // Hover Effect Logic for "Water Blob / Magnifying Glass"
        const blobMain = document.querySelector('.blob-main');
        const innerDots = document.querySelectorAll('.inner-dot');
        
        window.addEventListener('mouseover', (e) => {
            const target = e.target;
            const isInteractive = target.tagName.match(/^(A|BUTTON|H1|H2|H3|H4|H5|H6|P|SPAN|LI|INPUT|TEXTAREA|LABEL|IMG|STRONG|EM|SVG|USE|PATH|BLOCKQUOTE|CITE|Q|B|I)$/i) || target.closest('a, button');
            
            if (isInteractive) {
                gsap.to(blobs, {
                    backgroundColor: '#8C9678', // Light sage green
                    scale: 1.5,
                    duration: 0.3
                });
                gsap.to(blobMain, {
                    opacity: 0.4, // Transparent to see text
                    duration: 0.3
                });
                gsap.to(innerDots, {
                    opacity: 0,
                    duration: 0.3
                });
            } else {
                gsap.to(blobs, {
                    backgroundColor: '#1F3D2B', // Dark forest green
                    scale: 1,
                    duration: 0.3
                });
                gsap.to(blobMain, {
                    opacity: 1,
                    duration: 0.3
                });
                gsap.to(innerDots, {
                    opacity: 1,
                    duration: 0.3
                });
            }
        });
    }

    // Kinetic Headline Effect
    const splitIntoLetters = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return;
        
        // Process text nodes recursively to preserve existing HTML like <em>
        const processNodes = (parent) => {
            const nodes = Array.from(parent.childNodes);
            nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    // Only process text nodes that aren't purely empty/whitespace (unless it's a space we want to preserve between words)
                    // We need to keep single spaces.
                    if (node.textContent.trim().length > 0 || node.textContent === ' ' || node.textContent.includes(' ')) {
                        const text = node.textContent;
                        const fragment = document.createDocumentFragment();
                        
                        // Split by whitespace but keep the whitespace tokens
                        const words = text.split(/(\s+)/);
                        
                        words.forEach(word => {
                            if (word.trim().length === 0) {
                                // Just append whitespace as text so normal line wrapping applies between words
                                fragment.appendChild(document.createTextNode(word));
                            } else {
                                // Wrap actual words in an inline-block container so they don't break mid-word
                                const wordSpan = document.createElement('span');
                                wordSpan.className = 'kinetic-word';
                                wordSpan.style.display = 'inline-block';
                                wordSpan.style.whiteSpace = 'nowrap';
                                
                                word.split('').forEach((char) => {
                                    const charSpan = document.createElement('span');
                                    charSpan.className = 'kinetic-letter';
                                    charSpan.textContent = char;
                                    charSpan.style.display = 'inline-block';
                                    wordSpan.appendChild(charSpan);
                                });
                                
                                fragment.appendChild(wordSpan);
                            }
                        });
                        
                        parent.replaceChild(fragment, node);
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    processNodes(node);
                }
            });
        };

        processNodes(el);
    };

    if (!isTouchDevice && typeof gsap !== 'undefined') {
        splitIntoLetters('.hero-headline');
        
        const letters = document.querySelectorAll('.kinetic-letter');
        if (letters.length > 0) {
            const letterAnimations = Array.from(letters).map((letter) => ({
                el: letter,
                yTo: gsap.quickTo(letter, 'y', { duration: 0.4, ease: 'power3' })
            }));

            const heroSection = document.querySelector('.hero');
            
            const handleKineticMove = (e) => {
                letterAnimations.forEach(({ el, yTo }) => {
                    const rect = el.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
                    const influence = gsap.utils.mapRange(0, 100, -8, 0, Math.min(dist, 100));
                    yTo(influence);
                });
            };

            if ('IntersectionObserver' in window && heroSection) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            window.addEventListener('mousemove', handleKineticMove);
                        } else {
                            window.removeEventListener('mousemove', handleKineticMove);
                        }
                    });
                }, { threshold: 0 });
                observer.observe(heroSection);
            } else {
                window.addEventListener('mousemove', handleKineticMove);
            }
        }
    }

    // Mobile-only Hero Reveal
    function initMobileHeroReveal() {
        const mobilePulsePath = document.querySelector('.pulse-path');
        if (!mobilePulsePath) return;

        const pathLength = mobilePulsePath.getTotalLength();
        
        gsap.set(mobilePulsePath, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength
        });

        gsap.set('.hero-headline', { y: 30, opacity: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        tl.to('.hero-headline', { y: 0, opacity: 1, ease: 'none' }, 0)
          .to(mobilePulsePath, { strokeDashoffset: 0, ease: 'none' }, 0)
          .fromTo('.hero', { '--gray-val': 1 }, { '--gray-val': 0, ease: 'none' }, 0);
    }

    if (isMobile && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initMobileHeroReveal();
    }
});
