from flask import Blueprint, request, jsonify, current_app
from app.crud import user as user_crud
from app.models.user import User

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['POST'])
def create_user():
    """Create a new user profile."""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Check if user with email already exists
        if 'email' in data:
            existing_user = user_crud.get_user_by_email(data['email'])
            if existing_user:
                return jsonify({'error': 'User with this email already exists'}), 400

        user = user_crud.create_user(data)
        return jsonify(user.to_dict()), 201

    except Exception as e:
        current_app.logger.error(f"Error creating user: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@users_bp.route('/', methods=['GET'])
def get_users():
    """Get all users with pagination."""
    try:
        skip = request.args.get('skip', 0, type=int)
        limit = request.args.get('limit', 100, type=int)

        users = user_crud.get_all_users(skip=skip, limit=limit)
        return jsonify([user.to_dict() for user in users]), 200

    except Exception as e:
        current_app.logger.error(f"Error getting users: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a specific user by ID."""
    try:
        user = user_crud.get_user(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify(user.to_dict()), 200

    except Exception as e:
        current_app.logger.error(f"Error getting user {user_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@users_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update a user profile."""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        user = user_crud.update_user(user_id, data)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify(user.to_dict()), 200

    except Exception as e:
        current_app.logger.error(f"Error updating user {user_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@users_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user."""
    try:
        success = user_crud.delete_user(user_id)
        if not success:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'message': 'User deleted successfully'}), 200

    except Exception as e:
        current_app.logger.error(f"Error deleting user {user_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
