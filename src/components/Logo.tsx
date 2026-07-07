export default function Logo({ className = "w-10 h-10 md:w-12 md:h-12" }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="vk-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563eb" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="vk-acc" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fb923c" />
            <stop offset="1" stopColor="#ea580c" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#vk-bg)" />
        <rect x="10" y="10" width="28" height="28" rx="3" stroke="white" strokeWidth="2" fill="none" />
        <line x1="24" y1="10" x2="24" y2="38" stroke="white" strokeWidth="2" />
        <line x1="10" y1="24" x2="38" y2="24" stroke="white" strokeWidth="2" />
        <path d="M13 35 L35 13" stroke="url(#vk-acc)" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M27 13 L35 13 L35 21"
          stroke="url(#vk-acc)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
