import pytest
from app import create_app, db

@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_root_endpoint(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b'AI-Powered Roommate Matching Backend is running' in response.data

def test_create_user(client):
    user_data = {
        'name': 'Test User',
        'email': 'test@example.com',
        'cleanliness': 0.8,
        'sleep_schedule': 0.6,
        'work_hours': 0.5,
        'social_level': 0.7,
        'noise_tolerance': 0.4
    }
    response = client.post('/api/v1/users/', json=user_data)
    assert response.status_code == 201
    data = response.get_json()
    assert data['name'] == 'Test User'
    assert data['email'] == 'test@example.com'
