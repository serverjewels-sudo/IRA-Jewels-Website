import ProductForm from "@/components/admin/ProductForm";

export default function AddProductPage() {
  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="pb-5 border-b border-[#2E3135]/10">
        <h1 className="font-serif font-normal text-[36px] tracking-wide text-[#2E3135] uppercase">
          Add Product
        </h1>
        <p className="font-inter text-[13px] text-[#888888] mt-1 font-light">
          Create a new jewellery item in your inventory catalogue.
        </p>
      </div>

      {/* Form Container */}
      <ProductForm />
    </div>
  );
}
