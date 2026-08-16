interface MobileBottomBarProps {
  onOpenBooking: () => void;
}
const MAX_LINK = "https://max.ru/u/f9LHodD0cOIbMOqTBdWMtjtwwW7JyWEldW-Tz3JENfITHpjVmqPbiKibF0U";
export default function MobileBottomBar({ onOpenBooking }: MobileBottomBarProps) {
  const openChat = () => {
    // Показываем виджет Jivo (CSS прячет его, пока на body нет класса jivo-open)
    document.body.classList.add("jivo-open");
    // @ts-ignore
    if (window.jivo_api && window.jivo_api.open) {
      // @ts-ignore
      window.jivo_api.open();
    } else {
      window.open("https://jivosite.com", "_blank", "noopener,noreferrer");
    }
  };
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-800 p-2.5 sm:hidden shadow-2xl">
      <div className="grid grid-cols-4 gap-2">
        <a href="tel:+79149146606" className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition text-center">
          <span className="text-lg">📞</span><span className="text-[10px] font-bold mt-0.5">Звонок</span>
        </a>
        <a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#1a3a5c] text-white hover:bg-[#122943] transition text-center border border-white/10">
          <span className="w-5 h-5 rounded bg-white text-[#1a3a5c] grid place-items-center text-[8px] font-black">MAX</span><span className="text-[10px] font-bold mt-0.5">MAX</span>
        </a>
        <button onClick={openChat} className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#ff6b35] text-white hover:bg-[#e95620] transition text-center">
          <span className="text-lg">💬</span><span className="text-[10px] font-bold mt-0.5">Чат</span>
        </button>
        <button onClick={onOpenBooking} className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition text-center">
          <span className="text-lg">📐</span><span className="text-[10px] font-bold mt-0.5">Замер 0₽</span>
        </button>
      </div>
    </div>
  );
}
