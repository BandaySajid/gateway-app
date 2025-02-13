import { Link } from 'react-router-dom';
import { FacebookIcon, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border border-neutral-900 text-white py-6 z-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between text-center md:text-left">
          <div className="text-sm text-neutral-400 order-2 md:order-1 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Amplizard. All rights reserved.
          </div>
          <div className="order-1 md:order-2 mt-4 md:mt-0">
            <ul className="flex flex-wrap justify-center md:flex-row md:space-x-4 flex-col">
              <li>
                <Link to="/terms" className="underline hover:text-cyan-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="underline hover:text-cyan-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="underline hover:text-cyan-400">
                  Contact 
                </Link>
              </li>
            </ul>
          </div>
          <div className="order-3 mt-4 md:mt-0">
            <ul className="flex space-x-4 justify-center">
              <li>
                <a href="#" className="hover:text-cyan-400">
                  <i className="fab fa-facebook"></i>
                  <FacebookIcon></FacebookIcon>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-cyan-400">
                  <i className="fab fa-twitter"></i>
                  <Twitter/>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
