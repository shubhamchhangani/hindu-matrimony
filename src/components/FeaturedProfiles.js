import Image from 'next/image';

const FeaturedProfiles = () => {
  return (
    <section className="relative py-10 bg-[#f3e5ab] text-[#b22222]">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 md:opacity-50" style={{ backgroundImage: "url('/background.webp')" }}></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-semibold text-center mb-6">🌟 Featured Profiles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white shadow-md rounded-lg transform transition duration-150 hover:scale-105">
              <div className="h-40  rounded-t-lg overflow-hidden">
                <Image src="/ganesha2.webp" alt="Profile" width={240} height={160} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="mt-2 text-center font-semibold text-[#b22222]">Bride/Groom Name</p>
                <p className="text-center text-[#b22222]">City | Profession</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProfiles;
