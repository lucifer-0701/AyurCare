import { getDailyTip } from '../data/dailyTips.js';

export default function DailyTip() {
  const tip = getDailyTip();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest-800 to-forest-700 p-6 text-white shadow-card">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-turmeric-500/10 rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-forest-500/20 rounded-full translate-y-6 -translate-x-6" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-turmeric-500/20 rounded-xl flex items-center justify-center text-xl">
            {tip.icon}
          </div>
          <div>
            <p className="text-turmeric-300 text-xs font-semibold uppercase tracking-widest font-poppins">
              Daily Ayurvedic Tip
            </p>
            <p className="text-xs text-forest-300">{tip.practice}</p>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-poppins font-bold text-lg text-white mb-2">{tip.title}</h3>

        {/* Tip text */}
        <p className="text-forest-200 text-sm leading-relaxed">{tip.tip}</p>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-forest-600">
          <p className="text-forest-400 text-xs">
            🌿 A new tip awaits you tomorrow
          </p>
        </div>
      </div>
    </div>
  );
}
