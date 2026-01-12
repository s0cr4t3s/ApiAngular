import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject, Injector } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const messageService = inject(MessageService);
	const injector = inject(Injector);

	// Helper function to handle the dynamic translation
	const getDynamicTranslation = (key: string, commaArgs?: string): string => {
		const translate = injector.get(TranslateService);
		if (!commaArgs) return translate.instant(key);

		const argsArray = commaArgs.split(',');
		const params = Object.assign({}, argsArray);

		// The value key needs to have {{0}}, {{1}}, ..., {{n}} equals the number of 'params'.
		return translate.instant(key, params);
	};

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			const translate = injector.get(TranslateService);
			let errorMessage: string = 'DEFAULT_ERROR';
			let showMessageError: boolean = true;

			switch (error.status) {
				case 400: // Bad Request
					console.error('400 - Bad Request...');
					break;
				case 401: // Unauthorized
					console.warn('401 - Session expired. Redirecting...');
					authService.clearSession();
					if (!error.error) {
						errorMessage = 'UnauthorizedUser';
						showMessageError = false;
					}
					else {
						errorMessage = error.error.code;
					}
					break;
				case 403: // Forbidden
					console.warn('403 - Forbidden. Redirecting...');
					break;
				case 404: // Not found
					console.error('404 - Not found...');
					break;
				case 500: // Server error
					console.error('500 - Server error...');
					break;
				default:
					console.error(`${error.status} - other error...`);
					break;

			}

			if (showMessageError) {
				messageService.add({
					severity: 'error',
					summary: translate.instant('ERROR_HANDLER.TITLE'),
					detail: getDynamicTranslation(`ERROR_HANDLER.${errorMessage}`, error?.error?.errorDataInformation),
					life: 3000
				});
			}

			console.error(errorMessage);
			// Return the error so the calling service can still handle it if needed
			return throwError(() => error);
		})
	);
};

