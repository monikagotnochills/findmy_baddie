// Admin Dashboard JavaScript

const AdminDashboard = {
    currentTab: 'users',
    users: [
        {
            id: 1,
            name: "Monika Sharma",
            email: "monika@example.com",
            status: "active",
            credibility: 95,
            lastActive: "2024-08-01T10:30:00Z",
            joinDate: "2024-07-15T09:00:00Z"
        },
        {
            id: 2,
            name: "Priya Patel",
            email: "priya@example.com",
            status: "active",
            credibility: 88,
            lastActive: "2024-08-01T08:15:00Z",
            joinDate: "2024-07-20T14:30:00Z"
        },
        {
            id: 3,
            name: "Alex Chen",
            email: "alex@example.com",
            status: "inactive",
            credibility: 72,
            lastActive: "2024-07-28T16:45:00Z",
            joinDate: "2024-06-10T11:20:00Z"
        }
    ],

    init() {
        this.bindEvents();
        this.loadInitialData();
        this.initCharts();
        this.checkAdminAuth();
    },

    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.addEventListener('click', this.handleTabSwitch.bind(this));
        });

        // Back to home button
        const backBtn = document.getElementById('back-to-home');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // Admin logout
        const logoutBtn = document.getElementById('admin-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }

        // User management actions
        this.bindUserActions();

        // Settings controls
        this.bindSettingsControls();
    },

    checkAdminAuth() {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(userData);
        if (user.role !== 'admin') {
            // For demo purposes, allow any logged-in user to access admin
            // In production, this should redirect non-admin users
            console.log('Demo mode: Allowing admin access');
        }
    },

    handleTabSwitch(e) {
        e.preventDefault();
        const tab = e.target.dataset.tab;
        if (tab) {
            this.switchTab(tab);
        }
    },

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.admin-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update content
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`)?.classList.add('active');

        this.currentTab = tabName;

        // Load tab-specific data
        this.loadTabData(tabName);
    },

    loadInitialData() {
        this.loadUsersTable();
        this.updateStats();
    },

    loadTabData(tab) {
        switch(tab) {
            case 'users':
                this.loadUsersTable();
                break;
            case 'analytics':
                this.updateCharts();
                break;
            case 'moderation':
                this.loadModerationData();
                break;
            case 'safety':
                this.loadSafetyData();
                break;
            case 'settings':
                this.loadSettingsData();
                break;
        }
    },

    loadUsersTable() {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        tbody.innerHTML = this.users.map(user => `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <strong>${user.name}</strong>
                            <br>
                            <small>ID: ${user.id}</small>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <span class="status-badge status-${user.status}">
                        ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                </td>
                <td>
                    <span class="credibility-score score-${this.getScoreClass(user.credibility)}">
                        ${user.credibility}%
                    </span>
                </td>
                <td>${this.formatDate(user.lastActive)}</td>
                <td>
                    <div class="user-actions">
                        <button class="btn btn--sm btn--secondary" onclick="AdminDashboard.viewUser(${user.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn--sm btn--primary" onclick="AdminDashboard.editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn--sm btn--outline" onclick="AdminDashboard.suspendUser(${user.id})">
                            <i class="fas fa-ban"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    updateStats() {
        // Update dashboard statistics
        const stats = {
            totalUsers: this.users.length + 15417, // Add base number for demo
            activeUsers: this.users.filter(u => u.status === 'active').length + 8931,
            matchesMade: 5678,
            safetyScore: 98.5
        };

        // Update stat cards if they exist
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-number').textContent = stats.totalUsers.toLocaleString();
            statCards[1].querySelector('.stat-number').textContent = stats.activeUsers.toLocaleString();
            statCards[2].querySelector('.stat-number').textContent = stats.matchesMade.toLocaleString();
            statCards[3].querySelector('.stat-number').textContent = stats.safetyScore + '%';
        }
    },

    initCharts() {
        // Initialize Chart.js charts
        this.initRegistrationChart();
        this.initSuccessChart();
    },

    initRegistrationChart() {
        const ctx = document.getElementById('registration-chart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'New Registrations',
                    data: [120, 190, 300, 500, 200, 300, 450],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    },

    initSuccessChart() {
        const ctx = document.getElementById('success-chart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Successful Matches', 'Pending', 'Declined'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    },

    updateCharts() {
        // Refresh chart data
        console.log('Updating analytics charts...');
    },

    loadModerationData() {
        console.log('Loading moderation data...');
    },

    loadSafetyData() {
        console.log('Loading safety monitoring data...');
    },

    loadSettingsData() {
        console.log('Loading system settings...');
    },

    bindUserActions() {
        // User management actions would be handled here
    },

    bindSettingsControls() {
        // Settings controls
        const sliders = document.querySelectorAll('.setting-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const display = e.target.nextElementSibling;
                if (display) {
                    display.textContent = e.target.value + '%';
                }
            });
        });
    },

    // User management methods
    viewUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            alert(`Viewing user: ${user.name}\nEmail: ${user.email}\nCredibility: ${user.credibility}%`);
        }
    },

    editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            const newName = prompt('Edit user name:', user.name);
            if (newName && newName !== user.name) {
                user.name = newName;
                this.loadUsersTable();
                this.showNotification('User updated successfully', 'success');
            }
        }
    },

    suspendUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user && confirm(`Are you sure you want to suspend ${user.name}?`)) {
            user.status = user.status === 'active' ? 'inactive' : 'active';
            this.loadUsersTable();
            this.showNotification(`User ${user.status === 'active' ? 'reactivated' : 'suspended'}`, 'info');
        }
    },

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = 'index.html';
        }
    },

    // Utility methods
    getScoreClass(score) {
        if (score >= 90) return 'high';
        if (score >= 70) return 'medium';
        return 'low';
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString();
    },

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.admin-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'admin-notification';
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
        }, 4000);
    }
};

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AdminDashboard.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboard;
}