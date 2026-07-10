import CollectionForm from "@/components/admin/CollectionForm";

export const dynamic = 'force-dynamic';

export default function AddCollectionPage() {
  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="pb-5 border-b border-[#2E3135]/10">
        <h1 className="font-serif font-normal text-[36px] tracking-wide text-[#2E3135] uppercase">
          Add Collection
        </h1>
        <p className="font-inter text-[13px] text-[#888888] mt-1 font-light">
          Create a new collection to group your products together.
        </p>
      </div>

      {/* Form Container */}
      <CollectionForm />
    </div>
  );
}
