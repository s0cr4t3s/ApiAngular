import { Component, inject, OnInit } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { NavService } from '../services/nav.service';
import { AvatarModule } from 'primeng/avatar';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [PanelMenuModule, AvatarModule],
	templateUrl: './sidebar.component.html'
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
