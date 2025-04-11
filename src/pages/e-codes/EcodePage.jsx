import React, { useEffect, useState } from 'react';
import ecodeService from '../../services/ecode.service';

const eCodesData = [
  { code: 'E100', name: 'Куркумин', category: 'Красители', isHalal: true },
  { code: 'E101', name: 'Рибофлавин (Витамин B2)', category: 'Красители', isHalal: true },
  { code: 'E102', name: 'Тартразин', category: 'Красители', isHalal: false },
  { code: 'E104', name: 'Хинолиновый желтый', category: 'Красители', isHalal: false },
  { code: 'E110', name: 'Солнечный закат FCF', category: 'Красители', isHalal: false },
  { code: 'E120', name: 'Кошениль (кармин)', category: 'Красители', isHalal: false },
  { code: 'E140', name: 'Хлорофиллы', category: 'Красители', isHalal: true },
  { code: 'E200', name: 'Сорбиновая кислота', category: 'Консерванты', isHalal: true },
  { code: 'E211', name: 'Бензоат натрия', category: 'Консерванты', isHalal: false },
  { code: 'E300', name: 'Аскорбиновая кислота (Витамин C)', category: 'Антиоксиданты', isHalal: true },
  { code: 'E621', name: 'Глутамат натрия', category: 'Усилители вкуса', isHalal: false },
  { code: 'E953', name: 'Изомальт', category: 'Подсластители', isHalal: true }
];

function EcodePage() {
  const [ecode, setEcode] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEcode = async () => {
      try {
        const ecodeData = await ecodeService.getAll();
        setEcode(ecodeData);
      } catch (error) {
        console.error("Error fetching ecode:", error);
      }
    };
    fetchEcode();
  }, []);

  const filteredECodes = ecode.filter(item =>
    item.code.toLowerCase().includes(search.toLowerCase())
  );

  if (!ecode) return <div className="text-center text-xl mt-10">...Loading</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Е-коды</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Введите Е-код (например, E322)"
        className="mb-6 p-3 w-full max-w-md rounded bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
      />
      <div className="w-full max-w-2xl">
        {filteredECodes.map((item) => (
          <div
            key={item.code}
            className={`p-4 mb-4 rounded-lg shadow-lg border-l-4 ${item.status === 'halal' ? 'border-green-500 bg-green-900' : item.status === 'haram' ? 'border-red-500 bg-red-900' : 'border-yellow-500 bg-yellow-900'}`}
            onClick={() => handleStatusChange(item)}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xl font-semibold">{item.code}</span> - {item.name} ({item.category})
              </div>
              <span className="font-bold">
                {item.status === 'halal' ? 'Халяльный' : item.status === 'haram' ? 'Не Халяльный' : 'Подозрительный'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EcodePage;
