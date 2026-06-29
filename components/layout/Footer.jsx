export default function Footer() {
  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#F3F1EC] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="font-serif text-[18px] tracking-[0.2em] text-[#2E3135] uppercase">
          IRA Jewels
        </div>
        <div className="text-[11px] font-medium tracking-widest text-[#2E3135]/60 uppercase">
          &copy; {new Date().getFullYear()} IRA Jewels. Handcrafted Everyday Luxury.
        </div>
      </div>
    </footer>
  );
}

