document.addEventListener('DOMContentLoaded', () => {
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

    // Pulse Line Animation
    // We want the pulse to draw itself once on load, then settle.
    const pulsePath = document.querySelector('.pulse-path');
    
    if (pulsePath) {
        // Force a reflow
        pulsePath.getBoundingClientRect();
        
        // Animate the stroke dashoffset to 0 over 2 seconds
        pulsePath.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)';
        pulsePath.style.strokeDashoffset = '0';

        // After the drawing animation completes, we morph it to a straight line
        setTimeout(() => {
            // Replace the path data with a flat straight line
            // The original path was: d="M0,25 L200,25 L215,5 L230,45 L245,25 L500,25"
            // The flat line will be: d="M0,25 L200,25 L215,25 L230,25 L245,25 L500,25"
            pulsePath.style.transition = 'd 0.8s ease-in-out';
            pulsePath.setAttribute('d', 'M0,25 L200,25 L215,25 L230,25 L245,25 L500,25');
        }, 2200); // Wait slightly longer than the draw animation
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

    // Blob Cursor Animation
    const blobs = document.querySelectorAll('.blob');
    if (blobs.length > 0 && typeof gsap !== 'undefined') {
        const fastDuration = 0.1;
        const slowDuration = 0.5;
        const fastEase = 'power3.out';
        const slowEase = 'power1.out';
        
        const handleMove = (e) => {
            const x = e.clientX || e.touches?.[0]?.clientX;
            const y = e.clientY || e.touches?.[0]?.clientY;
            
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
        window.addEventListener('touchmove', handleMove);

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
});
