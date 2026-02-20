import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/30 animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-card w-full max-w-lg max-h-[85vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-ink-100 z-10">
          <h2 className="font-display font-bold text-ink-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-2 text-ink-400 transition" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
