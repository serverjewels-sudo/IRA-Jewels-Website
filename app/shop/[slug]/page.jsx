'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/lib/CartContext'

export default function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColour, setSelectedColour] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    if (!slug) return
    
    async function fetchProduct() {
      try {
        const { createClient } = await import('@/lib/supabase')
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single()
        
        if (error || !data) {
          setNotFound(true)
        } else {
          setProduct(data)
          if (data.size_options?.length > 0) setSelectedSize(data.size_options[0])
          if (data.colour_options?.length > 0) setSelectedColour(data.colour_options[0])
        }
      } catch (err) {
        console.error('[ProductPage] fetch error:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
        <Navbar />
        <div style={{minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexGrow: 1}}>
          <p style={{fontFamily:'Inter', color:'#888', fontSize:'14px', letterSpacing:'2px'}}>LOADING...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
        <Navbar />
        <div style={{minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'Inter', textAlign:'center', padding:'40px 20px', flexGrow: 1}}>
          <h2 style={{fontFamily:'Cormorant Garamond', fontSize:'36px', color:'#2E3135', marginBottom:'12px'}}>Product Not Found</h2>
          <p style={{color:'#888', fontSize:'15px', marginBottom:'28px'}}>This product may no longer be available.</p>
          <a href="/shop" style={{background:'#2E3135', color:'#fff', padding:'14px 36px', fontSize:'12px', letterSpacing:'2px', textDecoration:'none'}}>BACK TO SHOP</a>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
      <Navbar />
      <main className="flex-grow">
        <div style={{maxWidth:'1200px', margin:'0 auto', padding:'60px 24px', fontFamily:'Inter'}}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px', alignItems:'start'}}>
            
            {/* LEFT — Product Image */}
            <div>
              <img
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80'}
                alt={product.name}
                style={{width:'100%', aspectRatio:'1/1', objectFit:'cover', background:'#F3F1EC'}}
              />
            </div>

            {/* RIGHT — Product Info */}
            <div>
              <p style={{fontSize:'11px', letterSpacing:'2px', color:'#CDB38B', textTransform:'uppercase', marginBottom:'12px'}}>{product.category}</p>
              <h1 style={{fontFamily:'Cormorant Garamond', fontSize:'40px', color:'#2E3135', marginBottom:'16px', lineHeight:'1.2'}}>{product.name}</h1>
              <p style={{fontSize:'24px', color:'#2E3135', fontWeight:'500', marginBottom:'8px'}}>₹{product.price?.toLocaleString('en-IN')}</p>
              {product.karat && <p style={{fontSize:'13px', color:'#888', marginBottom:'24px'}}>{product.karat} {product.metal_type}</p>}
              
              {product.description && (
                <p style={{fontSize:'15px', color:'#2E3135', lineHeight:'1.8', marginBottom:'32px'}}>{product.description}</p>
              )}

              {/* Size Options */}
              {product.size_options?.length > 0 && (
                <div style={{gridColumn:'1 / -1', marginBottom:'24px'}}>
                  <p style={{fontSize:'12px', letterSpacing:'1.5px', textTransform:'uppercase', color:'#2E3135', marginBottom:'10px'}}>SIZE</p>
                  <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                    {product.size_options.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding:'8px 16px',
                          border: selectedSize === size ? '1px solid #2E3135' : '1px solid #ddd',
                          background: selectedSize === size ? '#2E3135' : '#fff',
                          color: selectedSize === size ? '#fff' : '#2E3135',
                          fontSize:'13px',
                          cursor:'pointer'
                        }}
                      >{size}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colour Options */}
              {product.colour_options?.length > 0 && (
                <div style={{marginBottom:'32px'}}>
                  <p style={{fontSize:'12px', letterSpacing:'1.5px', textTransform:'uppercase', color:'#2E3135', marginBottom:'10px'}}>COLOUR</p>
                  <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                    {product.colour_options.map(colour => (
                      <button
                        key={colour}
                        onClick={() => setSelectedColour(colour)}
                        style={{
                          padding:'8px 16px',
                          border: selectedColour === colour ? '1px solid #2E3135' : '1px solid #ddd',
                          background: selectedColour === colour ? '#2E3135' : '#fff',
                          color: selectedColour === colour ? '#fff' : '#2E3135',
                          fontSize:'13px',
                          cursor:'pointer'
                        }}
                      >{colour}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => {
                  const cartItem = {
                    productId: `${product.id}-${selectedSize || 'default'}-${selectedColour || 'default'}`,
                    id: product.id,
                    name: product.name,
                    price: `₹${product.price?.toLocaleString('en-IN')}`,
                    priceVal: product.price,
                    image: product.images?.[0] || '',
                    slug: product.slug,
                    selectedSize: selectedSize,
                    selectedColour: selectedColour,
                    quantity: 1
                  }
                  
                  // Update standard useCart context to ensure sync in Navbar
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: `₹${product.price?.toLocaleString('en-IN')}`,
                    priceVal: product.price,
                    images: product.images,
                    image: product.images?.[0] || '',
                    slug: product.slug
                  }, selectedSize, selectedColour)
                  
                  // Also write directly to localStorage with exact key for consistency check
                  const existing = JSON.parse(localStorage.getItem('ira_jewels_cart') || '[]')
                  const existingIndex = existing.findIndex(i => i.productId === cartItem.productId)
                  if (existingIndex >= 0) {
                    existing[existingIndex].quantity += 1
                  } else {
                    existing.push(cartItem)
                  }
                  localStorage.setItem('ira_jewels_cart', JSON.stringify(existing))
                  
                  window.dispatchEvent(new Event('cart-updated'))
                  alert('Added to cart!')
                }}
                style={{
                  width:'100%',
                  padding:'18px',
                  background:'#2E3135',
                  color:'#fff',
                  border:'none',
                  fontSize:'12px',
                  letterSpacing:'2px',
                  textTransform:'uppercase',
                  cursor:'pointer',
                  marginBottom:'16px'
                }}
              >
                ADD TO CART
              </button>

              <a href="/shop" style={{display:'block', textAlign:'center', fontSize:'12px', color:'#888', letterSpacing:'1px', textDecoration:'underline'}}>← Back to Shop</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
