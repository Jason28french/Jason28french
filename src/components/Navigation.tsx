'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-semibold text-secondary">
            Jason
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="#gallery" className="text-secondary hover:text-primary transition-colors">
              Galerie
            </Link>
            <Link href="#live" className="text-secondary hover:text-primary transition-colors">
              Live
            </Link>
            <Link href="#social" className="text-secondary hover:text-primary transition-colors">
              Réseaux Sociaux
            </Link>
            <Link href="#contact" className="text-secondary hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-secondary"
            onClick={() => setIsOpen(!isOpen)}
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
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="#gallery"
                className="text-secondary hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Galerie
              </Link>
              <Link
                href="#live"
                className="text-secondary hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Live
              </Link>
              <Link
                href="#social"
                className="text-secondary hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Réseaux Sociaux
              </Link>
              <Link
                href="#contact"
                className="text-secondary hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 