import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthLayout } from '@/pages/auth-layout';
import { LoginPage } from '@/pages/login';
import { SignupPage } from '@/pages/signup';
import { HomePage } from '@/pages/home';
import { DashboardLayout } from '@/pages/dashboard/layout';
import { DashboardPage } from '@/pages/dashboard/index';

const router = createBrowserRouter([
	{ path: '/', Component: HomePage },
	{
		Component: AuthLayout,
		children: [
			{ path: '/login', Component: LoginPage },
			{ path: '/signup', Component: SignupPage },
		],
	},
	{
		Component: DashboardLayout,
		children: [{ path: '/dashboard', Component: DashboardPage }],
	},
]);

export function App() {
	return <RouterProvider router={router} />;
}

export default App;
