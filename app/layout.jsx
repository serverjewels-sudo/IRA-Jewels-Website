import './globals.css';
import { CartProvider } from '@/lib/CartContext';

export const metadata = {
  title: "IRA Jewels — Fine Lab-Grown Diamond Jewellery",
  description: "Everyday luxury lab-grown diamond jewellery. Starting from ₹8,000. Free delivery all India.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
