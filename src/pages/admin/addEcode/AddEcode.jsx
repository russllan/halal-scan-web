import { useState, useEffect } from "react";
import SelectComponent from "../../../components/admin/select/Select";
import productService from "../../../services/product.service";
import ecodeService from "../../../services/ecode.service";

const AddEcode = () => {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("halal");
    const [productId, setProductId] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await productService.getAll();
                if (response) {
                    setProducts(response);
                }
            } catch (error) {
                console.log('error', error);
            }
        }
        getProduct();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newData = {
            code: code,
            name: name,
            status: status,
            category: (category),
            productId: Number(productId)
        };
        console.log(newData);
        try {
            await ecodeService.create(newData);
            alert("E-код успешно добавлен!");
            setCode("");
            setName("");
            setCategory("");
            setStatus("");
            setProductId("");
            set
        } catch (error) {
            console.error("Ошибка при добавлении Е-кода", error.response.data.message);
            setError
            alert("Ошибка при добавлении!");
        }
    };

    return (
        <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg text-white mt-8">
            <h2 className="text-xl font-bold mb-4">Добавить Е-код</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="E-код (например, E-140)" className="w-full p-2 bg-gray-800 rounded" value={code} onChange={(e) => setCode(e.target.value)} required />
                <input type="text" placeholder="Название Е-кода" className="w-full p-2 bg-gray-800 rounded" value={name} onChange={(e) => setName(e.target.value)} required />
                <SelectComponent apiType='category' valueKey='category' selected={category} setSelected={setCategory} />
                <select className="w-full p-2 bg-gray-800 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="halal">Халал</option>
                    <option value="haram">Не Халал</option>
                    <option value="suspicious">Подозрительный</option>
                </select>
                <select className="w-full p-2 bg-gray-800 rounded" value={productId} onChange={(e) => setProductId(e.target.value)}>
                    <option value="">Выберите продукт</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                </select>
                <button type="submit" className="w-full bg-yellow-500 p-2 rounded font-bold">Добавить</button>
            </form>
        </div>
    );
};

export default AddEcode;