'use client';

import { useState, useEffect } from 'react';

export default function AgeVerification() {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if age has already been verified
    const verified = localStorage.getItem('ageVerified');
    if (verified === 'true') {
      setIsVerified(true);
    }
  }, []);

  const handleVerification = (isAdult: boolean) => {
    if (isAdult) {
      localStorage.setItem('ageVerified', 'true');
      setIsVerified(true);
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  if (isVerified) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-4">Age Verification</h2>
        <p className="text-center mb-6">
          This site contains adult content. Are you over 18 years old?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleVerification(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Yes, I am over 18 years old
          </button>
          <button
            onClick={() => handleVerification(false)}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            No, I am under 18 years old
          </button>
        </div>
      </div>
    </div>
  );
} 