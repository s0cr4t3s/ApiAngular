import { Injectable, signal, inject } from '@angular/core';
import { tap, switchMap, firstValueFrom, catchError, of, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest } from '../api-generator/api-models';
import { ApiServiceBase } from './apiServiceBase';
import { StorageKyes } from '../core/constants';

@Injectable({ providedIn: 'root' })
export class AuthService extends ApiServiceBase {
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
					console.warn('Authentication failed: User is not logged in or session has expired.');
					this.clearSession();
					return of(null);
				}),
				finalize(() => this.isInitialCheckDone.set(true))
			)
		);
	}

	login(loginRequest: LoginRequest) {
		return this.post('/auth/login', loginRequest).pipe(
			// Once login succeeds, immediately call 'me' to get user details
			switchMap(() => this.checkAuthStatus())
		);
	}

	logout() {
		this.post('/auth/logout', {})
			.pipe(
				finalize(() => {
					this.clearSession(false);
				})
			)
			.subscribe();
	}

	checkAuthStatus() {
		// This hits your [Authorize] GetCurrentUser() method in .NET 10
		return this.get('/auth/current-user').pipe(
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
		
		this.handleLocalStorageReset();

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

	private handleLocalStorageReset() {
		// Save the current language temporarily
		const currentLang = localStorage.getItem(StorageKyes.UserLanguage);

		// Wipe everything
		localStorage.clear();

		// Put the language back so the Login Page looks correct
		if (currentLang) {
			localStorage.setItem(StorageKyes.UserLanguage, currentLang);
		}
	}
}
