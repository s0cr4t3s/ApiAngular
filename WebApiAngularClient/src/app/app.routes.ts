import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	// Public Routes
	{
		path: 'login',
		// DO NOT import at the top. Load it here:
		loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
	},

	// Private Routes (Inside the Main Layout)
	{
		path: '',
		loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayoutComponent),
		canActivate: [authGuard],
		children: [
			{
				path: 'dashboard',
				loadComponent: () => import('./components/weather/weather').then(m => m.WeatherComponent),
				data: { breadcrumb: 'Dashboard' } // Label for breadcrumb
			},
			{
				path: 'abc',
				loadComponent: () => import('./components/weather/weather').then(m => m.WeatherComponent),
				data: { breadcrumb: 'Weather' }
			},
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }
		]
	},

	// Fallback for 404s
	{ path: '**', redirectTo: '/login' }
];
