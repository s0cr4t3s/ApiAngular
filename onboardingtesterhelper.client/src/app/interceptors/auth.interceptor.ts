import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // 401 Unauthorized means the .NET JWT cookie is missing or expired
            if (error.status === 401 && !router.url.includes('/login') && authService.isInitialCheckDone()) {
                // Reset the signals in the service so the UI hides protected elements
                authService.clearSession();
            }

            // Re-throw the error so specific components can still handle it if they want
            return throwError(() => error);
        })
    );
};
