import { Link } from "react-router-dom";
import { LEGAL_PATHS } from "../data/legal";

// ============================================================================
// Чекбокс согласия на обработку ПДн (ст. 9 152-ФЗ): отдельное осознанное
// действие пользователя со ссылками на политику и текст согласия.
// Используется во всех формах, которые отправляют данные на /api/leads.
// ============================================================================
interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  id?: string;
  className?: string;
}

export default function ConsentCheckbox({ checked, onChange, id = "pd-consent", className = "" }: Props) {
  return (
    <label htmlFor={id} className={`flex items-start gap-2.5 cursor-pointer select-none text-[11px] leading-snug text-slate-600 dark:text-slate-400 ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 dark:border-slate-600 accent-[#ff6b35]"
      />
      <span>
        Согласен(на) на{" "}
        <Link to={LEGAL_PATHS.consent} target="_blank" className="underline hover:text-[#ff6b35]">обработку персональных данных</Link>
        {" "}в соответствии с{" "}
        <Link to={LEGAL_PATHS.policy} target="_blank" className="underline hover:text-[#ff6b35]">политикой конфиденциальности</Link>
      </span>
    </label>
  );
}
