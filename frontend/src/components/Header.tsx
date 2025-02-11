import { Link } from 'react-router-dom';
import logo from '../assets/logo-white.svg';
import Sidebar from './Sidebar';
import { AuthContext } from '@/context/AuthContext';
import { useContext } from 'react';

const Header = () => {
  const ac = useContext(AuthContext);
  return (
    <header className="flex justify-between items-center shadow-md mb-8">
      <div className="flex items-center">
        <Link to={ac?.authState.isAuthenticated ? "/rules" : "/"}>
          <img src={logo} alt="Amplizard Logo" className="h-14" />
        </Link>
      </div>
      <Sidebar />
    </header>
  );
};

export default Header;
