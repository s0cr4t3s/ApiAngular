import { Component, inject, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { NavService } from '../services/nav.service';

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [MenubarModule, ButtonModule],
	templateUrl: './navbar.component.html',
	//styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	public navService = inject(NavService);

	ngOnInit() {
		this.navService.loadMenu(); // Trigger the mock/API call
	}
}
