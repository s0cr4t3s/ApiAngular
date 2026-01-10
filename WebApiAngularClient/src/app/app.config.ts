import { ApplicationConfig, LOCALE_ID, provideAppInitializer, inject, InjectionToken, APP_INITIALIZER } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';

// PrimeNG Imports
import { MessageService, ConfirmationService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { authInterceptor } from './interceptors/auth.interceptor';
import { DefaultBlueTheme } from './layout/theme.config';
import { environment } from '../environments/environment';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { AppConfig, ConfigurationService } from './services/configuration.service';
import { lastValueFrom, throwError } from 'rxjs';
import { errorInterceptor } from './interceptors/error.interceptor';

registerLocaleData(localePt);

// This fix Circular Dependencies
export const ENVIRONMENT_CONFIG = new InjectionToken<typeof environment>('environment.config');
export const appConfigProviders = [
	{ provide: ENVIRONMENT_CONFIG, useValue: environment }
];

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(
			withInterceptors([
				(req, next) => next(req.clone({ withCredentials: true })),
				authInterceptor,
				loadingInterceptor,
				errorInterceptor
			])
		),
		provideAppInitializer(() => {
			const http = inject(HttpClient);
			const configService = inject(ConfigurationService);
			const auth = inject(AuthService);

			// Step 1: Load the Config
			return lastValueFrom(http.get<AppConfig>(environment.configFileName))
				.then(config => {
					configService.config = config;
					console.log('Config Loaded');
					if (configService.config.environmentName !== environment.environmentName) {
						const errorMessage = `Environment Mismatch beteween the environment build (${environment.environmentName}) and config file (${environment.configFileName}).`;
						console.error(errorMessage);

						return Promise.reject(errorMessage);
					}

					// Step 2: Now that we have the URL, Initialize Auth
					return auth.initAuth();
				})
				.catch(err => {
					console.error('Critical Startup Error:', err);
				});
		}),
		appConfigProviders,
		{ provide: LOCALE_ID, useValue: 'pt-PT' },
		// --- PrimeNG Specifics ---
		providePrimeNG({
			theme: {
				preset: DefaultBlueTheme, // This applies the modern "Aura" look [cite: 2025-10-10]
				options: {
					darkModeSelector: '.my-app-dark', // Disables automatic dark mode if you want light only
					ripple: true             // Enables the material-like ripple effect
				}
			},
			ripple: true // Enables the click ripple effect
		}),
		MessageService,      // Allows you to use this.messageService.add(...) anywhere
		ConfirmationService  // Allows you to use this.confirmationService.confirm(...)
	]
};
