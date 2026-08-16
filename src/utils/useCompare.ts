import { useCallback, useEffect, useState } from "react";
import { conditioners } from "../components/CatalogConditioners";

const STORAGE_KEY = "vk_compare_ids";
const MAX_COMPARE = 4;

export function useCompare() {
  const [ids, setIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as number[];
        return parsed.filter((id) => conditioners.some((c) => c.id === id)).slice(0, MAX_COMPARE);
      }
    } catch { /* ignore */ }
    return [];
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch { /* ignore */ }
  }, [ids]);

  const isSelected = useCallback((id: number) => ids.includes(id), [ids]);
  const toggle = useCallback((id: number) => {
    setIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);
  const clear = useCallback(() => setIds([]), []);
  const selected = conditioners.filter((c) => ids.includes(c.id));
  return { ids, selected, isSelected, toggle, clear, max: MAX_COMPARE };
}
