import { Link } from 'react-router-dom';
import NodeAnimation from '@/components/NodeAnimation';
const NotFound = () => {
  return (<>
		<NodeAnimation particleCount={40}/>
    <div className="flex-grow flex flex-col items-center justify-center text-white z-5">
      <h1 className="text-9xl font-extrabold mb-8">404</h1>
      <p className="text-3xl mb-8">Page not found</p>
      <Link to="/" className="bg-gray-500 hover:bg-gray-700 text-gray-300 font-bold py-2 px-4 rounded">
        Go Home
      </Link>
    </div>
  </>
  );
};

export default NotFound;
