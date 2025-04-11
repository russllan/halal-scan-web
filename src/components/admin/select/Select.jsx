import { useState, useEffect } from "react";
import ingredientService from "../../../services/ingredient.service";
import ecodeService from "../../../services/ecode.service";
import categoryService from "../../../services/category.service";
import companyService from "../../../services/company.service";

const SelectComponent = ({ apiType, valueKey, selected, setSelected, multiple = false }) => {
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = apiType === "ingredients"
                    ? await ingredientService.getAll()
                    : apiType === "e-codes"
                        ? await ecodeService.getAll()
                        : apiType === 'company' ? await companyService.getAll() : await categoryService.getAll();

                if (Array.isArray(data)) {
                    setOptions(apiType === "category"
                        ? data.map(({ id, name }) => ({ id, name }))
                        : data
                    );
                } else {
                    console.error("Неверный формат данных:", data);
                }
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        fetchData();
    }, [apiType]);

    const handleChange = (e) => {
        const value = multiple
            ? Array.from(e.target.selectedOptions, (option) => option.value)
            : e.target.value;

        setSelected(value);
    };

    return (
        <select
            multiple={multiple}
            className="w-full p-2 border rounded bg-gray-800 text-white"
            value={selected}
            onChange={handleChange}
        >
            {!multiple && <option value="">Выберите {apiType === "ingredients" ? "ингредиент" : apiType === "category" ? "категорию" : apiType === 'company' ? "производителя" : "е-код"}</option>}
            {options.map((item) => (
                <option key={item.id} value={item[valueKey] || item.id}>
                    {item[valueKey] || item.name || "Неизвестное значение"}
                </option>
            ))}
        </select>
    );
};

export default SelectComponent;
