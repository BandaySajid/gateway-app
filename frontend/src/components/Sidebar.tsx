import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MenuIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/context/AuthContext';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const ac = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={cn(
        "border rounded-lg shadow-sm dark:border-neutral-800 dark:bg-neutral-950 text-white absolute top-0 right-0 z-7 transition-all duration-300",
        isCollapsed ? "w-0" : "w-full md:w-64 min-h-screen"
      )}
    >
      <Button
        variant={"outline"}
        onClick={toggleSidebar}
        className={`p-4 text-left ${isCollapsed ? 'absolute': 'fixed'} hover:bg-gray-700 transition-colors duration-200 right-2 top-6 z-3`}
      >
        {isCollapsed ? (
          <MenuIcon className="h-6 w-6" />
        ) : (
          <X className="h-6 w-6" />
        )}
      </Button>

      <div  className={cn(
        "fixed h-full dark:bg-neutral-950 w-full",
        isCollapsed ? "w-0" : "w-full md:w-64 min-h-screen"
      )}>
      {!isCollapsed && (
        <nav className="p-4 w-full pt-20">
          <ul className="space-y-2">
              {ac?.authState.user && (
                <>
                <li>
                <span className='space-x-2 p-2 text-blue-400'>{ac?.authState.user.email}</span>
                </li>
                < hr className='border-gray-700 my-2'></hr>
                <li>
                <Link onClick={toggleSidebar} to="/dashboard" className="flex items-center space-x-2 hover:bg-neutral-700 p-2 rounded hover:bg-neutral-900 text-neutral-400">
                  <span>Dashboard <Badge  variant={'outline'}>coming soon</Badge></span>
                </Link>
                </li>
                </>
              )} 

              <li>
                <Link to="/plans" onClick={toggleSidebar} className="flex items-center space-x-2 hover:bg-neutral-700 p-2 rounded hover:bg-neutral-900 text-neutral-400">
                  <span>Plans</span>
                </Link>
              </li>


            {!ac?.authState.isAuthenticated && (
                <li>
                  <Link onClick={toggleSidebar} to="/auth" className="flex items-center space-x-2 hover:bg-neutral-700 p-2 rounded hover:bg-neutral-900 text-neutral-400">
                  <span>Signin</span>
                  </Link>
                </li>

              )}

            {ac?.authState.isAuthenticated && (
              <>
              <li>
              <Link to="/rules" onClick={toggleSidebar} className="flex items-center space-x-2 hover:bg-neutral-700 p-2 rounded hover:bg-neutral-900 text-neutral-400">
                <span>Rules</span>
              </Link>
            </li>
              <li>
                <Link to="/settings" onClick={toggleSidebar} className="flex items-center space-x-2 hover:bg-neutral-700 p-2 rounded hover:bg-neutral-900 text-neutral-400">
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={'outline'} className="ml-1 flex items-center space-x-2  p-2 rounded hover:bg-neutral-900 text-red-600">
                      <span>Log Out</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className='text-white'>Are you sure you want to log out?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will be redirected to the login page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className='text-white'>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                      onClick={() => ac.logout()}
                      className='text-white'
                      >
                        Log Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
              </>
            )}

              <li>
                <Link onClick={toggleSidebar} to="/contact" className="flex items-center space-x-2 hover:bg-neutral-700 p-2 rounded hover:bg-neutral-900 text-neutral-400">
                <span>Contact Us</span>
                </Link>
              </li>

          </ul>
        </nav>
      )}
      </div>
    </aside>
  );
};

export default Sidebar;
