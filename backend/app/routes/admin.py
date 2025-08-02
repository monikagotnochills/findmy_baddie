from flask import Blueprint, jsonify, current_app
from app.crud import user as user_crud, room as room_crud, match as match_crud
from app.models.user import User
from app.models.room import Room
from app.models.match import Match

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """Get admin dashboard statistics."""
    try:
        # Get user statistics
        total_users = User.query.count()
        active_users = User.query.filter_by(is_active=True).count()

        # Get room statistics
        total_rooms = Room.query.count()
        available_rooms = Room.query.filter_by(is_available=True).count()

        # Get match statistics
        total_matches = Match.query.count()
        successful_matches = Match.query.filter_by(status='accepted').count()
        pending_matches = Match.query.filter_by(status='pending').count()

        dashboard_data = {
            'total_users': total_users,
            'active_users': active_users,
            'total_rooms': total_rooms,
            'available_rooms': available_rooms,
            'total_matches': total_matches,
            'successful_matches': successful_matches,
            'pending_matches': pending_matches,
            'match_success_rate': (successful_matches / total_matches * 100) if total_matches > 0 else 0
        }

        return jsonify(dashboard_data), 200

    except Exception as e:
        current_app.logger.error(f"Error getting dashboard: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@admin_bp.route('/users', methods=['GET'])
def admin_get_users():
    """Get all users for admin view."""
    try:
        users = user_crud.get_all_users()
        return jsonify([user.to_dict() for user in users]), 200

    except Exception as e:
        current_app.logger.error(f"Error getting users for admin: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@admin_bp.route('/matches', methods=['GET'])
def admin_get_matches():
    """Get all matches for admin view."""
    try:
        matches = match_crud.get_all_matches()
        return jsonify([match.to_dict() for match in matches]), 200

    except Exception as e:
        current_app.logger.error(f"Error getting matches for admin: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@admin_bp.route('/rooms', methods=['GET'])
def admin_get_rooms():
    """Get all rooms for admin view."""
    try:
        rooms = room_crud.get_all_rooms()
        return jsonify([room.to_dict() for room in rooms]), 200

    except Exception as e:
        current_app.logger.error(f"Error getting rooms for admin: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
