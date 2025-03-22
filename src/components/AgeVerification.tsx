'use client';

import { useState, useEffect } from 'react';

export default function AgeVerification() {
  const [isVerified, setIsVerified] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkVerification = () => {
      try {
        const verified = localStorage.getItem('ageVerified');
        if (verified !== 'true') {
          setIsVerified(false);
        } else {
          setIsVerified(true);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        setIsVerified(false);
      }
    };

    checkVerification();
  }, []);

  const handleVerification = (isAdult: boolean) => {
    if (isAdult) {
      try {
        localStorage.setItem('ageVerified', 'true');
        setIsVerified(true);
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
      }
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  // Ne rien afficher si on n'est pas côté client
  if (typeof window === 'undefined') return null;

  // Si vérifié, ne rien afficher
  if (isVerified) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Vérification d'âge</h2>
        <p className="text-center mb-6 text-gray-700">
          Ce site contient du contenu réservé aux adultes. Avez-vous plus de 18 ans ?
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => handleVerification(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Oui, j'ai plus de 18 ans
          </button>
          <button
            onClick={() => handleVerification(false)}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Non, j'ai moins de 18 ans
          </button>
        </div>
      </div>
    </div>
  );
} 