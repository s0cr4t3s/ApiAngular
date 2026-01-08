import { Component, inject, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { NavService } from '../services/layout.service';
import { AvatarModule } from 'primeng/avatar';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [MenuModule, AvatarModule],
	templateUrl: './sidebar.html'
})
export class SidebarComponent implements OnInit {
	public navService = inject(NavService);

	ngOnInit() {
		// Only load if the menu is empty
		if (this.navService.menuItems().length === 0) {
			this.navService.loadMenu();
		}
	}
}
