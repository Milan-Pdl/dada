from pydantic import BaseModel, EmailStr
from app.models.user import UserRole


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    avatar_url: str | None = None
    bio: str | None = None
    location: str | None = None
    profile_completeness: float = 0.0

    class Config:
        from_attributes = True


TokenResponse.model_rebuild()
