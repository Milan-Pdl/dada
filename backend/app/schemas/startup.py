from pydantic import BaseModel


class StartupCreate(BaseModel):
    name: str
    tagline: str | None = None
    description: str | None = None
    industry: str
    stage: str = "idea"
    funding_ask: float | None = None
    funding_currency: str = "NPR"
    traction_summary: str | None = None
    team_size: int = 1
    website: str | None = None
    pitch_deck_url: str | None = None


class StartupResponse(StartupCreate):
    id: int
    founder_id: int
    team_gaps: list | None = None

    class Config:
        from_attributes = True


class TalentRequirementCreate(BaseModel):
    title: str
    description: str | None = None
    required_skills: list[str]
    nice_to_have_skills: list[str] = []
    engagement_type: str = "part_time"
    compensation_min: float | None = None
    compensation_max: float | None = None
    compensation_currency: str = "NPR"


class TalentRequirementResponse(TalentRequirementCreate):
    id: int
    startup_id: int
    is_active: int = 1

    class Config:
        from_attributes = True
