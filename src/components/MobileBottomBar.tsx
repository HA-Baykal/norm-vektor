interface MobileBottomBarProps {
  onOpenBooking: () => void;
}

export default function MobileBottomBar({ onOpenBooking }: MobileBottomBarProps) {
  const openChat = () => {
    // @ts-ignore
    if (window.jivo_api && window.jivo_api.open) window.jivo_api.open();
    else window.open("https://jivosite.com", "_blank");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-800 p-2.5 sm:hidden shadow-2xl">
      <div className="grid grid-cols-3 gap-2">
        <a
          href="tel:+79149146606"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition text-center"
        >
          <span className="text-lg">📞</span>
          <span className="text-[11px] font-bold mt-0.5">Позвонить</span>
        </a>

        <button
          onClick={openChat}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#ff6b35] text-white hover:bg-[#e95620] transition text-center"
        >
          <span className="text-lg">💬</span>
          <span className="text-[11px] font-bold mt-0.5">Чат Jivo</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition text-center"
        >
          <span className="text-lg">📐</span>
          <span className="text-[11px] font-bold mt-0.5">Замер 0 ₽</span>
        </button>
      </div>
    </div>
  );
}