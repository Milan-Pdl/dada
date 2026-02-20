from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.models.user import User, UserRole
from app.models.talent import TalentProfile, TalentSkill
from app.schemas.talent import TalentProfileCreate, TalentProfileResponse
from app.services.embeddings import get_embedding, build_talent_text

router = APIRouter(prefix="/api/talent", tags=["talent"])


@router.post("", response_model=TalentProfileResponse)
def create_talent_profile(
    data: TalentProfileCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role != UserRole.TALENT:
        raise HTTPException(status_code=403, detail="Only talent users can create talent profiles")
    if user.talent_profile:
        raise HTTPException(status_code=400, detail="You already have a talent profile")

    profile = TalentProfile(
        user_id=user.id,
        institution=data.institution,
        degree=data.degree,
        graduation_year=data.graduation_year,
        engagement_preference=data.engagement_preference,
        expected_compensation_min=data.expected_compensation_min,
        expected_compensation_max=data.expected_compensation_max,
        compensation_currency=data.compensation_currency,
        portfolio_url=data.portfolio_url,
        github_url=data.github_url,
        linkedin_url=data.linkedin_url,
        looking_for_cofounder=1 if data.looking_for_cofounder else 0,
    )
    db.add(profile)
    db.flush()

    for skill in data.skills:
        db.add(TalentSkill(profile_id=profile.id, name=skill.name, proficiency=skill.proficiency, years_experience=skill.years_experience))

    profile.embedding = get_embedding(build_talent_text(profile))
    db.commit()
    db.refresh(profile)
    return TalentProfileResponse.model_validate(profile)


@router.get("/me", response_model=TalentProfileResponse)
def get_my_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not user.talent_profile:
        raise HTTPException(status_code=404, detail="No talent profile found")
    return TalentProfileResponse.model_validate(user.talent_profile)


@router.put("/me", response_model=TalentProfileResponse)
def update_talent_profile(
    data: TalentProfileCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = user.talent_profile
    if not profile:
        raise HTTPException(status_code=404, detail="No talent profile found")

    profile.institution = data.institution
    profile.degree = data.degree
    profile.graduation_year = data.graduation_year
    profile.engagement_preference = data.engagement_preference
    profile.expected_compensation_min = data.expected_compensation_min
    profile.expected_compensation_max = data.expected_compensation_max
    profile.portfolio_url = data.portfolio_url
    profile.github_url = data.github_url
    profile.linkedin_url = data.linkedin_url
    profile.looking_for_cofounder = 1 if data.looking_for_cofounder else 0

    # Replace skills
    for s in profile.skills:
        db.delete(s)
    db.flush()
    for skill in data.skills:
        db.add(TalentSkill(profile_id=profile.id, name=skill.name, proficiency=skill.proficiency, years_experience=skill.years_experience))

    profile.embedding = get_embedding(build_talent_text(profile))
    db.commit()
    db.refresh(profile)
    return TalentProfileResponse.model_validate(profile)
