import { Link } from "react-router-dom";

interface SLinkProps {
  text: string;
  to: string;
  toggleSidebar: () => void;
}

const SLink: React.FC<SLinkProps> = ({ toggleSidebar, text, to }) => {
  return (
    <li>
      <Link to={to} onClick={toggleSidebar} className="flex items-center space-x-2 p-2 rounded hover:text-cyan-400 hover:bg-neutral-900 text-neutral-400">
        <span>{text}</span>
      </Link>
    </li>
  );
};

export default SLink;