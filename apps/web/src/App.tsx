import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AuthLayout } from '@/pages/auth/auth-layout';
import { DashboardLayoutPage } from '@/pages/dashboard/layout';
import { SettingsPage } from '@/pages/dashboard/settings';
import { WorkflowCreatePage } from '@/pages/dashboard/workflow-create';
import { WorkflowDetailPage } from '@/pages/dashboard/workflow-detail';
import { WorkflowListPage } from '@/pages/dashboard/workflow-list';
import { DocsPage } from '@/pages/docs';
import { ForgotPasswordPage } from '@/pages/auth/forgot-password';
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/auth/login';
import { SignupPage } from '@/pages/auth/signup';
import { OverviewTab } from '@/features/workflows/components/detail/overview-tab';
import { EditorTab } from '@/features/workflows/components/detail/editor-tab';
import { RunsTab } from '@/features/runs/components/runs-tab';
import { MetricsTab } from '@/features/workflows/components/detail/metrics-tab';
import { SecretsTab } from '@/features/workflows/components/detail/secrets-tab';

import { DashboardPage } from './pages/dashboard/dashboard';
import { RunsPage } from './pages/dashboard/runs';
import { Toaster } from '@/components/ui/toaster';
import { useAppInit } from '@/hooks/use-app-init';
import { RunDetailView } from './features/runs/components/detail/run-detail-view';

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
				<DashboardLayoutPage />
			</ProtectedRoute>
		),
		children: [
			{ path: '/dashboard', Component: DashboardPage },
			{ path: '/dashboard/workflows', Component: WorkflowListPage },
			{ path: '/dashboard/workflows/create', Component: WorkflowCreatePage },
			{
				path: '/dashboard/workflows/:id',
				Component: WorkflowDetailPage,
				children: [
					{ index: true, Component: OverviewTab },
					{ path: 'editor', Component: EditorTab },
					{ path: 'runs', Component: RunsTab },
					{ path: 'runs/:runId', Component: RunDetailView },
					{ path: 'metrics', Component: MetricsTab },
					{ path: 'secrets', Component: SecretsTab },
				],
			},
			{ path: '/dashboard/runs', Component: RunsPage },
			{ path: '/dashboard/settings', Component: SettingsPage },
		],
	},
]);

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
