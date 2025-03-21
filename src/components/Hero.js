import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative bg-[#f3e5ab] text-[#b22222] py-20 px-6 flex items-center justify-center md:justify-start h-[90vh]">
      <div className="absolute inset-0 bg-cover bg-center opacity-50 md:opacity-100" style={{ backgroundImage: "url('/herobg.webp')" }}></div>
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 ml-8">Find Your Perfect Match</h1>
        <p className="text-lg md:text-xl mb-6 ml-8">Resilient traditions, auspicious beginnings</p>
        <Link href="/signup">
        <button className="bg-[#b22222] text-[#fffacd] px-6 py-3 rounded hover:bg-[#8b0000] ml-8">Get Started</button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
