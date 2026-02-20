"""AI Pitch Co-Pilot and Team Gap Analysis services."""
import json
from openai import OpenAI
from app.config import get_settings

settings = get_settings()


def analyze_pitch(pitch_text: str) -> dict:
    """Analyze pitch text and return structured feedback."""
    if not settings.OPENAI_API_KEY:
        return _mock_pitch_feedback()

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an experienced startup investor evaluating a pitch from a Nepali startup. "
                    "Analyze the pitch and return a JSON object with these fields:\n"
                    "- overall_score (1-100)\n"
                    "- market_size: {score: 1-10, feedback: string}\n"
                    "- traction: {score: 1-10, feedback: string}\n"
                    "- team: {score: 1-10, feedback: string}\n"
                    "- defensibility: {score: 1-10, feedback: string}\n"
                    "- summary: string (2-3 sentences)\n"
                    "- suggestions: [string] (3-5 actionable suggestions)\n"
                    "Return ONLY valid JSON, no markdown."
                ),
            },
            {"role": "user", "content": pitch_text},
        ],
        temperature=0.7,
    )
    try:
        return json.loads(response.choices[0].message.content)
    except (json.JSONDecodeError, IndexError):
        return _mock_pitch_feedback()


def analyze_team_gaps(startup_data: dict) -> dict:
    """Analyze startup team and identify gaps affecting investor readiness."""
    if not settings.OPENAI_API_KEY:
        return _mock_team_gaps()

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a startup team advisor. Analyze the startup profile and identify "
                    "missing team roles that would improve investor readiness. Return JSON:\n"
                    "- missing_roles: [{role: string, importance: 'critical'|'important'|'nice_to_have', "
                    "reason: string}]\n"
                    "- investor_readiness_score: 1-100\n"
                    "- summary: string\n"
                    "Return ONLY valid JSON."
                ),
            },
            {"role": "user", "content": json.dumps(startup_data)},
        ],
        temperature=0.7,
    )
    try:
        return json.loads(response.choices[0].message.content)
    except (json.JSONDecodeError, IndexError):
        return _mock_team_gaps()


def _mock_pitch_feedback() -> dict:
    return {
        "overall_score": 65,
        "market_size": {"score": 7, "feedback": "Market opportunity is clear but needs quantification with Nepal-specific data."},
        "traction": {"score": 5, "feedback": "Early stage — consider highlighting user interviews or LOIs."},
        "team": {"score": 6, "feedback": "Core team present but missing key technical or business roles."},
        "defensibility": {"score": 5, "feedback": "Consider what makes this hard to replicate in the Nepali market."},
        "summary": "Promising concept with clear market need. Strengthen traction evidence and team composition to improve investor confidence.",
        "suggestions": [
            "Add specific TAM/SAM/SOM numbers for Nepal",
            "Include customer testimonials or LOIs",
            "Highlight any unfair advantages (network, domain expertise)",
            "Address the competitive landscape directly",
        ],
    }


def _mock_team_gaps() -> dict:
    return {
        "missing_roles": [
            {"role": "CTO", "importance": "critical", "reason": "Technical leadership needed to build and scale the product."},
            {"role": "Growth Lead", "importance": "important", "reason": "Dedicated growth function needed for user acquisition."},
        ],
        "investor_readiness_score": 55,
        "summary": "The team has strong domain expertise but lacks technical leadership and growth capabilities.",
    }
