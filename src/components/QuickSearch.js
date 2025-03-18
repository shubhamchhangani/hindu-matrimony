const QuickSearch = () => {
  return (
    <section className="bg-[#f3e5ab] text-[#b22222] shadow-md p-6 rounded-lg mt-[-50px]">
      <h3 className="text-xl font-semibold text-center">🔍 Quick Search</h3>
      <form className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
        <select className="border p-2 rounded"><option>Select Caste/Gotra</option></select>
        <select className="border p-2 rounded"><option>Select Age</option></select>
        <select className="border p-2 rounded"><option>Select Location</option></select>
        <select className="border p-2 rounded"><option>Select Education</option></select>
        <div className="flex justify-center md:justify-start">
          <button className="bg-[#b22222] text-[#fffacd] p-2 rounded hover:bg-[#8b0000] transition duration-300 ease-in-out transform hover:scale-105">Search</button>
        </div>
      </form>
    </section>
  );
};

export default QuickSearch;
