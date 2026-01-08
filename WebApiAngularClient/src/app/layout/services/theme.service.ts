import { Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
	// Use a signal to track the state (initially check localStorage)
	isDarkMode = signal<boolean>(localStorage.getItem('theme') === 'dark');

	constructor() {
		// This 'effect' runs automatically whenever the signal changes
		effect(() => {
			const html = document.documentElement; // The <html> tag
			if (this.isDarkMode()) {
				html.classList.add('my-app-dark');
				localStorage.setItem('theme', 'dark');
			} else {
				html.classList.remove('my-app-dark');
				localStorage.setItem('theme', 'light');
			}
		});
	}

	toggle() {
		this.isDarkMode.update(val => !val);
	}
}
