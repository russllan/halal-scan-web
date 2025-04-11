import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import Slider from "react-slick"; // Подключение слайдера
import ecodeService from "../../../services/ecode.service";
import productService from "../../../services/product.service";
import ingredientService from "../../../services/ingredient.service";
import companyService from "../../../services/company.service";

const MainPage = () => {
  const [editing, setEditing] = useState(false);
  const [editingEcode, setEditingEcode] = useState(false);
  const [editingIng, setEditingIng] = useState(false);
  const [editingCompany, setEditingCommpany] = useState(false);
  const [productData, setProductData] = useState([]);
  const [ecodeData, setEcodeData] = useState([]);
  const [ingredientData, setIngredientData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await productService.getAll();
        const ecode = await ecodeService.getAll();
        const ingredient = await ingredientService.getAll();
        const company = await companyService.getAll();
        if (productData) setProductData(productData);
        if (ecodeData) setEcodeData(ecode);
        if (ingredient) setIngredientData(ingredient);
        if (company) setCompanyData(company);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    setEditing(!editing);
  };

  const handleDelete = (productId) => {
    // Логика для удаления продукта
    alert(`Продукт с ID: ${productId} был удален.`);
  };

  const handleInputChange = async (e, field, productId) => {
    const newValue = e.target.value;
    setProductData((prevData) =>
      prevData.map((product) => {
        if (product.id === productId) {
          // Только если значение изменилось
          if (product[field] !== newValue) {
            // Обновляем локально
            const updatedProduct = { ...product, [field]: newValue };

            // Отправляем на бэкенд (например, PATCH)
            productService.update(productId, { [field]: newValue })
              .then(() => console.log("Updated!"))
              .catch((err) => console.error("Error updating:", err));

            return updatedProduct;
          }
          console.log(productId, field, newValue);
        }
        return product;
      })
    );
  };

  const handleEcodeChange = (e, field, id) => {
    const newValue = e.target.value;
    setEcodeData((prevData) =>
      prevData.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: newValue };
          ecodeService.patch(id, { [field]: newValue })
            .then(() => console.log("E-code updated"))
            .catch(console.error);
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleIngredientChange = (e, field, id) => {
    const value = field === "is_halal" ? e.target.value === "true" : e.target.value;
    setIngredientData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          ingredientService.patch(id, { [field]: value })
            .then(() => console.log("Ingredient updated"))
            .catch(console.error);
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleCompanyChange = (e, field, id) => {
    const value = field === "is_halal_certified" ? e.target.value === "true" : e.target.value;

    setCompanyData((prev) =>
      prev.map((company) => {
        if (company.id === id) {
          const updatedCompany = { ...company, [field]: value };
          companyService.patch(id, { [field]: value })
            .then(() => console.log("Company updated"))
            .catch(console.error);
          return updatedCompany;
        }
        return company;
      })
    );
  };


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    customPaging: (i) => (
      <button
        className="w-3 h-3 bg-yellow-500 rounded-full mx-1"
        style={{ opacity: 0.7 }}
      ></button>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (isError) return <div>Error <h1>404</h1></div>;

  return (
    <div className="p-6 bg-gray-900 text-white">
      {/* Слайдер продуктов */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Продукты</h2>
        <Slider {...settings}>
          {productData.map((product) => (
            <div key={product.id} className="p-6 bg-gray-800 rounded-xl shadow-lg space-y-4">
              <img
                src={product.image || "https://via.placeholder.com/600"}
                alt={product?.name || 'Без названия'}
                className="object-cover w-full h-80 rounded-md"
              />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  {editing ? (
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleInputChange(e, "name", product.id)}
                      className="bg-gray-700 text-white p-2 rounded-md w-full"
                    />
                  ) : (
                    product.name
                  )}
                </h3>
                <p className="text-gray-400">
                  {editing ? (
                    <textarea
                      value={product.description}
                      onChange={(e) => handleInputChange(e, "description", product.id)}
                      className="bg-gray-700 text-white p-2 rounded-md w-full"
                    />
                  ) : (
                    product.description
                  )}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="bg-transparent text-yellow-500 p-2 rounded-full flex items-center gap-2 hover:bg-yellow-400 transition"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-transparent text-red-500 p-2 rounded-full flex items-center gap-2 hover:bg-red-400 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="text-gray-400">Штрих-код: {product.barcode}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Слайдер E-кодов */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">E-коды</h2>
        <Slider {...settings}>
          {ecodeData.map((eCode) => (
            <div key={eCode.id} className="p-6 bg-gray-800 rounded-xl shadow-lg space-y-4">
              <h3 className="text-xl font-semibold">
                {editingEcode ? (
                  <input
                    type="text"
                    value={eCode.code}
                    onChange={(e) => handleEcodeChange(e, "code", eCode.id)}
                    className="bg-gray-700 text-white p-2 rounded-md w-full"
                  />
                ) : (
                  eCode.code
                )}
              </h3>
              <div className="space-y-2">
                <p className="text-gray-400">
                  {editingEcode ? (
                    <input
                      type="text"
                      value={eCode.name}
                      onChange={(e) => handleEcodeChange(e, "name", eCode.id)}
                      className="bg-gray-700 text-white p-2 rounded-md w-full"
                    />
                  ) : (
                    eCode.name
                  )}
                </p>
                <p className="text-gray-400">
                  {editingEcode ? (
                    <input
                      type="text"
                      value={eCode.status}
                      onChange={(e) => handleEcodeChange(e, "status", eCode.id)}
                      className="bg-gray-700 text-white p-2 rounded-md w-full"
                    />
                  ) : (
                    eCode.status
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingEcode(!editingEcode)}
                  className="bg-transparent text-yellow-500 p-2 rounded-full flex items-center gap-2 hover:bg-yellow-400 transition"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(eCode.id)}
                  className="bg-transparent text-red-500 p-2 rounded-full flex items-center gap-2 hover:bg-red-400 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Слайдер ингредиентов */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Ингредиенты</h2>
        <Slider {...settings}>
          {ingredientData.map((ingredient) => (
            <div key={ingredient.id} className="p-6 bg-gray-800 rounded-xl shadow-lg space-y-4">
              <h3 className="text-xl font-semibold">
                {editingIng ? (
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(e, "name", ingredient.id)}
                    className="bg-gray-700 text-white p-2 rounded-md w-full"
                  />
                ) : (
                  ingredient.name
                )}
              </h3>

              <p className="text-gray-400 flex items-center gap-2">
                {editingIng ? (
                  <select
                    value={ingredient.is_halal ? "true" : "false"}
                    onChange={(e) => handleIngredientChange(e, "is_halal", ingredient.id)}
                    className="bg-gray-700 text-white p-2 rounded-md"
                  >
                    <option value="true">Халяль</option>
                    <option value="false">Не халяль</option>
                  </select>
                ) : ingredient.is_halal ? (
                  <>
                    <CheckCircle className="text-green-400" size={16} />
                    Халяль
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-400" size={16} />
                    Не халяль
                  </>
                )}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingIng(!editingIng)}
                  className="bg-transparent text-yellow-500 p-2 rounded-full flex items-center gap-2 hover:bg-yellow-400 transition"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(ingredient.id)}
                  className="bg-transparent text-red-500 p-2 rounded-full flex items-center gap-2 hover:bg-red-400 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Слайдер компаний */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Компании</h2>
        <Slider {...settings}>
          {companyData.map((company) => (
            <div key={company.id} className="p-6 bg-gray-800 rounded-xl shadow-lg space-y-4">
              <h3 className="text-xl font-semibold">
                {editingCompany ? (
                  <input
                    type="text"
                    value={company.name}
                    onChange={(e) => handleCompanyChange(e, "name", company.id)}
                    className="bg-gray-700 text-white p-2 rounded-md w-full"
                  />
                ) : (
                  company.name
                )}
              </h3>

              <p className="text-gray-400">
                {editingCompany ? (
                  <input
                    type="text"
                    value={company.country}
                    onChange={(e) => handleCompanyChange(e, "country", company.id)}
                    className="bg-gray-700 text-white p-2 rounded-md w-full"
                  />
                ) : (
                  `Страна: ${company.country}`
                )}
              </p>

              <p className={`text-sm ${company.is_halal_certified ? "text-green-400" : "text-red-400"}`}>
                {editingCompany ? (
                  <select
                    value={company.is_halal_certified ? "true" : "false"}
                    onChange={(e) => handleCompanyChange(e, "is_halal_certified", company.id)}
                    className="bg-gray-700 text-white p-2 rounded-md"
                  >
                    <option value="true">Сертифицирована как халяль</option>
                    <option value="false">Не сертифицирована как халяль</option>
                  </select>
                ) : company.is_halal_certified ? (
                  "Сертифицирована как халяль"
                ) : (
                  "Не сертифицирована как халяль"
                )}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCommpany(!editingCompany)}
                  className="bg-transparent text-yellow-500 p-2 rounded-full flex items-center gap-2 hover:bg-yellow-400 transition"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(company.id)}
                  className="bg-transparent text-red-500 p-2 rounded-full flex items-center gap-2 hover:bg-red-400 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default MainPage;
