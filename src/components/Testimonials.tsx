'use client';

import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: "Marie",
    text: "Jason est incroyable ! Son contenu est toujours de qualité et il interagit vraiment avec ses fans.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sophie",
    text: "Le meilleur modèle français sur OnlyFans. Son contenu est exclusif et authentique.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma",
    text: "Une personne adorable et un contenu premium. Je recommande vivement !",
    rating: 5,
  },
];

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="section-title">Ce que disent mes fans</h2>
        <div className="relative max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-lg text-gray-700 mb-6 italic">
              "{testimonials[activeTestimonial].text}"
            </p>
            <p className="text-gray-900 font-semibold">
              {testimonials[activeTestimonial].name}
            </p>
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 