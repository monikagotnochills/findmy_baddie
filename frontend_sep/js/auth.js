// Authentication JavaScript

const Auth = {
    // Initialize authentication functionality
    init() {
        this.bindEvents();
        this.initTabs();
    },

    // Bind event listeners
    bindEvents() {
        // Tab switching
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');

        if (loginTab) loginTab.addEventListener('click', () => this.switchTab('login'));
        if (registerTab) registerTab.addEventListener('click', () => this.switchTab('register'));

        // Form submissions
        const loginForm = document.getElementById('login-form-element');
        const registerForm = document.getElementById('register-form-element');

        if (loginForm) loginForm.addEventListener('submit', this.handleLogin.bind(this));
        if (registerForm) registerForm.addEventListener('submit', this.handleRegister.bind(this));

        // Social login buttons
        document.querySelectorAll('.btn--google').forEach(btn => {
            btn.addEventListener('click', this.handleGoogleAuth.bind(this));
        });

        document.querySelectorAll('.btn--facebook').forEach(btn => {
            btn.addEventListener('click', this.handleFacebookAuth.bind(this));
        });

        // Password visibility toggle
        this.initPasswordToggle();
    },

    // Initialize tab functionality
    initTabs() {
        // Check URL parameters for initial tab
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab') || 'login';
        this.switchTab(tab);
    },

    // Switch between login and register tabs
    switchTab(tab) {
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        // Update tab states
        if (tab === 'login') {
            loginTab?.classList.add('active');
            registerTab?.classList.remove('active');
            loginForm?.classList.remove('hidden');
            registerForm?.classList.add('hidden');
        } else {
            loginTab?.classList.remove('active');
            registerTab?.classList.add('active');
            loginForm?.classList.add('hidden');
            registerForm?.classList.remove('hidden');
        }

        // Update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('tab', tab);
        window.history.replaceState({}, '', url);
    },

    // Handle login form submission
    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };

        try {
            this.showLoading('Signing you in...');

            // Simulate API call
            await this.simulateApiCall();

            // Mock successful login
            const userData = {
                id: 1,
                name: 'Monika Sharma',
                email: loginData.email,
                role: 'user',
                joinDate: new Date().toISOString()
            };

            // Store auth data
            localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
            localStorage.setItem('userData', JSON.stringify(userData));

            this.hideLoading();

            // Redirect to dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            this.hideLoading();
            this.showError('Login failed. Please check your credentials.');
        }
    },

    // Handle register form submission
    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const registerData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            age: formData.get('age'),
            gender: formData.get('gender'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validate passwords match
        if (registerData.password !== registerData.confirmPassword) {
            this.showError('Passwords do not match.');
            return;
        }

        // Validate age
        if (registerData.age < 18) {
            this.showError('You must be at least 18 years old to register.');
            return;
        }

        try {
            this.showLoading('Creating your account...');

            // Simulate API call
            await this.simulateApiCall();

            // Mock successful registration
            const userData = {
                id: Date.now(),
                name: registerData.firstName + ' ' + registerData.lastName,
                email: registerData.email,
                phone: registerData.phone,
                age: registerData.age,
                gender: registerData.gender,
                role: 'user',
                joinDate: new Date().toISOString()
            };

            // Store auth data
            localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
            localStorage.setItem('userData', JSON.stringify(userData));

            this.hideLoading();

            // Show welcome message and redirect
            this.showSuccess('Welcome to Living Spaces! Redirecting to your dashboard...');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);

        } catch (error) {
            this.hideLoading();
            this.showError('Registration failed. Please try again.');
        }
    },

    // Handle Google authentication
    handleGoogleAuth() {
        this.showLoading('Connecting to Google...');

        // Simulate Google OAuth flow
        setTimeout(() => {
            this.hideLoading();
            this.showError('Google authentication is not yet implemented in this demo.');
        }, 1500);
    },

    // Handle Facebook authentication
    handleFacebookAuth() {
        this.showLoading('Connecting to Facebook...');

        // Simulate Facebook OAuth flow
        setTimeout(() => {
            this.hideLoading();
            this.showError('Facebook authentication is not yet implemented in this demo.');
        }, 1500);
    },

    // Initialize password visibility toggle
    initPasswordToggle() {
        const passwordInputs = document.querySelectorAll('input[type="password"]');

        passwordInputs.forEach(input => {
            const wrapper = document.createElement('div');
            wrapper.className = 'password-input-wrapper';
            wrapper.style.position = 'relative';

            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);

            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'password-toggle';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
            toggleBtn.style.cssText = `
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: rgba(255, 255, 255, 0.6);
                cursor: pointer;
                padding: 4px;
            `;

            toggleBtn.addEventListener('click', () => {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                toggleBtn.innerHTML = isPassword ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
            });

            wrapper.appendChild(toggleBtn);
        });
    },

    // Simulate API call delay
    simulateApiCall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1500 + Math.random() * 1000);
        });
    },

    // Show loading state
    showLoading(message) {
        // Create or update loading overlay
        let overlay = document.querySelector('.auth-loading');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'auth-loading';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                color: white;
                font-size: 1.1rem;
            `;
            document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
            <div style="text-align: center;">
                <div class="loading-spinner" style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top: 3px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <p>${message}</p>
            </div>
        `;

        // Add CSS animation if not already added
        if (!document.querySelector('#auth-spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'auth-spinner-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        overlay.style.display = 'flex';
    },

    // Hide loading state
    hideLoading() {
        const overlay = document.querySelector('.auth-loading');
        if (overlay) {
            overlay.style.display = 'none';
        }
    },

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    },

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    },

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.auth-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'auth-notification';
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

        // Set background color based on type
        const colors = {
            error: '#ef4444',
            success: '#10b981',
            info: '#3b82f6'
        };
        notification.style.background = colors[type] || colors.info;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}