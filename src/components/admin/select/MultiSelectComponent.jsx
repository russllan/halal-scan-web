import { useState, useEffect } from "react";
import ingredientService from "../../../services/ingredient.service";
import ecodeService from "../../../services/ecode.service";
import categoryService from "../../../services/category.service";

const MultiSelectComponent = ({ apiType, selected, setSelected }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = apiType === "ingredients"
                    ? await ingredientService.getAll()
                    : apiType === "e-codes"
                    ? await ecodeService.getAll()
                    : await categoryService.getAll();

                if (Array.isArray(data)) {
                    setOptions(data);
                } else {
                    console.error("Неверный формат данных:", data);
                }
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        fetchData();
    }, [apiType]);

    const handleSelectChange = (e) => {
        const selectedId = e.target.value;
        const selectedItem = options.find(item => item.id.toString() === selectedId);

        if (selectedItem && !selected.some(item => item.id === selectedItem.id)) {
            setSelected([...selected, selectedItem]); // Сохраняем объект { id, name }
        }
    };

    const removeSelectedItem = (item) => {
        setSelected(selected.filter(selectedItem => selectedItem.id !== item.id));
    };

    return (
        <div>
            <select
                className="w-full p-2 border rounded bg-gray-800 text-white"
                onChange={handleSelectChange}
                value=""
            >
                <option value="">Выберите {apiType === "ingredients" ? "ингредиент" : "е-код"}</option>
                {options.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>

            {/* Отображение выбранных элементов */}
            <div className="flex flex-wrap gap-2 mt-2">
                {selected.map((item) => (
                    <div key={item.id} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center">
                        {item.name}
                        <button 
                            onClick={() => removeSelectedItem(item)} 
                            className="ml-2 text-white hover:text-red-400"
                        >
                            ✖
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultiSelectComponent;
