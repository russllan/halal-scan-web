import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../../services/product.service";
import { Link } from "react-router-dom";

const ProductPage = () => {
  const { barcode } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productService.getOne(barcode);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [barcode]);

  if (!product) return <div className="text-center text-xl mt-10">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Link to={'/product-detail'}>
        {/* Блок с изображением */}
        <div className="relative w-full h-2/3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 to-transparent"></div>
        </div>

        {/* Блок с характеристиками */}
        <div className="p-6 bg-gray-800 text-center flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-400 text-sm">Barcode: {barcode}</p>
          <p className="text-lg mt-2">{product.description}</p>
          <p className="mt-4">
            <span className="font-semibold">Halal:</span>
            <span className={`ml-1 ${product.is_halal ? "text-green-400" : "text-red-400"}`}>
              {product.is_halal ? "Yes" : "No"}
            </span>
          </p>
          <p className="mt-2">
            <span className="font-semibold">Company:</span> {product.company.name}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductPage;
