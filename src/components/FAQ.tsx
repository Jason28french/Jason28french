'use client';

import { useState } from 'react';

const faqs = [
  {
    question: "Comment puis-je accéder au contenu exclusif ?",
    answer: "Pour accéder au contenu exclusif, abonnez-vous à mon OnlyFans. Vous aurez accès à toutes mes photos et vidéos en haute qualité, ainsi qu'à des messages personnalisés.",
  },
  {
    question: "Est-ce que je peux commander des photos personnalisées ?",
    answer: "Oui, je propose des photos personnalisées sur demande. Contactez-moi via le formulaire de contact pour plus d'informations.",
  },
  {
    question: "À quelle fréquence postez-vous du nouveau contenu ?",
    answer: "Je poste du nouveau contenu plusieurs fois par semaine, avec des photos et vidéos exclusives pour mes abonnés.",
  },
  {
    question: "Comment puis-je interagir avec vous ?",
    answer: "Je réponds personnellement à tous les messages sur OnlyFans et je suis très actif sur mes réseaux sociaux. N'hésitez pas à me suivre !",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="section-title">Questions Fréquentes</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 