import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { signal } from '@angular/core';
import { WeatherService } from './weather.service'; // Importe o serviço
import { WeatherForecast } from '../../api-generator/api-models';

@Component({
	selector: 'weather-component',
	standalone: true,
	imports: [DatePipe], // Como usamos @if/@for no HTML, não precisamos de CommonModule aqui
	templateUrl: './weather.html',
	styleUrls: ['./weather.css']
})
export class WeatherComponent implements OnInit {
	title = 'Weather';
	forecasts = signal<WeatherForecast[]>([]);

	// Injetamos o serviço em vez do HttpClient diretamente
	private weatherService = inject(WeatherService);
	private destroyRef = inject(DestroyRef);

	ngOnInit() {
		// Carregar os dados na inicialização
		this.getForecasts();
	}

	private getForecasts() {

		//effect(() => {
		//  this.http.get<WeatherForecast[]>('/weatherforecast').subscribe({
		//    next: (result) => this.forecasts.set(result),
		//    error: (error) => console.error(error)
		//  });
		//});

		this.weatherService.getForecasts()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (result) => this.forecasts.set(result),
				error: (err) => console.error('Erro ao obter dados:', err)
			});
	}
}
