import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthLayout } from '@/pages/auth-layout';
import { DashboardPage } from '@/pages/dashboard/index';
import { DashboardLayout } from '@/pages/dashboard/layout';
import { RunsPage } from '@/pages/dashboard/runs';
import { SettingsPage } from '@/pages/dashboard/settings';
import { WorkflowDetailPage } from '@/pages/dashboard/workflow-detail';
import { WorkflowListPage } from '@/pages/dashboard/workflow-list';
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { SignupPage } from '@/pages/signup';

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
		children: [
			{ path: '/dashboard', Component: DashboardPage },
			{ path: '/dashboard/workflows', Component: WorkflowListPage },
			{ path: '/dashboard/workflows/:id', Component: WorkflowDetailPage },
			{ path: '/dashboard/runs', Component: RunsPage },
			{ path: '/dashboard/settings', Component: SettingsPage },
		],
	},
]);

import { Toaster } from '@/components/ui/toaster';

export function App() {
	return (
		<>
			<RouterProvider router={router} />
			<Toaster />
		</>
	);
}

export default App;
