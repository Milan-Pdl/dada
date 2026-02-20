import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { TalentProfile, TalentRequirement, MatchResult } from "@/types";
import MatchCard from "@/components/MatchCard";
import ConnectModal from "@/components/ConnectModal";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Tabs from "@/components/ui/Tabs";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { RefreshCw, Search, Briefcase, Users, GraduationCap } from "lucide-react";

export default function TalentDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [opportunities, setOpportunities] = useState<TalentRequirement[]>([]);
  const [tab, setTab] = useState("matches");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [connectTarget, setConnectTarget] = useState<MatchResult | null>(null);

  const [pf, setPf] = useState({
    institution: "", degree: "", graduation_year: "", engagement_preference: "part_time",
    expected_compensation_min: "", expected_compensation_max: "",
    portfolio_url: "", github_url: "", linkedin_url: "", looking_for_cofounder: false,
    skills: "",
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, mRes, oRes] = await Promise.all([
        api.get("/talent/me").catch(() => null),
        api.get("/matching/results").catch(() => ({ data: [] })),
        api.get("/startups/requirements/all").catch(() => ({ data: [] })),
      ]);
      if (pRes) setProfile(pRes.data);
      else setShowCreate(true);
      setMatches(mRes?.data || []);
      setOpportunities(oRes?.data || []);
    } finally { setLoading(false); }
  };

  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skills = pf.skills.split(",").map((s) => s.trim()).filter(Boolean).map((name) => ({ name, proficiency: "intermediate", years_experience: 0 }));
      await api.post("/talent", {
        ...pf,
        graduation_year: pf.graduation_year ? Number(pf.graduation_year) : null,
        expected_compensation_min: pf.expected_compensation_min ? Number(pf.expected_compensation_min) : null,
        expected_compensation_max: pf.expected_compensation_max ? Number(pf.expected_compensation_max) : null,
        skills,
      });
      setShowCreate(false);
      toast.success("Profile created");
      loadData();
    } catch { toast.error("Failed to create profile"); }
  };

  const refreshMatches = async () => {
    setRefreshing(true);
    try {
      const { data } = await api.post("/matching/refresh");
      setMatches(data);
      toast.success(`Found ${data.length} matches`);
    } catch { toast.error("Failed to refresh"); }
    setRefreshing(false);
  };

  const handleConnect = async (match: MatchResult, message: string) => {
    try {
      await api.post("/matching/connect", { to_user_id: match.target_user_id, match_id: match.id, message: message || "Hi! I'm interested in this opportunity." });
      toast.success(`Request sent to ${match.target_name}`);
    } catch { toast.error("Failed to send request"); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-xl text-ink-900">Dashboard</h1>
          <p className="text-sm text-ink-400">Welcome, {user?.full_name}</p>
        </div>
        <Button size="sm" icon={<RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />} onClick={refreshMatches} loading={refreshing}>
          Refresh matches
        </Button>
      </div>

      {/* Profile summary */}
      {profile && (
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-success-light flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-ink-900">{user?.full_name}</h2>
              <p className="text-xs text-ink-400 mt-0.5">
                {[profile.institution, profile.degree, profile.graduation_year && `Class of ${profile.graduation_year}`].filter(Boolean).join(" · ")}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {profile.skills.map((s) => (
                  <Badge key={s.id} variant="success">{s.name}</Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">{profile.engagement_preference.replace("_", " ")}</Badge>
                {profile.looking_for_cofounder && <Badge variant="accent" dot>Open to co-found</Badge>}
              </div>
            </div>
          </div>
        </Card>
      )}

      <Tabs
        tabs={[
          { id: "matches", label: "My matches", icon: <Users className="h-3.5 w-3.5" />, count: matches.length },
          { id: "opportunities", label: "Browse roles", icon: <Search className="h-3.5 w-3.5" />, count: opportunities.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "matches" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((m) => <MatchCard key={m.id} match={m} onConnect={setConnectTarget} />)}
          {matches.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={<Users className="h-6 w-6" />}
                title="No matches yet"
                description="Complete your profile and click 'Refresh matches' to find opportunities."
              />
            </div>
          )}
        </div>
      )}

      {tab === "opportunities" && (
        <div className="space-y-3">
          {opportunities.map((opp) => (
            <Card key={opp.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-ink-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-900">{opp.title}</h3>
                    <p className="text-xs text-ink-400 capitalize">{opp.engagement_type.replace("_", " ")}</p>
                  </div>
                </div>
                {opp.compensation_min && (
                  <span className="text-xs text-ink-400 shrink-0">
                    {opp.compensation_currency} {opp.compensation_min?.toLocaleString()}–{opp.compensation_max?.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3 ml-[52px]">
                {opp.required_skills.map((s) => {
                  const has = profile?.skills.some((ps) => ps.name.toLowerCase() === s.toLowerCase());
                  return <Badge key={s} variant={has ? "success" : "outline"}>{s}</Badge>;
                })}
              </div>
            </Card>
          ))}
          {opportunities.length === 0 && (
            <EmptyState icon={<Briefcase className="h-6 w-6" />} title="No open roles" description="Check back soon." />
          )}
        </div>
      )}

      <ConnectModal match={connectTarget} onClose={() => setConnectTarget(null)} onSend={handleConnect} />

      <Modal open={showCreate && !profile} onClose={() => setShowCreate(false)} title="Create your skill profile">
        <form onSubmit={createProfile} className="space-y-4">
          <Input label="Skills" value={pf.skills} onChange={(e) => setPf({ ...pf, skills: e.target.value })} placeholder="React, Python, Figma" hint="Comma-separated — these power your match score" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Institution" value={pf.institution} onChange={(e) => setPf({ ...pf, institution: e.target.value })} placeholder="e.g. Tribhuvan University" />
            <Input label="Degree" value={pf.degree} onChange={(e) => setPf({ ...pf, degree: e.target.value })} placeholder="e.g. BSc CS" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Graduation year" type="number" value={pf.graduation_year} onChange={(e) => setPf({ ...pf, graduation_year: e.target.value })} placeholder="2025" />
            <Select label="Engagement" value={pf.engagement_preference} onChange={(e) => setPf({ ...pf, engagement_preference: e.target.value })} options={[
              { value: "full_time", label: "Full Time" }, { value: "part_time", label: "Part Time" },
              { value: "contract", label: "Contract" }, { value: "internship", label: "Internship" },
              { value: "cofounder", label: "Co-Founder" },
            ]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Portfolio URL" value={pf.portfolio_url} onChange={(e) => setPf({ ...pf, portfolio_url: e.target.value })} placeholder="https://..." />
            <Input label="GitHub URL" value={pf.github_url} onChange={(e) => setPf({ ...pf, github_url: e.target.value })} placeholder="https://github.com/..." />
          </div>
          <label className="flex items-center gap-2.5 text-sm text-ink-600 cursor-pointer">
            <input type="checkbox" checked={pf.looking_for_cofounder} onChange={(e) => setPf({ ...pf, looking_for_cofounder: e.target.checked })} className="rounded border-ink-200 text-accent focus:ring-accent/20" />
            Open to co-founding opportunities
          </label>
          <Button type="submit" className="w-full">Create profile</Button>
        </form>
      </Modal>
    </div>
  );
}
