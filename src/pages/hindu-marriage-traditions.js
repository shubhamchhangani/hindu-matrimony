import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HinduMarriageTraditions() {
  return (
    <>
      <Head>
        <title>Hindu Marriage Traditions - Shrimali Brahmin</title>
        <meta name="description" content="Explore the rich traditions of Shrimali Brahmin marriages, including lineage, rituals, and sacred customs." />
      </Head>
      <Header />
      <div className="bg-[#f3e5ab] text-[#b22222] min-h-screen py-10 px-4 md:px-20">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Shrimali Brahmin Marriage Traditions</h1>

          <p className="text-lg mb-4">
            The <strong>Shrimali Brahmins</strong> are a revered Hindu Brahmin community known for their deep-rooted traditions, cultural heritage, and sacred matrimonial rituals. Their marriages are not just unions of two individuals but sacred bonds blessed by Vedic customs.
          </p>

          {/* Section 1 - Lineage and Gotra System */}
          <h2 className="text-2xl font-semibold mt-6">Lineage and Gotra System</h2>
          <p className="text-lg mb-4">
            The Shrimali Brahmins follow the <strong>Gotra system</strong>, ensuring that the bride and groom do not share the same paternal lineage. This system is derived from the ancient Rishis (sages), and some common gotras in the Shrimali Brahmin community include:
          </p>
          <ul className="list-disc list-inside text-lg mb-4">
            <li>Kashyapa</li>
            <li>Bharadwaj</li>
            <li>Vashishtha</li>
            <li>Gautama</li>
            <li>Atri</li>
          </ul>

          {/* Section 2 - Pre-Wedding Rituals */}
          <h2 className="text-2xl font-semibold mt-6">Pre-Wedding Rituals</h2>
          <ul className="list-disc list-inside text-lg mb-4">
            <li><strong>Roka & Lagna Patrika</strong> – The formal acceptance of marriage between two families.</li>
            <li><strong>Ganesh Pujan</strong> – Invoking Lord Ganesha for a blessed wedding.</li>
            <li><strong>Mehendi & Haldi</strong> – Applying turmeric and henna to the bride and groom for purification.</li>
          </ul>

          {/* Section 3 - Wedding Rituals */}
          <h2 className="text-2xl font-semibold mt-6">Wedding Rituals</h2>
          <ul className="list-disc list-inside text-lg mb-4">
            <li><strong>Kanyadaan</strong> – The bride’s parents give her hand to the groom.</li>
            <li><strong>Vivaah Havan</strong> – A sacred fire ritual performed by Vedic priests.</li>
            <li><strong>Phere (Saat Pheras)</strong> – The bride and groom take seven rounds around the holy fire, making vows.</li>
            <li><strong>Mangalsutra & Sindoor</strong> – The groom ties a sacred necklace and applies sindoor to the bride’s forehead.</li>
          </ul>

          {/* Section 4 - Post-Wedding Rituals */}
          <h2 className="text-2xl font-semibold mt-6">Post-Wedding Rituals</h2>
          <ul className="list-disc list-inside text-lg mb-4">
            <li><strong>Griha Pravesh</strong> – The bride enters her new home for the first time.</li>
            <li><strong>Paani Grahan</strong> – A ritual where the groom promises to protect and support the bride.</li>
            <li><strong>Satyanarayan Katha</strong> – A puja conducted to bless the couple with prosperity.</li>
          </ul>

          <p className="text-lg mt-6">
            Shrimali Brahmin marriages uphold the **rich heritage and sacred Vedic traditions**, emphasizing dharma, commitment, and spiritual unity. The customs not only bind two souls but also strengthen the values of family and culture.
          </p>

          <div className="text-center mt-6">
            <p className="text-lg font-semibold">🕉️ शुभ विवाह 🕉️</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
