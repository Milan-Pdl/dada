"""
NepLaunch AI Matching Engine
Hybrid algorithm: 60% skill overlap scoring + 40% semantic embedding similarity
"""
import numpy as np
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.models.startup import Startup, TalentRequirement
from app.models.talent import TalentProfile
from app.models.investor import InvestorProfile
from app.models.matching import Match
from app.services.embeddings import get_embedding


def cosine_similarity(a: list[float], b: list[float]) -> float:
    a_arr, b_arr = np.array(a), np.array(b)
    dot = np.dot(a_arr, b_arr)
    norm = np.linalg.norm(a_arr) * np.linalg.norm(b_arr)
    return float(dot / norm) if norm > 0 else 0.0


def compute_skill_overlap(required: list[str], candidate: list[str]) -> tuple[float, list[str], list[str]]:
    """Returns (score, matched_skills, missing_skills)"""
    required_lower = {s.lower() for s in required}
    candidate_lower = {s.lower() for s in candidate}
    matched = required_lower & candidate_lower
    missing = required_lower - candidate_lower
    score = len(matched) / len(required_lower) if required_lower else 0.0
    return score, sorted(matched), sorted(missing)


def match_talent_to_requirement(
    db: Session,
    requirement: TalentRequirement,
    limit: int = 20,
) -> list[dict]:
    """Match talent profiles against a specific talent requirement."""
    talents = db.query(TalentProfile).all()
    results = []

    for talent in talents:
        candidate_skills = [s.name for s in talent.skills]
        skill_score, matched, missing = compute_skill_overlap(
            requirement.required_skills or [], candidate_skills
        )

        # Semantic similarity
        semantic_score = 0.0
        if requirement.embedding and talent.embedding:
            semantic_score = cosine_similarity(requirement.embedding, talent.embedding)

        overall = (0.6 * skill_score) + (0.4 * semantic_score)

        if overall > 0.1:  # minimum threshold
            results.append({
                "talent_user_id": talent.user_id,
                "overall_score": round(overall, 3),
                "skill_overlap_score": round(skill_score, 3),
                "semantic_score": round(semantic_score, 3),
                "matched_skills": matched,
                "missing_skills": missing,
                "requirement_id": requirement.id,
            })

    results.sort(key=lambda x: x["overall_score"], reverse=True)
    return results[:limit]


def match_startup_to_investors(
    db: Session,
    startup: Startup,
    limit: int = 20,
) -> list[dict]:
    """Match a startup to investors based on thesis alignment."""
    investors = db.query(InvestorProfile).all()
    results = []

    for inv in investors:
        score = 0.0
        reasons = []

        # Sector match
        if inv.preferred_sectors:
            if startup.industry and startup.industry.lower() in [s.lower() for s in inv.preferred_sectors]:
                score += 0.3
                reasons.append("sector_match")

        # Stage match
        if inv.preferred_stages:
            if startup.stage and startup.stage.lower() in [s.lower() for s in inv.preferred_stages]:
                score += 0.2
                reasons.append("stage_match")

        # Check size match
        if inv.check_size_min and startup.funding_ask:
            if inv.check_size_min <= startup.funding_ask <= (inv.check_size_max or float("inf")):
                score += 0.1
                reasons.append("check_size_match")

        # Semantic similarity on thesis vs startup description
        semantic_score = 0.0
        if startup.embedding and inv.embedding:
            semantic_score = cosine_similarity(startup.embedding, inv.embedding)

        overall = (0.6 * score) + (0.4 * semantic_score)

        if overall > 0.05:
            results.append({
                "investor_user_id": inv.user_id,
                "overall_score": round(overall, 3),
                "skill_overlap_score": round(score, 3),
                "semantic_score": round(semantic_score, 3),
                "matched_skills": reasons,
                "missing_skills": [],
            })

    results.sort(key=lambda x: x["overall_score"], reverse=True)
    return results[:limit]


def run_matching_for_user(db: Session, user: User) -> list[Match]:
    """Run full matching pipeline for a user and persist results."""
    # Clear old matches
    db.query(Match).filter(Match.source_user_id == user.id).delete()
    db.commit()

    new_matches = []

    if user.role == UserRole.FOUNDER and user.startup:
        # Match talent to each requirement
        for req in user.startup.requirements:
            for m in match_talent_to_requirement(db, req):
                match = Match(
                    source_user_id=user.id,
                    target_user_id=m["talent_user_id"],
                    match_type="talent_to_startup",
                    overall_score=m["overall_score"],
                    skill_overlap_score=m["skill_overlap_score"],
                    semantic_score=m["semantic_score"],
                    matched_skills=m["matched_skills"],
                    missing_skills=m["missing_skills"],
                    requirement_id=m["requirement_id"],
                )
                db.add(match)
                new_matches.append(match)

        # Match to investors
        for m in match_startup_to_investors(db, user.startup):
            match = Match(
                source_user_id=user.id,
                target_user_id=m["investor_user_id"],
                match_type="startup_to_investor",
                overall_score=m["overall_score"],
                skill_overlap_score=m["skill_overlap_score"],
                semantic_score=m["semantic_score"],
                matched_skills=m["matched_skills"],
                missing_skills=m["missing_skills"],
            )
            db.add(match)
            new_matches.append(match)

    elif user.role == UserRole.TALENT and user.talent_profile:
        # Match against all active requirements
        requirements = db.query(TalentRequirement).filter(TalentRequirement.is_active == 1).all()
        for req in requirements:
            candidate_skills = [s.name for s in user.talent_profile.skills]
            skill_score, matched, missing = compute_skill_overlap(
                req.required_skills or [], candidate_skills
            )
            semantic_score = 0.0
            if req.embedding and user.talent_profile.embedding:
                semantic_score = cosine_similarity(req.embedding, user.talent_profile.embedding)
            overall = (0.6 * skill_score) + (0.4 * semantic_score)

            if overall > 0.1:
                startup = db.query(Startup).filter(Startup.id == req.startup_id).first()
                match = Match(
                    source_user_id=user.id,
                    target_user_id=startup.founder_id if startup else 0,
                    match_type="talent_to_startup",
                    overall_score=round(overall, 3),
                    skill_overlap_score=round(skill_score, 3),
                    semantic_score=round(semantic_score, 3),
                    matched_skills=matched,
                    missing_skills=missing,
                    requirement_id=req.id,
                )
                db.add(match)
                new_matches.append(match)

    elif user.role == UserRole.INVESTOR and user.investor_profile:
        # Match against all startups
        startups = db.query(Startup).all()
        for startup in startups:
            results = match_startup_to_investors(db, startup, limit=100)
            for m in results:
                if m["investor_user_id"] == user.id:
                    match = Match(
                        source_user_id=user.id,
                        target_user_id=startup.founder_id,
                        match_type="startup_to_investor",
                        overall_score=m["overall_score"],
                        skill_overlap_score=m["skill_overlap_score"],
                        semantic_score=m["semantic_score"],
                        matched_skills=m["matched_skills"],
                        missing_skills=m["missing_skills"],
                    )
                    db.add(match)
                    new_matches.append(match)

    db.commit()
    return new_matches
