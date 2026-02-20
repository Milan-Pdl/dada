from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.models.user import User, UserRole
from app.models.investor import InvestorProfile
from app.schemas.investor import InvestorProfileCreate, InvestorProfileResponse
from app.services.embeddings import get_embedding, build_investor_text

router = APIRouter(prefix="/api/investors", tags=["investors"])


@router.post("", response_model=InvestorProfileResponse)
def create_investor_profile(
    data: InvestorProfileCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if user.role != UserRole.INVESTOR:
        raise HTTPException(status_code=403, detail="Only investors can create investor profiles")
    if user.investor_profile:
        raise HTTPException(status_code=400, detail="You already have an investor profile")

    profile = InvestorProfile(
        user_id=user.id,
        **data.model_dump(exclude={"is_diaspora"}),
        is_diaspora=1 if data.is_diaspora else 0,
    )
    profile.embedding = get_embedding(build_investor_text(profile))
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return InvestorProfileResponse.model_validate(profile)


@router.get("/me", response_model=InvestorProfileResponse)
def get_my_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not user.investor_profile:
        raise HTTPException(status_code=404, detail="No investor profile found")
    return InvestorProfileResponse.model_validate(user.investor_profile)


@router.put("/me", response_model=InvestorProfileResponse)
def update_investor_profile(
    data: InvestorProfileCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = user.investor_profile
    if not profile:
        raise HTTPException(status_code=404, detail="No investor profile found")

    for key, val in data.model_dump(exclude={"is_diaspora"}).items():
        setattr(profile, key, val)
    profile.is_diaspora = 1 if data.is_diaspora else 0
    profile.embedding = get_embedding(build_investor_text(profile))
    db.commit()
    db.refresh(profile)
    return InvestorProfileResponse.model_validate(profile)
