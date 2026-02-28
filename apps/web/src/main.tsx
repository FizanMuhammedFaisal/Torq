import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AppConfigProvider } from '@/lib/app-config';

// Dark mode by default
document.documentElement.classList.add('dark');

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
	<StrictMode>
		<AppConfigProvider>
			<App />
		</AppConfigProvider>
	</StrictMode>,
);
