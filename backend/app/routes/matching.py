from flask import Blueprint, request, jsonify, current_app
from app.crud import user as user_crud, room as room_crud, match as match_crud
from app.core.matching_algorithm import matching_algorithm

matching_bp = Blueprint('matching', __name__)

@matching_bp.route('/find_matches', methods=['POST'])
def find_matches():
    """Find potential roommate matches for a user."""
    try:
        data = request.get_json()

        if not data or 'user_id' not in data:
            return jsonify({'error': 'user_id is required'}), 400

        user_id = data['user_id']
        max_candidates = data.get('max_candidates', 10)
        min_score = data.get('min_compatibility_score', 60.0)

        # Get the target user
        target_user = user_crud.get_user(user_id)
        if not target_user:
            return jsonify({'error': 'User not found'}), 404

        # Get potential matches
        potential_matches = user_crud.get_users_looking_for_roommate(exclude_user_id=user_id)

        if not potential_matches:
            return jsonify({
                'user_id': user_id,
                'candidates': [],
                'total_candidates': 0,
                'message': 'No potential matches found'
            }), 200

        # Find matches using the algorithm
        candidates = matching_algorithm.find_matches(
            target_user=target_user,
            potential_matches=potential_matches,
            max_candidates=max_candidates,
            min_score=min_score
        )

        # Add suggested rooms to candidates
        available_rooms = room_crud.get_available_twin_rooms()
        for candidate in candidates:
            suggested_room = matching_algorithm.find_suitable_room(
                target_user, candidate['user'], available_rooms
            )
            candidate['suggested_room'] = suggested_room.to_dict() if suggested_room else None
            candidate['user'] = candidate['user'].to_dict()  # Convert to dict for JSON serialization

        # Calculate statistics
        scores = [c['compatibility_score'] for c in candidates]
        response = {
            'user_id': user_id,
            'candidates': candidates,
            'total_candidates': len(candidates),
            'max_score': max(scores) if scores else None,
            'average_score': sum(scores) / len(scores) if scores else None
        }

        return jsonify(response), 200

    except Exception as e:
        current_app.logger.error(f"Error finding matches: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@matching_bp.route('/create_match', methods=['POST'])
def create_match():
    """Create a match between two users."""
    try:
        data = request.get_json()

        required_fields = ['user_id', 'matched_user_id', 'compatibility_score']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': f'Required fields: {required_fields}'}), 400

        # Verify both users exist
        user1 = user_crud.get_user(data['user_id'])
        user2 = user_crud.get_user(data['matched_user_id'])

        if not user1 or not user2:
            return jsonify({'error': 'One or both users not found'}), 404

        # Create the match
        match = match_crud.create_match(data)

        return jsonify(match.to_dict()), 201

    except Exception as e:
        current_app.logger.error(f"Error creating match: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@matching_bp.route('/', methods=['GET'])
def get_matches():
    """Get all matches with pagination."""
    try:
        skip = request.args.get('skip', 0, type=int)
        limit = request.args.get('limit', 100, type=int)

        matches = match_crud.get_all_matches(skip=skip, limit=limit)
        return jsonify([match.to_dict() for match in matches]), 200

    except Exception as e:
        current_app.logger.error(f"Error getting matches: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@matching_bp.route('/<int:match_id>/status', methods=['PUT'])
def update_match_status(match_id):
    """Update match status (accept/reject)."""
    try:
        data = request.get_json()

        if not data or 'status' not in data:
            return jsonify({'error': 'status is required'}), 400

        status = data['status']
        if status not in ['pending', 'accepted', 'rejected']:
            return jsonify({'error': 'Invalid status. Must be: pending, accepted, rejected'}), 400

        match = match_crud.update_match_status(match_id, status)
        if not match:
            return jsonify({'error': 'Match not found'}), 404

        return jsonify(match.to_dict()), 200

    except Exception as e:
        current_app.logger.error(f"Error updating match status: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
