import { Route, Routes, useLocation } from 'react-router-dom';
import Homepage from './pages/homepage/Homepage';
import Header from './components/header/Header';
import Navbar from './components/nav/Navbar';
import EcodePage from './pages/e-codes/EcodePage';
import CompanyPage from './pages/company/CompanyPage';
import ProfilePage from './pages/profile/ProfilePage';
import ScanPage from './pages/scanpage/ScanPage';
import ProductPage from './pages/product/ProductPage';
import AddProduct from './pages/admin/addProduct/AddProduct';
import AdminNavbar from './components/admin/navbar/AdminNavbar';
import Auth from './pages/auth/Auth';
import AddEcode from './pages/admin/addEcode/AddEcode';
import AddCompany from './pages/admin/addCompany/AddCompany';
import AdminHome from './pages/admin/home/AdminHome';
import ProductDetailPage from './pages/product/ProductDetailPage';
import MainPage from './pages/admin/home/AdminHome';

function App() {
  const location = useLocation();
  const hideHeaderNavbar = ['/auth', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col">
      {!hideHeaderNavbar && <Header />}

      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/ecodes" element={<EcodePage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/product/:barcode" element={<ProductDetailPage />} />
        <Route path="/productScan/:barcode" element={<ProductDetailPage />} />
        <Route path="/auth" element={<Auth type='login' />} />
        <Route path="/register" element={<Auth type='register' />} />
        {/* <Route path="/product-detail" element={<ProductDetailPage/>} /> */}
        {/* admin */}
        <Route path="/admin" element={<MainPage />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/add-ecodes" element={<AddEcode />} />
        <Route path="/admin/add-company" element={<AddCompany />} />
      </Routes>

      {!hideHeaderNavbar &&
        (location.pathname.startsWith('/admin') ? (
          <div className='pt-15'><AdminNavbar /></div>
        ) : (
          <div className='pt-15'><Navbar /></div>
        ))
      }
    </div>
  );
}

export default App;
