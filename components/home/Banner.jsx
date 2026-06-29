export default function Banner() {
  return (
    <section className="w-full bg-[#F3F1EC] py-20 px-6 sm:px-12 md:py-28 text-center flex items-center justify-center select-none">
      <div className="max-w-[800px] mx-auto flex flex-col items-center">
        {/* Main Line */}
        <h2 className="font-serif font-normal text-[26px] sm:text-[30px] md:text-[32px] text-[#2E3135] leading-snug tracking-wide">
          &ldquo;We believe fine jewelry should not live in a box.&rdquo;
        </h2>
        
        {/* Divider line for elegance */}
        <div className="w-12 h-[1px] bg-[#2E3135]/20 my-6 md:my-8"></div>

        {/* Subtext */}
        <p className="font-sans font-light text-[14px] sm:text-[15px] md:text-[16px] text-[#2E3135]/80 leading-relaxed tracking-wider max-w-[640px]">
          Built for the modern woman — lab-grown diamonds, ethically grown, beautifully crafted. Starting from ₹8,000.
        </p>
      </div>
    </section>
  );
}
