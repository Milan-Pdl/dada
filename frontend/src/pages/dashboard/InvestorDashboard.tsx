import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { InvestorProfile, MatchResult, ConnectionRequest as ConnReq } from "@/types";
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
import { RefreshCw, Inbox, CheckCircle, XCircle, BarChart3, Globe, TrendingUp } from "lucide-react";

export default function InvestorDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [connections, setConnections] = useState<ConnReq[]>([]);
  const [tab, setTab] = useState("dealflow");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [connectTarget, setConnectTarget] = useState<MatchResult | null>(null);

  const [ipf, setIpf] = useState({
    investor_type: "angel", investment_thesis: "", preferred_sectors: "", preferred_stages: "",
    check_size_min: "", check_size_max: "", is_diaspora: false, country: "Nepal",
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, mRes, cRes] = await Promise.all([
        api.get("/investors/me").catch(() => null),
        api.get("/matching/results").catch(() => ({ data: [] })),
        api.get("/matching/connections").catch(() => ({ data: [] })),
      ]);
      if (pRes) setProfile(pRes.data);
      else setShowCreate(true);
      setMatches(mRes?.data || []);
      setConnections(cRes?.data || []);
    } finally { setLoading(false); }
  };

  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/investors", {
        ...ipf,
        preferred_sectors: ipf.preferred_sectors.split(",").map((s) => s.trim()).filter(Boolean),
        preferred_stages: ipf.preferred_stages.split(",").map((s) => s.trim()).filter(Boolean),
        check_size_min: ipf.check_size_min ? Number(ipf.check_size_min) : null,
        check_size_max: ipf.check_size_max ? Number(ipf.check_size_max) : null,
      });
      setShowCreate(false);
      toast.success("Investor profile created");
      loadData();
    } catch { toast.error("Failed to create profile"); }
  };

  const refreshMatches = async () => {
    setRefreshing(true);
    try {
      const { data } = await api.post("/matching/refresh");
      setMatches(data);
      toast.success(`Found ${data.length} deals`);
    } catch { toast.error("Failed to refresh"); }
    setRefreshing(false);
  };

  const handleConnect = async (match: MatchResult, message: string) => {
    try {
      await api.post("/matching/connect", { to_user_id: match.target_user_id, match_id: match.id, message: message || "I'm interested in learning more about your startup." });
      toast.success(`Request sent to ${match.target_name}`);
    } catch { toast.error("Failed to send request"); }
  };

  const handleConnectionAction = async (id: number, action: "accept" | "decline") => {
    try {
      await api.put(`/matching/connections/${id}/${action}`);
      toast.success(`Connection ${action}ed`);
      loadData();
    } catch { toast.error(`Failed to ${action} connection`); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const pendingIncoming = connections.filter((c) => c.to_user_id === user?.id && c.status === "pending");
  const otherConnections = connections.filter((c) => !(c.to_user_id === user?.id && c.status === "pending"));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-xl text-ink-900">Dashboard</h1>
          <p className="text-sm text-ink-400">Welcome, {user?.full_name}</p>
        </div>
        <Button size="sm" icon={<RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />} onClick={refreshMatches} loading={refreshing}>
          Refresh deal flow
        </Button>
      </div>

      {/* Profile */}
      {profile && (
        <Card>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-warn-light flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-warn" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-ink-900 capitalize">{profile.investor_type} Investor</h2>
                {profile.is_diaspora && <Badge variant="accent" dot>Diaspora</Badge>}
              </div>
              {profile.investment_thesis && (
                <p className="text-sm text-ink-400 mt-1">{profile.investment_thesis}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {profile.preferred_sectors.map((s) => <Badge key={s} variant="accent">{s}</Badge>)}
                {profile.preferred_stages.map((s) => <Badge key={s} variant="success">{s}</Badge>)}
              </div>
              {profile.check_size_min && (
                <p className="text-xs text-ink-400 mt-2">
                  ${profile.check_size_min?.toLocaleString()} – ${profile.check_size_max?.toLocaleString()} {profile.check_size_currency}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <Tabs
        tabs={[
          { id: "dealflow", label: "Deal flow", icon: <TrendingUp className="h-3.5 w-3.5" />, count: matches.length },
          { id: "connections", label: "Connections", icon: <Inbox className="h-3.5 w-3.5" />, count: pendingIncoming.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      {/* Deal Flow */}
      {tab === "dealflow" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((m) => <MatchCard key={m.id} match={m} onConnect={setConnectTarget} />)}
          {matches.length === 0 && (
            <div className="col-span-full">
              <EmptyState icon={<TrendingUp className="h-6 w-6" />} title="No deals yet" description="Complete your profile and refresh to see thesis-aligned startups." />
            </div>
          )}
        </div>
      )}

      {/* Connections */}
      {tab === "connections" && (
        <div className="space-y-6">
          {/* Pending requests */}
          {pendingIncoming.length > 0 && (
            <section>
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-3">Pending requests</p>
              <div className="space-y-2">
                {pendingIncoming.map((c) => (
                  <Card key={c.id}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-ink-500">
                            {c.from_name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink-900">{c.from_name}</p>
                          {c.message && <p className="text-xs text-ink-400 truncate">{c.message}</p>}
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Button size="sm" variant="ghost" onClick={() => handleConnectionAction(c.id, "accept")}>
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="ml-1">Accept</span>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleConnectionAction(c.id, "decline")}>
                          <XCircle className="h-4 w-4 text-danger" />
                          <span className="ml-1">Decline</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Other connections */}
          {otherConnections.length > 0 && (
            <section>
              <p className="text-xs font-medium text-ink-400 uppercase tracking-wider mb-3">All connections</p>
              <div className="space-y-2">
                {otherConnections.map((c) => {
                  const isIncoming = c.to_user_id === user?.id;
                  const otherName = isIncoming ? c.from_name : c.to_name;
                  return (
                    <Card key={c.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-surface-2 flex items-center justify-center">
                            <span className="text-xs font-bold text-ink-500">
                              {otherName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-ink-900">{otherName}</p>
                            {c.message && <p className="text-xs text-ink-400 truncate max-w-xs">{c.message}</p>}
                          </div>
                        </div>
                        <Badge variant={c.status === "accepted" ? "success" : c.status === "declined" ? "danger" : "warn"} dot>
                          {c.status}
                        </Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {connections.length === 0 && (
            <EmptyState icon={<Inbox className="h-6 w-6" />} title="No connections" description="Connect with startups from your deal flow to start conversations." />
          )}
        </div>
      )}

      <ConnectModal match={connectTarget} onClose={() => setConnectTarget(null)} onSend={handleConnect} />

      <Modal open={showCreate && !profile} onClose={() => setShowCreate(false)} title="Set up your investor profile">
        <form onSubmit={createProfile} className="space-y-4">
          <Select label="Investor type" value={ipf.investor_type} onChange={(e) => setIpf({ ...ipf, investor_type: e.target.value })} options={[
            { value: "angel", label: "Angel Investor" }, { value: "vc", label: "VC" },
            { value: "diaspora", label: "Diaspora Investor" }, { value: "institutional", label: "Institutional" },
          ]} />
          <Textarea label="Investment thesis" value={ipf.investment_thesis} onChange={(e) => setIpf({ ...ipf, investment_thesis: e.target.value })} placeholder="What kind of startups do you back and why?" rows={3} />
          <Input label="Preferred sectors" value={ipf.preferred_sectors} onChange={(e) => setIpf({ ...ipf, preferred_sectors: e.target.value })} placeholder="fintech, edtech, healthtech" hint="Comma-separated" />
          <Input label="Preferred stages" value={ipf.preferred_stages} onChange={(e) => setIpf({ ...ipf, preferred_stages: e.target.value })} placeholder="mvp, early_traction" hint="Comma-separated" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Min check (USD)" type="number" value={ipf.check_size_min} onChange={(e) => setIpf({ ...ipf, check_size_min: e.target.value })} placeholder="10000" />
            <Input label="Max check (USD)" type="number" value={ipf.check_size_max} onChange={(e) => setIpf({ ...ipf, check_size_max: e.target.value })} placeholder="100000" />
          </div>
          <label className="flex items-center gap-2.5 text-sm text-ink-600 cursor-pointer">
            <input type="checkbox" checked={ipf.is_diaspora} onChange={(e) => setIpf({ ...ipf, is_diaspora: e.target.checked })} className="rounded border-ink-200 text-accent focus:ring-accent/20" />
            <Globe className="h-4 w-4 text-ink-400" />
            I'm a diaspora investor
          </label>
          <Button type="submit" className="w-full">Create profile</Button>
        </form>
      </Modal>
    </div>
  );
}
