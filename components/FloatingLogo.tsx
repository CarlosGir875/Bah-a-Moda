"use client";

import Image from "next/image";

export function FloatingLogo() {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[60] flex items-center justify-center pointer-events-none">
      <div 
        style={{ perspective: "1200px" }}
        className="relative w-56 h-36 sm:w-72 sm:h-48 md:w-80 md:h-56 animate-premium-logo pointer-events-auto cursor-pointer"
      >
        <Image
          src="https://res.cloudinary.com/dcuhbwukm/image/upload/v1774541928/Gemini_Generated_Image_9kn8v19kn8v19kn8_p5gbqj.png"
          alt="Bahía Moda Logo 4K"
          fill
          quality={100}
          unoptimized={true}
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  );
}
