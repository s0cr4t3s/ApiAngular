import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// A interface pode ficar aqui ou num ficheiro de models separado
export interface WeatherForecast {
	date: string;
	temperatureC: number;
	temperatureF: number;
	summary: string;
}

@Injectable({
	providedIn: 'root' // Isso torna o serviço disponível globalmente (Tree-shakable)
})
export class WeatherService {
	private http = inject(HttpClient);

	getForecasts(): Observable<WeatherForecast[]> {
		return this.http.get<WeatherForecast[]>('/api/weatherforecast');
	}
}
