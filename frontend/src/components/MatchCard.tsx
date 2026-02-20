import { MatchResult } from "@/types";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import ScoreRing from "./ui/ScoreRing";
import { Send } from "lucide-react";

interface Props {
  match: MatchResult;
  onConnect: (match: MatchResult) => void;
}

export default function MatchCard({ match, onConnect }: Props) {
  const scorePercent = Math.round(match.overall_score * 100);

  return (
    <Card hover className="animate-slide-up flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center">
            <span className="text-sm font-bold text-accent">
              {match.target_name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?"}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-900 leading-tight">{match.target_name || "Unknown"}</h3>
            <p className="text-xs text-ink-400 capitalize">{match.target_role}</p>
            {match.startup_name && (
              <p className="text-xs text-accent font-medium">{match.startup_name}</p>
            )}
          </div>
        </div>
        <ScoreRing score={scorePercent} size={48} strokeWidth={4} />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {match.matched_skills.map((s) => (
          <Badge key={s} variant="success">{s}</Badge>
        ))}
        {match.missing_skills.map((s) => (
          <Badge key={s} variant="outline">{s}</Badge>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {match.skill_overlap_score != null && (
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-ink-400 mb-1">
              <span>Skill match</span>
              <span>{Math.round(match.skill_overlap_score * 100)}%</span>
            </div>
            <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full transition-all duration-500" style={{ width: `${match.skill_overlap_score * 100}%` }} />
            </div>
          </div>
        )}
        {match.semantic_score != null && (
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-ink-400 mb-1">
              <span>Semantic</span>
              <span>{Math.round(match.semantic_score * 100)}%</span>
            </div>
            <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${match.semantic_score * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <Button
          variant="secondary"
          size="sm"
          icon={<Send className="h-3.5 w-3.5" />}
          onClick={() => onConnect(match)}
          className="w-full"
        >
          Connect
        </Button>
      </div>
    </Card>
  );
}
