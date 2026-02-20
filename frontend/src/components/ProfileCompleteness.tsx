import Card from "./ui/Card";

interface Props {
  score: number;
  suggestions?: string[];
}

export default function ProfileCompleteness({ score, suggestions }: Props) {
  const percent = Math.round(score * 100);
  const color = percent >= 80 ? "bg-success" : percent >= 50 ? "bg-warn" : "bg-danger";

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-ink-500 uppercase tracking-wider">Profile strength</span>
        <span className="text-xs font-bold text-ink-900">{percent}%</span>
      </div>
      <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${percent}%` }} />
      </div>
      {suggestions && suggestions.length > 0 && (
        <ul className="mt-3 space-y-1">
          {suggestions.map((s, i) => (
            <li key={i} className="text-xs text-ink-400 flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-ink-300 mt-1.5 shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
