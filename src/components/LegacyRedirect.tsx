import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { resolveLegacyRedirect } from "../constants/redirects";

/**
 * Последний рубеж склейки дублей: если слой редиректов хостинга (vercel.json)
 * и серверный 301 (api/page.ts) по какой-то причине не сработали, уводим старый
 * адрес на канонический хотя бы внутри SPA.
 *
 * Для краулеров клиентский переход слабее настоящего 301, поэтому те же правила
 * продублированы в vercel.json, public/_redirects и api/page.ts — источник
 * правил один: src/constants/redirects.ts.
 */
export default function LegacyRedirect({ fallback }: { fallback: ReactNode }) {
  const location = useLocation();
  const target = resolveLegacyRedirect(location.pathname);

  if (!target) return <>{fallback}</>;
  return <Navigate to={target} replace />;
}
