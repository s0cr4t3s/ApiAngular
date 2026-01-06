import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { authGuard } from './guards/auth.guard';
import { AppComponent } from './app.component';

export const routes: Routes = [
	// Public Routes
	{ path: 'login', component: LoginComponent },

	// Private Routes (Inside the Main Layout)
	{
		path: '',
		canActivate: [authGuard],
		children: [
			{
				path: 'dashboard',
				loadComponent: () => import('./weather/weather.component').then(m => m.WeatherComponent),
				data: { breadcrumb: 'Dashboard' } // Label for breadcrumb
			},
			{
				path: 'abc',
				loadComponent: () => import('./weather/weather.component').then(m => m.WeatherComponent),
				data: { breadcrumb: 'Weather' }
			},
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }
		]
	},

	// Fallback for 404s
	{ path: '**', redirectTo: '/login' }
];
