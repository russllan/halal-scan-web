import { data, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Barcode, Factory, List, Package, Star } from "lucide-react";
import productService from "../../services/product.service";
import basketService from "../../services/basket.service";

const ProductDetailPage = () => {
  const { barcode } = useParams();
  const [product, setProduct] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isBasket, setBasket] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRaw = localStorage.getItem('user');
        if (!userRaw) return;
        const user = JSON.parse(userRaw);
        setUserId(user.id);

        const productData = await productService.getByBarcode(barcode);
        if (productData) {
          productData.image = productData.image.replace(/\\/g, "/");
          setProduct(productData);

          // Получаем данные корзины только после установки product.id
          const basketData = await basketService.getOne(user.id, productData.id);
          if (basketData) {
            setBasket(true);
            console.log("Basket found:", basketData);
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      }
    };

    fetchData();
  }, [barcode]);

  if (!product) {
    return <div className="text-center text-gray-500">Загрузка...</div>;
  }

  const handleBasket = async () => {
    setBasket((prev) => !prev);
    try {
      if (isBasket) {
        await basketService.remove(userId, product.id);
        setBasket(false);
      } else {
        const data = { product_id: Number(product.id), user_id: Number(userId) };
        console.log(data);
        const response = await basketService.create(data);
        console.log(response);
        setBasket(true);
      }
    } catch (error) {
      console.error("Ошибка при обновлении корзины:", error);
    }
  };

  return (
    <div className="max-w-4xl p-6 bg-gray-900 text-white rounded-xl shadow-lg mt-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-6 relative">
        <div className="w-full md:w-1/3 h-80"> {/* Контейнер с фиксированной высотой */}
          <img
            src={
              product.image && product.image !== null && product.image !== undefined && product.image.startsWith('http')
                ? product.image // если это ссылка, просто вставляем её
                : `http://localhost:3000/${product.image ? product.image.replace(/\\/g, "/") : ''}` // если это файл в upload, добавляем localhost, но проверяем на null
            }
            alt={product?.name || 'No name'}
            className="object-cover w-full h-full rounded-md" // Картинка растягивается по размеру контейнера
          />
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {product.name}
            {product.is_halal === null ? (
              <span>Информация о халяльности отсутствует</span>
            ) : product.is_halal ? (
              <CheckCircle className="text-green-500" />
            ) : (
              <XCircle className="text-red-500" />
            )}
          </h1>
          <p className="text-gray-300 text-lg">{product.description || "Описание отсутствует"}</p>
          <p className="text-gray-400 flex items-center gap-2"><Barcode /> Штрих-код: {product.barcode}</p>
          <p className="text-gray-400 flex items-center gap-2"><Package /> Категория: {product.categories?.[0]?.name || "Не указана"}</p>
        </div>
        <button
          onClick={handleBasket}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md border transition ${isBasket
            ? "bg-yellow-400 hover:border-transparent border-yellow"
            : "bg-transparent hover:bg-yellow-400 border-black hover:border-transparent"
            }`}
        >
          <Star className="text-black" size={24} />
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-2"><Factory /> Компания</h2>
        <p className="text-gray-300"><strong>Название:</strong> {product.company.name}</p>
        <p className="text-gray-300"><strong>Страна:</strong> {product.company.country}</p>
        <p className={`text-sm font-semibold ${product.company.is_halal_certified ? 'text-green-400' : 'text-red-400'}`}>
          {product.company.is_halal_certified ? "Компания сертифицирована как халяль" : "Компания не имеет халяль-сертификата"}
        </p>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-2"><List /> Ингредиенты</h2>
        {product.ingredients.map((ingredient) => (
          <p key={ingredient.id} className="text-gray-300">
            {ingredient.name} ({ingredient.is_halal ? <CheckCircle className="inline text-green-400" size={16} /> : <XCircle className="inline text-red-400" size={16} />})
          </p>
        ))}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
        <h2 className="text-xl font-semibold flex items-center gap-2"><List /> E-коды</h2>
        {product.eCodes.map((eCode) => (
          <p key={eCode.id} className="text-gray-300">
            {eCode.code} - {eCode.name} ({eCode.status})
          </p>
        ))}
      </div>
    </div>
  );

};

export default ProductDetailPage;
