import { inject, Injectable, signal } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class LayoutService {
	public auth = inject(AuthService);
	private confirmationService = inject(ConfirmationService);
	// Signal to hold our menu structure
	readonly menuItems = signal<MenuItem[]>([]);
	readonly userMenuItems = signal<MenuItem[]>([]);
	readonly languageConfigItems = signal<LanguageConfig[]>([]);

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

	loadLanguageConfig() {
		const langConfig: LanguageConfig[] = [
			{ name: 'HEADER.LANGUAGE_PT', code: 'PT', language: 'pt' },
			{ name: 'HEADER.LANGUAGE_EN', code: 'GB', language: 'en' }
		];

		this.languageConfigItems.set(langConfig);
	}

	languageConfigDefault(): LanguageConfig {
		if (this.languageConfigItems().length === 0) {
			this.loadLanguageConfig();
		}

		return this.languageConfigItems().find(c => c.language === 'pt') || this.languageConfigItems()[0];

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

export interface LanguageConfig {
	name: string;
	code: string;
	language: string;
}
