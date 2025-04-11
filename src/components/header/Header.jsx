import { Link, useNavigate } from "react-router-dom";
import { CircleUserRound, LogOut } from "lucide-react";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";

const Header = () => {

  const [user, setUser] = useState({ name: "Guest", greeting: "Welcome!", isAdmin: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = JSON.parse(localStorage.getItem("user"));

    if (!storedName) {
      navigate('/home');
    } else {
      setUser({
        name: storedName.username || "user",
        greeting: storedName.name || "Welcome!"
      });
    }
  }, []);

  const handleExist = () => {
    localStorage.removeItem('user');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 text-white shadow-md md:py-6">
      {/* Mobile & Tablet View */}
      <div className="flex items-center md:hidden">
        {/* <img
          src="https://via.placeholder.com/40"
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        /> */}
        <CircleUserRound size={28} />
        <div className="ml-3">
          <p className="text-sm">Приветствую, <span className="font-bold">{user && user.username ? user.username : 'Гость'}</span></p>
          <p className="text-xs text-gray-400">Добро пожаловать в Halal Scan</p>
        </div>
      </div>
      <Link to="/auth" className="md:hidden">
        <LogOut size={24} className="text-gray-300" onClick={() => handleExist} />
      </Link>

      {/* Desktop View */}
      <nav className="hidden md:flex justify-between w-full">
        <div className="flex space-x-6">
          <Link to="/home" className="hover:text-yellow-400">Главная</Link>
          <Link to="/ecodes" className="hover:text-yellow-400">Е-коды</Link>
          <Link to="/company" className="hover:text-yellow-400">Компании</Link>
        </div>
        <div className="flex space-x-6 items-center">
          <Link to="/profile" className="hover:text-yellow-400">Профиль</Link>
          <Link to="/settings">
            <Settings size={24} className="text-gray-300 hover:text-yellow-400" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
