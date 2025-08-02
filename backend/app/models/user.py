from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, index=True)
    email = db.Column(db.String(255), unique=True, index=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    age = db.Column(db.Integer, nullable=True)

    # Compatibility traits (0-1 normalized values)
    cleanliness = db.Column(db.Float, default=0.5, nullable=False)
    sleep_schedule = db.Column(db.Float, default=0.5, nullable=False)
    work_hours = db.Column(db.Float, default=0.5, nullable=False)
    social_level = db.Column(db.Float, default=0.5, nullable=False)
    noise_tolerance = db.Column(db.Float, default=0.5, nullable=False)

    # Room preferences
    prefers_twin = db.Column(db.Boolean, default=True, nullable=False)
    preferred_floor = db.Column(db.Integer, default=1, nullable=False)
    window_preference = db.Column(db.String(20), default='any', nullable=False)

    # Status
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    is_looking_for_roommate = db.Column(db.Boolean, default=True, nullable=False)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'age': self.age,
            'cleanliness': self.cleanliness,
            'sleep_schedule': self.sleep_schedule,
            'work_hours': self.work_hours,
            'social_level': self.social_level,
            'noise_tolerance': self.noise_tolerance,
            'prefers_twin': self.prefers_twin,
            'preferred_floor': self.preferred_floor,
            'window_preference': self.window_preference,
            'is_active': self.is_active,
            'is_looking_for_roommate': self.is_looking_for_roommate,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
