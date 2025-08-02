from flask import Blueprint, request, jsonify, current_app
from app.crud import room as room_crud

rooms_bp = Blueprint('rooms', __name__)

@rooms_bp.route('/', methods=['POST'])
def create_room():
    """Create a new room."""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        room = room_crud.create_room(data)
        return jsonify(room.to_dict()), 201

    except Exception as e:
        current_app.logger.error(f"Error creating room: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@rooms_bp.route('/', methods=['GET'])
def get_rooms():
    """Get all rooms with pagination."""
    try:
        skip = request.args.get('skip', 0, type=int)
        limit = request.args.get('limit', 100, type=int)

        rooms = room_crud.get_all_rooms(skip=skip, limit=limit)
        return jsonify([room.to_dict() for room in rooms]), 200

    except Exception as e:
        current_app.logger.error(f"Error getting rooms: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@rooms_bp.route('/<int:room_id>', methods=['GET'])
def get_room(room_id):
    """Get a specific room by ID."""
    try:
        room = room_crud.get_room(room_id)
        if not room:
            return jsonify({'error': 'Room not found'}), 404

        return jsonify(room.to_dict()), 200

    except Exception as e:
        current_app.logger.error(f"Error getting room {room_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@rooms_bp.route('/<int:room_id>', methods=['PUT'])
def update_room(room_id):
    """Update a room."""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        room = room_crud.update_room(room_id, data)
        if not room:
            return jsonify({'error': 'Room not found'}), 404

        return jsonify(room.to_dict()), 200

    except Exception as e:
        current_app.logger.error(f"Error updating room {room_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@rooms_bp.route('/<int:room_id>', methods=['DELETE'])
def delete_room(room_id):
    """Delete a room."""
    try:
        success = room_crud.delete_room(room_id)
        if not success:
            return jsonify({'error': 'Room not found'}), 404

        return jsonify({'message': 'Room deleted successfully'}), 200

    except Exception as e:
        current_app.logger.error(f"Error deleting room {room_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@rooms_bp.route('/available', methods=['GET'])
def get_available_rooms():
    """Get available twin rooms."""
    try:
        rooms = room_crud.get_available_twin_rooms()
        return jsonify([room.to_dict() for room in rooms]), 200

    except Exception as e:
        current_app.logger.error(f"Error getting available rooms: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
