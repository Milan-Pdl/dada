from pydantic import BaseModel


class SkillCreate(BaseModel):
    name: str
    proficiency: str = "intermediate"
    years_experience: float = 0


class TalentProfileCreate(BaseModel):
    institution: str | None = None
    degree: str | None = None
    graduation_year: int | None = None
    engagement_preference: str = "part_time"
    expected_compensation_min: float | None = None
    expected_compensation_max: float | None = None
    compensation_currency: str = "NPR"
    portfolio_url: str | None = None
    github_url: str | None = None
    linkedin_url: str | None = None
    looking_for_cofounder: bool = False
    skills: list[SkillCreate] = []


class SkillResponse(BaseModel):
    id: int
    name: str
    proficiency: str
    years_experience: float

    class Config:
        from_attributes = True


class TalentProfileResponse(BaseModel):
    id: int
    user_id: int
    institution: str | None = None
    degree: str | None = None
    graduation_year: int | None = None
    engagement_preference: str
    expected_compensation_min: float | None = None
    expected_compensation_max: float | None = None
    portfolio_url: str | None = None
    github_url: str | None = None
    linkedin_url: str | None = None
    looking_for_cofounder: bool = False
    skills: list[SkillResponse] = []

    class Config:
        from_attributes = True
