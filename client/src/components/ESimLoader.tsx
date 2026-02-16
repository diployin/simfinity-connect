import { useSettingByKey } from "@/hooks/useSettings";

export default function ESimLoader() {
  const logo = useSettingByKey('logo');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#f0f9f1] to-white dark:from-gray-950 dark:to-gray-900 px-6">

      {logo ? (
        <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md animate-in fade-in zoom-in duration-500">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={logo}
              alt="Loading..."
              className="max-w-[240px] md:max-w-[280px] w-full h-auto max-h-[120px] object-contain drop-shadow-sm transition-all duration-300"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#2c7338] animate-bounce [animation-delay:-0.3s]" />
            <span className="w-3 h-3 rounded-full bg-[#3d9a4d] animate-bounce [animation-delay:-0.15s]" />
            <span className="w-3 h-3 rounded-full bg-[#4ade80] animate-bounce" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <svg
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-24 h-24"
            >
              <rect
                x="16"
                y="8"
                width="64"
                height="80"
                rx="8"
                className="fill-white dark:fill-gray-800 stroke-[#2c7338]"
                strokeWidth="2.5"
              />

              <rect
                x="24"
                y="16"
                width="48"
                height="48"
                rx="6"
                className="fill-[#f0f9f1] dark:fill-gray-700 stroke-[#2c7338]"
                strokeWidth="1.5"
              />

              <rect x="28" y="20" width="18" height="18" rx="2" className="fill-[#2c7338]/15" />
              <rect x="50" y="20" width="18" height="18" rx="2" className="fill-[#2c7338]/15" />
              <rect x="28" y="42" width="18" height="18" rx="2" className="fill-[#2c7338]/15" />
              <rect x="50" y="42" width="18" height="18" rx="2" className="fill-[#2c7338]/15" />

              <line x1="48" y1="20" x2="48" y2="60" className="stroke-[#2c7338]/30" strokeWidth="1" />
              <line x1="28" y1="40" x2="68" y2="40" className="stroke-[#2c7338]/30" strokeWidth="1" />

              <rect
                x="28"
                y="70"
                width="40"
                height="4"
                rx="2"
                className="fill-[#2c7338]/20"
              />
              <rect
                x="28"
                y="78"
                width="24"
                height="3"
                rx="1.5"
                className="fill-[#2c7338]/10"
              />

              <g className="animate-pulse">
                <circle cx="76" cy="16" r="4" className="fill-[#3d9a4d]" />
                <circle cx="76" cy="16" r="7" className="fill-[#3d9a4d]/20" />
              </g>
            </svg>

            <div className="absolute -top-2 -right-2">
              <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                <path
                  d="M16 28C16 28 16 22 16 20"
                  className="stroke-[#2c7338] animate-signal-1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 22C12.5 19.5 19.5 19.5 22 22"
                  className="stroke-[#2c7338] animate-signal-2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M6 18C10 14 22 14 26 18"
                  className="stroke-[#2c7338] animate-signal-3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M2 14C8 8 24 8 30 14"
                  className="stroke-[#2c7338]/60 animate-signal-4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Sim</span>
              <span className="text-lg font-bold bg-gradient-to-r from-[#2c7338] to-[#3d9a4d] bg-clip-text text-transparent">finity</span>
            </div>
            <div className="flex gap-1">
              <span
                className="w-2 h-2 rounded-full bg-[#2c7338] animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-[#2c7338] animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-[#2c7338] animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes signal-wave {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .animate-signal-1 {
          animation: signal-wave 1.6s ease-in-out infinite;
          animation-delay: 0s;
        }
        .animate-signal-2 {
          animation: signal-wave 1.6s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        .animate-signal-3 {
          animation: signal-wave 1.6s ease-in-out infinite;
          animation-delay: 0.4s;
        }
        .animate-signal-4 {
          animation: signal-wave 1.6s ease-in-out infinite;
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
}
