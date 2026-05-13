interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 36, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Logo Maître Zonon 666"
    >
      <ellipse cx="32" cy="32" rx="20" ry="11" fill="none" stroke="#D4AF37" strokeWidth="1.8"/>
      <circle cx="32" cy="32" r="7" fill="none" stroke="#D4AF37" strokeWidth="1.6"/>
      <circle cx="32" cy="32" r="2.5" fill="#D4AF37"/>
      <circle cx="32" cy="32" r="1" fill="#0d0b14"/>
      <line x1="32" y1="14" x2="32" y2="19" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="32" y1="45" x2="32" y2="50" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="10" y1="32" x2="15" y2="32" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="49" y1="32" x2="54" y2="32" stroke="#D4AF37" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="15" y1="17" x2="18.5" y2="20.5" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
      <line x1="45.5" y1="43.5" x2="49" y2="47" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
      <line x1="49" y1="17" x2="45.5" y2="20.5" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
      <line x1="18.5" y1="43.5" x2="15" y2="47" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}
