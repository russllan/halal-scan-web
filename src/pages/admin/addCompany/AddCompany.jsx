import { useState } from "react";
import companyService from "../../../services/company.service";

const AddCompany = () => {
    const [formData, setFormData] = useState({
        name: "",
        country: "",
        website: "",
        is_halal_certified: false,
        certification_authority: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newData = {
                name: formData.name,
                country: formData.country,
                website: formData.website,
                is_halal_certified: formData.is_halal_certified,
                certification_authority: formData.certification_authority
            };
            console.log(newData);
            const response = await companyService.create(newData);
            alert("Компания успешно добавлена!");
            setFormData({
                name: "",
                country: "",
                website: "",
                is_halal_certified: false,
                certification_authority: "",
            });
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-md mt-12">
            <h2 className="text-xl font-bold mb-4">Добавить компанию</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Название компании"
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                    required
                />
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Страна"
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                />
                <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Веб-сайт"
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                />
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="is_halal_certified"
                        checked={formData.is_halal_certified}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label>Халяль-сертифицирована</label>
                </div>
                {formData.is_halal_certified ? <input
                    type="text"
                    name="certification_authority"
                    value={formData.certification_authority}
                    onChange={handleChange}
                    placeholder="Орган сертификации"
                    className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                />
                    : null}
                <button
                    type="submit"
                    className="w-full bg-yellow-500 text-gray-900 py-2 rounded font-bold hover:bg-yellow-600"
                >
                    Добавить компанию
                </button>
            </form>
        </div>
    );
};

export default AddCompany;
