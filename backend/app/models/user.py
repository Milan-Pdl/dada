from sqlalchemy import Column, Integer, String, DateTime, Enum as SAEnum, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.database import Base


class UserRole(str, enum.Enum):
    FOUNDER = "founder"
    TALENT = "talent"
    INVESTOR = "investor"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SAEnum(UserRole), nullable=False)
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    location = Column(String, default="Kathmandu")
    profile_completeness = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    startup = relationship("Startup", back_populates="founder", uselist=False)
    talent_profile = relationship("TalentProfile", back_populates="user", uselist=False)
    investor_profile = relationship("InvestorProfile", back_populates="user", uselist=False)
