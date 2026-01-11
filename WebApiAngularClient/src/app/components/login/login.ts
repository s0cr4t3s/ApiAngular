import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { LoginRequest } from '../../api-generator/api-models';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, FormsModule,
		TranslateModule, TranslatePipe
	],
	templateUrl: './login.html',
	styleUrl: './login.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private auth = inject(AuthService);
	private messageService = inject(MessageService);
	private translate = inject(TranslateService);

	// signals for form data and loading state
	username = signal('');
	password = signal('');
	isLoading = signal(false);

	onSubmit() {
		this.isLoading.set(true);

		const loginRequest: LoginRequest = {
			username: this.username(),
			password: this.password()
		};

		// This hits your [HttpPost("login")] in .NET 10
		this.auth.login(loginRequest).subscribe({
			next: () => {
				this.messageService.add({
					severity: 'success',
					summary: this.translate.instant('LOGIN.SUCCESS_SUMMARY'),
					detail: this.translate.instant('LOGIN.SUCCESS_DETAIL'),
					life: 3000
				});

				// Get the returnUrl from query parameters, default to '/dashboard'
				const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
				this.router.navigateByUrl(returnUrl);
			},
			error: (err) => {
				this.isLoading.set(false);

				//this.messageService.add({
				//	severity: 'error',
				//	summary: this.translate.instant('LOGIN.ERROR_SUMMARY'),
				//	detail: this.translate.instant('LOGIN.ERROR_DETAIL'),
				//	life: 3000
				//});
			}
		});
	}
}
