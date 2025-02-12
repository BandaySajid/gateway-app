import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/app/pages/Home';
import RuleForm from '@/components/RuleForm';
import Rules from '@/components/Rules';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import NotFound from '@/app/pages/NotFound';
import Auth from '@/app/pages/Auth';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {GOOGLE_CLIENT_ID} from '../../config.mjs';
import { useContext } from 'react';
import { AuthContext} from '@/context/AuthContext';
import SettingsPage from './pages/Settings';
import Plans from './pages/Plans';
import Contact from './pages/Contact';

function Router() {
	const authContext = useContext(AuthContext);
	const isAuthenticated = authContext?.authState.isAuthenticated;

	return (
			<div className='min-h-full p-4 sm:px-6 lg:px-8 flex flex-col bg-neutral-950'>
				<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
					<BrowserRouter>
						<Header />
						<Routes>
							{isAuthenticated ? (
								<>
									<Route path="/" element={<Home />} />
									<Route path="/rules/:id" element={<RuleForm />} />
									<Route path="/rules/new" element={<RuleForm />} />
									<Route path="/rules" element={<Rules />} />
									<Route path="/auth" element={<Navigate to="/rules" />} />
									<Route path="/settings" element={<SettingsPage />} />
									<Route path="/plans" element={<Plans />} />
									<Route path="/contact" element={<Contact />} />
									<Route path="/dashboard" element={<Navigate to="/rules" replace={true} />} />
									<Route path="*" element={<NotFound />} />
								</>
							) : (
								<>
									<Route path="/" element={<Home />} />
									<Route path="/auth" element={<Auth />} />
									<Route path="/plans" element={<Plans />} />
									<Route path="/contact" element={<Contact />} />
									<Route path="*" element={<Navigate to="/auth" replace={true} />} />
								</>
							)}
						</Routes>
					</BrowserRouter>
				</GoogleOAuthProvider>
				<Toaster />
			</div>
	);
}

export default Router;
