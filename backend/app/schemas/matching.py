from pydantic import BaseModel
from datetime import datetime


class MatchResponse(BaseModel):
    id: int
    source_user_id: int
    target_user_id: int
    match_type: str
    overall_score: float
    skill_overlap_score: float | None = None
    semantic_score: float | None = None
    matched_skills: list[str] = []
    missing_skills: list[str] = []
    requirement_id: int | None = None
    # Enriched fields
    target_name: str | None = None
    target_role: str | None = None
    startup_name: str | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class ConnectionRequestCreate(BaseModel):
    to_user_id: int
    match_id: int | None = None
    message: str | None = None


class ConnectionRequestResponse(BaseModel):
    id: int
    from_user_id: int
    to_user_id: int
    match_id: int | None = None
    message: str | None = None
    status: str
    from_name: str | None = None
    to_name: str | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class PitchFeedbackRequest(BaseModel):
    pitch_text: str


class PitchFeedbackResponse(BaseModel):
    overall_score: int
    market_size: dict
    traction: dict
    team: dict
    defensibility: dict
    summary: str
    suggestions: list[str]
