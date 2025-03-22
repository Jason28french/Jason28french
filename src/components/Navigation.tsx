'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-soft' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Jason
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link 
              href="#gallery" 
              className="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
            >
              Galerie
            </Link>
            <Link 
              href="#live" 
              className="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
            >
              Live
            </Link>
            <Link 
              href="#social" 
              className="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
            >
              Réseaux Sociaux
            </Link>
            <Link 
              href="#contact" 
              className="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-secondary-700 hover:text-primary-600 transition-colors"
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
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                href="#gallery"
                className="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Galerie
              </Link>
              <Link
                href="#live"
                className="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Live
              </Link>
              <Link
                href="#social"
                className="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Réseaux Sociaux
              </Link>
              <Link
                href="#contact"
                className="text-secondary-700 hover:text-primary-600 transition-colors font-medium"
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