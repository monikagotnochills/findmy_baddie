import math
from typing import List, Dict, Any, Tuple, Optional

# Compatibility weights for different traits
COMPATIBILITY_WEIGHTS = {
    "cleanliness": 0.25,
    "sleep_schedule": 0.20,
    "work_hours": 0.15,
    "social_level": 0.20,
    "noise_tolerance": 0.20
}

class RoommateMatchingAlgorithm:
    def __init__(self, weights: Dict[str, float] = None):
        self.weights = weights or COMPATIBILITY_WEIGHTS

    def calculate_compatibility_score(self, user1, user2) -> float:
        """
        Calculate compatibility score between two users based on their traits.
        Returns a score between 0-100.
        """
        if not user1 or not user2:
            return 0.0

        traits = ["cleanliness", "sleep_schedule", "work_hours", "social_level", "noise_tolerance"]
        total_score = 0.0
        total_weight = 0.0

        for trait in traits:
            if trait in self.weights:
                user1_value = getattr(user1, trait, 0.5)
                user2_value = getattr(user2, trait, 0.5)

                # Calculate similarity (inverse of distance)
                distance = abs(user1_value - user2_value)
                similarity = 1 - distance

                # Weight the similarity
                weighted_score = similarity * self.weights[trait]
                total_score += weighted_score
                total_weight += self.weights[trait]

        if total_weight == 0:
            return 0.0

        # Convert to 0-100 scale
        return (total_score / total_weight) * 100

    def generate_match_explanation(self, user1, user2, score: float) -> str:
        """Generate a human-readable explanation for the match."""
        explanations = []

        # Analyze each trait
        if abs(user1.cleanliness - user2.cleanliness) < 0.3:
            explanations.append("similar cleanliness standards")

        if abs(user1.sleep_schedule - user2.sleep_schedule) < 0.3:
            if user1.sleep_schedule > 0.7:
                explanations.append("both are night owls")
            elif user1.sleep_schedule < 0.3:
                explanations.append("both are early birds")
            else:
                explanations.append("compatible sleep schedules")

        if abs(user1.work_hours - user2.work_hours) < 0.3:
            explanations.append("similar work schedules")

        if abs(user1.social_level - user2.social_level) < 0.3:
            if user1.social_level > 0.7:
                explanations.append("both enjoy social activities")
            elif user1.social_level < 0.3:
                explanations.append("both prefer quiet time")
            else:
                explanations.append("balanced social preferences")

        if abs(user1.noise_tolerance - user2.noise_tolerance) < 0.3:
            explanations.append("similar noise tolerance levels")

        if not explanations:
            explanations.append("complementary personality traits")

        base_explanation = f"Compatibility score: {score:.1f}%. "
        trait_explanation = "Matched based on: " + ", ".join(explanations[:3])

        return base_explanation + trait_explanation

    def find_suitable_room(self, user1, user2, available_rooms):
        """Find the most suitable room for two matched users."""
        if not available_rooms:
            return None

        # Score rooms based on preferences
        room_scores = []

        for room in available_rooms:
            score = 0

            # Floor preference matching
            if abs(room.floor - user1.preferred_floor) == 0:
                score += 2
            if abs(room.floor - user2.preferred_floor) == 0:
                score += 2

            # Window preference matching
            if user1.window_preference == "window" and room.has_window:
                score += 1
            elif user1.window_preference == "no_window" and not room.has_window:
                score += 1

            if user2.window_preference == "window" and room.has_window:
                score += 1
            elif user2.window_preference == "no_window" and not room.has_window:
                score += 1

            # Quiet area preference (inferred from noise tolerance)
            if user1.noise_tolerance < 0.4 and user2.noise_tolerance < 0.4 and room.is_quiet_area:
                score += 2

            room_scores.append((room, score))

        # Sort by score and return the best match
        room_scores.sort(key=lambda x: x[1], reverse=True)
        return room_scores[0][0] if room_scores else available_rooms[0]

    def find_matches(self, target_user, potential_matches, max_candidates: int = 10, min_score: float = 60.0):
        """Find potential roommate matches for a given user."""

        if not potential_matches:
            return []

        # Calculate compatibility scores
        candidates = []

        for candidate in potential_matches:
            score = self.calculate_compatibility_score(target_user, candidate)

            if score >= min_score:
                explanation = self.generate_match_explanation(target_user, candidate, score)

                candidates.append({
                    'user': candidate,
                    'compatibility_score': score,
                    'explanation': explanation
                })

        # Sort by compatibility score (descending)
        candidates.sort(key=lambda x: x['compatibility_score'], reverse=True)

        # Return top candidates
        return candidates[:max_candidates]

    def process_survey_responses(self, responses: Dict[str, str]) -> Dict[str, float]:
        """
        Convert survey responses to normalized compatibility scores.
        """
        scores = {}

        # Cleanliness (scale of 1-5, where 5 is very clean)
        if "cleanliness" in responses:
            try:
                raw_score = float(responses["cleanliness"])
                scores["cleanliness"] = (raw_score - 1) / 4  # Normalize to 0-1
            except (ValueError, TypeError):
                scores["cleanliness"] = 0.5

        # Sleep schedule (early bird = 0, night owl = 1)
        if "sleep_schedule" in responses:
            response = responses["sleep_schedule"].lower()
            if "early" in response or "morning" in response:
                scores["sleep_schedule"] = 0.2
            elif "night" in response or "late" in response:
                scores["sleep_schedule"] = 0.8
            else:
                scores["sleep_schedule"] = 0.5

        # Work hours (regular hours = 0.5, flexible/irregular = varies)
        if "work_hours" in responses:
            response = responses["work_hours"].lower()
            if "9" in response and "5" in response:
                scores["work_hours"] = 0.5
            elif "flexible" in response:
                scores["work_hours"] = 0.7
            elif "shift" in response:
                scores["work_hours"] = 0.3
            else:
                scores["work_hours"] = 0.5

        # Social level (introvert = 0, extrovert = 1)
        if "social" in responses:
            response = responses["social"].lower()
            if "introvert" in response or "quiet" in response:
                scores["social_level"] = 0.3
            elif "extrovert" in response or "social" in response:
                scores["social_level"] = 0.7
            else:
                scores["social_level"] = 0.5

        # Noise tolerance (sensitive = 0, tolerant = 1)
        if "noise" in responses:
            response = responses["noise"].lower()
            if "sensitive" in response or "quiet" in response:
                scores["noise_tolerance"] = 0.2
            elif "tolerant" in response or "don't mind" in response:
                scores["noise_tolerance"] = 0.8
            else:
                scores["noise_tolerance"] = 0.5

        # Fill in any missing scores with defaults
        default_traits = ["cleanliness", "sleep_schedule", "work_hours", "social_level", "noise_tolerance"]
        for trait in default_traits:
            if trait not in scores:
                scores[trait] = 0.5

        return scores

# Global instance
matching_algorithm = RoommateMatchingAlgorithm()
