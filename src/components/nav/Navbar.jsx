import { Home, Headphones, Heart, Grid, QrCode, TicketPercent, User } from "lucide-react";
import { Link } from 'react-router-dom';

const NavItem = ({ icon, label, highlight }) => {
  return (
    <div className={`flex flex-col items-center text-white ${highlight ? 'relative z-10' : ''}`}>
      <div className={`${highlight ? 'bg-yellow-500 p-2 rounded-full' : ''}`}>
        {icon}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
};

const Navbar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-4 flex justify-around items-center rounded-t-3xl md:hidden shadow-lg">
      <Link to={"/home"}>
        <NavItem icon={<Home size={24} />} label="Главная" />
      </Link>
      <Link to={"/ecodes"}>
        <NavItem icon={<TicketPercent size={24} />} label="Е-коды" />
      </Link>
      <Link to={"/scan"}>
        <NavItem icon={<QrCode size={26} />} highlight />
      </Link>
      <Link to={"/company"}>
        <NavItem icon={<Grid size={24} />} label="Компании" />
      </Link>
      <Link to={"/profile"}>
        <NavItem icon={<User size={24} />} label="Профиль" />
      </Link>
    </div>
  );
};

export default Navbar;
