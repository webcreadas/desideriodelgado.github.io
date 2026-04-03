/**
 * DESIDERIO - Carousel JavaScript
 * Homepage image carousel functionality
 */

(function() {
    'use strict';

    const CAROUSEL_INTERVAL = 5000; // 5 seconds between slides

    // Initialize carousel when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        initCarousel();
    }

    function initCarousel() {
        const carousel = document.getElementById('homeCarousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.indicator');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');

        if (slides.length === 0) return;

        let currentSlide = 0;
        let autoplayInterval;

        // Initialize first slide
        showSlide(0);
        startAutoplay();

        // Event listeners for controls
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoplay();
                prevSlide();
                startAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoplay();
                nextSlide();
                startAutoplay();
            });
        }

        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoplay();
                showSlide(index);
                startAutoplay();
            });
        });

        // Pause autoplay on hover
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!isCarouselInViewport()) return;

            if (e.key === 'ArrowLeft') {
                stopAutoplay();
                prevSlide();
                startAutoplay();
            } else if (e.key === 'ArrowRight') {
                stopAutoplay();
                nextSlide();
                startAutoplay();
            }
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let isSwiping = false;
        const SWIPE_THRESHOLD = 50; // Minimum distance for a swipe
        const SWIPE_MAX_Y = 100; // Maximum vertical movement to consider a horizontal swipe

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            touchEndX = touchStartX;
            isSwiping = true;
            stopAutoplay();
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;

            const touchX = e.changedTouches[0].screenX;
            const touchY = e.changedTouches[0].screenY;
            const diffX = Math.abs(touchX - touchStartX);
            const diffY = Math.abs(touchY - touchStartY);

            // Only prevent scroll if we're swiping horizontally more than vertically
            if (diffX > diffY && diffX > 10) {
                e.preventDefault();
            }

            touchEndX = touchX;
        }, { passive: false });

        carousel.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            isSwiping = false;

            const touchY = e.changedTouches[0].screenY;
            const diffY = Math.abs(touchY - touchStartY);

            // Only handle swipe if vertical movement is minimal
            if (diffY < SWIPE_MAX_Y) {
                handleSwipe();
            }

            startAutoplay();
        }, { passive: true });

        carousel.addEventListener('touchcancel', () => {
            isSwiping = false;
            startAutoplay();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
                if (swipeDistance > 0) {
                    // Swiped right - go to previous slide
                    prevSlide();
                } else {
                    // Swiped left - go to next slide
                    nextSlide();
                }
            }
        }

        /**
         * Show a specific slide
         */
        function showSlide(index) {
            // Wrap around if out of bounds
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }

            // Update current slide
            currentSlide = index;

            // Update slides
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentSlide);
            });

            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentSlide);
            });

            // Trigger custom event
            carousel.dispatchEvent(new CustomEvent('slideChange', {
                detail: { currentSlide: currentSlide }
            }));
        }

        /**
         * Show next slide
         */
        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        /**
         * Show previous slide
         */
        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        /**
         * Start autoplay
         */
        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, CAROUSEL_INTERVAL);
        }

        /**
         * Stop autoplay
         */
        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }

        /**
         * Check if carousel is in viewport
         */
        function isCarouselInViewport() {
            const rect = carousel.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
        }

        // Handle visibility change (pause when tab is hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });
    }
})();
