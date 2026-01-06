import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherComponent } from './weather';
import { WeatherService } from './weather.service';
import { of, throwError } from 'rxjs';

describe('WeatherComponent', () => {
	let component: WeatherComponent;
	let fixture: ComponentFixture<WeatherComponent>;
	let weatherServiceMock: any;

	// Mock dos dados que o seu C# normalmente enviaria
	const mockForecasts = [
		{ date: '2026-01-02', temperatureC: 25, temperatureF: 77, summary: 'Ensolarado' }
	];

	beforeEach(async () => {
		// 1. Criamos um objeto "falso" para o serviço
		weatherServiceMock = {
			getForecasts: jasmine.createSpy('getForecasts').and.returnValue(of(mockForecasts))
		};

		await TestBed.configureTestingModule({
			imports: [WeatherComponent], // Componente Standalone
			providers: [
				// 2. Dizemos ao Angular: "Quando pedirem WeatherService, usa o nosso Mock"
				{ provide: WeatherService, useValue: weatherServiceMock }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(WeatherComponent);
		component = fixture.componentInstance;
		fixture.detectChanges(); // Dispara o ngOnInit
	});

	it('deve criar o componente', () => {
		expect(component).toBeTruthy();
	});

	it('deve carregar os dados meteorológicos ao iniciar', () => {
		// Verifica se o Signal foi atualizado com os dados do mock
		expect(component.forecasts()).toEqual(mockForecasts);
		// Verifica se o método do serviço foi chamado exatamente uma vez
		expect(weatherServiceMock.getForecasts).toHaveBeenCalled();
	});

	it('deve mostrar erro na consola se a API falhar', () => {
		spyOn(console, 'error');
		// Simula uma falha do servidor .NET
		weatherServiceMock.getForecasts.and.returnValue(throwError(() => new Error('Erro 500')));

		component.ngOnInit();

		expect(console.error).toHaveBeenCalledWith('Erro ao obter dados:', jasmine.any(Error));
	});
});
