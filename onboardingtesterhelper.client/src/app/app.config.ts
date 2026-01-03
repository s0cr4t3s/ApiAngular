import { ApplicationConfig, LOCALE_ID, provideAppInitializer, inject, APP_INITIALIZER } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { authInterceptor } from './interceptors/auth.interceptor'; // Your 401 handler
import { firstValueFrom, catchError, of } from 'rxjs';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(
			withInterceptors([
				// Interceptor 1: Attach Credentials (Cookies)
				(req, next) => next(req.clone({ withCredentials: true })),
				// Interceptor 2: Global 401 Redirect handler
				authInterceptor
			])
		),
		provideAppInitializer(() => {
			const auth = inject(AuthService);
			// Call initAuth() instead of checkAuthStatus() directly 
			// to ensure signals are populated before the app finishes booting.
			return auth.initAuth();
		}),
		{ provide: LOCALE_ID, useValue: 'pt-PT' },
	]
};
