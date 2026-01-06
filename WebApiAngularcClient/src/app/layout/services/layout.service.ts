import { inject, Injectable, signal } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class NavService {
	public auth = inject(AuthService);
	private confirmationService = inject(ConfirmationService);
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
			message: 'Deseja realmente sair do sistema?',
			header: 'Confirmação de Saída',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Sim, sair',
			rejectLabel: 'Cancelar',
			accept: () => {
				this.auth.logout(); // Chama o método que discutimos antes
			}
		});
	}
}
