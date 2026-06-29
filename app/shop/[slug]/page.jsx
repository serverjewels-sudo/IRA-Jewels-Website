import ProductDetailClient from "./ProductDetailClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  return [];
}

export default function ProductDetailPage({ params }) {
  const { slug } = params;
  return <ProductDetailClient slug={slug} />;
}
