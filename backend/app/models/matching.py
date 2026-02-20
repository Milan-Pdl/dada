from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, JSON
from datetime import datetime, timezone
from app.database import Base


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    source_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    match_type = Column(String, nullable=False)  # talent_to_startup, startup_to_investor, cofounder
    overall_score = Column(Float, nullable=False)
    skill_overlap_score = Column(Float, nullable=True)
    semantic_score = Column(Float, nullable=True)
    matched_skills = Column(JSON, default=list)
    missing_skills = Column(JSON, default=list)
    requirement_id = Column(Integer, ForeignKey("talent_requirements.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ConnectionRequest(Base):
    __tablename__ = "connection_requests"

    id = Column(Integer, primary_key=True, index=True)
    from_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    to_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    match_id = Column(Integer, ForeignKey("matches.id"), nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String, default="pending")  # pending, accepted, declined
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
