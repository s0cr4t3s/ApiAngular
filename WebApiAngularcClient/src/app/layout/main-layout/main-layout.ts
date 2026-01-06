import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AvatarModule } from 'primeng/avatar';
import { filter } from 'rxjs/operators';
import { MenuModule } from 'primeng/menu'
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';

@Component({
	selector: 'app-main-layout',
	standalone: true,
	imports: [RouterOutlet, SidebarComponent, ToastModule, ConfirmDialogModule, BreadcrumbModule, ButtonModule, BadgeModule, AvatarModule, MenuModule],
	templateUrl: './main-layout.html', // Pointing to the external file
	styleUrls: ['./main-layout.css']    // Pointing to the external CSS
})
export class MainLayoutComponent implements OnInit {
	private router = inject(Router);
	private activatedRoute = inject(ActivatedRoute);
	sidebarActive = signal(true);

	// This signal feeds the p-breadcrumb in your HTML
	breadcrumbItems = signal<MenuItem[]>([]);

	// Inside the class:
	userMenuItems: MenuItem[] = [
		{ label: 'Profile', icon: 'pi pi-user', routerLink: '/profile' },
		{ label: 'Settings', icon: 'pi pi-cog', routerLink: '/settings' },
		{ separator: true },
		{ label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
	];

	ngOnInit() {
		// 1. Build the breadcrumb for the CURRENT route immediately on load
		this.breadcrumbItems.set(this.createBreadcrumbs(this.activatedRoute.root));

		// 2. Then listen for any FUTURE route changes
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe(() => {
			this.breadcrumbItems.set(this.createBreadcrumbs(this.activatedRoute.root));
		});
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

	toggleMenu() {
		this.sidebarActive.update(value => !value);
	}

	logout() {
		// Logic to clear cookies/session [cite: 2025-12-18]
	}
}
