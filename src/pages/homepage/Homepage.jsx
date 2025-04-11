import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/product.service";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await productService.getAll();
      setProducts(products);
      setFilteredProducts(products);
      console.log(products);
    };

    fetchProducts();
  }, []);

  const allCategories = useMemo(() => {
    const namesSet = new Set();

    products.forEach((product) => {
      if (Array.isArray(product.categories)) {
        product.categories.forEach((category) => {
          if (category?.name) {
            namesSet.add(category.name);
          }
        });
      }
    });

    return Array.from(namesSet);
  }, [products]);

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCompany) {
      filtered = filtered.filter(
        (product) => product.company.id === parseInt(selectedCompany)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          Array.isArray(product.categories) &&
          product.categories.some((cat) => cat.name === selectedCategory)
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Список продуктов</h1>

      {/* Фильтры */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select
          className="bg-gray-800 text-white p-3 rounded-md outline-none"
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">Все компании</option>
          {products?.map((product) => (
            <option key={product.company.id} value={product.company.id.toString()}>
              {product.company.name}
            </option>
          ))}
        </select>

        <select
          className="bg-gray-800 text-white p-3 rounded-md outline-none"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="">Все категории</option>
          {allCategories?.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md text-white font-medium transition"
          onClick={filterProducts}
        >
          Применить
        </button>
      </div>

      {/* Список продуктов */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts?.map((product) => (
          <Link to={`/product/${product.barcode}`} key={product.id}>
            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
              <img
                src={
                  product.image && product.image !== null && product.image !== undefined && product.image.startsWith('http')
                    ? product.image // если это ссылка, просто вставляем её
                    : `http://localhost:3000/${product.image ? product.image.replace(/\\/g, "/") : ''}` // если это файл в upload, добавляем localhost, но проверяем на null
                }
                alt={product?.name || 'No name'}
                className="h-40 w-full object-cover rounded-md"
              />

              <h2 className="text-lg font-semibold mt-3">{product.name}</h2>
              <p className="text-gray-400 text-sm mt-1 h-15">{product.description}</p>
              <p className="text-xs mt-2 text-gray-500">
                Производитель: {product.company.name || "Неизвестно"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
