import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, switchMap, firstValueFrom, catchError, of, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest } from '../api-generator/api-models';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private http = inject(HttpClient);
	private router = inject(Router);

	// Using Signals for Angular 21 performance
	currentUser = signal<any | null>(null);
	isAuthenticated = signal<boolean>(false);
	isInitialCheckDone = signal<boolean>(false);

	initAuth(): Promise<any> {
		return firstValueFrom(
			this.checkAuthStatus().pipe(
				tap(user => {
					this.currentUser.set(user);
					this.isAuthenticated.set(true);
				}),
				catchError(() => {
					console.log('User not logged in or session expired');
					this.clearSession();
					return of(null);
				}),
				finalize(() => this.isInitialCheckDone.set(true))
			)
		);
	}

	login(loginRequest: LoginRequest) {
		return this.http.post('/api/auth/login', loginRequest).pipe(
			// Once login succeeds, immediately call 'me' to get user details
			switchMap(() => this.checkAuthStatus())
		);
	}

	logout() {
		// 1. Tell the server to clear the cookie
		this.http.post('/api/auth/logout', {}).subscribe({
			next: () => this.clearSession(false),
			error: () => this.clearSession(false) // Clear local state even if server fails
		});
	}

	checkAuthStatus() {
		// This hits your [Authorize] GetCurrentUser() method in .NET 10
		return this.http.get('/api/auth/current-user').pipe(
			tap(user => {
				this.currentUser.set(user);
				this.isAuthenticated.set(true);
			})
		);
	}

	clearSession(saveReturnUrl: boolean = true) {
		// Grab the current URL to use as the returnUrl
		const currentUrl = this.router.url;

		// Reset signals
		this.currentUser.set(null);
		this.isAuthenticated.set(false);

		// Redirect with query params
		// If the user is already on /login, we don't want to save that as the returnUrl
		if (saveReturnUrl && !currentUrl.includes('/login')) {
			this.router.navigate(['/login'], {
				queryParams: { returnUrl: currentUrl }
			});
		} else {
			this.router.navigate(['/login']);
		}
	}
}
