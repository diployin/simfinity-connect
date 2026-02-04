'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function TopPromoBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full bg-primary text-white relative">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-4">
        {/* Message */}
        <p className="text-sm font-medium text-center">
          ❄️ Get <span className="font-bold">5% off 10GB+ plans</span> with the code{' '}
          <span className="font-bold">SNOW5</span>
        </p>

        {/* Button */}
        <button className="px-4 py-1.5 text-sm font-semibold border border-white rounded-full hover:bg-black hover:text-white transition">
          Get the Deal
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
      >
        <X size={18} />
      </button>
    </div>
  );
}
