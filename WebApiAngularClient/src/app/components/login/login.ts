import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { LoginRequest } from '../../api-generator/api-models';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './login.html',
	styleUrl: './login.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
	private router = inject(Router);
	private route = inject(ActivatedRoute);
	private auth = inject(AuthService);
	private messageService = inject(MessageService);

	// signals for form data and loading state
	username = signal('');
	password = signal('');
	errorMessage = signal('');
	isLoading = signal(false);

	onSubmit() {
		this.isLoading.set(true);
		this.errorMessage.set('');

		const loginRequest: LoginRequest = {
			username: this.username(),
			password: this.password()
		};

		// This hits your [HttpPost("login")] in .NET 10
		this.auth.login(loginRequest).subscribe({
			next: () => {
				this.messageService.add({
					severity: 'success',
					summary: 'Bem-vindo!',
					detail: 'Login realizado com sucesso.',
					life: 3000
				});

				// Get the returnUrl from query parameters, default to '/dashboard'
				const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
				this.router.navigateByUrl(returnUrl);
			},
			error: (err) => {
				this.isLoading.set(false);
				this.errorMessage.set('Credenciais inválidas.');

				this.messageService.add({
					severity: 'error',
					summary: 'Erro de Autenticação',
					detail: 'Usuário ou senha inválidos. Tente novamente.',
					life: 3000
				});
			}
		});
	}
}
