// ==========================================================================
// Regex Tester Pro — Onboarding Flow
// MD 08 Agent 3: First-run experience with 5 slides
// ==========================================================================

class ZovoOnboarding {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 5;
        this.init();
    }

    init() {
        this.slides = document.querySelectorAll('.onboarding-slide');
        this.dots = document.querySelectorAll('.dot');
        this.progressBar = document.getElementById('progressBar');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.startBtn = document.getElementById('startBtn');

        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.complete());
        }

        this.updateUI();
    }

    next() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            this.updateUI();
        }
    }

    prev() {
        if (this.currentSlide > 1) {
            this.currentSlide--;
            this.updateUI();
        }
    }

    updateUI() {
        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active', i + 1 === this.currentSlide);
        });

        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i + 1 === this.currentSlide);
        });

        const progress = (this.currentSlide / this.totalSlides) * 100;
        this.progressBar.style.width = `${progress}%`;

        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.style.display = this.currentSlide === this.totalSlides ? 'none' : 'block';
    }

    async complete() {
        try {
            await chrome.storage.local.set({
                onboardingCompleted: true,
                onboardingCompletedAt: Date.now()
            });
        } catch (e) {
            // Silently handle — may not be in extension context during testing
        }
        window.close();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ZovoOnboarding();
});
