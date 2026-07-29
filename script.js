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
});
