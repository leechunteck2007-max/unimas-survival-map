import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export type IconName =
  | "grid"
  | "food"
  | "book"
  | "toilet"
  | "card"
  | "printer"
  | "store"
  | "parking"
  | "bus"
  | "faculty"
  | "college"
  | "health"
  | "sports"
  | "surau"
  | "services"
  | "lab"
  | "laundry"
  | "building"
  | "image"
  | "tag";

const paths: Record<IconName, ReactNode> = {
  grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
  food: <><path d="M6 3v7a2 2 0 0 0 2 2V3M4 7h6M8 12v9M16 3v18M16 3c3 2 4 5 4 8h-4" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
  toilet: <><circle cx="8" cy="5" r="2" /><circle cx="16" cy="5" r="2" /><path d="M5 21v-7H3l2-5h6l2 5h-2v7M15 21v-6h-2V9h6v6h-2v6" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>,
  printer: <><path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M7 14h10v7H7zM17 11h.01" /></>,
  store: <><path d="M4 10v10h16V10M3 10l2-6h14l2 6" /><path d="M3 10a3 3 0 0 0 5 2 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 5-2M9 20v-5h6v5" /></>,
  parking: <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" /></>,
  bus: <><path d="M5 17V6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v11M5 12h14M8 7h8" /><circle cx="8" cy="17" r="1" /><circle cx="16" cy="17" r="1" /><path d="M7 21v-2M17 21v-2M3 17h18" /></>,
  faculty: <><path d="M3 10h18M5 10v9M9 10v9M15 10v9M19 10v9M3 21h18M12 3l9 5H3z" /></>,
  college: <><path d="M4 21V7l8-4 8 4v14M8 21v-6h8v6M8 10h.01M12 10h.01M16 10h.01" /></>,
  health: <><path d="M12 21s8-4.5 8-11V5l-3-2-5 3-5-3-3 2v5c0 6.5 8 11 8 11z" /><path d="M12 8v5M9.5 10.5h5" /></>,
  sports: <><circle cx="12" cy="12" r="9" /><path d="M5 8c2 1 3 3 3 5 0 2-1 4-2 5M19 8c-2 1-3 3-3 5 0 2 1 4 2 5M12 3c-1 2-2 4-2 6s1 4 2 6 2 4 2 6" /></>,
  surau: <><path d="M4 21h16M6 21v-8h12v8M5 13h14M8 13V9l4-4 4 4v4M12 5V2M12 2h3" /></>,
  services: <><path d="M5 4h14v16H5zM8 8h8M8 12h5M8 16h4" /><circle cx="17" cy="17" r="3" /><path d="m19 19 2 2" /></>,
  lab: <><path d="M9 3h6M10 3v6l-5 8a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-5-8V3M8 15h8" /></>,
  laundry: <><rect x="4" y="3" width="16" height="18" rx="2" /><circle cx="12" cy="14" r="4" /><path d="M8 7h.01M11 7h.01" /></>,
  building: <><path d="M4 21V5l8-3 8 3v16M8 21v-3h8v3M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-4.5-4.5L7 20" /></>,
  tag: <><path d="M20 13 13 20 4 11V4h7z" /><circle cx="8.5" cy="8.5" r="1" /></>,
};

function IconBase({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function AppIcon({ name, ...props }: IconProps & { name: IconName }) {
  return <IconBase {...props}>{paths[name]}</IconBase>;
}

export function CompassIcon(props: IconProps) {
  return <IconBase {...props}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></IconBase>;
}

export function SearchIcon(props: IconProps) {
  return <IconBase {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></IconBase>;
}

export function MapPinIcon(props: IconProps) {
  return <IconBase {...props}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></IconBase>;
}

export function SparklesIcon(props: IconProps) {
  return <IconBase {...props}><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2zM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7zM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8z" /></IconBase>;
}

export function ArrowRightIcon(props: IconProps) {
  return <IconBase {...props}><path d="M5 12h14M13 6l6 6-6 6" /></IconBase>;
}

export function BuildingIcon(props: IconProps) {
  return <AppIcon {...props} name="building" />;
}

export function ImageIcon(props: IconProps) {
  return <AppIcon {...props} name="image" />;
}

export function TagIcon(props: IconProps) {
  return <AppIcon {...props} name="tag" />;
}
