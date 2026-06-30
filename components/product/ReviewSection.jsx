'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    if (!productId) return
    fetchReviews()
    checkUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  async function fetchReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
      if (!error && data) setReviews(data)
    } catch (err) {
      console.error('[ReviewSection] fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!user || rating === 0) return
    setSubmitting(true)
    try {
      const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer'
      const { error } = await supabase.from('reviews').insert({
        product_id: productId,
        user_id: user.id,
        user_name: userName,
        rating: rating,
        review_text: reviewText,
      })
      if (!error) {
        setSubmitSuccess(true)
        setRating(0)
        setReviewText('')
        fetchReviews()
      }
    } catch (err) {
      console.error('[ReviewSection] submit error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding:'60px 24px', fontFamily:'Inter'}}>
      <h2 style={{fontFamily:'Cormorant Garamond', fontSize:'32px', color:'#2E3135', marginBottom:'24px'}}>Customer Reviews</h2>

      <div style={{display:'flex', alignItems:'center', gap:'16px', marginBottom:'40px', paddingBottom:'24px', borderBottom:'1px solid #e5e5e5'}}>
        <span style={{fontSize:'36px', color:'#2E3135', fontFamily:'Cormorant Garamond'}}>{avgRating || '—'}</span>
        <div>
          <div style={{color:'#CDB38B', fontSize:'18px', letterSpacing:'2px'}}>
            {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
          </div>
          <p style={{fontSize:'13px', color:'#888', marginTop:'4px'}}>Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div style={{background:'#F3F1EC', padding:'32px', marginBottom:'40px'}}>
        {!user ? (
          <div style={{textAlign:'center'}}>
            <p style={{fontSize:'14px', color:'#2E3135', marginBottom:'12px'}}>Login to share your experience</p>
            <a 
              href={typeof window !== 'undefined' ? `/account/login?redirect=${encodeURIComponent(window.location.pathname)}` : '/account/login'} 
              style={{display:'inline-block', background:'#2E3135', color:'#fff', padding:'12px 28px', fontSize:'12px', letterSpacing:'1.5px', textDecoration:'none'}}
            >
              LOGIN TO REVIEW
            </a>
          </div>
        ) : submitSuccess ? (
          <p style={{textAlign:'center', color:'#2E3135', fontSize:'14px'}}>Thank you! Your review has been posted.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{fontSize:'12px', letterSpacing:'1.5px', textTransform:'uppercase', color:'#2E3135', marginBottom:'12px'}}>Your Rating</p>
            <div style={{display:'flex', gap:'4px', marginBottom:'20px'}}>
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{fontSize:'28px', cursor:'pointer', color: star <= (hoverRating || rating) ? '#CDB38B' : '#ddd'}}
                >★</span>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
              style={{width:'100%', padding:'14px', border:'1px solid #ddd', fontSize:'14px', fontFamily:'Inter', marginBottom:'16px', resize:'vertical'}}
            />
            <button
              type="submit"
              disabled={rating === 0 || submitting}
              style={{background:'#2E3135', color:'#fff', padding:'14px 32px', fontSize:'12px', letterSpacing:'1.5px', border:'none', cursor: rating === 0 ? 'not-allowed' : 'pointer', opacity: rating === 0 ? 0.5 : 1}}
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
            </button>
          </form>
        )}
      </div>

      {loading ? (
        <p style={{color:'#888', fontSize:'14px'}}>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p style={{color:'#888', fontSize:'14px'}}>No reviews yet. Be the first to share your experience.</p>
      ) : (
        <div>
          {reviews.map(review => (
            <div key={review.id} style={{paddingBottom:'24px', marginBottom:'24px', borderBottom:'1px solid #e5e5e5'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                <span style={{fontSize:'14px', fontWeight:'500', color:'#2E3135'}}>{review.user_name}</span>
                <span style={{fontSize:'12px', color:'#888'}}>{new Date(review.created_at).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</span>
              </div>
              <div style={{color:'#CDB38B', fontSize:'14px', marginBottom:'8px'}}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </div>
              {review.review_text && <p style={{fontSize:'14px', color:'#2E3135', lineHeight:'1.7'}}>{review.review_text}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
