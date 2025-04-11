import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate для перехода
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Link } from "react-router-dom";

const ScanPage = () => {
  const [decodedText, setDecodedText] = useState("");
  const [scanner, setScanner] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false); // Состояние для запуска камеры
  const navigate = useNavigate(); // Для навигации

  useEffect(() => {
    if (!cameraStarted) return;

    const qrScanner = new Html5Qrcode("qr-reader");
    setScanner(qrScanner);

    qrScanner
      .start(
        { facingMode: "environment" }, // Задняя камера
        {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minSize = Math.min(viewfinderWidth, viewfinderHeight);
            return { width: minSize * 0.9, height: minSize * 0.9 }; // Камера занимает 90% экрана
          },
          supportedFormats: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128, // Добавляем поддержку CODE 128
            Html5QrcodeSupportedFormats.CODE_39,  // Добавляем поддержку CODE 39
            Html5QrcodeSupportedFormats.EAN_13,   // Добавляем поддержку EAN 13
            Html5QrcodeSupportedFormats.EAN_8,    // Добавляем поддержку EAN 8
            Html5QrcodeSupportedFormats.UPC_A,    // Добавляем поддержку UPC A
            Html5QrcodeSupportedFormats.UPC_E     // Добавляем поддержку UPC E
          ],
        },
        (decodedText) => {
          console.log("Штрих-код:", decodedText);
          setDecodedText(decodedText);
          sendToBackend(decodedText);
          // Переход на страницу с товаром, передаем штрих-код как параметр
          navigate(`/product/${decodedText}`);
        },
        (error) => console.warn("Ошибка сканирования:", error)
      )
      .catch((err) => console.error("Ошибка запуска сканера:", err));

    return () => {
      // Остановка сканера при размонтировании компонента
      if (qrScanner.isScanning) {
        qrScanner.stop().catch(() => {}); // Безопасный вызов stop()
      }
    };
  }, [cameraStarted, navigate]); // Запускаем только если камера была активирована

  const sendToBackend = async (decodedText) => {
    try {
      const response = await fetch("http://localhost:3000/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData: decodedText }),
      });
      const data = await response.json();
      console.log("Ответ от сервера:", data);
    } catch (error) {
      console.error("Ошибка отправки на бэкенд:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !scanner) return;

    try {
      const result = await scanner.scanFile(file, false);
      setDecodedText(result);
      sendToBackend(result);
      // Переход на страницу с товаром
      navigate(`/product/${result}`);
    } catch (error) {
      console.error("Ошибка сканирования файла:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold mb-4">Сканер штрих-кода</h1>
      <div
        id="qr-reader"
        className="w-full max-w-lg h-80 bg-gray-900 rounded-lg mb-4 flex justify-center items-center"
        style={{ position: "relative", maxWidth: "500px", height: "400px" }}
      ></div>

      {decodedText && (
        <div className="bg-gray-900 text-white p-4 rounded-lg w-4/5 max-w-lg mt-4 text-center">
          Считанный штрих-код: {decodedText}
        </div>
      )}

      {!cameraStarted && (
        <button
          onClick={() => setCameraStarted(true)}
          className="mt-6 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md"
        >
          Запустить камеру
        </button>
      )}

      <label className="mt-6 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md cursor-pointer">
        Выбрать файл
        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
      </label>
    </div>
  );
};

export default ScanPage;
