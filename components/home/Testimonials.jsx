export default function Testimonials() {
  const testimonials = [
    {
      stars: "★★★★★",
      text: '"I bought the Solitaire Diamond Ring for my anniversary and I wear it every single day. It looks exactly like the photos — even more beautiful in person. My friends keep asking where I got it."',
      name: "Priya Sharma",
      location: "Mumbai",
    },
    {
      stars: "★★★★★",
      text: '"The quality is exceptional for the price. I was skeptical about lab-grown diamonds at first, but after seeing this necklace I am completely convinced. TATVAAN has a customer for life."',
      name: "Ananya Patel",
      location: "Ahmedabad",
    },
    {
      stars: "★★★★★",
      text: '"Fast delivery, beautiful packaging, and the earrings are stunning. I\'ve bought from many jewellery brands but TATVAAN feels truly premium. Worth every rupee."',
      name: "Meera Iyer",
      location: "Bangalore",
    },
  ];

  return (
    <section id="testimonials" className="w-full bg-[#F3F1EC] py-20 px-6 sm:px-12 select-none">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <span className="font-inter font-medium text-[11px] tracking-[2px] uppercase text-[#CDB38B] mb-3">
            WHAT OUR CUSTOMERS SAY
          </span>
          <h2 className="font-cormorant font-normal text-[40px] text-[#2E3135] leading-tight">
            Stories of Everyday Luxury
          </h2>
          <div className="w-[60px] h-[1px] bg-[#CDB38B] mt-5"></div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] rounded-[8px] p-8 flex flex-col justify-between shadow-[0_2px_16px_rgba(0,0,0,0.06)] border-none transition-transform duration-300 hover:-translate-y-1"
            >
              <div>
                {/* 5 gold stars */}
                <div className="text-[#CDB38B] text-[16px] tracking-[2px] mb-4">
                  {t.stars}
                </div>
                {/* Review Text */}
                <p className="font-cormorant italic text-[18px] text-[#2E3135] leading-[1.7] mb-6">
                  {t.text}
                </p>
              </div>
              <div>
                {/* Thin gold divider */}
                <div className="w-[40px] h-[1px] bg-[#CDB38B] mb-5"></div>
                {/* Customer name */}
                <h4 className="font-inter font-medium text-[14px] text-[#2E3135] mb-1">
                  {t.name}
                </h4>
                {/* Customer location */}
                <p className="font-inter font-light text-[13px] text-[#888888]">
                  {t.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
