import { Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	// Public Routes
	{ path: 'login', component: LoginComponent },

	// Private Routes (Grouped)
	{
		path: '',
		canActivate: [authGuard],
		children: [
			{ path: 'dashboard', component: WeatherComponent },
			{ path: 'abc', component: WeatherComponent },
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' }
		]
	},

	// Fallback for 404s
	{ path: '**', redirectTo: '/login' }
];
