import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, ToastModule, ConfirmDialogModule], // Importante para navegação
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	public auth = inject(AuthService);

	title = 'Sistema de Onboarding';

	ngOnInit() {
		this.auth.initAuth();
	}
}
