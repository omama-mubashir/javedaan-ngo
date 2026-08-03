document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.matchMedia('(max-width: 768px) and (pointer: coarse)').matches;

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-links a, .nav-btn');

    let navTl;

    // Use GSAP matchMedia to only apply the expanding animation on mobile (<= 860px)
    if (typeof gsap !== 'undefined' && gsap.matchMedia) {
        const mm = gsap.matchMedia();
        mm.add("(max-width: 860px)", () => {
            const menuItems = document.querySelectorAll('.nav-links li, .nav-btn');
            const siteHeader = document.querySelector('.site-header');
            const logo = document.querySelector('.logo');
            
            // Initial state for staggering
            gsap.set(menuItems, { y: 20, opacity: 0 });

            // Store initial styles to easily clear them on cleanup
            const initialHeaderStyles = siteHeader.getAttribute('style') || '';
            const initialHamburgerStyles = hamburger.getAttribute('style') || '';

            navTl = gsap.timeline({ paused: true, reversed: true });
            
            // 1. Morph the pill into the card (Keep original glass background)
            navTl.to(siteHeader, {
                height: '75vh',
                borderRadius: '24px',
                duration: 0.6,
                ease: 'power3.inOut'
            }, 0);

            // 2. Fade out logo
            navTl.to(logo, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out'
            }, 0);

            // 3. Move hamburger menu to bottom center
            const hamburgerBars = hamburger.querySelectorAll('.bar');
            
            // Calculate absolute pixel values to prevent percentage-based swooping
            const headerWidth = siteHeader.offsetWidth;
            const initialHeight = siteHeader.offsetHeight;
            const targetHeight = window.innerHeight * 0.75;
            
            const initialTop = initialHeight / 2;
            const targetTop = targetHeight - 30;
            
            const initialRight = 24; // 1.5rem
            const targetRight = (headerWidth / 2) - (hamburger.offsetWidth / 2);

            navTl.fromTo(hamburger, 
                { 
                    top: initialTop,
                    right: initialRight,
                    x: 0, 
                    yPercent: -50 // Preserve CSS vertical centering
                },
                {
                    top: targetTop,
                    right: targetRight,
                    x: 0,
                    yPercent: -50,
                    duration: 0.6,
                    ease: 'power3.inOut'
                }, 0);

            // 4. Reveal the nav container
            navTl.set(mainNav, { autoAlpha: 1 }, 0);
            
            // 5. Stagger in the navigation links
            navTl.to(menuItems, {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.08,
                ease: 'power2.out'
            }, 0.3);

            return () => {
                if (navTl) navTl.kill();
                navTl = null;
                gsap.set(menuItems, { clearProps: "all" });
                gsap.set(mainNav, { clearProps: "all" });
                siteHeader.setAttribute('style', initialHeaderStyles);
                hamburger.setAttribute('style', initialHamburgerStyles);
                gsap.set(hamburgerBars, { clearProps: "all" });
                gsap.set(logo, { clearProps: "all" });
            };
        });
    }

    const toggleMenu = () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        
        // Trigger GSAP timeline if available, otherwise fallback
        if (navTl) {
            navTl.reversed() ? navTl.play() : navTl.reverse();
        } else {
            mainNav.classList.toggle('active');
        }
        
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
            // Check if active class exists (fallback) or if GSAP timeline is played
            if (mainNav.classList.contains('active') || (navTl && !navTl.reversed())) {
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

    // Unified Hero Entrance Animation (All Devices)
    const pulsePath = document.querySelector('.pulse-path');
    const heroHeadline = document.querySelector('.hero-headline');
    
    if (typeof gsap !== 'undefined') {
        const heroTl = gsap.timeline({ defaults: { duration: 1.2, ease: 'power2.out' } });
        
        // Initial setup
        if (heroHeadline) {
            gsap.set(heroHeadline, { y: 30, opacity: 0 });
        }
        
        if (pulsePath) {
            const length = pulsePath.getTotalLength();
            gsap.set(pulsePath, { strokeDasharray: length, strokeDashoffset: length });
        }
        
        // Animate in on load
        if (heroHeadline) {
            heroTl.to(heroHeadline, { y: 0, opacity: 1 }, 0);
        }
        if (pulsePath) {
            heroTl.to(pulsePath, { strokeDashoffset: 0 }, 0.4); // Start slightly after headline
        }
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
            const amountValEl = document.getElementById('raised-amount-val');
            const goalValEl = document.getElementById('raised-goal-val');
            const purposeEl = document.getElementById('raised-purpose');
            const updatedEl = document.getElementById('raised-updated');
            
            const purposeElMobile = document.getElementById('raised-purpose-mobile');
            const updatedElMobile = document.getElementById('raised-updated-mobile');
            
            let raised = 0;
            let goal = 120000;

            if (data.amount) {
                raised = data.amount;
                if (amountValEl) {
                    amountValEl.textContent = '0';
                }
            }
            if (data.goal) {
                goal = data.goal;
                const formattedGoal = new Intl.NumberFormat('en-PK').format(goal);
                if (goalValEl) goalValEl.textContent = formattedGoal;
            }

            if (data.purpose) {
                if (purposeEl) purposeEl.textContent = data.purpose;
                if (purposeElMobile) purposeElMobile.textContent = data.purpose;
            }
            if (data.updatedAt) {
                const updatedText = `Updated ${data.updatedAt}`;
                if (updatedEl) updatedEl.textContent = updatedText;
                if (updatedElMobile) updatedElMobile.textContent = updatedText;
            }

            // Tasbih Ring Generator
            const ringContainer = document.querySelector('.tasbih-ring');
            if (ringContainer) {
                const totalBeads = 28;
                const filledCount = Math.round((raised / goal) * totalBeads);
                
                // Update aria-label
                ringContainer.setAttribute('aria-label', `Fundraising progress: Rs. ${raised} of Rs. ${goal} raised`);

                // Remove old beads if running again
                ringContainer.querySelectorAll('.bead').forEach(b => b.remove());

                // We need radius, but offsetWidth might be 0 if display:none or initially hidden. Default to 160 (320/2) if 0
                const radius = (ringContainer.offsetWidth || 320) / 2;

                for (let i = 0; i < totalBeads; i++) {
                    const angle = (i / totalBeads) * 2 * Math.PI - Math.PI / 2; // start at top
                    // Subtle irregularity for handmade feel (12px to 15px)
                    const size = 12 + Math.random() * 3;
                    const halfSize = size / 2;
                    const x = radius + radius * Math.cos(angle) - halfSize;
                    const y = radius + radius * Math.sin(angle) - halfSize;

                    const bead = document.createElement('span');
                    bead.className = i < filledCount ? 'bead bead-filled' : 'bead bead-hollow';
                    
                    bead.style.width = `${size}px`;
                    bead.style.height = `${size}px`;
                    bead.style.left = `${x}px`;
                    bead.style.top = `${y}px`;
                    
                    ringContainer.appendChild(bead);
                }

                // GSAP Animation for filled beads and progress bar
                if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                    if (!isMobile) {
                        gsap.set('.tasbih-section', { y: 24, scale: 0.98, opacity: 0.9 });
                    }

                    gsap.set('.tasbih-ayat-block', { opacity: 0, y: 20 });
                    gsap.set('.tasbih-ayat-arabic', { clipPath: 'inset(0 0 0 100%)' });
                    
                    const dividerPath = document.querySelector('.tasbih-divider-path');
                    if (dividerPath && !isMobile) {
                        const dividerLength = dividerPath.getTotalLength() || 200;
                        gsap.set(dividerPath, { strokeDasharray: dividerLength, strokeDashoffset: dividerLength });
                    }

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: '.tasbih-section',
                            start: 'top 80%'
                        }
                    });

                    if (!isMobile) {
                        tl.to('.tasbih-section', {
                            y: 0,
                            scale: 1,
                            opacity: 1,
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    }

                    tl.eventCallback('onComplete', () => {
                        gsap.to('.tasbih-section', {
                            scale: 1.015,
                            duration: 4,
                            ease: 'sine.inOut',
                            yoyo: true,
                            repeat: -1
                        });
                    });

                    gsap.to('.tasbih-ring', {
                        rotate: 20,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.tasbih-section',
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    });

                    gsap.to('.tasbih-content', {
                        rotate: -20,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.tasbih-section',
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    });

                    function animateCountUp(el, endValue, duration) {
                        const obj = { val: 0 };
                        gsap.to(obj, {
                            val: endValue,
                            duration,
                            ease: 'power1.out',
                            onUpdate: () => {
                                el.textContent = Math.round(obj.val).toLocaleString('en-PK');
                            }
                        });
                    }

                    // Only animate ring beads, not tail beads
                    tl.from('.tasbih-ring .bead-filled', {
                        scale: 0,
                        opacity: 0,
                        stagger: 0.04,
                        duration: 0.3,
                        ease: 'back.out(2)'
                    });

                    if (amountValEl) {
                        tl.add(() => animateCountUp(amountValEl, raised, 0.6), '<');
                    }

                    tl.to('.tasbih-ayat-block', {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, '<')
                    .to('.tasbih-ayat-arabic', {
                        clipPath: 'inset(0 0 0 0%)',
                        duration: 1,
                        ease: 'power2.inOut'
                    }, '<');

                    if (dividerPath && !isMobile) {
                        tl.to(dividerPath, {
                            strokeDashoffset: 0,
                            duration: 0.6,
                            ease: 'power2.inOut'
                        });
                    }

                    // Animate the slim progress bar fill
                    const progressFill = document.querySelector('.tasbih-progress-fill');
                    if (progressFill) {
                        const ratio = Math.min(1, raised / goal);
                        const percentStr = (ratio * 100) + '%';
                        
                        gsap.fromTo(progressFill, 
                            { width: '0%' }, 
                            { 
                                width: percentStr, 
                                duration: 1.5, 
                                ease: 'power2.out',
                                scrollTrigger: {
                                    trigger: '.tasbih-wrapper',
                                    start: 'top 80%'
                                }
                            }
                        );
                    }
                }
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
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth <= 860;

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

});
