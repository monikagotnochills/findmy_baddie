# AI-Powered Roommate Matching Backend - Flask Version

This backend system provides API endpoints, database models, and matchmaking logic for an AI-powered roommate matching application, built with Flask and designed for women's co-living spaces. It includes optional integration with Omnidim.io's voice assistant.

## Features

- **Flask-based RESTful API** with JSON responses
- **SQLAlchemy ORM models** with SQLite (development) / PostgreSQL (production)
- **Sophisticated roommate matching algorithm** with compatibility scores
- **Room allocation logic** considering user preferences and room availability
- **Admin dashboard endpoints** for monitoring system metrics
- **Omnidim.io integration hooks** (survey session creation, webhook processing)
- **Modular project structure** with clear separation of concerns
- **No Pydantic dependencies** - pure Flask with marshmallow for serialization
- **Voice survey integration** with 5 micro-survey questions

## Project Structure

```
roommate_matching_backend_flask/
├── app/
│   ├── __init__.py              # Flask app factory
│   ├── models/
│   │   ├── user.py              # User model
│   │   ├── room.py              # Room model
│   │   └── match.py             # Match and Survey models
│   ├── crud/
│   │   ├── user.py              # User CRUD operations
│   │   ├── room.py              # Room CRUD operations
│   │   └── match.py             # Match CRUD operations
│   ├── routes/
│   │   ├── users.py             # User management endpoints
│   │   ├── rooms.py             # Room management endpoints
│   │   ├── matching.py          # Matching algorithm endpoints
│   │   ├── admin.py             # Admin dashboard endpoints
│   │   └── omnidim.py           # Omnidim integration endpoints
│   ├── core/
│   │   ├── matching_algorithm.py # AI matching logic
│   │   └── omnidim_integration.py # Voice assistant integration
│   └── utils/
├── tests/
├── docs/
├── requirements.txt
├── config.py                    # Flask configuration
├── run.py                       # Application runner
├── .env.example                 # Environment variables template
└── README.md
```

## Quick Start

1. **Clone the repository**:
```bash
git clone <repo_url>
cd roommate_matching_backend_flask
```

2. **Create a virtual environment and install dependencies**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Copy `.env.example` to `.env` and configure settings**:
```bash
cp .env.example .env
# Edit .env to set your SECRET_KEY and database settings
```

4. **Run the application**:
```bash
python run.py
```

Or using Flask CLI:
```bash
export FLASK_APP=app
flask run
```

5. **Test the API** at `http://127.0.0.1:5000/`

## API Endpoints

### Users
- `POST /api/v1/users/` - Create user profile
- `GET /api/v1/users/` - List all users
- `GET /api/v1/users/<id>` - Get specific user
- `PUT /api/v1/users/<id>` - Update user profile
- `DELETE /api/v1/users/<id>` - Delete user

### Rooms
- `POST /api/v1/rooms/` - Create room
- `GET /api/v1/rooms/` - List all rooms
- `GET /api/v1/rooms/<id>` - Get specific room
- `PUT /api/v1/rooms/<id>` - Update room
- `DELETE /api/v1/rooms/<id>` - Delete room
- `GET /api/v1/rooms/available` - Get available twin rooms

### Matching
- `POST /api/v1/matching/find_matches` - Find compatible roommates
- `POST /api/v1/matching/create_match` - Create a match between users
- `GET /api/v1/matching/` - List all matches
- `PUT /api/v1/matching/<id>/status` - Update match status

### Admin
- `GET /api/v1/admin/dashboard` - Get dashboard statistics
- `GET /api/v1/admin/users` - Get all users (admin view)
- `GET /api/v1/admin/matches` - Get all matches (admin view)
- `GET /api/v1/admin/rooms` - Get all rooms (admin view)

### Omnidim Integration
- `POST /api/v1/omnidim/webhook` - Receive Omnidim webhooks
- `GET /api/v1/omnidim/survey/questions` - Get survey questions
- `POST /api/v1/omnidim/survey/submit` - Submit survey responses
- `GET /api/v1/omnidim/config` - Get Omnidim configuration

## Omnidim.io Integration

1. Set up your Omnidim credentials in `.env`
2. Configure webhook URL to point to `/api/v1/omnidim/webhook`
3. Use the survey configuration from `/api/v1/omnidim/config`

## Database Models

### User
- Personal information (name, email, phone, age)
- Compatibility traits (cleanliness, sleep_schedule, work_hours, social_level, noise_tolerance)
- Room preferences (prefers_twin, preferred_floor, window_preference)
- Status flags (is_active, is_looking_for_roommate)

### Room
- Room details (room_number, floor, room_type, has_window, is_quiet_area)
- Occupancy (max_occupancy, current_occupancy)
- Availability status

### Match
- User pairing (user_id, matched_user_id)
- Compatibility metrics (compatibility_score, match_explanation)
- Room assignment (suggested_room_id)
- Status (pending, accepted, rejected)

## Matching Algorithm

The system uses a weighted compatibility scoring algorithm that evaluates:
- **Cleanliness standards** (25% weight)
- **Sleep schedules** (20% weight)
- **Work hours** (15% weight)
- **Social preferences** (20% weight)
- **Noise tolerance** (20% weight)

Scores are calculated on a 0-100 scale with explanations for transparency.

## Development

### Running Tests
```bash
python -m pytest tests/
```

### Environment Variables
See `.env.example` for all available configuration options.

### Database Migrations
The application automatically creates tables on startup. For production, consider using Flask-Migrate for schema changes.

## Deployment

### Using Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app()"
```

### Docker
Create a Dockerfile:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:create_app()"]
```

## Key Differences from FastAPI Version

- **No Pydantic**: Uses native Python types and marshmallow for serialization
- **No Dependency Injection**: Uses Flask's request context and direct imports
- **Blueprint-based routing**: Instead of FastAPI routers
- **Flask-SQLAlchemy**: Instead of pure SQLAlchemy with async support
- **Request/Response handling**: Uses Flask's request object and jsonify
- **Error handling**: Uses Flask's error handling patterns

## License

MIT License
