import { LayoutDashboard, PlusCircle, Building, Barcode } from "lucide-react";
import { Link } from 'react-router-dom';

const NavItem = ({ icon, label, highlight }) => {
  return (
    <div className={`flex flex-col items-center text-white ${highlight ? 'relative z-10' : ''}`}>
      <div className={`${highlight ? 'bg-blue-500 p-2 rounded-full' : ''}`}>
        {icon}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
};

const AdminNavbar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-blue-800 p-4 flex justify-around items-center rounded-t-3xl md:hidden shadow-lg">
      <Link to={"/admin/"}>
        <NavItem icon={<LayoutDashboard size={24} />} label="Админ панель" />
      </Link>
      <Link to={"/admin/add-product"}>
        <NavItem icon={<Barcode size={24} />} label="Добавить продукт" />
      </Link>
      <Link to={"/admin/add-ecodes"}>
        <NavItem icon={<PlusCircle size={24} />} label="Добавить Е-коды" />
      </Link>
      <Link to={"/admin/add-company"}>
        <NavItem icon={<Building size={24} />} label="Добавить компании" />
      </Link>
    </div>
  );
};

export default AdminNavbar;
