// MinimalMaintenance.jsx
import React from 'react';

const MinimalMaintenance = () => {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {/* Icon */}
        <div className="text-5xl mb-4 animate-spin">⏳</div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Maintenance in Progress</h1>

        {/* Message */}
        {/* <p className="text-gray-600 mb-6 max-w-xs">Simfinity will be back online at 7:00 PM</p> */}

        {/* Time */}
        {/* <div className="text-gray-700">
          Current time: <span className="font-bold">{getCurrentTime()}</span>
        </div> */}
      </div>
    </div>
  );
};

export default MinimalMaintenance;
