'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store/store';
import { toggleMobileMenu } from '@/redux/slice/topNavbarSlice';

export default function TopPromoBar() {
  const [visible, setVisible] = useState(true);

  const dispatch: AppDispatch = useDispatch();

  // Get state from Redux
  const { isExpanded } = useSelector((state: RootState) => state.topNavbar);

  if (isExpanded) return null;

  const handleClose = () => {
    dispatch(toggleMobileMenu());
  };

  return (
    <div className="w-full bg-primary text-white relative">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-4">
        {/* Message */}
        <p className="text-sm font-medium text-center">
          ❄️ Get <span className="font-bold">25% off 5GB+ plans</span> with the code{' '}
          <span className="font-bold">SIMFINITY</span>
        </p>

        {/* Button - Responsive with different text on mobile */}
        <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-semibold border border-white rounded-full hover:bg-black hover:text-white transition whitespace-nowrap min-w-[100px] sm:min-w-[120px]">
          <span className="hidden sm:inline">Get the Deal</span>
          <span className="sm:hidden">Get Deal</span>
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
      >
        <X size={18} />
      </button>
    </div>
  );
}
