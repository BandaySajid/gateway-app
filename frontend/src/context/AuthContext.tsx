import { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

export enum Plan {
	free = 'free',
	// basic = 'basic',
	premium = 'premium'
}

interface UserData {
  id: string;
  email: string;
  name: string;
  plan: Plan;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user?: UserData | null;  
}

interface AuthContextData {
  authState: AuthState;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const decodedToken: any = jwtDecode(token);
    const expiry = decodedToken.exp * 1000; 
    return Date.now() >= expiry;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const getInitialAuthState = (): AuthState => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
  
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        if (!isTokenExpired(token)) {
          return {
            isAuthenticated: true,
            token: token,
            user: user,
          };
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        logout();
      }
    }
  
    return {
      isAuthenticated: false,
      token: null,
      user: null,
    };
  };

  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenExpired(token)) {
        logout();
      } else {
        const userString = localStorage.getItem('user');
        if (userString) {
          try {
            const user = JSON.parse(userString);
            setAuthState({
              isAuthenticated: true,
              token: token,
              user: user,
            });
          } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            logout();
          }
        }
      }
    }
  }, []);

  function login(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      isAuthenticated: true,
      token: token,
      user: user,
    });
  };

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
    });
    window.location.href = '/auth';
  };
  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
