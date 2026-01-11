import { Component, inject, signal, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AvatarModule } from 'primeng/avatar';
import { filter } from 'rxjs/operators';
import { MenuModule } from 'primeng/menu'
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LayoutService } from '../services/layout.service';
import { ThemeService } from '../services/theme.service';
import { ENVIRONMENT_CONFIG } from '../../app.config';
import { TranslateService, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { StorageKyes } from '../../core/constants';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-main-layout',
	standalone: true,
	imports: [
		RouterOutlet,
		SidebarComponent,
		BreadcrumbModule,
		ButtonModule,
		BadgeModule,
		AvatarModule,
		MenuModule,
		ConfirmDialogModule,
		TranslateModule,
		TranslatePipe,
		SelectModule,
		FormsModule],
	templateUrl: './main-layout.html', // Pointing to the external file
	styleUrls: ['./main-layout.scss'],    // Pointing to the external CSS
})
export class MainLayoutComponent implements OnInit {
	private router = inject(Router);
	private activatedRoute = inject(ActivatedRoute);
	public layoutService = inject(LayoutService);
	public themeService = inject(ThemeService);
	private translate = inject(TranslateService);
	sidebarActive = signal(true);

	// This signal feeds the p-breadcrumb in your HTML
	breadcrumbItems = signal<MenuItem[]>([]);

	protected environmentConfig = inject(ENVIRONMENT_CONFIG);

	public applicationName = this.environmentConfig.applicationName;

	selectedlanguage: any;

	ngOnInit() {
		if (this.layoutService.userMenuItems().length === 0) {
			this.layoutService.loadUserMenu();
		}

		if (this.layoutService.languageConfigItems().length === 0) {
			this.layoutService.loadLanguageConfig();
		}

		const savedLang = localStorage.getItem(StorageKyes.UserLanguage) || this.layoutService.languageConfigDefault().language;
		this.selectedlanguage = this.layoutService.languageConfigItems().find(c => c.language === savedLang)?.code;

		// 1. Build the breadcrumb for the CURRENT route immediately on load
		this.breadcrumbItems.set(this.createBreadcrumbs(this.activatedRoute.root));

		// 2. Then listen for any FUTURE route changes
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe(() => {
			this.breadcrumbItems.set(this.createBreadcrumbs(this.activatedRoute.root));
		});
	}

	toggleMenu() {
		this.sidebarActive.update(value => !value);
	}

	onLanguageChange(event: any) {
		let newLang = this.layoutService.languageConfigItems().find(c => c.code == event)?.language || this.layoutService.languageConfigDefault().language;
		this.changeLanguage(newLang.toLowerCase());
	}

	changeLanguage(lang: string) {
		this.translate.use(lang);
		localStorage.setItem(StorageKyes.UserLanguage, lang);
	}

	@HostListener('window:storage', ['$event'])
	onStorageChange(event: StorageEvent) {
		if (event.key === 'user_lang' && event.newValue) {
			this.translate.use(event.newValue);
			this.selectedlanguage = this.layoutService.languageConfigItems().find(c => c.language === event.newValue)?.code || this.layoutService.languageConfigDefault().code;
		}
	}

	private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
		const children: ActivatedRoute[] = route.children;

		if (children.length === 0) {
			return breadcrumbs;
		}

		for (const child of children) {
			const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
			if (routeURL !== '') {
				url += `/${routeURL}`;
			}

			const label = child.snapshot.data['breadcrumb'];
			if (label) {
				breadcrumbs.push({ label, routerLink: url });
			}

			return this.createBreadcrumbs(child, url, breadcrumbs);
		}
		return breadcrumbs;
	}
}
