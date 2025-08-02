// Living Spaces - Enhanced AI-Powered Roommate Matching Application
// Fixed Implementation with Working Navigation and Modal Functionality

// Application State Management
const AppState = {
    currentPage: 'home',
    currentQuestion: 0,
    surveyAnswers: {},
    isListening: false,
    isVoiceMode: true,
    currentCardIndex: 0,
    userMatches: [],
    isLoggedIn: false,
    isAdmin: false,

    // Enhanced Survey Questions (Exactly as specified)
    surveyQuestions: [
        {
            id: 1,
            question: "On a scale of 0-1, how tidy are you? (cleanliness)",
            type: "slider",
            min: 0,
            max: 1,
            step: 0.1,
            labels: ["Very Messy", "Very Tidy"]
        },
        {
            id: 2,
            question: "On a scale of 0-1, where 0 is early bird and 1 is night owl, what is your sleep preference? (sleep_schedule)",
            type: "slider",
            min: 0,
            max: 1,
            step: 0.1,
            labels: ["Early Bird", "Night Owl"]
        },
        {
            id: 3,
            question: "On a scale of 0-1, where 0 is day job and 1 is night shift, what are your work hours? (work_hours)",
            type: "slider",
            min: 0,
            max: 1,
            step: 0.1,
            labels: ["Day Job", "Night Shift"]
        },
        {
            id: 4,
            question: "On a scale of 0-1, where 0 is introvert and 1 is extrovert, how social are you? (social)",
            type: "slider",
            min: 0,
            max: 1,
            step: 0.1,
            labels: ["Introvert", "Extrovert"]
        },
        {
            id: 5,
            question: "On a scale of 0-1, where 0 is quiet and 1 is loud, how noisy are you? (noise)",
            type: "slider",
            min: 0,
            max: 1,
            step: 0.1,
            labels: ["Very Quiet", "Very Loud"]
        }
    ],

    // Sample Roommate Profiles (Enhanced with more realistic data)
    roommateProfiles: [
        {
            id: 1,
            name: "Riya Mehra",
            location: "Near TechPark, Sector 56",
            match_score: 92,
            traits: ["Early Riser", "Vegetarian", "Book Lover"],
            vibe: "Calm, bookworm",
            bio: "Looking for someone who respects privacy but loves deep convos.",
            profile_image: "https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=300",
            preferences: {
                cleanliness: 0.8,
                sleep_schedule: 0.2,
                work_hours: 0.1,
                social: 0.4,
                noise: 0.2
            }
        },
        {
            id: 2,
            name: "Priya Singh",
            location: "Downtown Area, Gurugram",
            match_score: 88,
            traits: ["Night Owl", "Foodie", "Gym Enthusiast"],
            vibe: "Energetic, social",
            bio: "Love cooking together and having good conversations over coffee!",
            profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
            preferences: {
                cleanliness: 0.7,
                sleep_schedule: 0.8,
                work_hours: 0.3,
                social: 0.9,
                noise: 0.6
            }
        },
        {
            id: 3,
            name: "Anita Sharma",
            location: "University District",
            match_score: 85,
            traits: ["Organized", "Student", "Music Lover"],
            vibe: "Focused, creative",
            bio: "Graduate student looking for a study-friendly environment.",
            profile_image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
            preferences: {
                cleanliness: 0.9,
                sleep_schedule: 0.6,
                work_hours: 0.4,
                social: 0.5,
                noise: 0.3
            }
        },
        {
            id: 4,
            name: "Sara Ahmed",
            location: "Cyber City Hub",
            match_score: 90,
            traits: ["Tech Professional", "Clean", "Pet Lover"],
            vibe: "Professional, caring",
            bio: "Software engineer who loves weekend adventures and cozy nights in.",
            profile_image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300",
            preferences: {
                cleanliness: 0.9,
                sleep_schedule: 0.4,
                work_hours: 0.2,
                social: 0.6,
                noise: 0.4
            }
        }
    ],

    // Room Data
    allRooms: [
        {
            id: 1,
            title: "Cozy Twin Share in Downtown",
            price: "$800/month",
            location: "Downtown Area",
            type: "Twin Share",
            amenities: ["WiFi", "Laundry", "Kitchen", "Study Area"],
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
            available: true,
            rating: 4.8
        },
        {
            id: 2,
            title: "Modern Studio with Roommate",
            price: "$950/month",
            location: "University District",
            type: "Studio Share",
            amenities: ["AC", "Parking", "Gym", "Pool"],
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
            available: true,
            rating: 4.9
        },
        {
            id: 3,
            title: "Spacious Twin Room",
            price: "$750/month",
            location: "Suburban Area",
            type: "Twin Share",
            amenities: ["Garden", "WiFi", "Kitchen", "Parking"],
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
            available: true,
            rating: 4.7
        }
    ],

    // Admin Data
    adminUsers: [
        {
            id: 1,
            name: "Riya Mehra",
            email: "riya.mehra@gmail.com",
            status: "Active",
            credibility: 92,
            lastActive: "2 hours ago",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=100"
        },
        {
            id: 2,
            name: "Priya Singh",
            email: "priya.singh@yahoo.com",
            status: "Active",
            credibility: 88,
            lastActive: "1 day ago",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
        },
        {
            id: 3,
            name: "Anita Sharma",
            email: "anita.sharma@gmail.com",
            status: "Pending",
            credibility: 85,
            lastActive: "3 days ago",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
        },
        {
            id: 4,
            name: "Sara Ahmed",
            email: "sara.ahmed@gmail.com",
            status: "Active",
            credibility: 90,
            lastActive: "30 minutes ago",
            avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100"
        }
    ]
};

// Voice Recognition Setup
let recognition = null;
let speechSynthesis = window.speechSynthesis;

// Initialize Speech Recognition
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            AppState.isListening = true;
            updateVoiceButton();
            showTranscript();
        };
        
        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            updateTranscript(transcript);
            
            if (event.results[event.results.length - 1].isFinal) {
                processVoiceInput(transcript);
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            AppState.isListening = false;
            updateVoiceButton();
            showMessage("Sorry, I couldn't hear you clearly. Please try again or switch to text mode.");
        };
        
        recognition.onend = () => {
            AppState.isListening = false;
            updateVoiceButton();
        };
    }
}

// Text-to-Speech Function
function speak(text) {
    if (speechSynthesis) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
    }
}

// Page Navigation System
function showPage(pageId) {
    console.log('Showing page:', pageId);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
        AppState.currentPage = pageId;
        console.log('Page shown successfully:', pageId);
    } else {
        console.log('Page element not found, staying on home page');
        // Fallback to home page
        const homePage = document.getElementById('home-page');
        if (homePage) {
            homePage.classList.add('active');
            AppState.currentPage = 'home';
        }
    }
    
    // Update navigation
    updateNavigation();
    
    // Initialize page-specific content
    if (pageId === 'swipe-match') {
        setTimeout(() => initializeSwipeMatch(), 100);
    } else if (pageId === 'admin') {
        setTimeout(() => initializeAdminDashboard(), 100);
    }
}

function updateNavigation() {
    document.querySelectorAll('.nav__link').forEach(link => {
        link.classList.remove('active');
    });
    
    const currentPageLink = document.querySelector(`[href="#${AppState.currentPage}"]`);
    if (currentPageLink) {
        currentPageLink.classList.add('active');
    }
}

// Survey Functions
function openVoiceModal() {
    console.log('Opening voice modal...');
    const voiceModal = document.getElementById('voice-modal');
    if (voiceModal) {
        voiceModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        resetSurvey();
        setTimeout(() => {
            startSurvey();
        }, 500);
        console.log('Voice modal opened successfully');
    } else {
        console.error('Voice modal element not found');
    }
}

function closeVoiceModal() {
    console.log('Closing voice modal...');
    const voiceModal = document.getElementById('voice-modal');
    if (voiceModal) {
        voiceModal.classList.add('hidden');
        document.body.style.overflow = '';
        stopListening();
        resetSurvey();
    }
}

function resetSurvey() {
    AppState.currentQuestion = 0;
    AppState.surveyAnswers = {};
    updateProgress();
    hideTranscript();
    
    const surveyContent = document.getElementById('survey-content');
    if (surveyContent) {
        surveyContent.innerHTML = '';
    }
}

function startSurvey() {
    const welcomeMessage = "Hi! I'm your AI assistant powered by Omnidim.io. Let's find your perfect roommate with just 5 quick questions about your preferences on a scale of 0 to 1. Ready to get started?";
    showMessage(welcomeMessage);
    
    if (AppState.isVoiceMode) {
        speak(welcomeMessage);
        setTimeout(() => {
            showCurrentQuestion();
        }, 4000);
    } else {
        setTimeout(() => {
            showCurrentQuestion();
        }, 1000);
    }
}

function showCurrentQuestion() {
    if (AppState.currentQuestion >= AppState.surveyQuestions.length) {
        completeSurvey();
        return;
    }
    
    const question = AppState.surveyQuestions[AppState.currentQuestion];
    showMessage(question.question);
    
    if (AppState.isVoiceMode) {
        speak(question.question);
    } else {
        showSliderQuestion(question);
    }
    
    updateProgress();
}

function showSliderQuestion(question) {
    const surveyContent = document.getElementById('survey-content');
    if (!surveyContent) return;
    
    surveyContent.innerHTML = `
        <div class="survey-question">
            <h3>${question.question}</h3>
            <div class="slider-container" style="margin: 2rem 0;">
                <div class="slider-labels" style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.875rem; color: var(--color-text-secondary);">
                    <span>${question.labels[0]}</span>
                    <span>${question.labels[1]}</span>
                </div>
                <input type="range" 
                       id="question-slider" 
                       min="${question.min}" 
                       max="${question.max}" 
                       step="${question.step}" 
                       value="0.5" 
                       class="question-slider"
                       style="width: 100%; margin-bottom: 1rem;">
                <div class="slider-value" style="text-align: center; font-weight: 600; color: var(--color-primary); font-size: 1.1rem;">
                    Value: <span id="slider-value">0.5</span>
                </div>
            </div>
            <button class="btn btn--primary" onclick="submitSliderAnswer()" style="margin-top: 1.5rem; width: 100%;">
                Next Question
            </button>
        </div>
    `;
    
    // Add slider event listener
    const slider = document.getElementById('question-slider');
    const valueDisplay = document.getElementById('slider-value');
    
    if (slider && valueDisplay) {
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
        });
    }
}

// Global function for slider submission
window.submitSliderAnswer = function() {
    const slider = document.getElementById('question-slider');
    if (slider) {
        const question = AppState.surveyQuestions[AppState.currentQuestion];
        AppState.surveyAnswers[question.id] = parseFloat(slider.value);
        
        AppState.currentQuestion++;
        const surveyContent = document.getElementById('survey-content');
        if (surveyContent) {
            surveyContent.innerHTML = '';
        }
        
        setTimeout(() => {
            showCurrentQuestion();
        }, 500);
    }
};

function processVoiceInput(transcript) {
    const cleanTranscript = transcript.toLowerCase().trim();
    let value = 0.5; // default
    
    // Extract numeric value from speech
    const numberMatch = cleanTranscript.match(/(\d+\.?\d*)/);
    if (numberMatch) {
        const extractedNumber = parseFloat(numberMatch[1]);
        if (extractedNumber >= 0 && extractedNumber <= 1) {
            value = extractedNumber;
        } else if (extractedNumber > 1 && extractedNumber <= 10) {
            value = extractedNumber / 10;
        }
    } else {
        // Parse common words
        if (cleanTranscript.includes('zero') || cleanTranscript.includes('none')) {
            value = 0;
        } else if (cleanTranscript.includes('one') || cleanTranscript.includes('maximum') || cleanTranscript.includes('highest')) {
            value = 1;
        } else if (cleanTranscript.includes('half') || cleanTranscript.includes('middle') || cleanTranscript.includes('average')) {
            value = 0.5;
        } else if (cleanTranscript.includes('low') || cleanTranscript.includes('little') || cleanTranscript.includes('small')) {
            value = 0.3;
        } else if (cleanTranscript.includes('high') || cleanTranscript.includes('much') || cleanTranscript.includes('very')) {
            value = 0.7;
        }
    }
    
    const question = AppState.surveyQuestions[AppState.currentQuestion];
    AppState.surveyAnswers[question.id] = value;
    
    showMessage(`Great! I heard a value of ${value}. Moving to the next question...`);
    
    setTimeout(() => {
        AppState.currentQuestion++;
        hideTranscript();
        showCurrentQuestion();
    }, 2000);
}

function completeSurvey() {
    const completionMessage = "Perfect! I have all your preferences. Let me find your ideal roommate matches...";
    showMessage(completionMessage);
    speak(completionMessage);
    
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) progressFill.style.width = '100%';
    if (progressText) progressText.textContent = 'Complete!';
    
    setTimeout(() => {
        closeVoiceModal();
        showSignUpModal();
    }, 2000);
}

function showSignUpModal() {
    const signupModal = document.getElementById('signup-modal');
    if (signupModal) {
        signupModal.classList.remove('hidden');
    }
}

function closeSignUpModal() {
    const signupModal = document.getElementById('signup-modal');
    if (signupModal) {
        signupModal.classList.add('hidden');
    }
}

// Swipe & Match Functionality
function initializeSwipeMatch() {
    console.log('Initializing swipe match...');
    const cardsContainer = document.getElementById('roommate-cards');
    if (!cardsContainer) {
        console.log('Cards container not found');
        return;
    }
    
    cardsContainer.innerHTML = '';
    AppState.currentCardIndex = 0;
    
    // Create cards for all profiles
    AppState.roommateProfiles.forEach((profile, index) => {
        const card = createRoommateCard(profile, index);
        cardsContainer.appendChild(card);
    });
    
    // Show current card
    showCurrentCard();
    
    // Update budget slider
    const budgetSlider = document.querySelector('.budget-slider');
    const budgetValue = document.getElementById('budget-value');
    if (budgetSlider && budgetValue) {
        budgetSlider.addEventListener('input', function() {
            budgetValue.textContent = this.value;
        });
    }
    
    console.log('Swipe match initialized successfully');
}

function createRoommateCard(profile, index) {
    const card = document.createElement('div');
    card.className = 'roommate-card';
    card.style.zIndex = AppState.roommateProfiles.length - index;
    card.style.transform = `scale(${1 - index * 0.05}) translateY(${index * 10}px)`;
    
    if (index > 0) {
        card.style.opacity = '0.8';
    }
    
    card.innerHTML = `
        <div class="roommate-info">
            <img src="${profile.profile_image}" alt="${profile.name}" class="roommate-avatar">
            <h3>🧑 ${profile.name}</h3>
            <div class="roommate-detail">
                <span>📍 ${profile.location}</span>
            </div>
            <div class="match-score">
                📊 Match Score: ${profile.match_score}%
            </div>
            <div class="roommate-detail">
                <span>🛏️ Preferences: ${profile.traits.join(', ')}</span>
            </div>
            <div class="roommate-detail">
                <span>🎧 Vibe: ${profile.vibe}</span>
            </div>
            <div class="roommate-bio">
                💬 "${profile.bio}"
            </div>
        </div>
    `;
    
    // Add swipe functionality (simplified for better compatibility)
    let startX = 0;
    let currentX = 0;
    let cardBeingDragged = false;
    
    card.addEventListener('mousedown', handleStart);
    card.addEventListener('touchstart', handleStart, { passive: false });
    
    function handleStart(e) {
        if (index !== AppState.currentCardIndex) return;
        
        cardBeingDragged = true;
        card.classList.add('dragging');
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchend', handleEnd);
        
        e.preventDefault();
    }
    
    function handleMove(e) {
        if (!cardBeingDragged) return;
        
        currentX = (e.type === 'mousemove' ? e.clientX : e.touches[0].clientX) - startX;
        const rotation = currentX * 0.1;
        
        card.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
        
        // Visual feedback
        if (currentX > 50) {
            card.style.borderColor = '#10b981'; // green for like
        } else if (currentX < -50) {
            card.style.borderColor = '#ef4444'; // red for skip
        } else {
            card.style.borderColor = 'rgba(255, 255, 255, 0.18)';
        }
        
        e.preventDefault();
    }
    
    function handleEnd(e) {
        if (!cardBeingDragged) return;
        
        cardBeingDragged = false;
        card.classList.remove('dragging');
        
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchend', handleEnd);
        
        if (Math.abs(currentX) > 100) {
            // Card swiped
            if (currentX > 0) {
                handleMatch(profile);
            } else {
                handleSkip(profile);
            }
            removeCard(card);
        } else {
            // Snap back
            card.style.transform = '';
            card.style.borderColor = 'rgba(255, 255, 255, 0.18)';
        }
        
        currentX = 0;
    }
    
    return card;
}

function showCurrentCard() {
    const cards = document.querySelectorAll('.roommate-card');
    cards.forEach((card, index) => {
        if (index === AppState.currentCardIndex) {
            card.style.zIndex = '10';
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
        } else if (index === AppState.currentCardIndex + 1) {
            card.style.zIndex = '5';
            card.style.opacity = '0.8';
            card.style.transform = 'scale(0.95) translateY(10px)';
        } else if (index === AppState.currentCardIndex + 2) {
            card.style.zIndex = '2';
            card.style.opacity = '0.6';
            card.style.transform = 'scale(0.9) translateY(20px)';
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8) translateY(30px)';
        }
    });
}

function handleSkip(profile) {
    console.log('Skipped:', profile.name);
    nextCard();
}

function handleMatch(profile) {
    console.log('Matched:', profile.name);
    AppState.userMatches.push(profile);
    
    // Show match modal
    showMatchModal(profile);
    nextCard();
}

function nextCard() {
    AppState.currentCardIndex++;
    
    if (AppState.currentCardIndex >= AppState.roommateProfiles.length) {
        // No more cards
        showNoMoreCards();
    } else {
        setTimeout(() => {
            showCurrentCard();
        }, 300);
    }
}

function removeCard(card) {
    card.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    card.style.transform = `translateX(${currentX > 0 ? '100vw' : '-100vw'}) rotate(${currentX > 0 ? '30deg' : '-30deg'})`;
    card.style.opacity = '0';
    
    setTimeout(() => {
        if (card.parentNode) {
            card.parentNode.removeChild(card);
        }
    }, 300);
}

function showMatchModal(profile) {
    const matchModal = document.getElementById('match-modal');
    const matchName = document.getElementById('match-name');
    
    if (matchModal && matchName) {
        matchName.textContent = profile.name;
        matchModal.classList.remove('hidden');
        
        // Auto close after 3 seconds
        setTimeout(() => {
            matchModal.classList.add('hidden');
        }, 3000);
    }
}

function showNoMoreCards() {
    const cardsContainer = document.getElementById('roommate-cards');
    if (cardsContainer) {
        cardsContainer.innerHTML = `
            <div class="no-more-cards glass-card" style="padding: 2rem; text-align: center;">
                <h3>🎉 You've seen all available profiles!</h3>
                <p>Check back later for new roommate suggestions, or adjust your filters to see more options.</p>
                <button class="btn btn--primary" onclick="initializeSwipeMatch()">
                    Reset Stack
                </button>
            </div>
        `;
    }
}

// Admin Dashboard Functions
function initializeAdminDashboard() {
    console.log('Initializing admin dashboard...');
    populateUserTable();
    initializeCharts();
    
    // Admin navigation
    const adminNavItems = document.querySelectorAll('.admin-nav-item');
    adminNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.dataset.tab;
            showAdminTab(tabId);
            
            // Update active nav item
            adminNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    console.log('Admin dashboard initialized');
}

function showAdminTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show target tab
    const targetTab = document.getElementById(tabId + '-tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

function populateUserTable() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = AppState.adminUsers.map(user => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
                    <span>${user.name}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="status status--${user.status.toLowerCase() === 'active' ? 'success' : 'warning'}">
                    ${user.status}
                </span>
            </td>
            <td>
                <div class="credibility-bar">
                    <div class="credibility-fill" style="width: ${user.credibility}%;"></div>
                </div>
                <small>${user.credibility}%</small>
            </td>
            <td>${user.lastActive}</td>
            <td>
                <button class="btn btn--sm btn--secondary" onclick="viewUser(${user.id})">View</button>
                <button class="btn btn--sm btn--primary" onclick="editUser(${user.id})">Edit</button>
            </td>
        </tr>
    `).join('');
}

function initializeCharts() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.log('Chart.js not available, skipping chart initialization');
        return;
    }
    
    // Registration Chart
    const regCtx = document.getElementById('registration-chart');
    if (regCtx) {
        new Chart(regCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Registrations',
                    data: [120, 190, 300, 500, 700, 900],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Success Rate Chart
    const successCtx = document.getElementById('success-chart');
    if (successCtx) {
        new Chart(successCtx, {
            type: 'doughnut',
            data: {
                labels: ['Successful Matches', 'Pending', 'No Match'],
                datasets: [{
                    data: [75, 15, 10],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

// Global admin functions
window.viewUser = function(userId) {
    const user = AppState.adminUsers.find(u => u.id === userId);
    if (user) {
        alert(`User Details:\n\nName: ${user.name}\nEmail: ${user.email}\nStatus: ${user.status}\nCredibility: ${user.credibility}%\nLast Active: ${user.lastActive}`);
    }
};

window.editUser = function(userId) {
    const user = AppState.adminUsers.find(u => u.id === userId);
    if (user) {
        const newStatus = prompt(`Edit status for ${user.name}:`, user.status);
        if (newStatus) {
            user.status = newStatus;
            populateUserTable();
        }
    }
};

// Helper Functions
function updateVoiceButton() {
    const micButton = document.getElementById('mic-button');
    if (!micButton) return;
    
    if (AppState.isListening) {
        micButton.classList.add('active');
        micButton.innerHTML = `
            <lottie-player 
                src="https://assets4.lottiefiles.com/packages/lf20_nXwgWa.json" 
                background="transparent" 
                speed="2" 
                style="width: 30px; height: 30px;"
                loop 
                autoplay>
            </lottie-player>
            <span>Listening...</span>
        `;
    } else {
        micButton.classList.remove('active');
        micButton.innerHTML = `
            <lottie-player 
                src="https://assets4.lottiefiles.com/packages/lf20_nXwgWa.json" 
                background="transparent" 
                speed="1" 
                style="width: 30px; height: 30px;"
                loop 
                autoplay>
            </lottie-player>
            <span>Tap to Speak</span>
        `;
    }
}

function showMessage(message) {
    const assistantMessage = document.getElementById('assistant-message');
    if (assistantMessage) {
        assistantMessage.textContent = message;
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    const progress = (AppState.currentQuestion / AppState.surveyQuestions.length) * 100;
    
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `Question ${AppState.currentQuestion} of ${AppState.surveyQuestions.length}`;
}

function showTranscript() {
    const transcript = document.getElementById('transcript');
    if (transcript) {
        transcript.classList.add('show');
    }
}

function hideTranscript() {
    const transcript = document.getElementById('transcript');
    if (transcript) {
        transcript.classList.remove('show');
        transcript.textContent = '';
    }
}

function updateTranscript(text) {
    const transcript = document.getElementById('transcript');
    if (transcript) {
        transcript.textContent = text;
    }
}

function startListening() {
    if (recognition && !AppState.isListening) {
        recognition.start();
    } else if (!recognition) {
        showMessage("Voice recognition is not available in your browser. Please use text mode instead.");
        toggleInputMode();
    }
}

function stopListening() {
    if (recognition && AppState.isListening) {
        recognition.stop();
    }
}

function toggleInputMode() {
    const textMode = document.getElementById('text-mode');
    AppState.isVoiceMode = !AppState.isVoiceMode;
    
    if (textMode) {
        textMode.innerHTML = AppState.isVoiceMode 
            ? '<i class="fas fa-keyboard"></i><span>Switch to Text</span>'
            : '<i class="fas fa-microphone"></i><span>Switch to Voice</span>';
    }
    
    showCurrentQuestion();
}

function showLoadingScreen() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

// Room Functions
function renderRooms(rooms) {
    const roomsGrid = document.getElementById('rooms-grid');
    if (!roomsGrid) return;
    
    const roomsHTML = rooms.map(room => `
        <div class="room-card glass-card" data-room-id="${room.id}">
            <img src="${room.image}" alt="${room.title}" class="room-card__image" loading="lazy">
            <div class="room-card__content">
                <div class="room-card__header">
                    <h3 class="room-card__title">${room.title}</h3>
                    <span class="room-card__price">${room.price}</span>
                </div>
                <div class="room-card__location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${room.location}
                </div>
                <div class="room-card__amenities">
                    ${room.amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join('')}
                </div>
                <div class="room-card__footer">
                    <div class="room-card__rating">
                        <i class="fas fa-star" style="color: #fbbf24;"></i>
                        ${room.rating}
                    </div>
                    <button class="btn btn--primary btn--sm" onclick="viewRoom(${room.id})">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    roomsGrid.innerHTML = roomsHTML;
}

function filterRooms() {
    const priceFilter = document.getElementById('price-filter');
    const typeFilter = document.getElementById('type-filter');
    const locationFilter = document.getElementById('location-filter');
    
    const priceValue = priceFilter ? priceFilter.value : 'all';
    const typeValue = typeFilter ? typeFilter.value : 'all';
    const locationValue = locationFilter ? locationFilter.value : 'all';
    
    let filteredRooms = AppState.allRooms.filter(room => {
        let matchesPrice = true;
        let matchesType = true;
        let matchesLocation = true;
        
        if (priceValue !== 'all') {
            const price = parseInt(room.price.replace(/[^0-9]/g, ''));
            if (priceValue === '0-800') {
                matchesPrice = price <= 800;
            } else if (priceValue === '800-1000') {
                matchesPrice = price > 800 && price <= 1000;
            } else if (priceValue === '1000+') {
                matchesPrice = price > 1000;
            }
        }
        
        if (typeValue !== 'all') {
            if (typeValue === 'twin') {
                matchesType = room.type.toLowerCase().includes('twin');
            } else if (typeValue === 'studio') {
                matchesType = room.type.toLowerCase().includes('studio');
            }
        }
        
        if (locationValue !== 'all') {
            if (locationValue === 'downtown') {
                matchesLocation = room.location.toLowerCase().includes('downtown');
            } else if (locationValue === 'university') {
                matchesLocation = room.location.toLowerCase().includes('university');
            } else if (locationValue === 'suburban') {
                matchesLocation = room.location.toLowerCase().includes('suburban');
            }
        }
        
        return matchesPrice && matchesType && matchesLocation;
    });
    
    renderRooms(filteredRooms);
}

function clearAllFilters() {
    const priceFilter = document.getElementById('price-filter');
    const typeFilter = document.getElementById('type-filter');
    const locationFilter = document.getElementById('location-filter');
    
    if (priceFilter) priceFilter.value = 'all';
    if (typeFilter) typeFilter.value = 'all';
    if (locationFilter) locationFilter.value = 'all';
    
    renderRooms(AppState.allRooms);
}

// Global functions for HTML onclick handlers
window.viewRoom = function(roomId) {
    const room = AppState.allRooms.find(r => r.id === roomId);
    if (room) {
        const detailMessage = `🏠 ${room.title}\n\n💰 Price: ${room.price}\n📍 Location: ${room.location}\n⭐ Rating: ${room.rating}/5\n\n🏷️ Room Type: ${room.type}\n\n✨ Amenities:\n${room.amenities.map(a => `• ${a}`).join('\n')}\n\nThis would normally open a detailed room view with:\n• Virtual tour\n• Roommate compatibility scores\n• Booking calendar\n• Contact roommates\n• Schedule visit`;
        alert(detailMessage);
    }
};

// Main Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Living Spaces Enhanced App Starting...');
    
    try {
        // Initialize speech recognition
        initSpeechRecognition();
        
        // Setup navigation - Fixed event listeners
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Navigation clicked:', this.getAttribute('href'));
                
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const pageId = href.substring(1);
                    console.log('Attempting to show page:', pageId);
                    
                    if (pageId === 'swipe-match') {
                        showPage('swipe-match');
                    } else if (pageId === 'home') {
                        showPage('home');
                    } else {
                        // Scroll to section within home page
                        showPage('home');
                        setTimeout(() => {
                            const target = document.getElementById(pageId);
                            if (target) {
                                target.scrollIntoView({ behavior: 'smooth' });
                            }
                        }, 200);
                    }
                }
            });
        });
        
        // Setup voice CTA buttons - Fixed event listeners
        const voiceCTA = document.getElementById('voice-cta');
        const textCTA = document.getElementById('text-cta');
        
        if (voiceCTA) {
            voiceCTA.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Voice CTA clicked');
                AppState.isVoiceMode = true;
                openVoiceModal();
            });
            console.log('Voice CTA event listener attached');
        } else {
            console.error('Voice CTA button not found');
        }
        
        if (textCTA) {
            textCTA.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Text CTA clicked');
                AppState.isVoiceMode = false;
                openVoiceModal();
            });
            console.log('Text CTA event listener attached');
        }
        
        // Setup modal controls
        const closeModal = document.getElementById('close-modal');
        const voiceModal = document.getElementById('voice-modal');
        const micButton = document.getElementById('mic-button');
        const textMode = document.getElementById('text-mode');
        
        if (closeModal) {
            closeModal.addEventListener('click', function(e) {
                e.preventDefault();
                closeVoiceModal();
            });
        }
        
        if (voiceModal) {
            voiceModal.addEventListener('click', function(e) {
                if (e.target === voiceModal) {
                    closeVoiceModal();
                }
            });
        }
        
        if (micButton) {
            micButton.addEventListener('click', function(e) {
                e.preventDefault();
                if (AppState.isListening) {
                    stopListening();
                } else {
                    startListening();
                }
            });
        }
        
        if (textMode) {
            textMode.addEventListener('click', function(e) {
                e.preventDefault();
                toggleInputMode();
            });
        }
        
        // Setup signup modal
        const closeSignupModal = document.getElementById('close-signup-modal');
        const signupModal = document.getElementById('signup-modal');
        
        if (closeSignupModal) {
            closeSignupModal.addEventListener('click', function(e) {
                e.preventDefault();
                closeSignUpModal();
            });
        }
        
        if (signupModal) {
            signupModal.addEventListener('click', function(e) {
                if (e.target === signupModal) {
                    closeSignUpModal();
                }
            });
            
            const signupForm = signupModal.querySelector('.signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(signupForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        try {
            const response = await fetch('http://localhost:8000/api/v1/omnidim/survey/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObject)
            });

            if (!response.ok) {
                const error = await response.json();
                alert(`Failed to submit form: ${error.message || 'Unknown error'}`);
                return;
            }

            const result = await response.json();
            console.log('✅ Form submitted:', result);

            alert('Account created successfully! You can now access the swipe matching feature.');
            closeSignUpModal();
            showPage('swipe-match');

        } catch (err) {
            console.error('❌ Error submitting form:', err);
            alert('Something went wrong while submitting the form. Please try again later.');
        }
    });
}

        }
        
        // Setup admin access
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const isAdmin = confirm('Login as Admin? (Cancel for regular user login)');
                if (isAdmin) {
                    AppState.isAdmin = true;
                    const adminLink = document.getElementById('admin-link');
                    if (adminLink) {
                        adminLink.style.display = 'inline-flex';
                    }
                    alert('Logged in as Admin. Admin panel is now accessible.');
                } else {
                    alert('Regular user login functionality would be implemented here.');
                }
            });
        }
        
        const adminLink = document.getElementById('admin-link');
        if (adminLink) {
            adminLink.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('admin');
            });
        }
        
        // Setup back to home button
        const backToHome = document.getElementById('back-to-home');
        if (backToHome) {
            backToHome.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('home');
            });
        }
        
        // Setup swipe buttons
        const skipBtn = document.getElementById('skip-btn');
        const matchBtn = document.getElementById('match-btn');
        
        if (skipBtn) {
            skipBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (AppState.currentCardIndex < AppState.roommateProfiles.length) {
                    handleSkip(AppState.roommateProfiles[AppState.currentCardIndex]);
                    const currentCard = document.querySelector('.roommate-card');
                    if (currentCard) {
                        removeCard(currentCard);
                    }
                }
            });
        }
        
        if (matchBtn) {
            matchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (AppState.currentCardIndex < AppState.roommateProfiles.length) {
                    handleMatch(AppState.roommateProfiles[AppState.currentCardIndex]);
                    const currentCard = document.querySelector('.roommate-card');
                    if (currentCard) {
                        removeCard(currentCard);
                    }
                }
            });
        }
        
        // Setup mobile navigation
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function(e) {
                e.preventDefault();
                navMenu.classList.toggle('active');
            });
        }
        
        // Setup room functionality
        renderRooms(AppState.allRooms);
        
        const priceFilter = document.getElementById('price-filter');
        const typeFilter = document.getElementById('type-filter');
        const locationFilter = document.getElementById('location-filter');
        const clearFilters = document.getElementById('clear-filters');
        
        if (priceFilter) priceFilter.addEventListener('change', filterRooms);
        if (typeFilter) typeFilter.addEventListener('change', filterRooms);
        if (locationFilter) locationFilter.addEventListener('change', filterRooms);
        if (clearFilters) clearFilters.addEventListener('click', clearAllFilters);
        
        // Setup other functionality
        const previewButton = document.querySelector('.rooms__cta .btn');
        if (previewButton) {
            previewButton.addEventListener('click', function(e) {
                e.preventDefault();
                alert('🏠 Loading more amazing rooms...\n\nThis would typically:\n• Load additional room listings\n• Show advanced search options\n• Display personalized recommendations\n• Allow booking tours\n\nStay tuned for more features!');
            });
        }
        
        // Close modals on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const voiceModal = document.getElementById('voice-modal');
                const signupModal = document.getElementById('signup-modal');
                const matchModal = document.getElementById('match-modal');
                
                if (voiceModal && !voiceModal.classList.contains('hidden')) {
                    closeVoiceModal();
                }
                if (signupModal && !signupModal.classList.contains('hidden')) {
                    closeSignUpModal();
                }
                if (matchModal && !matchModal.classList.contains('hidden')) {
                    matchModal.classList.add('hidden');
                }
            }
        });
        
        // Initialize default page
        showPage('home');
        
        console.log('✨ Living Spaces Enhanced App Ready!');
        
    } catch (error) {
        console.error('❌ Error initializing app:', error);
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (speechSynthesis && speechSynthesis.speaking) {
            speechSynthesis.pause();
        }
    } else {
        if (speechSynthesis && speechSynthesis.paused) {
            speechSynthesis.resume();
        }
    }
});