from flask import Blueprint, request, jsonify, current_app
from app.core.omnidim_integration import omnidim_integration
from app.crud import user as user_crud, match as match_crud
from app.core.matching_algorithm import matching_algorithm
import json
from flask_cors import CORS

omnidim_bp = Blueprint('omnidim', __name__)
CORS(omnidim_bp)

@omnidim_bp.route('/webhook', methods=['POST'])
def omnidim_webhook():
    """Handle webhook from Omnidim voice assistant."""
    try:
        # Verify webhook signature
        signature = request.headers.get('X-Signature', '')
        payload_str = request.get_data(as_text=True)

        if not omnidim_integration.verify_webhook_signature(payload_str, signature):
            return jsonify({'error': 'Invalid signature'}), 401

        # Parse payload
        payload = request.get_json()
        if not payload:
            return jsonify({'error': 'No payload provided'}), 400

        # Process voice responses to compatibility scores
        scores = omnidim_integration.process_webhook_payload(payload)

        # Get user ID from payload
        user_id = payload.get('user_data', {}).get('user_id')
        if not user_id:
            return jsonify({'error': 'user_id not found in payload'}), 400

        try:
            user_id = int(user_id)
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid user_id format'}), 400

        # Update user profile with processed scores
        user = user_crud.get_user(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Update user traits
        update_data = {}
        for trait, value in scores.items():
            if hasattr(user, trait):
                update_data[trait] = value

        if update_data:
            user_crud.update_user(user_id, update_data)

        # Create or update survey record
        session_id = payload.get('session_id')
        if session_id:
            survey_data = {
                'user_id': user_id,
                'cleanliness_response': payload.get('responses', {}).get('cleanliness'),
                'sleep_schedule_response': payload.get('responses', {}).get('sleep_schedule'),
                'work_hours_response': payload.get('responses', {}).get('work_hours'),
                'social_response': payload.get('responses', {}).get('social'),
                'noise_response': payload.get('responses', {}).get('noise'),
                'processed_scores': json.dumps(scores),
                'source': 'omnidim',
                'omnidim_session_id': session_id
            }

            existing_survey = match_crud.get_survey_by_session_id(session_id)
            if existing_survey:
                match_crud.complete_survey(existing_survey.id, json.dumps(scores))
            else:
                match_crud.create_survey(survey_data)

        return jsonify({'status': 'success', 'processed_scores': scores}), 200

    except Exception as e:
        current_app.logger.error(f"Error processing Omnidim webhook: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@omnidim_bp.route('/survey/questions', methods=['GET'])
def get_survey_questions():
    """Get the default survey questions."""
    try:
        questions = [
            "On a scale of 0-1, how tidy are you? (cleanliness)",
            "On a scale of 0-1, where 0 is early bird and 1 is night owl, what is your sleep preference? (sleep_schedule)",
            "On a scale of 0-1, where 0 is day job and 1 is night shift, what are your work hours? (work_hours)",
            "On a scale of 0-1, where 0 is introvert and 1 is extrovert, how social are you? (social)",
            "On a scale of 0-1, where 0 is quiet and 1 is loud, how noisy are you? (noise)"
        ]

        return jsonify({'questions': questions}), 200

    except Exception as e:
        current_app.logger.error(f"Error getting survey questions: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@omnidim_bp.route('/survey/submit', methods=['POST'])
def submit_survey():
    """Submit survey answers and create user profile."""
    try:
        data = request.get_json()

        testdata = {
            "cleanliness": "5",
            "sleep_schedule": "Night owl",
            "work_hours": "Flexible schedule",
            "social": "Extrovert and outgoing",
            "noise": "Don't mind noise"
        }

        newdataset = {
            "responses": testdata,
            "user_data": data
        }

        if not newdataset:
            return jsonify({'error': 'No data provided'}), 400

        # Check if this is from manual survey or processed voice data
        if 'responses' in newdataset:
            # Process survey responses using the matching algorithm
            responses = newdataset['responses']
            scores = matching_algorithm.process_survey_responses(responses)

            # Create user newdataset with processed scores
            user_data = newdataset.get('user_data', {})
            user_data.update(scores)
        else:
            # Direct user data (already processed)
            user_data = newdataset

        # Create user
        user = user_crud.create_user(user_data)

        return jsonify(user.to_dict()), 200

    except Exception as e:
        current_app.logger.error(f"Error submitting survey: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@omnidim_bp.route('/config', methods=['GET'])
def get_omnidim_config():
    """Get Omnidim survey configuration."""
    try:
        config = omnidim_integration.get_default_survey_config()
        return jsonify(config), 200

    except Exception as e:
        current_app.logger.error(f"Error getting Omnidim config: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500
