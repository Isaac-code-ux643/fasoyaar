export default function Flag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 90 60"
      className={className ?? "h-10"}
      role="img"
      aria-label="Drapeau du Burkina Faso"
    >
      <rect width="90" height="30" fill="#EF2B2D" />
      <rect y="30" width="90" height="30" fill="#009E49" />
      <polygon
        points="45,20 47.35,26.76 54.51,26.91 48.8,31.24 50.88,38.09 45,34 39.12,38.09 41.2,31.24 35.49,26.91 42.65,26.76"
        fill="#FCD116"
      />
    </svg>
  );
}
