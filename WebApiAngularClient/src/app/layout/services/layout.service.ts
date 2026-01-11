import { inject, Injectable, signal } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';

@Injectable({
	providedIn: 'root'
})
export class LayoutService {
	private confirmationService = inject(ConfirmationService);
	private translate = inject(TranslateService);
	public auth = inject(AuthService);
	// Signal to hold our menu structure
	readonly menuItems = signal<MenuItem[]>([]);
	readonly userMenuItems = signal<MenuItem[]>([]);

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

	loadUserMenu() {
		// In the future, this will be: this.http.get<MenuItem[]>('api/nav').subscribe(...)
		const mockUserMenu: MenuItem[] = [
			{ label: 'Profile', icon: 'pi pi-user', routerLink: '/profile' },
			{ label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
			{ separator: true },
			{ label: 'Logout', icon: 'pi pi-sign-out', command: () => this.onLogout() }
		];

		this.userMenuItems.set(mockUserMenu);
	}

	onLogout() {
		this.confirmationService.confirm({
			header: this.translate.instant('LOGOUT.TITLE'),
			message: this.translate.instant('LOGOUT.MESSAGE'),
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: this.translate.instant('LOGOUT.ACCEPT_LABEL'),
			rejectLabel: this.translate.instant('LOGOUT.REJECT_LABEL'),
			accept: () => {
				this.auth.logout(); // Chama o método que discutimos antes
			}
		});
	}
}
