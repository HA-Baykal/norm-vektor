import { useEffect, useRef, useState, type RefObject, type TouchEvent } from "react";
import {
  INTERIER_APP_URL,
  INTERIER_ORIGIN,
  INTERIER_TITLE,
  extractPaymentUrl,
  interierEmbedUrl,
  isPaymentUrl,
  openPaymentTab,
  trackInterierEvent,
} from "../constants/interier";

interface Props {
  open: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

export default function InterierModal({ open, onClose, triggerRef }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const ignoreNextLoad = useRef(false);
  const sawFirstLoad = useRef(false);
  const openedAt = useRef(0);
  const touchStart = useRef<{ y: number; x: number } | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [loaded, setLoaded] = useState(false);
  const [breakout, setBreakout] = useState(false);
  const [frameSrc, setFrameSrc] = useState(interierEmbedUrl());

  useEffect(() => {
    if (!open) return;

    restoreFocus.current = true;
    sawFirstLoad.current = false;
    ignoreNextLoad.current = false;
    openedAt.current = Date.now();
    setLoaded(false);
    setBreakout(false);
    setFrameSrc(interierEmbedUrl());

    const scrollY = window.scrollY;
    const previous = document.body.style.cssText;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    const focusTimer = window.requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        trackInterierEvent("interier_close_modal");
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const nodes = dialogRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex='-1'])"
      );
      const list = Array.from(nodes).filter((el) => !el.hasAttribute("disabled"));
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== INTERIER_ORIGIN) return;
      const url = extractPaymentUrl(event.data);
      if (url) {
        openPaymentTab(url);
        setBreakout(true);
        return;
      }
      const type = typeof event.data === "object" && event.data ? (event.data as { type?: string }).type : "";
      if (type === "interier:pay" || type === "interier:payment") {
        const payload = extractPaymentUrl(event.data) || INTERIER_APP_URL;
        openPaymentTab(payload);
        setBreakout(true);
      }
    };

    const onPerf = (list: PerformanceObserverEntryList) => {
      for (const entry of list.getEntries()) {
        if (isPaymentUrl(entry.name)) {
          openPaymentTab(entry.name);
          setBreakout(true);
        }
      }
    };

    let observer: PerformanceObserver | null = null;
    try {
      observer = new PerformanceObserver(onPerf);
      observer.observe({ type: "resource", buffered: true });
    } catch {
      observer = null;
    }

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("message", onMessage);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("message", onMessage);
      observer?.disconnect();
      document.body.style.cssText = previous;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (open || !restoreFocus.current) return;
    restoreFocus.current = false;
    triggerRef?.current?.focus();
  }, [open, triggerRef]);

  if (!open) return null;

  const closeModal = () => {
    trackInterierEvent("interier_close_modal");
    onClose();
  };

  const openExternal = () => {
    trackInterierEvent("interier_open_newtab");
  };

  const handleIframeLoad = () => {
    if (ignoreNextLoad.current) {
      ignoreNextLoad.current = false;
      setLoaded(true);
      return;
    }
    if (!sawFirstLoad.current || Date.now() - openedAt.current < 4000) {
      sawFirstLoad.current = true;
      setLoaded(true);
      return;
    }
    // Повторная полная загрузка iframe — ЮMoney/OAuth ушли с origin приложения
    // и платёжная страница внутри окна пустая. Возвращаем Interier и предлагаем новую вкладку.
    setBreakout(true);
    setLoaded(true);
    ignoreNextLoad.current = true;
    const next = new URL(interierEmbedUrl());
    next.searchParams.set("r", String(Date.now()));
    setFrameSrc(next.toString());
  };

  const onTouchStart = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    touchStart.current = { y: touch.clientY, x: touch.clientX };
  };

  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const touch = event.changedTouches[0];
    const dy = touch.clientY - start.y;
    const dx = Math.abs(touch.clientX - start.x);
    if (dy > 90 && dx < 80) closeModal();
  };

  return (
    <div
      className="interier-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={INTERIER_TITLE}
        className="interier-dialog"
      >
        <header
          className="interier-dialog-header"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="interier-dialog-heading">
            <span className="interier-swipe-handle" aria-hidden="true" />
            <strong>{INTERIER_TITLE}</strong>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={INTERIER_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={openExternal}
              className="interier-external-link"
            >
              Открыть в новом окне ↗
            </a>
            <button
              ref={closeBtnRef}
              type="button"
              aria-label="Закрыть Interier"
              onClick={closeModal}
              className="interier-close"
            >
              ✕
            </button>
          </div>
        </header>
        <div className="interier-frame-wrap">
          {!loaded && (
            <div className="interier-loader">
              <span className="interier-spinner" aria-hidden="true" />
              <span>Загружаем Interier…</span>
              <small>Сервис может просыпаться до минуты</small>
            </div>
          )}
          {breakout && (
            <div className="interier-breakout" role="status">
              <p>
                ЮMoney не открывается внутри окна сайта. Оплату нужно завершить в новой вкладке.
              </p>
              <button
                type="button"
                className="interier-primary"
                onClick={() => {
                  openPaymentTab(INTERIER_APP_URL);
                  trackInterierEvent("interier_open_newtab");
                }}
              >
                Открыть оплату в новой вкладке ↗
              </button>
              <button type="button" className="interier-breakout-dismiss" onClick={() => setBreakout(false)}>
                Остаться в мини-приложении
              </button>
            </div>
          )}
          <iframe
            src={frameSrc}
            title={INTERIER_TITLE}
            allow="camera; microphone; payment; clipboard-write; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onLoad={handleIframeLoad}
            className={loaded ? "interier-frame is-loaded" : "interier-frame"}
          />
        </div>
      </div>
    </div>
  );
}
