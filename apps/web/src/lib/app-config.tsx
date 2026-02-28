import * as React from 'react';

interface AppConfig {
	authEnabled: boolean;
}

const AppConfigContext = React.createContext<AppConfig>({
	authEnabled: false,
});

const appConfig: AppConfig = {
	authEnabled: import.meta.env.VITE_AUTH_ENABLED === 'true',
};

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
	return (
		<AppConfigContext.Provider value={appConfig}>
			{children}
		</AppConfigContext.Provider>
	);
}

export function useAppConfig() {
	return React.useContext(AppConfigContext);
}
