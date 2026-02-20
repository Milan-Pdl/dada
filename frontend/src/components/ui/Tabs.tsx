import { ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex gap-1 p-1 bg-surface-2 rounded-xl w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150
            ${active === tab.id
              ? "bg-white text-ink-900 shadow-soft"
              : "text-ink-400 hover:text-ink-600"
            }
          `}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
              active === tab.id ? "bg-accent-muted text-accent" : "bg-surface-3 text-ink-400"
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
