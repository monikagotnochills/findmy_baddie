from app import db
from datetime import datetime

class Match(db.Model):
    __tablename__ = 'matches'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    matched_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    compatibility_score = db.Column(db.Float, nullable=False)
    match_explanation = db.Column(db.Text, nullable=True)
    suggested_room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=True)

    # Status
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending, accepted, rejected

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], backref='sent_matches')
    matched_user = db.relationship('User', foreign_keys=[matched_user_id], backref='received_matches')
    suggested_room = db.relationship('Room', backref='matches')

    def __repr__(self):
        return f'<Match {self.user_id}-{self.matched_user_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'matched_user_id': self.matched_user_id,
            'compatibility_score': self.compatibility_score,
            'match_explanation': self.match_explanation,
            'suggested_room_id': self.suggested_room_id,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Survey(db.Model):
    __tablename__ = 'surveys'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Survey responses (raw data from Omnidim or web form)
    cleanliness_response = db.Column(db.Text, nullable=True)
    sleep_schedule_response = db.Column(db.Text, nullable=True)
    work_hours_response = db.Column(db.Text, nullable=True)
    social_response = db.Column(db.Text, nullable=True)
    noise_response = db.Column(db.Text, nullable=True)

    # Processed scores
    processed_scores = db.Column(db.Text, nullable=True)  # JSON string

    # Metadata
    source = db.Column(db.String(20), default='web', nullable=False)  # web, omnidim
    omnidim_session_id = db.Column(db.String(255), nullable=True)

    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    user = db.relationship('User', backref='surveys')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'cleanliness_response': self.cleanliness_response,
            'sleep_schedule_response': self.sleep_schedule_response,
            'work_hours_response': self.work_hours_response,
            'social_response': self.social_response,
            'noise_response': self.noise_response,
            'processed_scores': self.processed_scores,
            'source': self.source,
            'omnidim_session_id': self.omnidim_session_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }
