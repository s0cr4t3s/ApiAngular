import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
	// A global signal that anyone can read
	loading = signal(false);

	show() { this.loading.set(true); }
	hide() { this.loading.set(false); }
}
