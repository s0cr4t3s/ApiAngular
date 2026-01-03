import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService);
	const router = inject(Router);

	if (authService.isAuthenticated()) {
		return true; // Access granted
	}

	// Redirect to login, but save the URL they were trying to hit
	return router.createUrlTree(['/login'], {
		queryParams: { returnUrl: state.url }
	});
};
