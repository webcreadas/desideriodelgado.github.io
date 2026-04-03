/**
 * DESIDERIO - Gallery JavaScript
 * Gallery filtering and lightbox functionality
 */

(function() {
    'use strict';

    // Initialize gallery when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }

    function initGallery() {
        initFilters();
        initLightbox();
    }

    /**
     * Gallery filtering
     */
    function initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (filterButtons.length === 0 || galleryItems.length === 0) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Get filter value
                const filter = button.dataset.filter;

                // Filter items with smooth transitions
                galleryItems.forEach(item => {
                    const category = item.dataset.category;
                    if (filter === 'all' || category === filter) {
                        // Show item
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        item.classList.remove('hidden');
                        // Force reflow
                        void item.offsetWidth;
                        // Animate in
                        requestAnimationFrame(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        });
                    } else {
                        // Hide item
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            item.classList.add('hidden');
                            item.style.transform = '';
                        }, 400);
                    }
                });

                // Dispatch custom event
                document.dispatchEvent(new CustomEvent('galleryFilter', {
                    detail: { filter: filter }
                }));
            });
        });
    }

    /**
     * Lightbox functionality
     */
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxCaption = document.getElementById('lightboxCaption');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');

        let currentImageIndex = 0;
        let visibleItems = [];

        // Get all gallery items
        function updateVisibleItems() {
            visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
        }

        // Open lightbox when clicking a gallery item
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                updateVisibleItems();
                currentImageIndex = visibleItems.indexOf(item);
                openLightbox(item);
            });
        });

        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Navigate previous
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                showPrevImage();
            });
        }

        // Navigate next
        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                showNextImage();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        });

        /**
         * Open lightbox with specific item
         */
        function openLightbox(item) {
            const img = item.querySelector('img');
            const title = item.querySelector('.gallery-item-title');

            if (img && lightboxImage) {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
            }

            if (title && lightboxCaption) {
                lightboxCaption.textContent = title.textContent;
            }

            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }

        /**
         * Close lightbox
         */
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling

            // Clear image after transition
            setTimeout(() => {
                if (lightboxImage) {
                    lightboxImage.src = '';
                }
            }, 300);
        }

        /**
         * Show previous image
         */
        function showPrevImage() {
            if (visibleItems.length === 0) return;

            currentImageIndex--;
            if (currentImageIndex < 0) {
                currentImageIndex = visibleItems.length - 1;
            }

            const item = visibleItems[currentImageIndex];
            openLightbox(item);
        }

        /**
         * Show next image
         */
        function showNextImage() {
            if (visibleItems.length === 0) return;

            currentImageIndex++;
            if (currentImageIndex >= visibleItems.length) {
                currentImageIndex = 0;
            }

            const item = visibleItems[currentImageIndex];
            openLightbox(item);
        }

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    showNextImage();
                } else {
                    showPrevImage();
                }
            }
        }
    }
})();
