from app import db
from datetime import datetime

class Room(db.Model):
    __tablename__ = 'rooms'

    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    floor = db.Column(db.Integer, nullable=False)
    room_type = db.Column(db.String(20), nullable=False)  # twin, single
    has_window = db.Column(db.Boolean, default=True, nullable=False)
    is_quiet_area = db.Column(db.Boolean, default=False, nullable=False)
    max_occupancy = db.Column(db.Integer, default=2, nullable=False)
    current_occupancy = db.Column(db.Integer, default=0, nullable=False)
    amenities = db.Column(db.Text, nullable=True)  # JSON string of amenities

    # Status
    is_available = db.Column(db.Boolean, default=True, nullable=False)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Room {self.room_number}>'

    def to_dict(self):
        return {
            'id': self.id,
            'room_number': self.room_number,
            'floor': self.floor,
            'room_type': self.room_type,
            'has_window': self.has_window,
            'is_quiet_area': self.is_quiet_area,
            'max_occupancy': self.max_occupancy,
            'current_occupancy': self.current_occupancy,
            'amenities': self.amenities,
            'is_available': self.is_available,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
