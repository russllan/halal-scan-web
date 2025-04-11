import { useEffect, useState } from 'react';
import companyService from '../../services/company.service';

const CompanyPage = () => {
  const [company, setCompany] = useState([]);
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [allergen, setAllergen] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  const regions = ['Бишкек', 'Ош', 'ыссык-Куль', 'Талас', 'Чуй', 'Джалал-Абад', 'Баткен', 'Нарын'];

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyData = await companyService.getAll();
        setCompany(companyData);
        setFilteredCompanies(companyData); // Загружаем все данные сразу
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompany();
  }, []);

  const handleApplyFilters = () => {
    let filtered = company;

    // Фильтрация по категории
    if (category) {
      filtered = filtered.filter((comp) =>
        comp.categories.some((cat) => cat.name === category)
      );
    }

    // Фильтрация по региону
    if (region && region !== 'Все регионы') {
      filtered = filtered.filter((comp) => comp.country === region);
    }

    // Фильтрация по аллергенам (если задано)
    if (allergen) {
      filtered = filtered.filter((comp) => !comp.name.toLowerCase().includes(allergen.toLowerCase()));
    }

    setFilteredCompanies(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="container mx-auto p-4">
        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Фильтры</h2>
          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Категория</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Все категории</option>
                {/* Вытягиваем уникальные категории */}
                {['Мясное', 'Молочное', 'Веганское'].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Регион</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Все регионы</option>
                {regions.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Allergen Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">Аллерген</label>
              <input
                type="text"
                value={allergen}
                onChange={(e) => setAllergen(e.target.value)}
                placeholder="Исключить аллерген"
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Apply Filters Button */}
            <div>
              <button
                onClick={handleApplyFilters}
                className="w-full bg-blue-500 text-white py-2 rounded-md mt-4"
              >
                Применить фильтры
              </button>
            </div>
          </div>
        </div>

        {/* Companies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((comp, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{comp.name}</h3>
              <p><strong>Страна:</strong> {comp.country}</p>
              <p><strong>Сертификация:</strong> {comp.halalCert}</p>
              {comp.website && (
                <a href={comp.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Перейти на сайт
                </a>
              )}
              {/* Выводим категории */}
              <p><strong>Категории:</strong> {comp.categories.map(cat => cat.name).join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
