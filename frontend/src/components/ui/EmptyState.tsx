import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center text-ink-300 mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-ink-700 mb-1">{title}</h3>
      <p className="text-xs text-ink-400 max-w-xs mb-5">{description}</p>
      {action}
    </div>
  );
}
