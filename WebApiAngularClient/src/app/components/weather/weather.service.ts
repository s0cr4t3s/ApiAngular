import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherForecast } from '../../api-generator/api-models';


@Injectable({
	providedIn: 'root' // Isso torna o serviço disponível globalmente (Tree-shakable)
})
export class WeatherService {
	private http = inject(HttpClient);

	getForecasts(): Observable<WeatherForecast[]> {
		return this.http.get<WeatherForecast[]>('/api/weatherforecast');
	}
}
