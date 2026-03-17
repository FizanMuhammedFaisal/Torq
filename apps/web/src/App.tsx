import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/protected-route';

import { AuthLayout } from '@/pages/auth-layout';
import { DashboardPage } from '@/pages/dashboard/index';
import { DashboardLayout } from '@/pages/dashboard/layout';
import { RunsPage } from '@/pages/dashboard/runs';
import { SettingsPage } from '@/pages/dashboard/settings';
import { WorkflowCreatePage } from '@/pages/dashboard/workflow-create';
import { WorkflowDetailPage } from '@/pages/dashboard/workflow-detail/index';
import { WorkflowListPage } from '@/pages/dashboard/workflow-list';
import { DocsPage } from '@/pages/docs';
import { ForgotPasswordPage } from '@/pages/forgot-password';
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';
import { SignupPage } from '@/pages/signup';

const router = createBrowserRouter([
	{ path: '/', Component: HomePage },
	{ path: '/docs', Component: DocsPage },
	{
		Component: AuthLayout,
		children: [
			{ path: '/login', Component: LoginPage },
			{ path: '/signup', Component: SignupPage },
			{ path: '/forgot-password', Component: ForgotPasswordPage },
		],
	},
	{
		element: (
			<ProtectedRoute>
				<DashboardLayout />
			</ProtectedRoute>
		),
		children: [
			{ path: '/dashboard', Component: DashboardPage },
			{ path: '/dashboard/workflows', Component: WorkflowListPage },
			{ path: '/dashboard/workflows/create', Component: WorkflowCreatePage },
			{ path: '/dashboard/workflows/:id', Component: WorkflowDetailPage },
			{ path: '/dashboard/runs', Component: RunsPage },
			{ path: '/dashboard/settings', Component: SettingsPage },
		],
	},
]);

import { Toaster } from '@/components/ui/toaster';
import { useAppInit } from '@/hooks/use-app-init';

export function App() {
	useAppInit();
	return (
		<>
			<RouterProvider router={router} />
			<Toaster />
		</>
	);
}

export default App;
