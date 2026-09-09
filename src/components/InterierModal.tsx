import { useEffect, useRef, useState, type RefObject } from "react";
import { INTERIER_APP_URL, INTERIER_EXTERNAL_URL, INTERIER_TITLE, trackInterierEvent } from "../constants/interier";

interface Props { open: boolean; onClose: () => void; triggerRef?: RefObject<HTMLButtonElement | null>; }

export default function InterierModal({ open, onClose, triggerRef }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const previous = document.body.style.cssText;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    setLoaded(false);
    requestAnimationFrame(() => dialogRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { trackInterierEvent("interier_close_modal"); onClose(); } };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.cssText = previous;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) triggerRef?.current?.focus();
  }, [open, triggerRef]);

  if (!open) return null;
  const closeModal = () => { trackInterierEvent("interier_close_modal"); onClose(); };
  return (
    <div className="interier-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={INTERIER_TITLE} className="interier-dialog">
        <header className="interier-dialog-header">
          <strong>{INTERIER_TITLE}</strong>
          <div className="flex items-center gap-3">
            <a href={INTERIER_EXTERNAL_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackInterierEvent("interier_open_newtab")} className="interier-external-link">Открыть в новом окне ↗</a>
            <button type="button" aria-label="Закрыть Interier" onClick={closeModal} className="interier-close">✕</button>
          </div>
        </header>
        <div className="interier-frame-wrap">
          {!loaded && <div className="interier-loader"><span className="interier-spinner" aria-hidden="true" /><span>Загружаем Interier…</span><small>Сервис может просыпаться до минуты</small></div>}
          <iframe src={INTERIER_APP_URL} title={INTERIER_TITLE} allow="camera" onLoad={() => setLoaded(true)} className={loaded ? "interier-frame is-loaded" : "interier-frame"} />
        </div>
      </div>
    </div>
  );
}
