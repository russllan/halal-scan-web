import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import SelectComponent from "../../../components/admin/select/Select";
import MultiSelectComponent from "../../../components/admin/select/MultiSelectComponent";
import productService from "../../../services/product.service";

const AddProductPage = () => {
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedECodes, setSelectedECodes] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const [scanner, setScanner] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const videoRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cameraStarted) return;

    const qrScanner = new Html5Qrcode("qr-reader");
    setScanner(qrScanner);

    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices.length > 0) {
          const backCamera = devices.find(device => device.label.toLowerCase().includes("back"));
          const cameraId = backCamera ? backCamera.id : devices[0].id;

          qrScanner.start(
            cameraId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              setBarcode(decodedText);
              qrScanner.stop().then(() => setCameraStarted(false));
            },
            (error) => console.warn("Ошибка сканирования:", error)
          );
        }
      })
      .catch(err => console.error("Ошибка доступа к камере:", err));

    return () => {
      if (qrScanner && qrScanner.isScanning) {
        qrScanner.stop().catch(() => { });
      }
    };
  }, [cameraStarted, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const startCamera = async () => {
    setCapturing(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "photo.png", { type: "image/png" });
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }, "image/png");

    video.srcObject.getTracks().forEach(track => track.stop());
    setCapturing(false);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("barcode", barcode);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    selectedIngredients.forEach((item, index) => {
      formData.append(`ingredients[${index}]`, item.id);
    });

    selectedECodes.forEach((item, index) => {
      formData.append(`eCodes[${index}]`, item.id);
    });

    formData.append("categories[0]", selectedCategory);
    formData.append("company", selectedCompany);

    try {
      const response = await productService.create(formData);
      if (response) {
        alert("Продукт добавлен");
        setName("");
        setBarcode("");
        setDescription("");
        setImageFile(null);
        setImagePreview(null);
        setSelectedIngredients([]);
        setSelectedECodes([]);
        setSelectedCompany("");
      }
    } catch (error) {
      alert("Ошибка: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Добавить продукт</h1>

      <div id="qr-reader" className="w-full max-w-lg h-80 bg-gray-800 rounded-lg flex justify-center items-center mb-4"></div>

      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded bg-gray-800 text-white"
        />

        {capturing ? (
          <div className="relative">
            <video ref={videoRef} autoPlay className="w-full h-60 bg-black rounded"></video>
            <button
              onClick={capturePhoto}
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 hover:bg-red-500 text-white p-2 rounded"
            >
              Сделать фото
            </button>
          </div>
        ) : (
          <button
            onClick={startCamera}
            className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-md transition"
          >
            📷 Открыть камеру
          </button>
        )}

        {imagePreview && (
          <img src={imagePreview} alt="Предпросмотр" className="w-full h-40 object-cover mt-2 rounded" />
        )}
      </div>

      <div className="pt-5">
        {!cameraStarted && (
          <button
            onClick={() => setCameraStarted(true)}
            className="mb-4 w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-md transition"
          >
            Запустить камеру для штри-кода
          </button>
        )}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Штрих-код"
          className="w-full p-2 border rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Название продукта"
          className="w-full p-2 border rounded bg-gray-800 text-white"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание"
          className="w-full p-2 border rounded bg-gray-800 text-white"
        />

        <SelectComponent apiType="category" valueKey="category" selected={selectedCategory} setSelected={setSelectedCategory} />

        <MultiSelectComponent
          apiType="ingredients"
          valueKey="ing"
          selected={selectedIngredients}
          setSelected={setSelectedIngredients}
        />

        <MultiSelectComponent
          apiType="e-codes"
          valueKey="ecode"
          selected={selectedECodes}
          setSelected={setSelectedECodes}
        />

        <SelectComponent apiType="company" valueKey="company" selected={selectedCompany} setSelected={setSelectedCompany} />

        <button className="w-full bg-green-600 hover:bg-green-500 py-2 rounded-md transition" onClick={handleSubmit}>
          Добавить продукт
        </button>
      </div>
    </div>
  );
};

export default AddProductPage;
