import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LoadingService } from './services/loading.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { ENVIRONMENT_CONFIG } from './app.config';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, ToastModule, ConfirmDialogModule, ProgressBarModule,
		TranslateModule,
		TranslatePipe
	], // Importante para navegação
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
	public auth = inject(AuthService);
	public loadingService = inject(LoadingService);
	protected environmentConfig = inject(ENVIRONMENT_CONFIG);

	ngOnInit() {
		console.log('Current Environment: ', this.environmentConfig.environmentState);
		this.auth.initAuth();
	}
}
