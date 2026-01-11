import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const messageService = inject(MessageService);
	const translate = inject(TranslateService);
	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			let errorMessage = 'An unknown error occurred!';
			let errorCode = 'DEFAULT_ERROR';

			// 1. Handle .NET API Side Errors (4xx, 5xx)
			if (error.error instanceof ErrorEvent) {
				// Client-side error
				errorMessage = `Error: ${error.error.message}`;
			} else {
				// Server-side error (from your .NET 10 API)
				errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

				switch (error.status) {
					case 400: // Bad Request
						console.error('400 - Bad Request...');
						break;
					case 401: // Unauthorized
						console.warn('401 - Session expired. Redirecting...');
						authService.clearSession();
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
			}

			messageService.add({
				severity: 'error',
				summary: translate.instant('ERROR_HANDLER.TITLE'),
				detail: translate.instant(`ERROR_HANDLER.${errorCode}`) ,
				life: 3000
			});

			console.error(errorMessage);
			// Return the error so the calling service can still handle it if needed
			return throwError(() => error);
		})
	);
};
