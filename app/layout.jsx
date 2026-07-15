import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/CartContext';
import ScrollRestoration from '@/components/ScrollRestoration';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: "TATVAAN — Fine Lab-Grown Diamond Jewellery",
  description: "Everyday luxury lab-grown diamond jewellery. Starting from ₹8,000. Free delivery all India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <ScrollRestoration />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
