from app import db
from app.models.match import Match, Survey
from typing import List, Optional

def create_match(match_data: dict) -> Match:
    """Create a new match."""
    match = Match(**match_data)
    db.session.add(match)
    db.session.commit()
    return match

def get_match(match_id: int) -> Optional[Match]:
    """Get match by ID."""
    return Match.query.get(match_id)

def get_all_matches(skip: int = 0, limit: int = 100) -> List[Match]:
    """Get all matches with pagination."""
    return Match.query.offset(skip).limit(limit).all()

def get_matches_for_user(user_id: int) -> List[Match]:
    """Get all matches for a specific user."""
    return Match.query.filter(
        (Match.user_id == user_id) | (Match.matched_user_id == user_id)
    ).all()

def update_match_status(match_id: int, status: str) -> Optional[Match]:
    """Update match status."""
    match = Match.query.get(match_id)
    if not match:
        return None

    match.status = status
    db.session.commit()
    return match

def create_survey(survey_data: dict) -> Survey:
    """Create a new survey."""
    survey = Survey(**survey_data)
    db.session.add(survey)
    db.session.commit()
    return survey

def get_survey_by_session_id(session_id: str) -> Optional[Survey]:
    """Get survey by Omnidim session ID."""
    return Survey.query.filter_by(omnidim_session_id=session_id).first()

def complete_survey(survey_id: int, processed_scores: str) -> Optional[Survey]:
    """Mark survey as completed and update processed scores."""
    from datetime import datetime

    survey = Survey.query.get(survey_id)
    if not survey:
        return None

    survey.processed_scores = processed_scores
    survey.completed_at = datetime.utcnow()
    db.session.commit()
    return survey
