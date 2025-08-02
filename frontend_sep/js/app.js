// Living Spaces - Main Application JavaScript

// Global application state
const App = {
    currentUser: null,
    isLoggedIn: false,
    currentPage: 'home',

    // Initialize the application
    init() {
        this.bindEvents();
        this.checkAuthStatus();
        this.initNavigation();
    },

    // Bind global event listeners
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });

        // Login button
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }

        // Voice CTA button
        const voiceCTA = document.getElementById('voice-cta');
        if (voiceCTA) {
            voiceCTA.addEventListener('click', this.openVoiceModal.bind(this));
        }

        // Text CTA button
        const textCTA = document.getElementById('text-cta');
        if (textCTA) {
            textCTA.addEventListener('click', this.openSignupModal.bind(this));
        }

        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('show');
            });
        }
    },

    // Handle navigation between sections
    handleNavigation(e) {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    },

    // Check if user is authenticated
    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
            this.isLoggedIn = true;
            this.currentUser = JSON.parse(userData);
            this.updateUIForLoggedInUser();
        }
    },

    // Update UI elements for logged in users
    updateUIForLoggedInUser() {
        const loginBtn = document.getElementById('login-btn');
        const adminLink = document.getElementById('admin-link');

        if (loginBtn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.onclick = () => window.location.href = 'dashboard.html';
        }

        if (adminLink && this.currentUser?.role === 'admin') {
            adminLink.style.display = 'block';
        }
    },

    // Initialize navigation highlighting
    initNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav__link');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if ((currentPath.includes('index.html') || currentPath === '/') && href === '#home') {
                link.classList.add('active');
            } else if (currentPath.includes('dashboard.html') && href === 'dashboard.html') {
                link.classList.add('active');
            } else if (currentPath.includes('admin.html') && href === 'admin.html') {
                link.classList.add('active');
            }
        });
    },

    // Open voice assistant modal
    openVoiceModal() {
        if (this.isLoggedIn) {
            // Load voice assistant component
            this.loadVoiceAssistant();
        } else {
            // Redirect to signup first
            window.location.href = 'login.html';
        }
    },

    // Open signup modal
    openSignupModal() {
        window.location.href = 'login.html';
    },

    // Load voice assistant component
    async loadVoiceAssistant() {
        try {
            const response = await fetch('components/voice-assistant.html');
            const html = await response.text();

            // Create modal container if it doesn't exist
            let modal = document.getElementById('voice-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.innerHTML = html;
                document.body.appendChild(modal.firstElementChild);
            }

            // Show modal
            modal = document.getElementById('voice-modal');
            modal.classList.remove('hidden');

            // Initialize voice assistant functionality
            if (window.VoiceAssistant) {
                window.VoiceAssistant.init();
            }

        } catch (error) {
            console.error('Error loading voice assistant:', error);
        }
    },

    // Utility function to show loading
    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.querySelector('p').textContent = message;
            overlay.classList.remove('hidden');
        }
    },

    // Utility function to hide loading
    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
};

// Room filtering functionality
const RoomFilter = {
    rooms: [
        {
            id: 1,
            title: "Modern Downtown Studio Share",
            price: 850,
            type: "studio",
            location: "downtown",
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
            amenities: ["WiFi", "Gym", "Parking"],
            description: "Beautiful modern studio in the heart of downtown with amazing city views."
        },
        {
            id: 2,
            title: "Cozy University Twin Room",
            price: 650,
            type: "twin",
            location: "university",
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
            amenities: ["WiFi", "Study Area", "Kitchen"],
            description: "Perfect for students! Close to campus with great study spaces."
        },
        {
            id: 3,
            title: "Suburban Family Home Share",
            price: 750,
            type: "twin",
            location: "suburban",
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
            amenities: ["Garden", "Parking", "Pet Friendly"],
            description: "Quiet suburban location with garden and parking space."
        }
    ],

    init() {
        this.renderRooms();
        this.bindFilterEvents();
    },

    bindFilterEvents() {
        const priceFilter = document.getElementById('price-filter');
        const typeFilter = document.getElementById('type-filter');
        const locationFilter = document.getElementById('location-filter');
        const clearFilters = document.getElementById('clear-filters');

        if (priceFilter) priceFilter.addEventListener('change', this.applyFilters.bind(this));
        if (typeFilter) typeFilter.addEventListener('change', this.applyFilters.bind(this));
        if (locationFilter) locationFilter.addEventListener('change', this.applyFilters.bind(this));
        if (clearFilters) clearFilters.addEventListener('click', this.clearFilters.bind(this));
    },

    renderRooms(roomsToRender = this.rooms) {
        const grid = document.getElementById('rooms-grid');
        if (!grid) return;

        grid.innerHTML = roomsToRender.map(room => `
            <div class="room-card glass-card" data-room-id="${room.id}">
                <div class="room-card__image" style="background-image: url('${room.image}')">
                    <div class="room-card__price">$${room.price}/mo</div>
                </div>
                <div class="room-card__content">
                    <h3 class="room-card__title">${room.title}</h3>
                    <p class="room-card__description">${room.description}</p>
                    <div class="room-card__amenities">
                        ${room.amenities.map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                    </div>
                    <div class="room-card__actions">
                        <button class="btn btn--primary btn--sm">View Details</button>
                        <button class="btn btn--secondary btn--sm">Contact</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    applyFilters() {
        const priceFilter = document.getElementById('price-filter')?.value || 'all';
        const typeFilter = document.getElementById('type-filter')?.value || 'all';
        const locationFilter = document.getElementById('location-filter')?.value || 'all';

        let filtered = this.rooms.filter(room => {
            let matches = true;

            // Price filter
            if (priceFilter !== 'all') {
                if (priceFilter === '0-800' && room.price > 800) matches = false;
                if (priceFilter === '800-1000' && (room.price < 800 || room.price > 1000)) matches = false;
                if (priceFilter === '1000+' && room.price < 1000) matches = false;
            }

            // Type filter
            if (typeFilter !== 'all' && room.type !== typeFilter) matches = false;

            // Location filter
            if (locationFilter !== 'all' && room.location !== locationFilter) matches = false;

            return matches;
        });

        this.renderRooms(filtered);
    },

    clearFilters() {
        document.getElementById('price-filter').value = 'all';
        document.getElementById('type-filter').value = 'all';
        document.getElementById('location-filter').value = 'all';
        this.renderRooms();
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    RoomFilter.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, RoomFilter };
}