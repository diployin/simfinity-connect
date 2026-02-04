import React from "react";

const MinimalMaintenance = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="text-5xl mb-6 animate-spin">⏳</div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-3">
          We’re Under Maintenance
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-4">
          Our system is currently undergoing a quick upgrade to improve your experience.
          Please check back in a little while.
        </p>

        {/* Small note */}
        <p className="text-sm text-gray-400">
          Thank you for your patience 🙏
        </p>
      </div>
    </div>
  );
};

export default MinimalMaintenance;

