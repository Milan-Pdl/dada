from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class Startup(Base):
    __tablename__ = "startups"

    id = Column(Integer, primary_key=True, index=True)
    founder_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String, nullable=False)
    tagline = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    industry = Column(String, nullable=False)
    stage = Column(String, default="idea")  # idea, mvp, early_traction, growth
    funding_ask = Column(Float, nullable=True)
    funding_currency = Column(String, default="NPR")
    traction_summary = Column(Text, nullable=True)
    team_size = Column(Integer, default=1)
    website = Column(String, nullable=True)
    pitch_deck_url = Column(String, nullable=True)
    team_gaps = Column(JSON, nullable=True)  # AI-generated team gap analysis
    embedding = Column(JSON, nullable=True)  # Stored OpenAI embedding
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    founder = relationship("User", back_populates="startup")
    requirements = relationship("TalentRequirement", back_populates="startup", cascade="all, delete-orphan")


class TalentRequirement(Base):
    __tablename__ = "talent_requirements"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    required_skills = Column(JSON, nullable=False, default=list)  # ["Python", "React", ...]
    nice_to_have_skills = Column(JSON, default=list)
    engagement_type = Column(String, default="part_time")  # full_time, part_time, contract, internship
    compensation_min = Column(Float, nullable=True)
    compensation_max = Column(Float, nullable=True)
    compensation_currency = Column(String, default="NPR")
    is_active = Column(Integer, default=1)
    embedding = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    startup = relationship("Startup", back_populates="requirements")
