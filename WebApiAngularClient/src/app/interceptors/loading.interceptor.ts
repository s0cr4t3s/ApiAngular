import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize, of, tap, timer, switchMap, takeUntil, Subject } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
	const loadingService = inject(LoadingService);

	// Create a timer that waits 200ms
	const timer$ = timer(200);
	const cancelTimer$ = new Subject<void>();

	// Start the timer logic
	if (req.method.toUpperCase() !== 'GET') {
		loadingService.show();
	}
	else {
		timer$.pipe(takeUntil(cancelTimer$)).subscribe(() => {
			loadingService.show();
		});
	}

	return next(req).pipe(
		finalize(() => {
			cancelTimer$.next();
			loadingService.hide();
		})
	);
};
