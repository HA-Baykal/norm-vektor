export function LineIcon({ name }: { name: string }) {
  const common = "stroke-current";
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {name === "check" && <path className={common} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />}
      {name === "phone" && <path className={common} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2 4.1 1.4V20c0 .6-.4 1-1 1C9.9 21 3 14.1 3 5.5c0-.6.4-1 1-1h3.4l1.4 4.1-2.2 2.2Z" />}
    </svg>
  );
}
