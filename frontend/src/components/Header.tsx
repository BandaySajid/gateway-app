import { Link } from 'react-router-dom';
import logo from '../assets/logo-white.svg';
import Sidebar from './Sidebar';
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';

const Header = () => {
  const ac = useContext(AuthContext);
  return (
    <header className="flex justify-between items-center shadow-md mb-8">
      <div className="flex items-center relative z-5 px-4">
        <Link to={ac?.authState.isAuthenticated ? "/rules" : "/"}>
          <img src={logo} alt="Amplizard Logo" className="h-14" />
        </Link>
        <span className="text-xs text-cyan-500 absolute right-0 top-0 font-bold">BETA</span>
      </div>
      <Sidebar />
    </header>
  );
};

export default Header;
