const Footer = () => {
  return (
    <footer className="bg-[#b22222] text-[#fffacd] text-center p-6 mt-10">
      <p className="text-lg font-semibold">🔱 Brahmin Matrimony | All Rights Reserved</p>
      <p className="text-sm mt-2">“धर्म, परंपरा और संस्कृति के साथ एक सुंदर जीवन की ओर”</p>
      <div className="mt-4 flex justify-center space-x-4">
        <a href="#" className="hover:text-[#8b0000] transition duration-300 ease-in-out">Privacy Policy</a>
        <a href="#" className="hover:text-[#8b0000] transition duration-300 ease-in-out">Terms of Service</a>
        <a href="#" className="hover:text-[#8b0000] transition duration-300 ease-in-out">Contact Us</a>
      </div>
    </footer>
  );
};

export default Footer;
