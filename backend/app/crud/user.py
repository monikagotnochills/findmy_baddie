from app import db
from app.models.user import User
from typing import List, Optional

def create_user(user_data: dict) -> User:
    """Create a new user."""
    user = User(**user_data)
    db.session.add(user)
    db.session.commit()
    return user

def get_user(user_id: int) -> Optional[User]:
    """Get user by ID."""
    return User.query.get(user_id)

def get_user_by_email(email: str) -> Optional[User]:
    """Get user by email."""
    return User.query.filter_by(email=email).first()

def get_all_users(skip: int = 0, limit: int = 100) -> List[User]:
    """Get all users with pagination."""
    return User.query.offset(skip).limit(limit).all()

def update_user(user_id: int, user_data: dict) -> Optional[User]:
    """Update user by ID."""
    user = User.query.get(user_id)
    if not user:
        return None

    for key, value in user_data.items():
        if hasattr(user, key):
            setattr(user, key, value)

    db.session.commit()
    return user

def delete_user(user_id: int) -> bool:
    """Delete user by ID."""
    user = User.query.get(user_id)
    if not user:
        return False

    db.session.delete(user)
    db.session.commit()
    return True

def get_users_looking_for_roommate(exclude_user_id: int = None) -> List[User]:
    """Get users who are looking for roommates."""
    query = User.query.filter_by(is_active=True, is_looking_for_roommate=True)
    if exclude_user_id:
        query = query.filter(User.id != exclude_user_id)
    return query.all()
