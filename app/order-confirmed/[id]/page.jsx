'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'

export default function OrderConfirmedPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    
    async function fetchOrder() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error || !data) {
          setNotFound(true)
        } else {
          setOrder(data)
        }
      } catch (err) {
        console.error('[OrderConfirmed] fetch error:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
        <Navbar />
        <div style={{minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', flexGrow: 1}}>
          <p style={{fontFamily:'Inter', color:'#888', fontSize:'14px', letterSpacing:'2px'}}>LOADING YOUR ORDER...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
        <Navbar />
        <div style={{minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 20px', flexGrow: 1}}>
          <h2 style={{fontFamily:'Cormorant Garamond', fontSize:'36px', color:'#2E3135', marginBottom:'12px'}}>Order Not Found</h2>
          <p style={{color:'#888', fontSize:'15px', marginBottom:'28px'}}>We could not find your order details.</p>
          <a href="/" style={{background:'#2E3135', color:'#fff', padding:'14px 36px', fontSize:'12px', letterSpacing:'2px', textDecoration:'none'}}>BACK TO HOME</a>
        </div>
        <Footer />
      </div>
    )
  }

  const items = Array.isArray(order.items) ? order.items : []

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
      <Navbar />
      <main className="flex-grow">
        <div style={{maxWidth:'680px', margin:'0 auto', padding:'80px 24px', fontFamily:'Inter', textAlign:'center'}}>
          <div style={{width:'60px', height:'60px', background:'#F3F1EC', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px'}}>
            <svg width="28" height="28" fill="none" stroke="#CDB38B" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 style={{fontFamily:'Cormorant Garamond', fontSize:'44px', color:'#2E3135', marginBottom:'8px'}}>Order Confirmed</h1>
          <p style={{color:'#888', fontSize:'14px', marginBottom:'8px'}}>Thank you for your purchase</p>
          <p style={{color:'#CDB38B', fontSize:'13px', letterSpacing:'1px', marginBottom:'48px'}}>ORDER #{order.order_number}</p>

          <div style={{background:'#F3F1EC', padding:'32px', marginBottom:'24px', textAlign:'left'}}>
            <p style={{fontSize:'11px', letterSpacing:'2px', color:'#888', marginBottom:'16px', textTransform:'uppercase'}}>Items Ordered</p>
            {items.map((item, i) => (
              <div key={i} style={{display:'flex', justifyContent:'space-between', paddingBottom:'12px', marginBottom:'12px', borderBottom:'1px solid #e5e5e5'}}>
                <span style={{fontSize:'14px', color:'#2E3135'}}>{item.name} {item.quantity > 1 ? `x${item.quantity}` : ''}</span>
                <span style={{fontSize:'14px', color:'#2E3135'}}>₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div style={{display:'flex', justifyContent:'space-between', marginTop:'8px'}}>
              <span style={{fontSize:'14px', fontWeight:'500', color:'#2E3135'}}>Total</span>
              <span style={{fontSize:'14px', fontWeight:'500', color:'#2E3135'}}>₹{order.total?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {order.shipping_address && (
            <div style={{textAlign:'left', marginBottom:'40px'}}>
              <p style={{fontSize:'11px', letterSpacing:'2px', color:'#888', marginBottom:'8px', textTransform:'uppercase'}}>Delivery To</p>
              <p style={{fontSize:'14px', color:'#2E3135', lineHeight:'1.8'}}>
                {order.shipping_address.name || order.customer_name}<br/>
                {order.shipping_address.address}<br/>
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
              </p>
            </div>
          )}

          <div style={{marginBottom:'32px'}}>
            <p style={{fontFamily:'Inter', fontWeight:300, fontSize:'12px', color:'#888'}}>
              TATVAAN | GSTIN: 24AAHCI5512M1ZH
            </p>
          </div>

          <a href="/shop" style={{display:'inline-block', background:'#2E3135', color:'#fff', padding:'16px 40px', fontSize:'12px', letterSpacing:'2px', textDecoration:'none'}}>CONTINUE SHOPPING</a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
