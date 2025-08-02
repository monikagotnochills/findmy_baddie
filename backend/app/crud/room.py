from app import db
from app.models.room import Room
from typing import List, Optional

def create_room(room_data: dict) -> Room:
    """Create a new room."""
    room = Room(**room_data)
    db.session.add(room)
    db.session.commit()
    return room

def get_room(room_id: int) -> Optional[Room]:
    """Get room by ID."""
    return Room.query.get(room_id)

def get_all_rooms(skip: int = 0, limit: int = 100) -> List[Room]:
    """Get all rooms with pagination."""
    return Room.query.offset(skip).limit(limit).all()

def get_available_twin_rooms() -> List[Room]:
    """Get available twin rooms."""
    return Room.query.filter_by(
        is_available=True,
        room_type='twin'
    ).filter(Room.current_occupancy < Room.max_occupancy).all()

def update_room(room_id: int, room_data: dict) -> Optional[Room]:
    """Update room by ID."""
    room = Room.query.get(room_id)
    if not room:
        return None

    for key, value in room_data.items():
        if hasattr(room, key):
            setattr(room, key, value)

    db.session.commit()
    return room

def delete_room(room_id: int) -> bool:
    """Delete room by ID."""
    room = Room.query.get(room_id)
    if not room:
        return False

    db.session.delete(room)
    db.session.commit()
    return True
