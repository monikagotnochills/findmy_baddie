import requests
import json
import hmac
import hashlib
from flask import current_app

class OmnidimIntegration:
    def __init__(self):
        self.api_key = None
        self.base_url = None
        self.webhook_secret = None

    def init_app(self, app):
        self.api_key = app.config.get('OMNIDIM_API_KEY')
        self.base_url = app.config.get('OMNIDIM_BASE_URL', 'https://api.omnidim.io')
        self.webhook_secret = app.config.get('OMNIDIM_WEBHOOK_SECRET')

    def create_survey_session(self, user_id: int, survey_config: dict) -> str:
        """Create a new survey session with Omnidim."""
        if not self.api_key:
            current_app.logger.warning("Omnidim API key not configured")
            return None

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "user_id": str(user_id),
            "survey_config": survey_config,
            "webhook_url": f"{current_app.config['HOST']}/api/v1/omnidim/webhook"
        }

        try:
            response = requests.post(
                f"{self.base_url}/survey/create",
                headers=headers,
                json=payload,
                timeout=30.0
            )

            if response.status_code == 200:
                data = response.json()
                return data.get("session_id")
            else:
                current_app.logger.error(f"Failed to create Omnidim session: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            current_app.logger.error(f"Error creating Omnidim session: {str(e)}")
            return None

    def verify_webhook_signature(self, payload: str, signature: str) -> bool:
        """Verify the webhook signature from Omnidim."""
        if not self.webhook_secret:
            current_app.logger.warning("Webhook secret not configured - skipping verification")
            return True

        expected_signature = hmac.new(
            self.webhook_secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(f"sha256={expected_signature}", signature)

    def process_webhook_payload(self, payload: dict) -> dict:
        """Process the webhook payload from Omnidim and extract compatibility scores."""
        from app.core.matching_algorithm import matching_algorithm

        # Extract responses from the payload
        responses = payload.get('responses', {})

        # Use the matching algorithm to process responses
        scores = matching_algorithm.process_survey_responses(responses)

        # Apply confidence scores if available
        confidence_scores = payload.get('confidence_scores', {})
        if confidence_scores:
            for trait, confidence in confidence_scores.items():
                if trait in scores and confidence < 0.7:  # Low confidence threshold
                    # Adjust score towards neutral if confidence is low
                    scores[trait] = scores[trait] * confidence + 0.5 * (1 - confidence)

        current_app.logger.info(f"Processed Omnidim responses for session {payload.get('session_id')}: {scores}")
        return scores

    def get_default_survey_config(self) -> dict:
        """Get the default survey configuration for roommate matching."""

        questions = [
            {
                "id": "cleanliness",
                "type": "rating",
                "question": "On a scale of 1 to 5, how important is cleanliness to you in your living space?",
                "options": ["1 - Not important", "2 - Slightly important", "3 - Moderately important", 
                          "4 - Very important", "5 - Extremely important"],
                "follow_up": "Can you tell me more about your cleaning habits?"
            },
            {
                "id": "sleep_schedule",
                "type": "choice",
                "question": "Would you describe yourself as an early bird or a night owl?",
                "options": ["Early bird - I go to bed early and wake up early", 
                          "Night owl - I stay up late and wake up later",
                          "Somewhere in between - I'm flexible with my schedule"],
                "follow_up": "What time do you usually go to bed and wake up?"
            },
            {
                "id": "work_hours",
                "type": "open",
                "question": "Can you tell me about your typical work or study schedule?",
                "hints": ["Do you work regular 9-5 hours?", "Do you have a flexible schedule?", 
                         "Do you work shifts or irregular hours?"]
            },
            {
                "id": "social",
                "type": "choice",
                "question": "How would you describe your social preferences?",
                "options": ["I'm quite introverted and prefer quiet time at home",
                          "I'm somewhat social but also enjoy alone time",
                          "I'm very social and love having people over"],
                "follow_up": "How do you feel about having guests or hosting social gatherings?"
            },
            {
                "id": "noise",
                "type": "choice",
                "question": "How sensitive are you to noise when you're trying to sleep or concentrate?",
                "options": ["Very sensitive - I need complete quiet",
                          "Somewhat sensitive - I can handle some noise",
                          "Not sensitive - Noise doesn't bother me much"],
                "follow_up": "Are there any specific sounds that particularly bother you?"
            }
        ]

        return {
            "questions": questions,
            "max_duration": 300,  # 5 minutes
            "language": "en",
            "voice_settings": {
                "voice_type": "friendly_female",
                "speed": "normal",
                "tone": "conversational"
            }
        }

    def get_session_status(self, session_id: str) -> dict:
        """Get the status of an Omnidim survey session."""
        if not self.api_key:
            return None

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.get(
                f"{self.base_url}/survey/{session_id}/status",
                headers=headers,
                timeout=30.0
            )

            if response.status_code == 200:
                return response.json()
            else:
                current_app.logger.error(f"Failed to get session status: {response.status_code}")
                return None

        except Exception as e:
            current_app.logger.error(f"Error getting session status: {str(e)}")
            return None

# Global instance
omnidim_integration = OmnidimIntegration()
