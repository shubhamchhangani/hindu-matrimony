import Image from 'next/image';
import Link from 'next/link';

const HinduCulture = () => {
  return (
    <section className="bg-[#f3e5ab] text-[#b22222] py-10 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 flex justify-center md:justify-start">
          <Image src="/radha.webp" alt="Hindu Culture" width={400} height={300} className="rounded-lg shadow-lg" />
        </div>
        <div className="md:w-1/2 mt-6 md:mt-0 md:ml-10">
          <h3 className="text-2xl font-semibold text-center md:text-left">🕉️ Hindu Marriage Traditions</h3>
          <p className="text-center md:text-left mt-2">Understanding Vedic rituals like Kanyadaan, Saptapadi, and Mangalsutra.</p>
          <div className="mt-4 flex justify-center md:justify-start">
            <Link href="/hindu-marriage-traditions"> <button className="bg-[#b22222] text-[#fffacd] px-4 py-2 rounded hover:bg-[#8b0000] transition duration-300 ease-in-out transform hover:scale-105">Learn More</button> </Link>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default HinduCulture;
