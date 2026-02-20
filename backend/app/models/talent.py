from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class TalentProfile(Base):
    __tablename__ = "talent_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    institution = Column(String, nullable=True)
    degree = Column(String, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    engagement_preference = Column(String, default="part_time")  # full_time, part_time, contract, internship, cofounder
    expected_compensation_min = Column(Float, nullable=True)
    expected_compensation_max = Column(Float, nullable=True)
    compensation_currency = Column(String, default="NPR")
    portfolio_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    looking_for_cofounder = Column(Integer, default=0)
    embedding = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="talent_profile")
    skills = relationship("TalentSkill", back_populates="profile", cascade="all, delete-orphan")


class TalentSkill(Base):
    __tablename__ = "talent_skills"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("talent_profiles.id"), nullable=False)
    name = Column(String, nullable=False)
    proficiency = Column(String, default="intermediate")  # beginner, intermediate, advanced, expert
    years_experience = Column(Float, default=0)

    profile = relationship("TalentProfile", back_populates="skills")
