import { useCallback, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  alt: string;
  /** Подписи поверх картинки; по умолчанию «До» и «После». */
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

// Сравнение «до и после»: тянешь ползунок — видишь разницу.
// Работает мышью, пальцем и с клавиатуры (стрелки ←/→).
export default function BeforeAfterSlider({
  before,
  after,
  alt,
  beforeLabel = "До",
  afterLabel = "После",
  className = "",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(96, Math.max(4, percent)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const stopDragging = () => {
    draggingRef.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(4, p - 4));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(96, p + 4));
  };

  return (
    <div
      ref={boxRef}
      role="slider"
      aria-label={`Сравнение до и после: ${alt}`}
      aria-valuemin={4}
      aria-valuemax={96}
      aria-valuenow={Math.round(position)}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onPointerLeave={stopDragging}
      onKeyDown={onKeyDown}
      className={`before-after aspect-[4/3] w-full rounded-[1.5rem] shadow-xl ${className}`}
    >
      <img src={after} alt={`${alt} — после`} loading="lazy" decoding="async" />
      <div className="before-after-after" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src={before} alt={`${alt} — до`} loading="lazy" decoding="async" />
      </div>
      <span className="before-after-label left-3">{beforeLabel}</span>
      <span className="before-after-label right-3">{afterLabel}</span>
      <div className="before-after-handle" style={{ left: `${position}%` }}>
        <span className="before-after-knob" aria-hidden>
          ↔
        </span>
      </div>
    </div>
  );
}
