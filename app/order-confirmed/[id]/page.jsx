import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabaseServer } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default async function OrderConfirmedPage({ params }) {
  const { id } = params;
  
  try {
    const { data: order, error } = await supabaseServer
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !order) {
      return <OrderNotFound />;
    }
    
    return <OrderConfirmedUI order={order} />;
    
  } catch (err) {
    console.error('[OrderConfirmed] Error:', err);
    return <OrderNotFound />;
  }
}

function OrderConfirmedUI({ order }) {
  const itemsList = Array.isArray(order.items) ? order.items : [];
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
      <Navbar />

      <main className="flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="space-y-10">
          {/* Header Success Section */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-[#F3F1EC] p-5 flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-[#CDB38B] stroke-[1.25]" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="font-cormorant font-normal text-[36px] sm:text-[40px] text-[#2E3135] leading-tight">
                Order Confirmed
              </h1>
              <p className="font-inter font-light text-[15px] text-[#888888] max-w-md mx-auto">
                Thank you, {order.customer_name}! Your order has been placed successfully and is currently being processed.
              </p>
            </div>
          </div>

          {/* Details & Summary Layout */}
          <div className="bg-[#F3F1EC] p-6 sm:p-8 rounded space-y-6 border border-[#E8E6E1]/50">
            {/* Meta Details */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-[#2E3135]/5 font-inter text-[13px]">
              <div>
                <span className="block text-[#888888] font-light uppercase tracking-wider text-[11px] mb-1">
                  Order Number
                </span>
                <span className="font-medium text-[#2E3135]">{order.order_number}</span>
              </div>
              <div>
                <span className="block text-[#888888] font-light uppercase tracking-wider text-[11px] mb-1">
                  Order Date
                </span>
                <span className="font-medium text-[#2E3135]">{orderDate}</span>
              </div>
              <div className="mt-2">
                <span className="block text-[#888888] font-light uppercase tracking-wider text-[11px] mb-1">
                  Payment Method
                </span>
                <span className="font-medium text-[#2E3135]">
                  {getPaymentMethodLabel(order.payment_method)}
                </span>
              </div>
              <div className="mt-2">
                <span className="block text-[#888888] font-light uppercase tracking-wider text-[11px] mb-1">
                  Order Status
                </span>
                <span className="font-medium text-[#CDB38B] uppercase tracking-wider text-[12px]">
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              <h3 className="font-inter font-medium text-[12px] uppercase tracking-wider text-[#2E3135]">
                Order Items
              </h3>
              <div className="divide-y divide-[#E8E6E1] border-t border-b border-[#E8E6E1]">
                {itemsList.map((item, index) => (
                  <div key={index} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-white border border-[#E8E6E1]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-inter font-medium text-[14px] text-[#2E3135]">
                          {item.name}
                        </h4>
                        <p className="font-inter font-light text-[12px] text-[#888888] mt-0.5">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-inter font-medium text-[14px] text-[#2E3135]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="space-y-2 border-b border-[#2E3135]/5 pb-4 font-inter text-[14px]">
              <div className="flex justify-between items-center text-[#2E3135]/80">
                <span className="font-light">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[#2E3135]/80">
                <span className="font-light">Shipping</span>
                <span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between items-center text-[16px] text-[#2E3135] pt-2 font-medium">
                <span>Total</span>
                <span className="text-[18px]">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Shipping details */}
            <div className="font-inter text-[13px]">
              <h3 className="font-medium text-[12px] uppercase tracking-wider text-[#2E3135] mb-2">
                Shipping Address
              </h3>
              <p className="font-light text-[#888888] leading-relaxed">
                {order.shipping_address?.address}, <br />
                {order.shipping_address?.city}, {order.shipping_address?.state} – {order.shipping_address?.pincode}
              </p>
            </div>

            {/* Delivery Note */}
            <div className="bg-white p-4 border border-[#E8E6E1] text-center font-inter text-[13px] text-[#2E3135]/80">
              Estimated delivery: 5–7 business days
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3 max-w-sm mx-auto">
            <Link
              href="/shop"
              className="w-full h-14 bg-[#2E3135] text-white font-inter font-medium text-[12px] tracking-[2px] uppercase flex items-center justify-center hover:bg-[#CDB38B] transition-all duration-300 shadow-sm gap-2"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function OrderNotFound() {
  return (
    <div style={{minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyItems:'center', justifyContent:'center', fontFamily:'Inter'}}>
      <h2 style={{fontFamily:'Cormorant Garamond', fontSize:'36px', color:'#2E3135', marginBottom:'12px'}}>Order Not Found</h2>
      <p style={{color:'#888', fontSize:'15px', marginBottom:'28px'}}>We could not find your order details.</p>
      <a href="/" style={{background:'#2E3135', color:'#fff', padding:'14px 36px', fontSize:'12px', letterSpacing:'2px', textDecoration:'none', fontFamily:'Inter'}}>BACK TO HOME</a>
    </div>
  );
}

const formatPrice = (amount) => {
  return "₹" + Number(amount).toLocaleString("en-IN");
};

const getPaymentMethodLabel = (method) => {
  switch (String(method).toLowerCase()) {
    case "cod":
      return "Cash on Delivery (COD)";
    case "upi":
      return "UPI (GPay/PhonePe)";
    case "card":
      return "Credit/Debit Card";
    case "netbanking":
      return "Net Banking";
    default:
      return method ? method.toUpperCase() : "Demo Payment";
  }
};

const getStatusLabel = (status) => {
  switch (String(status).toLowerCase()) {
    case "placed":
      return "Placed";
    case "confirmed":
      return "Confirmed";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status ? status.toUpperCase() : "Placed";
  }
};
