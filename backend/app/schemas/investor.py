from pydantic import BaseModel


class InvestorProfileCreate(BaseModel):
    investor_type: str = "angel"
    investment_thesis: str | None = None
    preferred_sectors: list[str] = []
    preferred_stages: list[str] = []
    check_size_min: float | None = None
    check_size_max: float | None = None
    check_size_currency: str = "USD"
    portfolio_companies: list[str] = []
    linkedin_url: str | None = None
    is_diaspora: bool = False
    country: str = "Nepal"


class InvestorProfileResponse(InvestorProfileCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True
