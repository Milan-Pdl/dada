import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Startup, TalentRequirement, MatchResult } from "@/types";
import MatchCard from "@/components/MatchCard";
import ConnectModal from "@/components/ConnectModal";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Tabs from "@/components/ui/Tabs";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import ScoreRing from "@/components/ui/ScoreRing";
import { RefreshCw, Plus, Brain, Users, TrendingUp, AlertTriangle, Zap, Sparkles } from "lucide-react";

export default function FounderDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [requirements, setRequirements] = useState<TalentRequirement[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [tab, setTab] = useState("matches");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [connectTarget, setConnectTarget] = useState<MatchResult | null>(null);

  // Pitch
  const [pitchText, setPitchText] = useState("");
  const [pitchFeedback, setPitchFeedback] = useState<any>(null);
  const [pitchLoading, setPitchLoading] = useState(false);
  const [teamGaps, setTeamGaps] = useState<any>(null);

  // Modals
  const [showStartupModal, setShowStartupModal] = useState(false);
  const [showReqModal, setShowReqModal] = useState(false);

  // Forms
  const [sf, setSf] = useState({ name: "", industry: "", stage: "idea", tagline: "", description: "", funding_ask: "", traction_summary: "", team_size: "1" });
  const [rf, setRf] = useState({ title: "", required_skills: "", nice_to_have_skills: "", engagement_type: "part_time", description: "" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, rRes, mRes] = await Promise.all([
        api.get("/startups/me").catch(() => null),
        api.get("/startups/requirements").catch(() => ({ data: [] })),
        api.get("/matching/results").catch(() => ({ data: [] })),
      ]);
      if (sRes) setStartup(sRes.data);
      else setShowStartupModal(true);
      setRequirements(rRes?.data || []);
      setMatches(mRes?.data || []);
    } finally { setLoading(false); }
  };

  const createStartup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/startups", { ...sf, funding_ask: sf.funding_ask ? Number(sf.funding_ask) : null, team_size: Number(sf.team_size) });
      setShowStartupModal(false);
      toast.success("Startup profile created");
      loadData();
    } catch { toast.error("Failed to create startup"); }
  };

  const createRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/startups/requirements", {
        ...rf,
        required_skills: rf.required_skills.split(",").map((s) => s.trim()).filter(Boolean),
        nice_to_have_skills: rf.nice_to_have_skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setShowReqModal(false);
      setRf({ title: "", required_skills: "", nice_to_have_skills: "", engagement_type: "part_time", description: "" });
      toast.success("Role posted");
      loadData();
    } catch { toast.error("Failed to post role"); }
  };

  const refreshMatches = async () => {
    setRefreshing(true);
    try {
      const { data } = await api.post("/matching/refresh");
      setMatches(data);
      toast.success(`Found ${data.length} matches`);
    } catch { toast.error("Failed to refresh matches"); }
    setRefreshing(false);
  };

  const handleConnect = async (match: MatchResult, message: string) => {
    try {
      await api.post("/matching/connect", { to_user_id: match.target_user_id, match_id: match.id, message: message || `Hi! I'd love to connect regarding ${startup?.name || "my startup"}.` });
      toast.success(`Connection request sent to ${match.target_name}`);
    } catch { toast.error("Failed to send connection request"); }
  };

  const getPitchFeedback = async () => {
    setPitchLoading(true);
    try {
      const { data } = await api.post("/matching/pitch-feedback", { pitch_text: pitchText });
      setPitchFeedback(data);
    } catch { toast.error("Failed to analyze pitch"); }
    setPitchLoading(false);
  };

  const getTeamGaps = async () => {
    try {
      const { data } = await api.get("/matching/team-gaps");
      setTeamGaps(data);
    } catch { toast.error("Failed to load team gaps"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const talentMatches = matches.filter((m) => m.match_type === "talent_to_startup");
  const investorMatches = matches.filter((m) => m.match_type === "startup_to_investor");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-xl text-ink-900">Dashboard</h1>
          <p className="text-sm text-ink-400">Welcome back, {user?.full_name}</p>
        </div>
        <div className="flex gap-2">
          {startup && (
            <Button variant="secondary" size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setShowReqModal(true)}>
              Post role
            </Button>
          )}
          <Button size="sm" icon={<RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />} onClick={refreshMatches} loading={refreshing}>
            Refresh matches
          </Button>
        </div>
      </div>

      {/* Startup card */}
      {startup && (
        <Card>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-muted flex items-center justify-center">
                <Zap className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-ink-900">{startup.name}</h2>
                {startup.tagline && <p className="text-sm text-ink-400">{startup.tagline}</p>}
                <div className="flex gap-2 mt-2">
                  <Badge variant="accent">{startup.industry}</Badge>
                  <Badge variant="success" dot>{startup.stage.replace("_", " ")}</Badge>
                  {startup.funding_ask && <Badge variant="outline">${startup.funding_ask.toLocaleString()}</Badge>}
                </div>
              </div>
            </div>
          </div>
          {requirements.length > 0 && (
            <div className="mt-5 pt-5 border-t border-ink-100">
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-3">Open roles</p>
              <div className="flex flex-wrap gap-2">
                {requirements.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 px-3 py-2 bg-surface-1 rounded-lg">
                    <span className="text-sm font-medium text-ink-700">{r.title}</span>
                    <Badge variant="outline">{r.required_skills.length} skills</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      <Tabs
        tabs={[
          { id: "matches", label: "Matches", icon: <Users className="h-3.5 w-3.5" />, count: matches.length },
          { id: "pitch", label: "Pitch Co-Pilot", icon: <Brain className="h-3.5 w-3.5" /> },
          { id: "gaps", label: "Team Gaps", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
        ]}
        active={tab}
        onChange={(id) => { setTab(id); if (id === "gaps" && !teamGaps) getTeamGaps(); }}
      />

      {/* Matches */}
      {tab === "matches" && (
        <div className="space-y-8">
          {talentMatches.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-ink-900">Talent matches</h3>
                <Badge variant="success">{talentMatches.length}</Badge>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {talentMatches.map((m) => <MatchCard key={m.id} match={m} onConnect={setConnectTarget} />)}
              </div>
            </section>
          )}
          {investorMatches.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-ink-900">Investor matches</h3>
                <Badge variant="warn">{investorMatches.length}</Badge>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {investorMatches.map((m) => <MatchCard key={m.id} match={m} onConnect={setConnectTarget} />)}
              </div>
            </section>
          )}
          {matches.length === 0 && (
            <EmptyState
              icon={<Users className="h-6 w-6" />}
              title="No matches yet"
              description="Post talent requirements and click 'Refresh matches' to find your team and investors."
              action={startup ? <Button size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setShowReqModal(true)}>Post a role</Button> : undefined}
            />
          )}
        </div>
      )}

      {/* Pitch Co-Pilot */}
      {tab === "pitch" && (
        <Card padding="lg">
          <div className="mb-5">
            <h3 className="font-semibold text-ink-900">AI Pitch Co-Pilot</h3>
            <p className="text-xs text-ink-400 mt-1">Get structured feedback modeled on how real investors evaluate pitches</p>
          </div>
          <Textarea value={pitchText} onChange={(e) => setPitchText(e.target.value)} placeholder="Paste your pitch text here..." rows={6} />
          <div className="mt-3">
            <Button onClick={getPitchFeedback} disabled={!pitchText.trim()} loading={pitchLoading} icon={<Brain className="h-3.5 w-3.5" />}>
              Analyze pitch
            </Button>
          </div>
          {pitchFeedback && (
            <div className="mt-8 pt-6 border-t border-ink-100 space-y-6 animate-slide-up">
              <div className="flex items-center gap-5">
                <ScoreRing score={pitchFeedback.overall_score} size={72} strokeWidth={5} label="Overall" />
                <p className="text-sm text-ink-500 flex-1">{pitchFeedback.summary}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {(["market_size", "traction", "team", "defensibility"] as const).map((key) => (
                  <div key={key} className="p-4 bg-surface-1 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-ink-700 capitalize">{key.replace("_", " ")}</span>
                      <span className="text-xs font-bold text-accent">{pitchFeedback[key].score}/10</span>
                    </div>
                    <p className="text-xs text-ink-400 leading-relaxed">{pitchFeedback[key].feedback}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-700 mb-2">Suggestions</p>
                <ul className="space-y-2">
                  {pitchFeedback.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-ink-500">
                      <span className="w-4 h-4 rounded bg-accent-muted text-accent flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Team Gaps */}
      {tab === "gaps" && (
        <Card padding="lg">
          {teamGaps ? (
            <div className="animate-slide-up">
              <div className="flex items-center gap-5 mb-6">
                <ScoreRing score={teamGaps.investor_readiness_score} size={72} strokeWidth={5} label="Readiness" />
                <div>
                  <h3 className="font-semibold text-ink-900">Investor Readiness</h3>
                  <p className="text-sm text-ink-400">{teamGaps.summary}</p>
                </div>
              </div>
              <div className="space-y-3">
                {teamGaps.missing_roles?.map((role: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-surface-1 rounded-lg">
                    <Badge variant={role.importance === "critical" ? "danger" : role.importance === "important" ? "warn" : "default"} dot>
                      {role.importance}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{role.role}</p>
                      <p className="text-xs text-ink-400 mt-0.5">{role.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </Card>
      )}

      {/* Connect Modal */}
      <ConnectModal match={connectTarget} onClose={() => setConnectTarget(null)} onSend={handleConnect} />

      {/* Create Startup Modal */}
      <Modal open={showStartupModal && !startup} onClose={() => setShowStartupModal(false)} title="Create your startup">
        <form onSubmit={createStartup} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Startup name" value={sf.name} onChange={(e) => setSf({ ...sf, name: e.target.value })} placeholder="e.g. PaySewa" required />
            <Input label="Industry" value={sf.industry} onChange={(e) => setSf({ ...sf, industry: e.target.value })} placeholder="e.g. fintech" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Stage" value={sf.stage} onChange={(e) => setSf({ ...sf, stage: e.target.value })} options={[
              { value: "idea", label: "Idea" }, { value: "mvp", label: "MVP" },
              { value: "early_traction", label: "Early Traction" }, { value: "growth", label: "Growth" },
            ]} />
            <Input label="Funding ask (USD)" type="number" value={sf.funding_ask} onChange={(e) => setSf({ ...sf, funding_ask: e.target.value })} placeholder="50000" />
          </div>
          <Input label="Tagline" value={sf.tagline} onChange={(e) => setSf({ ...sf, tagline: e.target.value })} placeholder="One-liner about your startup" />
          <Textarea label="Description" value={sf.description} onChange={(e) => setSf({ ...sf, description: e.target.value })} placeholder="What does your startup do?" rows={3} />
          <Textarea label="Traction" value={sf.traction_summary} onChange={(e) => setSf({ ...sf, traction_summary: e.target.value })} placeholder="Users, revenue, partnerships..." rows={2} />
          <Button type="submit" className="w-full">Create startup</Button>
        </form>
      </Modal>

      {/* Post Role Modal */}
      <Modal open={showReqModal} onClose={() => setShowReqModal(false)} title="Post a talent requirement">
        <form onSubmit={createRequirement} className="space-y-4">
          <Input label="Role title" value={rf.title} onChange={(e) => setRf({ ...rf, title: e.target.value })} placeholder="e.g. Full-Stack Developer" required />
          <Input label="Required skills" value={rf.required_skills} onChange={(e) => setRf({ ...rf, required_skills: e.target.value })} placeholder="React, Python, PostgreSQL" hint="Comma-separated" required />
          <Input label="Nice-to-have skills" value={rf.nice_to_have_skills} onChange={(e) => setRf({ ...rf, nice_to_have_skills: e.target.value })} placeholder="Docker, AWS" hint="Comma-separated" />
          <Select label="Engagement type" value={rf.engagement_type} onChange={(e) => setRf({ ...rf, engagement_type: e.target.value })} options={[
            { value: "full_time", label: "Full Time" }, { value: "part_time", label: "Part Time" },
            { value: "contract", label: "Contract" }, { value: "internship", label: "Internship" },
          ]} />
          <Button type="submit" className="w-full">Post role</Button>
        </form>
      </Modal>
    </div>
  );
}
