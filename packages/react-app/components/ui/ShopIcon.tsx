interface ShopIconProps {
  className?: string;
}

export function ShopIcon({ className }: ShopIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 66 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="12" width="66" height="42" fill="#7A5A66" />
      <rect x="6" y="18" width="54" height="30" fill="#F6A8B8" />
      <rect x="18" width="30" height="6" fill="#7A5A66" />
      <rect x="18" y="6" width="6" height="6" fill="#7A5A66" />
      <rect x="42" y="6" width="6" height="6" fill="#7A5A66" />
      <rect x="24" y="30" width="12" height="12" fill="white" />
    </svg>
  );
}
