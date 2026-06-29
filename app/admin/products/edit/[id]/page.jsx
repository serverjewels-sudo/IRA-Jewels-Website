import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage({ params }) {
  const { id } = params;

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="pb-5 border-b border-[#2E3135]/10">
        <h1 className="font-serif font-normal text-[36px] tracking-wide text-[#2E3135] uppercase">
          Edit Product
        </h1>
        <p className="font-inter text-[13px] text-[#888888] mt-1 font-light">
          Modify the properties and settings of an existing jewellery item.
        </p>
      </div>

      {/* Form Container */}
      <ProductForm productId={id} />
    </div>
  );
}
