"""OpenAI embedding service for semantic matching."""
from openai import OpenAI
from app.config import get_settings

settings = get_settings()


def get_embedding(text: str) -> list[float] | None:
    """Get OpenAI embedding for text. Returns None if API key not configured."""
    if not settings.OPENAI_API_KEY:
        return None
    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text,
        )
        return response.data[0].embedding
    except Exception:
        return None


def build_talent_text(profile) -> str:
    """Build text representation of talent profile for embedding."""
    skills = ", ".join(s.name for s in profile.skills) if profile.skills else ""
    parts = [
        f"Skills: {skills}",
        f"Degree: {profile.degree or 'N/A'}",
        f"Institution: {profile.institution or 'N/A'}",
        f"Engagement: {profile.engagement_preference}",
    ]
    return ". ".join(parts)


def build_requirement_text(req) -> str:
    """Build text representation of talent requirement for embedding."""
    skills = ", ".join(req.required_skills) if req.required_skills else ""
    nice = ", ".join(req.nice_to_have_skills) if req.nice_to_have_skills else ""
    parts = [
        f"Role: {req.title}",
        f"Required skills: {skills}",
        f"Nice to have: {nice}",
        f"Description: {req.description or 'N/A'}",
        f"Engagement: {req.engagement_type}",
    ]
    return ". ".join(parts)


def build_startup_text(startup) -> str:
    """Build text representation of startup for embedding."""
    parts = [
        f"Name: {startup.name}",
        f"Industry: {startup.industry}",
        f"Stage: {startup.stage}",
        f"Description: {startup.description or 'N/A'}",
        f"Traction: {startup.traction_summary or 'N/A'}",
    ]
    return ". ".join(parts)


def build_investor_text(profile) -> str:
    """Build text representation of investor profile for embedding."""
    sectors = ", ".join(profile.preferred_sectors) if profile.preferred_sectors else ""
    stages = ", ".join(profile.preferred_stages) if profile.preferred_stages else ""
    parts = [
        f"Thesis: {profile.investment_thesis or 'N/A'}",
        f"Sectors: {sectors}",
        f"Stages: {stages}",
        f"Type: {profile.investor_type}",
    ]
    return ". ".join(parts)
