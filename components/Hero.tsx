"use client";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative h-[calc(100vh-64px)] w-full bg-gray-900 flex items-center justify-center overflow-hidden">
      {/* FONDO DE VIDEO 4K */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover bg-gray-900"
      >
        <source src="https://res.cloudinary.com/dthdq9vol/video/upload/v1774567428/6128448-hd_1920_1080_30fps_ltbv7e.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/30" /> {/* Filtro suave para garantizar lectura sin tapar el color real del mar */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter mb-4 uppercase drop-shadow-lg">
          Moda Global en el Puerto
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
          Bienvenidos a Bahía Moda. Tu vitrina exclusiva para descubrir ropa de diseñador, zapatos y lociones premium, directo a tu hogar.
        </p>
        <button 
          className="bg-white text-black px-10 py-4 rounded-full font-bold tracking-widest uppercase text-sm hover:scale-105 transition-transform duration-300 shadow-xl"
          onClick={() => router.push('/catalogo')}
        >
          Entrar a la Tienda
        </button>
      </div>
    </section>
  );
}
