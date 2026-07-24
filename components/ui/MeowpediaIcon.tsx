interface MeowpediaIconProps {
  className?: string;
}

export function MeowpediaIcon({ className }: MeowpediaIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="72" height="54" fill="#7A5A66" />
      <rect x="6" y="6" width="6" height="42" fill="#FBF1DE" />
      <rect x="18" y="6" width="48" height="42" fill="#F6A8B8" />
      <rect x="35" y="20" width="14" height="14" fill="white" />
    </svg>
  );
}
