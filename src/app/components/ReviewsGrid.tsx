'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'
import reviewsData from '@/data/reviews.json'

interface Review {
  id: string
  userName: string
  userImage: string
  location: string
  rating: number
  date: string
  comment: string
  source: string
  hostResponse?: string
}

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl transition-all duration-300 group" style={{ direction: 'rtl', textAlign: 'right' }}>
    <div className="flex items-center gap-4 mb-5">
      {/* תמונת פרופיל עם אפקט טבעת */}
      <div className="relative h-14 w-14 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-400 to-orange-300 rounded-full animate-pulse opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <img 
          src={review.userImage} 
          alt={review.userName} 
          className="h-full w-full object-cover rounded-full border-2 border-white relative z-10"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-bold text-slate-800 text-lg leading-none">{review.userName}</h3>
        <p className="text-xs text-slate-400 mt-1">{review.location}</p>
        <div className="flex text-amber-400 mt-1.5 gap-0.5">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>
      </div>
      
      <Quote className="text-slate-100 h-10 w-10" />
    </div>
    
    <div className="flex-grow">
      <p className="text-slate-600 leading-relaxed text-[15px] font-medium italic">
        "{review.comment}"
      </p>
    </div>

    {review.hostResponse && (
      <div className="mt-5 p-4 bg-slate-50/50 rounded-2xl border-r-4 border-rose-400/30">
        <p className="text-[11px] font-bold text-rose-500 uppercase tracking-wider mb-1">תגובת המארח</p>
        <p className="text-sm text-slate-500 italic leading-snug">{review.hostResponse}</p>
      </div>
    )}
    
    <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
      <span className="text-[11px] font-semibold text-slate-300 tracking-tighter uppercase">
        {review.date}
      </span>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-slate-400">Verified on</span>
        <span className="text-rose-500 font-black text-xs">Airbnb</span>
      </div>
    </div>
  </div>
)

export default function ReviewsGrid() {
  return (
    <section className="py-12 bg-slate-50/50" style={{ direction: 'rtl' }}>
      <div className="container mx-auto px-4">
        {/* כותרת */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-3">מה האורחים שלנו אומרים</h2>
          <p className="text-slate-500 text-lg">חוויות אמיתיות מאורחים שביקרו אצלנו</p>
        </div>
        
        {/* גריד של ביקורות */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewsData.map((rev) => (
            <ReviewCard key={rev.id} review={rev as Review} />
          ))}
        </div>
      </div>
    </section>
  )
}
