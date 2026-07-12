import { useEffect, useRef } from "react";
/**
 * Виджет карточки компании 2ГИS.
 * Встраивает iframe с рейтингом, отзывами и информацией из 2ГИС.
 *
 * Данные закодированы 2ГИС в base64 (ветка и организация «Вектор Комфорта»).
 */
// Закодированная в base64 конфигурация виджета (из кода, который выдал 2ГИС)
const WIDGET_HTML_BASE64 =
  "PGhlYWQ+PHNjcmlwdCB0eXBlPSJ0ZXh0L2phdmFzY3JpcHQiPgogICAgd2luZG93Ll9fc2l6ZV9fPSdiaWcnOwogICAgd2luZG93Ll9fdGhlbWVfXz0nbGlnaHQnOwogICAgd2luZG93Ll9fYnJhbmNoSWRfXz0nNzAwMDAwMDExMTU0OTc2NTUnCiAgICB3aW5kb3cuX19vcmdJZF9fPSc3MDAwMDAwMTExNTQ5NzY1NCcKICAgPC9zY3JpcHQ+PHNjcmlwdCBjcm9zc29yaWdpbj0iYW5vbnltb3VzIiB0eXBlPSJtb2R1bGUiIHNyYz0iaHR0cHM6Ly9kaXNrLjJnaXMuY29tL3dpZGdldC1jb25zdHJ1Y3Rvci9hc3NldHMvaWZyYW1lLmpzIj48L3NjcmlwdD48bGluayByZWw9Im1vZHVsZXByZWxvYWQiIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIGhyZWY9Imh0dHBzOi8vZGlzay4yZ2lzLmNvbS93aWRnZXQtY29uc3RydWN0b3IvYXNzZXRzL2RlZmF1bHRzLmpzIj48bGluayByZWw9InN0eWxlc2hlZXQiIGNyb3Nzb3JpZ2luPSJhbm9ueW1vdXMiIGhyZWY9Imh0dHBzOi8vZGlzay4yZ2lzLmNvbS93aWRnZXQtY29uc3RydWN0b3IvYXNzZXRzL2RlZmF1bHRzLmNzcyI+PC9oZWFkPjxib2R5PjxkaXYgaWQ9ImlmcmFtZSI+PC9kaXY+PC9ib2R5Pg==";
export default function DoubleGisWidget() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentWindow?.document;
      if (!doc) return;
      // Декодируем base64 → HTML и записываем внутрь iframe
      const html = decodeURIComponent(escape(atob(WIDGET_HTML_BASE64)));
      doc.open();
      doc.write(html);
      doc.close();
    } catch (e) {
      // Если что-то пошло не так — молча не ломаем страницу
      console.error("Не удалось загрузить виджет 2ГИС:", e);
    }
  }, []);
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shadow-sm">
      <iframe
        ref={iframeRef}
        title="Отзывы и рейтинг Вектор Комфорта на 2ГИС"
        frameBorder="0"
        className="w-full"
        style={{ height: "824px", maxHeight: "824px" }}
        sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
      />
    </div>
  );
}
