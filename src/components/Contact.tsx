'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({ name: '', email: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-soft p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
            Nom
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="Votre nom"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Votre message..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Envoyer
        </button>
      </form>
    </div>
  )
} 