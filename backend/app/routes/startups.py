from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.models.user import User, UserRole
from app.models.startup import Startup, TalentRequirement
from app.schemas.startup import StartupCreate, StartupResponse, TalentRequirementCreate, TalentRequirementResponse
from app.services.embeddings import get_embedding, build_startup_text, build_requirement_text

router = APIRouter(prefix="/api/startups", tags=["startups"])


@router.post("", response_model=StartupResponse)
def create_startup(data: StartupCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role != UserRole.FOUNDER:
        raise HTTPException(status_code=403, detail="Only founders can create startups")
    if user.startup:
        raise HTTPException(status_code=400, detail="You already have a startup profile")

    startup = Startup(**data.model_dump(), founder_id=user.id)
    startup.embedding = get_embedding(build_startup_text(startup))
    db.add(startup)
    db.commit()
    db.refresh(startup)
    return StartupResponse.model_validate(startup)


@router.get("/me", response_model=StartupResponse)
def get_my_startup(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not user.startup:
        raise HTTPException(status_code=404, detail="No startup profile found")
    return StartupResponse.model_validate(user.startup)


@router.put("/me", response_model=StartupResponse)
def update_startup(data: StartupCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not user.startup:
        raise HTTPException(status_code=404, detail="No startup profile found")
    for key, val in data.model_dump().items():
        setattr(user.startup, key, val)
    user.startup.embedding = get_embedding(build_startup_text(user.startup))
    db.commit()
    db.refresh(user.startup)
    return StartupResponse.model_validate(user.startup)


@router.get("", response_model=list[StartupResponse])
def list_startups(db: Session = Depends(get_db)):
    return [StartupResponse.model_validate(s) for s in db.query(Startup).all()]


# --- Talent Requirements ---

@router.post("/requirements", response_model=TalentRequirementResponse)
def create_requirement(
    data: TalentRequirementCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not user.startup:
        raise HTTPException(status_code=400, detail="Create a startup profile first")
    req = TalentRequirement(**data.model_dump(), startup_id=user.startup.id)
    req.embedding = get_embedding(build_requirement_text(req))
    db.add(req)
    db.commit()
    db.refresh(req)
    return TalentRequirementResponse.model_validate(req)


@router.get("/requirements", response_model=list[TalentRequirementResponse])
def list_my_requirements(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not user.startup:
        return []
    return [TalentRequirementResponse.model_validate(r) for r in user.startup.requirements]


@router.get("/requirements/all", response_model=list[TalentRequirementResponse])
def list_all_requirements(db: Session = Depends(get_db)):
    reqs = db.query(TalentRequirement).filter(TalentRequirement.is_active == 1).all()
    return [TalentRequirementResponse.model_validate(r) for r in reqs]
