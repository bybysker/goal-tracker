'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Star as StarOutline } from 'lucide-react';

export default function RateUs() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [name, setName] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    // For now, we'll just simulate a successful submission
    try {
      // Add your API call here
      // await fetch('/api/testimonials', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, rating, testimonial }),
      // });
      
      setSubmitted(true);
      // Reset form
      setRating(0);
      setName('');
      setTestimonial('');
    } catch (error) {
      console.error('Error submitting testimonial:', error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
          <p className="mb-4">We appreciate your feedback.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Another Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Rate Your Experience</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Your Rating</label>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                {star <= (hoveredRating || rating) ? (
                  <Star className="h-8 w-8 text-yellow-400" />
                ) : (
                  <StarOutline className="h-8 w-8 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Name (Optional)
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="testimonial" className="block text-sm font-medium">
            Your Feedback
          </label>
          <textarea
            id="testimonial"
            required
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Tell us about your experience..."
          />
        </div>

        <button
          type="submit"
          disabled={!rating || !testimonial}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
} 