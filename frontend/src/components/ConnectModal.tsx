import { useState } from "react";
import { MatchResult } from "@/types";
import Modal from "./ui/Modal";
import Textarea from "./ui/Textarea";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import { Send } from "lucide-react";

interface Props {
  match: MatchResult | null;
  onClose: () => void;
  onSend: (match: MatchResult, message: string) => Promise<void>;
}

export default function ConnectModal({ match, onClose, onSend }: Props) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  if (!match) return null;

  const scorePercent = Math.round(match.overall_score * 100);

  const handleSend = async () => {
    setSending(true);
    await onSend(match, message);
    setSending(false);
    setMessage("");
    onClose();
  };

  return (
    <Modal open={!!match} onClose={onClose} title="Send connection request">
      <div className="space-y-5">
        {/* Who you're connecting with */}
        <div className="flex items-center gap-3 p-3 bg-surface-1 rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-accent-muted flex items-center justify-center">
            <span className="text-sm font-bold text-accent">
              {match.target_name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-ink-900">{match.target_name}</p>
            <p className="text-xs text-ink-400 capitalize">{match.target_role}</p>
          </div>
          <Badge variant={scorePercent >= 60 ? "success" : "default"}>{scorePercent}% match</Badge>
        </div>

        {/* Matched skills preview */}
        {match.matched_skills.length > 0 && (
          <div>
            <p className="text-xs text-ink-400 mb-2">Matched on</p>
            <div className="flex flex-wrap gap-1.5">
              {match.matched_skills.map((s) => (
                <Badge key={s} variant="success">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Message */}
        <Textarea
          label="Message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Introduce yourself briefly — why do you want to connect?"
          rows={3}
        />

        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button
            onClick={handleSend}
            loading={sending}
            icon={<Send className="h-3.5 w-3.5" />}
            className="flex-1"
          >
            Send request
          </Button>
        </div>
      </div>
    </Modal>
  );
}
