import { inject, Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class NavService {
	public auth = inject(AuthService);
	// Signal to hold our menu structure
	readonly menuItems = signal<MenuItem[]>([]);

	constructor() { }

	loadMenu() {
		// In the future, this will be: this.http.get<MenuItem[]>('api/nav').subscribe(...)
		const mockMenu: MenuItem[] = [
			{
				label: 'Home',
				items: [
					{ label: 'Dashboard', icon: 'pi pi-home', routerLink: '/dashboard' },
					{ label: 'Weather', icon: 'pi pi-cloud', routerLink: '/abc' }
				]
			},
			{
				label: 'Settings',
				items: [
					{ label: 'Profile', icon: 'pi pi-user', routerLink: '/profile' },
					{ label: 'Logout', icon: 'pi pi-sign-out', command: () => this.onLogout() }
				]
			}
		];

		this.menuItems.set(mockMenu);
	}

	private onLogout() {
		console.log('User logged out');
		this.auth.logout();
	}
}
