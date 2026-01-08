import { ApplicationConfig, LOCALE_ID, provideAppInitializer, inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// PrimeNG Imports
import { MessageService, ConfirmationService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'; // Or your preferred theme
import { definePreset } from '@primeng/themes';

import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { authInterceptor } from './interceptors/auth.interceptor';
import { DefaultBlueTheme } from './layout/theme.config';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(
			withInterceptors([
				(req, next) => next(req.clone({ withCredentials: true })),
				authInterceptor
			])
		),
		provideAppInitializer(() => {
			const auth = inject(AuthService);
			return auth.initAuth();
		}),
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
