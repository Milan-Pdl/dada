from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class InvestorProfile(Base):
    __tablename__ = "investor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    investor_type = Column(String, default="angel")  # angel, vc, diaspora, institutional
    investment_thesis = Column(Text, nullable=True)
    preferred_sectors = Column(JSON, default=list)  # ["fintech", "edtech", ...]
    preferred_stages = Column(JSON, default=list)  # ["idea", "mvp", ...]
    check_size_min = Column(Float, nullable=True)
    check_size_max = Column(Float, nullable=True)
    check_size_currency = Column(String, default="USD")
    portfolio_companies = Column(JSON, default=list)
    linkedin_url = Column(String, nullable=True)
    is_diaspora = Column(Integer, default=0)
    country = Column(String, default="Nepal")
    embedding = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="investor_profile")
