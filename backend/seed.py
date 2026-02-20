"""Seed the database with sample data for development."""
from app.database import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.startup import Startup, TalentRequirement
from app.models.talent import TalentProfile, TalentSkill
from app.models.investor import InvestorProfile
from app.auth import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Clear existing data
for model in [TalentSkill, TalentProfile, TalentRequirement, Startup, InvestorProfile, User]:
    db.query(model).delete()
db.commit()

# --- Founders & Startups ---
f1 = User(email="aarav@example.com", hashed_password=hash_password("password123"), full_name="Aarav Sharma", role=UserRole.FOUNDER, bio="Building fintech for Nepal", location="Kathmandu")
db.add(f1)
db.flush()
s1 = Startup(founder_id=f1.id, name="PaySewa", tagline="Digital payments for rural Nepal", description="Mobile-first payment platform targeting unbanked populations in rural Nepal.", industry="fintech", stage="mvp", funding_ask=50000, funding_currency="USD", traction_summary="500 beta users, 3 bank partnerships", team_size=3)
db.add(s1)
db.flush()
db.add(TalentRequirement(startup_id=s1.id, title="Full-Stack Developer", required_skills=["React", "Python", "PostgreSQL", "REST API"], nice_to_have_skills=["Docker", "AWS"], engagement_type="full_time", compensation_min=40000, compensation_max=60000, compensation_currency="NPR"))
db.add(TalentRequirement(startup_id=s1.id, title="UI/UX Designer", required_skills=["Figma", "User Research", "Prototyping"], nice_to_have_skills=["Tailwind CSS"], engagement_type="part_time", compensation_min=25000, compensation_max=40000, compensation_currency="NPR"))

f2 = User(email="priya@example.com", hashed_password=hash_password("password123"), full_name="Priya Adhikari", role=UserRole.FOUNDER, bio="EdTech entrepreneur", location="Pokhara")
db.add(f2)
db.flush()
s2 = Startup(founder_id=f2.id, name="SikshyaHub", tagline="Personalized learning for Nepali students", description="AI-powered adaptive learning platform for K-12 students in Nepal.", industry="edtech", stage="early_traction", funding_ask=100000, funding_currency="USD", traction_summary="2000 students, 15 schools onboarded", team_size=5)
db.add(s2)
db.flush()
db.add(TalentRequirement(startup_id=s2.id, title="ML Engineer", required_skills=["Python", "TensorFlow", "NLP", "Data Science"], nice_to_have_skills=["PyTorch", "MLOps"], engagement_type="full_time", compensation_min=50000, compensation_max=80000, compensation_currency="NPR"))

# --- Talent ---
t1 = User(email="suman@example.com", hashed_password=hash_password("password123"), full_name="Suman Tamang", role=UserRole.TALENT, bio="CS graduate passionate about web dev", location="Kathmandu")
db.add(t1)
db.flush()
tp1 = TalentProfile(user_id=t1.id, institution="Tribhuvan University", degree="BSc Computer Science", graduation_year=2025, engagement_preference="full_time", expected_compensation_min=35000, expected_compensation_max=55000)
db.add(tp1)
db.flush()
for skill, prof in [("React", "advanced"), ("Python", "intermediate"), ("PostgreSQL", "intermediate"), ("JavaScript", "advanced"), ("REST API", "intermediate")]:
    db.add(TalentSkill(profile_id=tp1.id, name=skill, proficiency=prof, years_experience=2))

t2 = User(email="anita@example.com", hashed_password=hash_password("password123"), full_name="Anita Gurung", role=UserRole.TALENT, bio="Design student with startup interest", location="Lalitpur")
db.add(t2)
db.flush()
tp2 = TalentProfile(user_id=t2.id, institution="Kathmandu University", degree="BFA Design", graduation_year=2025, engagement_preference="part_time", expected_compensation_min=20000, expected_compensation_max=40000, looking_for_cofounder=1)
db.add(tp2)
db.flush()
for skill, prof in [("Figma", "expert"), ("User Research", "advanced"), ("Prototyping", "advanced"), ("Adobe XD", "intermediate")]:
    db.add(TalentSkill(profile_id=tp2.id, name=skill, proficiency=prof, years_experience=3))

t3 = User(email="bikash@example.com", hashed_password=hash_password("password123"), full_name="Bikash Rai", role=UserRole.TALENT, bio="ML enthusiast from CTEVT", location="Chitwan")
db.add(t3)
db.flush()
tp3 = TalentProfile(user_id=t3.id, institution="CTEVT Polytechnic", degree="Diploma in IT", graduation_year=2024, engagement_preference="full_time", expected_compensation_min=30000, expected_compensation_max=50000)
db.add(tp3)
db.flush()
for skill, prof in [("Python", "advanced"), ("TensorFlow", "intermediate"), ("Data Science", "intermediate"), ("NLP", "beginner"), ("SQL", "intermediate")]:
    db.add(TalentSkill(profile_id=tp3.id, name=skill, proficiency=prof, years_experience=1.5))

# --- Investors ---
i1 = User(email="rajesh@example.com", hashed_password=hash_password("password123"), full_name="Rajesh Hamal", role=UserRole.INVESTOR, bio="Angel investor focused on Nepal tech", location="Kathmandu")
db.add(i1)
db.flush()
db.add(InvestorProfile(user_id=i1.id, investor_type="angel", investment_thesis="Backing early-stage fintech and edtech startups solving real problems in Nepal", preferred_sectors=["fintech", "edtech", "healthtech"], preferred_stages=["mvp", "early_traction"], check_size_min=10000, check_size_max=50000, check_size_currency="USD"))

i2 = User(email="sunita@example.com", hashed_password=hash_password("password123"), full_name="Sunita KC", role=UserRole.INVESTOR, bio="Diaspora VC investing back in Nepal", location="San Francisco")
db.add(i2)
db.flush()
db.add(InvestorProfile(user_id=i2.id, investor_type="diaspora", investment_thesis="Investing in scalable tech startups from Nepal with global potential", preferred_sectors=["fintech", "saas", "edtech"], preferred_stages=["early_traction", "growth"], check_size_min=25000, check_size_max=200000, check_size_currency="USD", is_diaspora=1, country="USA"))

db.commit()
db.close()
print("Database seeded successfully!")
