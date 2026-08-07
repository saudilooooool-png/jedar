type IconProps = { name: IconName; className?: string };

export type IconName =
  | "home"
  | "search"
  | "horn"
  | "chat"
  | "user"
  | "star"
  | "flag"
  | "pin"
  | "check"
  | "lock"
  | "mic"
  | "phone"
  | "cal"
  | "thumb"
  | "shield"
  | "doc"
  | "bell";

const PATHS: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20.5 20.5L16 16" />
    </>
  ),
  horn: (
    <>
      <path d="M3 10v5h3l8 4V6l-8 4H3z" />
      <path d="M17.5 9.5a5 5 0 010 6" />
    </>
  ),
  chat: <path d="M4 5h16v11H9l-5 4V5z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.5-3.8 4.8-4.8 7.5-4.8s6 1 7.5 4.8" />
    </>
  ),
  star: (
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z" />
  ),
  flag: (
    <>
      <path d="M5.5 21V4" />
      <path d="M5.5 4.5h12l-2 4 2 4h-12" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5L20 6.5" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0013 0" />
      <path d="M12 18v3.5" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.6a12 12 0 005 5L15 13l5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z" />
  ),
  cal: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2" />
      <path d="M4 10.5h16M8.5 3v4M15.5 3v4" />
    </>
  ),
  thumb: (
    <>
      <path d="M7.5 11.5v8.5H4v-8.5h3.5z" />
      <path d="M7.5 12l4-7.5a2 2 0 012 2v4h5a2 2 0 012 2.4l-1.2 5A2 2 0 0117.3 20H7.5" />
    </>
  ),
  shield: <path d="M12 3l7 3v5.5c0 4.8-3.4 8.2-7 9.5-3.6-1.3-7-4.7-7-9.5V6l7-3z" />,
  doc: (
    <>
      <path d="M6 3h9l4 4v14H6V3z" />
      <path d="M15 3v4h4" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16v-5a6 6 0 0112 0v5l1.5 2.5H4.5L6 16z" />
      <path d="M10 21a2.2 2.2 0 004 0" />
    </>
  ),
};

export function Icon({ name, className = "i" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

export function BrickLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="1" y="4" width="11" height="8" rx="1.5" fill="#A9701F" />
      <rect x="14" y="4" width="11" height="8" rx="1.5" fill="#24344D" opacity=".85" />
      <rect x="7" y="14" width="11" height="8" rx="1.5" fill="#24344D" opacity=".85" />
    </svg>
  );
}
