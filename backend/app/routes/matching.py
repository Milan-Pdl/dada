from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app.models.user import User
from app.models.matching import Match, ConnectionRequest
from app.schemas.matching import (
    MatchResponse, ConnectionRequestCreate, ConnectionRequestResponse,
    PitchFeedbackRequest, PitchFeedbackResponse,
)
from app.services.matching_engine import run_matching_for_user
from app.services.ai_copilot import analyze_pitch, analyze_team_gaps

router = APIRouter(prefix="/api/matching", tags=["matching"])


@router.post("/refresh", response_model=list[MatchResponse])
def refresh_matches(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Re-compute all matches for the current user."""
    matches = run_matching_for_user(db, user)
    return _enrich_matches(matches, db)


@router.get("/results", response_model=list[MatchResponse])
def get_matches(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get cached matches for the current user."""
    matches = db.query(Match).filter(Match.source_user_id == user.id).order_by(Match.overall_score.desc()).all()
    return _enrich_matches(matches, db)


def _enrich_matches(matches: list[Match], db: Session) -> list[MatchResponse]:
    results = []
    for m in matches:
        target = db.query(User).filter(User.id == m.target_user_id).first()
        resp = MatchResponse.model_validate(m)
        if target:
            resp.target_name = target.full_name
            resp.target_role = target.role.value if target.role else None
            if target.startup:
                resp.startup_name = target.startup.name
        results.append(resp)
    return results


# --- Connection Requests ---

@router.post("/connect", response_model=ConnectionRequestResponse)
def send_connection(
    data: ConnectionRequestCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(ConnectionRequest).filter(
        ConnectionRequest.from_user_id == user.id,
        ConnectionRequest.to_user_id == data.to_user_id,
        ConnectionRequest.status == "pending",
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Connection request already pending")

    conn = ConnectionRequest(from_user_id=user.id, **data.model_dump())
    db.add(conn)
    db.commit()
    db.refresh(conn)
    return _enrich_connection(conn, db)


@router.get("/connections", response_model=list[ConnectionRequestResponse])
def get_connections(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conns = db.query(ConnectionRequest).filter(
        (ConnectionRequest.from_user_id == user.id) | (ConnectionRequest.to_user_id == user.id)
    ).all()
    return [_enrich_connection(c, db) for c in conns]


@router.put("/connections/{conn_id}/accept")
def accept_connection(conn_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conn = db.query(ConnectionRequest).filter(ConnectionRequest.id == conn_id, ConnectionRequest.to_user_id == user.id).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection request not found")
    conn.status = "accepted"
    db.commit()
    return {"status": "accepted"}


@router.put("/connections/{conn_id}/decline")
def decline_connection(conn_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conn = db.query(ConnectionRequest).filter(ConnectionRequest.id == conn_id, ConnectionRequest.to_user_id == user.id).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection request not found")
    conn.status = "declined"
    db.commit()
    return {"status": "declined"}


def _enrich_connection(conn: ConnectionRequest, db: Session) -> ConnectionRequestResponse:
    resp = ConnectionRequestResponse.model_validate(conn)
    from_user = db.query(User).filter(User.id == conn.from_user_id).first()
    to_user = db.query(User).filter(User.id == conn.to_user_id).first()
    resp.from_name = from_user.full_name if from_user else None
    resp.to_name = to_user.full_name if to_user else None
    return resp


# --- AI Co-Pilot ---

@router.post("/pitch-feedback", response_model=PitchFeedbackResponse)
def get_pitch_feedback(data: PitchFeedbackRequest, user: User = Depends(get_current_user)):
    result = analyze_pitch(data.pitch_text)
    return PitchFeedbackResponse(**result)


@router.get("/team-gaps")
def get_team_gaps(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not user.startup:
        raise HTTPException(status_code=400, detail="No startup profile found")
    startup_data = {
        "name": user.startup.name,
        "industry": user.startup.industry,
        "stage": user.startup.stage,
        "team_size": user.startup.team_size,
        "description": user.startup.description,
    }
    return analyze_team_gaps(startup_data)
