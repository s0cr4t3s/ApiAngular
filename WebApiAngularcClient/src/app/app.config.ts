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

registerLocaleData(localePt);

// blue, indigo, purple, pink, red, orange, amber, yellow, teal, cyan, green, emerald, lime, slate, gray, zinc, neutral, stone.
const MyPreset = definePreset(Aura, {
	semantic: {
		primary: {
			// This replaces "Teal" with "Blue"
			50: '{blue.50}',
			100: '{blue.100}',
			200: '{blue.200}',
			300: '{blue.300}',
			400: '{blue.400}',
			500: '{blue.500}',
			600: '{blue.600}',
			700: '{blue.700}',
			800: '{blue.800}',
			900: '{blue.900}',
			950: '{blue.950}'
		}
	}
});

const NoirPreset = definePreset(Aura, {
	semantic: {
		primary: {
			50: '{zinc.50}',
			100: '{zinc.100}',
			200: '{zinc.200}',
			300: '{zinc.300}',
			400: '{zinc.400}',
			500: '{zinc.500}',
			600: '{zinc.600}',
			700: '{zinc.700}',
			800: '{zinc.800}',
			900: '{zinc.900}',
			950: '{zinc.950}'
		},
		colorScheme: {
			light: {
				primary: {
					color: '{zinc.950}',
					contrastColor: '#ffffff',
					hoverColor: '{zinc.800}',
					activeColor: '{zinc.700}'
				}
			},
			dark: {
				primary: {
					color: '{zinc.50}',
					contrastColor: '{zinc.950}',
					hoverColor: '{zinc.200}',
					activeColor: '{zinc.300}'
				}
			}
		}
	}
});

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
				preset: MyPreset, // This applies the modern "Aura" look [cite: 2025-10-10]
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
