'use client'

import Image from 'next/image'
import { useState } from 'react'

interface GalleryItem {
  id: number
  src: string
  alt: string
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: '/images/gallery/photo1.jpg',
    alt: 'Jason - Photo 1'
  },
  {
    id: 2,
    src: '/images/gallery/photo2.jpg',
    alt: 'Jason - Photo 2'
  },
  {
    id: 3,
    src: '/images/gallery/photo3.jpg',
    alt: 'Jason - Photo 3'
  }
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {galleryItems.map((item) => (
        <div
          key={item.id}
          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => setSelectedImage(item)}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <span className="text-white text-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Voir en grand
            </span>
          </div>
        </div>
      ))}

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={1200}
              height={800}
              className="rounded-lg shadow-2xl"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors duration-300 transform hover:scale-110"
              onClick={() => setSelectedImage(null)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 