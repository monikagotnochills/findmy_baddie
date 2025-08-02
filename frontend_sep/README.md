# Living Spaces - AI-Powered Roommate Matching

## Project Structure

This project has been separated into multiple files and components for better organization and maintainability.

### File Structure

```
living-spaces/
├── index.html              # Main landing page
├── login.html              # Authentication page (login/register)
├── dashboard.html          # User dashboard with swipe/match functionality
├── admin.html              # Admin dashboard
├── README.md               # This file
├── components/
│   ├── voice-assistant.html # Voice assistant modal component
│   └── signup-modal.html    # Signup modal component
├── css/
│   ├── style.css           # Main stylesheet
│   ├── auth.css            # Authentication page styles
│   ├── dashboard.css       # Dashboard page styles
│   └── admin.css           # Admin dashboard styles
└── js/
    ├── app.js              # Main application JavaScript
    ├── auth.js             # Authentication functionality
    ├── dashboard.js        # Dashboard/swipe functionality
    └── admin.js            # Admin dashboard functionality
```

### Pages

1. **index.html** - Main landing page with hero section, features, how it works, and rooms sections
2. **login.html** - Combined login and registration page with tabbed interface
3. **dashboard.html** - User dashboard with AI-powered roommate matching and swiping interface
4. **admin.html** - Administrative dashboard for user management, analytics, and system monitoring

### Components

- **voice-assistant.html** - Reusable voice assistant modal component
- **signup-modal.html** - Reusable signup modal component

### Stylesheets

- **style.css** - Base styles, utilities, and common components
- **auth.css** - Specific styles for authentication pages
- **dashboard.css** - Styles for the dashboard and matching interface
- **admin.css** - Styles for the admin dashboard

### JavaScript Files

- **app.js** - Main application logic, navigation, and utility functions
- **auth.js** - Authentication handling, login/register functionality
- **dashboard.js** - Dashboard functionality, swiping logic, and user interactions
- **admin.js** - Admin dashboard functionality, user management, and analytics

## Key Features

### Landing Page (index.html)
- Hero section with AI-powered voice assistant integration
- Features showcase
- How it works section
- Available rooms with filtering
- Responsive design with glass morphism effects

### Authentication (login.html)
- Tabbed interface for login and registration
- Form validation
- Social login options (Google, Facebook)
- Password visibility toggle
- Responsive design

### Dashboard (dashboard.html)
- AI-powered roommate matching
- Swipe interface (left to skip, right to match)
- Dynamic filters (budget, lifestyle, cleanliness)
- Compatibility scoring
- Touch/swipe support for mobile
- Match success modals

### Admin Dashboard (admin.html)
- User management with search and filters
- Content moderation tools
- Analytics with Chart.js integration
- Safety monitoring
- System settings
- Real-time statistics

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Modern JavaScript features
- **Chart.js** - Data visualization for admin dashboard
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Inter, Poppins)
- **Lottie** - Animations

## Setup Instructions

1. Extract all files to a web server directory
2. Ensure all files maintain the directory structure shown above
3. Open `index.html` in a web browser or serve through a local web server
4. For full functionality, serve from an HTTP server (not file://) due to CORS restrictions

## Features Implemented

### Authentication System
- Login/Register forms with validation
- Local storage for session management
- Role-based access control
- Social login placeholders

### AI Matching System
- Compatibility scoring algorithm
- Profile matching based on preferences
- Dynamic filtering system
- Swipe-based interface

### Admin Dashboard
- User management system
- Analytics and reporting
- Content moderation tools
- System settings and configuration

### Responsive Design
- Mobile-first approach
- Touch gestures for mobile swiping
- Adaptive layouts for all screen sizes
- Glass morphism design effects

## Demo Data

The application includes mock data for demonstration purposes:
- Sample user profiles with compatibility scores
- Mock room listings with filters
- Simulated admin statistics and analytics
- Placeholder API responses

## Future Enhancements

- Real backend API integration
- WebRTC for video calls
- Push notifications
- Advanced AI matching algorithms
- Real-time chat functionality
- Payment processing for premium features

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is for demonstration purposes.
