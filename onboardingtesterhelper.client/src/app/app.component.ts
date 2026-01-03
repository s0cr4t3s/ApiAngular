import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/nav-bar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, NavbarComponent], // Importante para navegação
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	public auth = inject(AuthService);

	title = 'Sistema de Onboarding';

	ngOnInit() {
		this.auth.initAuth();
	}
}
