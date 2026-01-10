import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';

interface HttpOptions {
	headers?: HttpHeaders | Record<string, string | string[]>;
	params?: HttpParams | Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>;
}

@Injectable({ providedIn: 'root' })
export abstract class ApiServiceBase {
	protected http = inject(HttpClient);
	protected config = inject(ConfigurationService);

	// GET helper
	protected get<TResponse>(endpoint: string, options?: HttpOptions): Observable<TResponse> {
		return this.http
			.get<TResponse>(this.buildUrl(endpoint), {
				headers: this.buildHeaders(options),
				params: options?.params
			});
	}

	// POST helper
	protected post<TResponse, TRequest = any>(endpoint: string, body: TRequest, options?: HttpOptions): Observable<TResponse> {
		return this.http
			.post<TResponse>(this.buildUrl(endpoint), body, {
				headers: this.buildHeaders(),
				params: options?.params
			});
	}

	// PUT helper
	protected put<T, U = any>(endpoint: string, body: U, options?: HttpOptions): Observable<T> {
		return this.http
			.put<T>(this.buildUrl(endpoint), body, {
				headers: this.buildHeaders(),
				params: options?.params
			});
	}

	// DELETE helper
	protected delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
		return this.http
			.delete<T>(this.buildUrl(endpoint), {
				headers: this.buildHeaders(),
				params: options?.params
			});
	}

	// Build full URL from base and endpoint
	private buildUrl(endpoint: string): string {
		const baseUrl = this.config.config.apiUrl;

		const base = baseUrl ? baseUrl.replace(/\/+$/, '') : '';
		const cleanBase = base.endsWith('/') ? base : `${base}/`;

		const path = endpoint ? endpoint.replace(/^\/+/, '') : '';
		const cleanPath = path.startsWith('/') ? path.substring(1) : path;

		return cleanPath ? `${cleanBase}${cleanPath}` : cleanBase;
	}

	private buildHeaders(options?: HttpOptions): HttpHeaders {
		// Initialize with your default header
		let headers = new HttpHeaders().set('Content-Type', 'application/json');

		if (!options || !options.headers) {
			return headers;
		}

		// Check if headers is an instance of HttpHeaders or a plain object
		if (options.headers instanceof HttpHeaders) {
			// If it's already HttpHeaders, we can just return it or merge it
			return options.headers;
		} else {
			// Use Object.keys() to iterate over a plain object safely
			const headerKeys = Object.keys(options.headers);
			for (const key of headerKeys) {
				const value = (options.headers as any)[key];

				if (value !== null && value !== undefined) {
					headers = headers.set(key, String(value));
				}
			}
		}

		return headers;
	}
}
