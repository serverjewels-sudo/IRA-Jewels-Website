import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Connect With Us | TATVAAN",
  description: "Follow our journey on social media. See our daily drops, crafting process, styling ideas and custom diamond designs.",
};

export default function ConnectPage() {
  const socialChannels = [
    {
      name: "Instagram",
      description: "Daily drops, styling ideas & behind the scenes",
      link: "https://www.instagram.com/tatvaanjewels?igsh=dW5iczZ5eGhtZmxm",
      icon: (
        <svg className="w-8 h-8 text-[#CDB38B] transition-colors duration-300 group-hover:text-[#2E3135]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      )
    },
    {
      name: "Facebook",
      description: "Updates, offers and community conversations",
      link: "https://www.facebook.com/share/1DC136rNr1/",
      icon: (
        <svg className="w-8 h-8 text-[#CDB38B] transition-colors duration-300 group-hover:text-[#2E3135]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "YouTube",
      description: "Watch our crafting process and diamond education",
      link: "https://youtube.com/@tatvaanjewels?si=x417XQXVrgs9hdwp",
      icon: (
        <svg className="w-8 h-8 text-[#CDB38B] transition-colors duration-300 group-hover:text-[#2E3135]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: "Pinterest",
      description: "Mood boards, styling guides and inspiration",
      link: "https://pin.it/7gbKsoU5A",
      icon: (
        <svg className="w-8 h-8 text-[#CDB38B] transition-colors duration-300 group-hover:text-[#2E3135]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.24 2C6.98 2 2.75 6.22 2.75 11.49c0 4.04 2.5 7.51 6.06 8.92-.08-.75-.15-1.9.03-2.72l1.6-6.79s-.4-.82-.4-2.02c0-1.9 1.1-3.31 2.47-3.31 1.16 0 1.72.87 1.72 1.92 0 1.17-.74 2.92-1.13 4.54-.32 1.36.68 2.47 2.02 2.47 2.43 0 4.3-2.56 4.3-6.25 0-3.27-2.35-5.55-5.7-5.55-3.89 0-6.17 2.92-6.17 5.93 0 1.17.45 2.43 1.02 3.12.11.13.13.25.09.4l-.38 1.55c-.06.26-.2.32-.47.2-1.77-.82-2.88-3.41-2.88-5.49 0-4.47 3.25-8.58 9.37-8.58 4.92 0 8.74 3.51 8.74 8.19 0 4.89-3.08 8.83-7.36 8.83-1.44 0-2.79-.75-3.25-1.63l-.88 3.37c-.32 1.23-1.18 2.77-1.76 3.71A9.74 9.74 0 0 0 12.25 22c5.27 0 9.5-4.23 9.5-9.5C21.75 6.22 17.51 2 12.24 2z"/>
        </svg>
      )
    },
    {
      name: "LinkedIn",
      description: "Professional updates, career opportunities and industry insights",
      link: "https://www.linkedin.com/in/tatvaan-jewels-251315422?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      icon: (
        <svg className="w-8 h-8 text-[#CDB38B] transition-colors duration-300 group-hover:text-[#2E3135]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: "WhatsApp",
      description: "Chat with us directly for custom orders",
      link: "https://wa.me/919023454014",
      icon: (
        <svg className="w-8 h-8 text-[#CDB38B] transition-colors duration-300 group-hover:text-[#2E3135]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Page Hero */}
        <section className="bg-ira-mist py-16 md:py-24 text-center px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-cormorant text-[40px] md:text-[52px] text-ira-graphite font-normal leading-tight">
              Connect With Us
            </h1>
            <p className="font-inter text-[16px] text-[#888] mt-[12px] font-normal max-w-md mx-auto">
              Follow our journey. See every piece up close.
            </p>
          </div>
        </section>

        {/* Social Cards Section */}
        <section className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-cormorant text-[32px] text-ira-graphite text-center mb-12 font-normal">
              Find Us On
            </h2>
            
            {/* Grid layout: 1 col on mobile, 2 col on tablet, 3 col on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {socialChannels.map((channel, index) => (
                <div 
                  key={index} 
                  className="group w-full max-w-sm bg-white border border-ira-mist rounded-[8px] p-8 md:p-10 flex flex-col items-center text-center transition-all duration-300 hover:border-ira-gold hover:shadow-lg hover:-translate-y-0.5"
                >
                  {/* Platform Icon Wrapper */}
                  <div className="w-16 h-16 rounded-full border border-ira-mist flex items-center justify-center bg-white group-hover:border-ira-gold group-hover:bg-[#F9F8F6] transition-all duration-300 mb-6">
                    {channel.icon}
                  </div>
                  
                  {/* Platform Name */}
                  <h3 className="font-cormorant text-[22px] text-ira-graphite font-normal mb-2">
                    {channel.name}
                  </h3>
                  
                  {/* Short Description */}
                  <p className="font-inter text-[14px] text-[#888] font-normal leading-relaxed mb-6 flex-grow">
                    {channel.description}
                  </p>
                  
                  {/* FOLLOW US link button */}
                  <a 
                    href={channel.link} 
                    target={channel.link === "#" ? undefined : "_blank"} 
                    rel={channel.link === "#" ? undefined : "noopener noreferrer"}
                    className="font-inter font-medium text-[12px] uppercase tracking-[2px] text-ira-graphite hover:underline transition-all duration-200 mt-auto"
                  >
                    FOLLOW US
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Banner */}
        <section className="bg-ira-graphite py-[60px] px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-cormorant italic text-[36px] text-white font-normal mb-3">
              Tag us in your photos
            </h2>
            <p className="font-inter text-[15px] text-ira-gold tracking-wide font-normal max-w-3xl mx-auto">
              Use #TATVAAN and get featured on our page.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
