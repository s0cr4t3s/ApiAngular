import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherForecast } from '../../api-generator/api-models';
import { ApiServiceBase } from '../../services/apiServiceBase';


@Injectable({
	providedIn: 'root' // Isso torna o serviço disponível globalmente (Tree-shakable)
})
export class WeatherService extends ApiServiceBase {

	//getForecasts(): Observable<WeatherForecast[]> {
	//	// Access the URL that was loaded from the JSON file
	//	return this.http.get<WeatherForecast[]>(`${this.configService.config.apiUrl}/weatherforecast`);
	//}

	getForecastsByCity(city: string): Observable<WeatherForecast[]> {
		const params = { city: city, units: 'metric' };

		return this.get<WeatherForecast[]>('weatherforecast', { params });
	}

	getForecasts(): Observable<WeatherForecast[]> {
		return this.get<WeatherForecast[]>('weatherforecast');
	}
}
