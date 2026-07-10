import CollectionForm from "@/components/admin/CollectionForm";

export const dynamic = 'force-dynamic';

export default function EditCollectionPage({ params }) {
  const { id } = params;

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="pb-5 border-b border-[#2E3135]/10">
        <h1 className="font-serif font-normal text-[36px] tracking-wide text-[#2E3135] uppercase">
          Edit Collection
        </h1>
        <p className="font-inter text-[13px] text-[#888888] mt-1 font-light">
          Update the details of your collection.
        </p>
      </div>

      {/* Form Container */}
      <CollectionForm collectionId={id} />
    </div>
  );
}
