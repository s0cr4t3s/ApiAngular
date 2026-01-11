import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

	readonly languageConfigItems = signal<LanguageConfig[]>([]);

	loadLanguageConfig() {
		const langConfig: LanguageConfig[] = [
			{ name: 'MAIN_LAYOUT.LANGUAGE_PT', code: 'PT', language: 'pt' },
			{ name: 'MAIN_LAYOUT.LANGUAGE_EN', code: 'GB', language: 'en' }
		];

		this.languageConfigItems.set(langConfig);
	}

	languageConfigDefault(): LanguageConfig {
		if (this.languageConfigItems().length === 0) {
			this.loadLanguageConfig();
		}

		return this.languageConfigItems().find(c => c.language === 'pt') || this.languageConfigItems()[0];

	}
}
export interface LanguageConfig {
	name: string;
	code: string;
	language: string;
}
