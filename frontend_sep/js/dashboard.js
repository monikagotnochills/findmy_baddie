// Dashboard JavaScript for Swipe & Match functionality

const Dashboard = {
    currentCardIndex: 0,
    matches: [],
    roommateProfiles: [
        {
            id: 1,
            name: "Priya Sharma",
            age: 24,
            image: "https://images.unsplash.com/photo-1494790108755-2616b9c0b843?w=400",
            bio: "Software engineer who loves cooking and yoga. Looking for a clean, friendly roommate!",
            compatibility: 92,
            lifestyle: "Chill",
            cleanliness: "Very Tidy",
            workFromHome: true,
            budget: 900,
            interests: ["Cooking", "Yoga", "Movies", "Reading"],
            schedule: "9-5 Weekdays"
        },
        {
            id: 2,
            name: "Alex Chen",
            age: 22,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            bio: "Graduate student studying architecture. Love music and weekend adventures!",
            compatibility: 87,
            lifestyle: "Active",
            cleanliness: "Moderate",
            workFromHome: false,
            budget: 800,
            interests: ["Music", "Architecture", "Hiking", "Coffee"],
            schedule: "Flexible Student Hours"
        },
        {
            id: 3,
            name: "Sarah Johnson",
            age: 26,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
            bio: "Marketing professional who enjoys fitness and trying new restaurants.",
            compatibility: 89,
            lifestyle: "Early Bird",
            cleanliness: "Very Tidy",
            workFromHome: true,
            budget: 1000,
            interests: ["Fitness", "Food", "Marketing", "Travel"],
            schedule: "6am-6pm Weekdays"
        }
    ],

    init() {
        this.bindEvents();
        this.loadRoommateCards();
        this.initFilters();
        this.checkAuthStatus();
    },

    bindEvents() {
        // Swipe buttons
        const skipBtn = document.getElementById('skip-btn');
        const matchBtn = document.getElementById('match-btn');

        if (skipBtn) skipBtn.addEventListener('click', () => this.swipeCard('skip'));
        if (matchBtn) matchBtn.addEventListener('click', () => this.swipeCard('match'));

        // Filter changes
        const budgetSlider = document.querySelector('.budget-slider');
        if (budgetSlider) {
            budgetSlider.addEventListener('input', this.updateBudgetDisplay.bind(this));
            budgetSlider.addEventListener('change', this.applyFilters.bind(this));
        }

        // Assistant buttons
        document.querySelectorAll('.assistant-actions .btn').forEach(btn => {
            btn.addEventListener('click', this.handleAssistantAction.bind(this));
        });

        // Keyboard support
        document.addEventListener('keydown', this.handleKeyboard.bind(this));

        // Touch/swipe support for mobile
        this.initTouchSupport();
    },

    checkAuthStatus() {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(userData);
        this.updateWelcomeMessage(user.name);
    },

    updateWelcomeMessage(name) {
        const welcomeMsg = document.querySelector('.assistant-message h4');
        if (welcomeMsg) {
            welcomeMsg.textContent = `Hi ${name.split(' ')[0]} 👋!`;
        }
    },

    loadRoommateCards() {
        const container = document.getElementById('roommate-cards');
        if (!container) return;

        container.innerHTML = this.roommateProfiles.map((profile, index) => `
            <div class="roommate-card ${index === 0 ? 'active' : ''}" data-profile-id="${profile.id}">
                <div class="card-image" style="background-image: url('${profile.image}')">
                    <div class="compatibility-badge">
                        <span>${profile.compatibility}% Match</span>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-name">${profile.name}</h3>
                        <span class="card-age">${profile.age} years old</span>
                    </div>

                    <div class="compatibility-score">
                        <div class="score-circle">${profile.compatibility}%</div>
                        <div class="score-details">
                            <h4>Compatibility Score</h4>
                            <p>Based on lifestyle, cleanliness, and preferences</p>
                        </div>
                    </div>

                    <p class="card-bio">${profile.bio}</p>

                    <div class="card-details">
                        <div class="detail-item">
                            <i class="fas fa-moon"></i>
                            <span>${profile.lifestyle}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-broom"></i>
                            <span>${profile.cleanliness}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-home"></i>
                            <span>${profile.workFromHome ? 'WFH' : 'Office'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-dollar-sign"></i>
                            <span>$${profile.budget}/mo</span>
                        </div>
                    </div>

                    <div class="card-interests">
                        <h4>Interests</h4>
                        <div class="interests-tags">
                            ${profile.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
                        </div>
                    </div>

                    <div class="card-schedule">
                        <h4>Schedule</h4>
                        <p>${profile.schedule}</p>
                    </div>
                </div>
            </div>
        `).join('');
    },

    swipeCard(action) {
        const currentCard = document.querySelector('.roommate-card.active');
        if (!currentCard) return;

        const profileId = parseInt(currentCard.dataset.profileId);
        const profile = this.roommateProfiles.find(p => p.id === profileId);

        if (action === 'match') {
            this.matches.push(profile);
            this.showMatchModal(profile);
        }

        // Animate card out
        currentCard.style.transform = action === 'match' ? 'translateX(100%) rotate(20deg)' : 'translateX(-100%) rotate(-20deg)';
        currentCard.style.opacity = '0';

        setTimeout(() => {
            currentCard.remove();
            this.showNextCard();
        }, 300);

        // Update progress or show completion
        this.updateProgress();
    },

    showNextCard() {
        this.currentCardIndex++;
        const nextCard = document.querySelector('.roommate-card:not(.active)');

        if (nextCard) {
            nextCard.classList.add('active');
            nextCard.style.transform = 'translateX(0) rotate(0)';
            nextCard.style.opacity = '1';
        } else {
            this.showCompletionMessage();
        }
    },

    showMatchModal(profile) {
        const modal = document.getElementById('match-modal');
        const nameSpan = document.getElementById('match-name');

        if (modal && nameSpan) {
            nameSpan.textContent = profile.name;
            modal.classList.remove('hidden');

            // Auto-hide after 3 seconds
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 3000);
        }
    },

    showCompletionMessage() {
        const container = document.getElementById('roommate-cards');
        if (container) {
            container.innerHTML = `
                <div class="completion-message">
                    <lottie-player 
                        src="https://assets5.lottiefiles.com/packages/lf20_khfxaekd.json" 
                        background="transparent" 
                        speed="1" 
                        style="width: 100px; height: 100px; margin: 0 auto;"
                        loop 
                        autoplay>
                    </lottie-player>
                    <h3>All Done! 🎉</h3>
                    <p>You've reviewed all available profiles.</p>
                    <p>Found ${this.matches.length} potential matches!</p>
                    <button class="btn btn--primary" onclick="Dashboard.resetCards()">
                        <i class="fas fa-refresh"></i> Review Again
                    </button>
                </div>
            `;
        }
    },

    resetCards() {
        this.currentCardIndex = 0;
        this.loadRoommateCards();
    },

    updateBudgetDisplay() {
        const slider = document.querySelector('.budget-slider');
        const display = document.getElementById('budget-value');

        if (slider && display) {
            display.textContent = slider.value;
        }
    },

    applyFilters() {
        // In a real app, this would filter the profiles based on selected criteria
        console.log('Applying filters...');

        // Show loading and simulate filter application
        const container = document.getElementById('roommate-cards');
        if (container) {
            container.style.opacity = '0.5';
            setTimeout(() => {
                container.style.opacity = '1';
                this.showNotification('Filters applied! Showing best matches.', 'success');
            }, 500);
        }
    },

    handleAssistantAction(e) {
        const action = e.target.textContent.trim();

        if (action === 'High Scores Only') {
            this.filterHighScores();
        } else if (action === 'Show All') {
            this.showAllProfiles();
        }
    },

    filterHighScores() {
        // Filter to show only profiles with 90%+ compatibility
        this.roommateProfiles = this.roommateProfiles.filter(p => p.compatibility >= 90);
        this.resetCards();
        this.showNotification('Showing only high compatibility matches (90%+)', 'info');
    },

    showAllProfiles() {
        // Reset to show all profiles (would typically reload from server)
        this.resetCards();
        this.showNotification('Showing all available profiles', 'info');
    },

    handleKeyboard(e) {
        if (e.key === 'ArrowLeft') {
            this.swipeCard('skip');
        } else if (e.key === 'ArrowRight') {
            this.swipeCard('match');
        }
    },

    initTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let cardBeingDragged = null;

        document.addEventListener('touchstart', (e) => {
            const card = e.target.closest('.roommate-card.active');
            if (card) {
                cardBeingDragged = card;
                startX = e.touches[0].clientX;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (!cardBeingDragged) return;

            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;

            cardBeingDragged.style.transform = `translateX(${diffX}px) rotate(${diffX * 0.1}deg)`;
            cardBeingDragged.style.opacity = Math.abs(diffX) > 100 ? '0.7' : '1';
        });

        document.addEventListener('touchend', () => {
            if (!cardBeingDragged) return;

            const diffX = currentX - startX;

            if (Math.abs(diffX) > 100) {
                this.swipeCard(diffX > 0 ? 'match' : 'skip');
            } else {
                // Snap back
                cardBeingDragged.style.transform = 'translateX(0) rotate(0)';
                cardBeingDragged.style.opacity = '1';
            }

            cardBeingDragged = null;
        });
    },

    updateProgress() {
        const total = this.roommateProfiles.length;
        const remaining = document.querySelectorAll('.roommate-card').length;
        const progress = ((total - remaining) / total) * 100;

        // Update any progress indicators
        console.log(`Progress: ${progress.toFixed(0)}%`);
    },

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.dashboard-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'dashboard-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        const colors = {
            error: '#ef4444',
            success: '#10b981',
            info: '#3b82f6'
        };
        notification.style.background = colors[type] || colors.info;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}