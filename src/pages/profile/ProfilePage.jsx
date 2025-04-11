import { useState, useEffect } from 'react';
import basketService from '../../services/basket.service';

const ProfilePage = () => {
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  // Стейт для хранения данных

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRaw = localStorage.getItem('user');
        if (!userRaw) return;
        const user = JSON.parse(userRaw);
        setUserId(user.id)
        const response = await basketService.getAll(user.id);
        if (response) {
          setProduct(response);
          console.log('response = ', response);
          // Формируем список избранных из полученных данных
          const formattedFavorites = response.map(item => ({
            id: item.id,
            name: item.product_id.name,
            company: "Неизвестно", // Добавь информацию о компании, если она есть
            image: item.product_id.image,
            product_id: item.product_id.id
          }));
          setFavorites(formattedFavorites);
        }
      } catch (error) {
        console.log('error', error);
        setErrorMessage(error.response?.data?.message || 'Ошибка при загрузке данных');
      }
    };

    fetchData();
  }, []);

  const [scannedHistory, setScannedHistory] = useState([
    { id: 1, productName: "Продукт 1", date: "2025-03-15", status: "Проверено" },
    { id: 2, productName: "Продукт 2", date: "2025-03-14", status: "Проверено" },
    { id: 3, productName: "Продукт 3", date: "2025-03-13", status: "Проверено" },
  ]);

  // const [favorites, setFavorites] = useState([
  //   { id: 1, name: "Продукт 1", company: "Компания 1" },
  //   { id: 2, name: "Продукт 2", company: "Компания 2" },
  // ]);

  const [settings, setSettings] = useState({
    password: "",
    notifications: true,
    language: "Русский",
  });

  // Функции для действий с данными
  const handleRescan = (productId) => {
    console.log(`Повторно проверяем продукт с ID: ${productId}`);
  };

  const handleRemoveFavorite = async (favoriteId) => {
    setFavorites(favorites.filter(fav => fav.product_id !== favoriteId));
    try {
      await basketService.remove(userId, favoriteId);
      alert('Продукт удален из избранного.')
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSaveSettings = () => {
    console.log("Настройки сохранены:", settings);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      {/* История сканирования */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">История сканирования и поиска</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Продукт</th>
                <th className="px-4 py-2 text-left">Дата</th>
                <th className="px-4 py-2 text-left">Статус</th>
                <th className="px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {scannedHistory.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2">{item.productName}</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.status}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleRescan(item.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Повторно проверить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Избранное */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Избранное</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {errorMessage.length > 0 ? (
            <div className="text-red-500">{errorMessage}</div>
          ) : (
            favorites?.map((fav) => (
              <div key={fav.id} className="bg-gray-50 p-4 rounded-lg shadow-md">
                <img src={fav.image} alt={fav.name} className="w-full h-40 object-cover rounded-md" />
                <h3 className="font-semibold mt-4">{fav.name}</h3>
                <p className="text-sm text-gray-600">Компания: {fav.company}</p>
                <button
                  onClick={() => handleRemoveFavorite(fav.product_id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Удалить из избранного
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Настройки профиля */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Настройки профиля</h2>
        <div className="space-y-4">
          {/* Изменение пароля */}
          <div>
            <label className="block text-sm font-medium mb-1">Новый пароль</label>
            <input
              type="password"
              value={settings.password}
              onChange={(e) => setSettings({ ...settings, password: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Настройка уведомлений */}
          <div>
            <label className="block text-sm font-medium mb-1">Уведомления</label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={() => setSettings({ ...settings, notifications: !settings.notifications })}
              className="h-5 w-5"
            />
            <span className="ml-2">Получать уведомления</span>
          </div>

          {/* Настройка языка */}
          <div>
            <label className="block text-sm font-medium mb-1">Язык</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="Русский">Русский</option>
              <option value="English">English</option>
              <option value="Français">Français</option>
            </select>
          </div>

          {/* Кнопка сохранения настроек */}
          <div className="mt-6">
            <button
              onClick={handleSaveSettings}
              className="w-full bg-green-500 text-white py-2 rounded-md"
            >
              Сохранить настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
