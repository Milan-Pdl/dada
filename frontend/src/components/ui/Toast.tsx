import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

interface ToastCtx {
  success: (msg: string) => void;
  error: (msg: string) => void;
}

const ToastContext = createContext<ToastCtx>(null!);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message: string, type: "success" | "error") => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  const success = useCallback((msg: string) => add(msg, "success"), [add]);
  const error = useCallback((msg: string) => add(msg, "error"), [add]);

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastNotification key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastNotification({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 px-4 py-3 bg-white border rounded-xl shadow-card
        transition-all duration-200 max-w-sm
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        ${isSuccess ? "border-success/20" : "border-danger/20"}
      `}
    >
      {isSuccess
        ? <CheckCircle className="h-4 w-4 text-success shrink-0" />
        : <XCircle className="h-4 w-4 text-danger shrink-0" />
      }
      <p className="text-sm text-ink-700 flex-1">{toast.message}</p>
      <button onClick={onClose} className="p-1 rounded hover:bg-surface-2 text-ink-300 shrink-0" aria-label="Dismiss">
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

export const useToast = () => useContext(ToastContext);
