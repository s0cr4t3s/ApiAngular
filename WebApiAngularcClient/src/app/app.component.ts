import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet], // Importante para navegação
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	public auth = inject(AuthService);

	title = 'Sistema de Onboarding';

	ngOnInit() {
		this.auth.initAuth();
	}
}
