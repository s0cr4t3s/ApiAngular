import { Injectable } from '@angular/core';

export interface AppConfig {
	apiUrl: string;
	environmentName: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
	private settings: AppConfig | null = null;

	set config(value: AppConfig) {
		this.settings = value;
	}

	get config(): AppConfig {
		if (!this.settings) {
			throw new Error('Config not loaded!');
		}
		return this.settings;
	}
}
