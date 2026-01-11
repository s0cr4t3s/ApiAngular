import { Component, inject, OnInit } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { LayoutService } from '../services/layout.service';
import { AvatarModule } from 'primeng/avatar';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [MenuModule, AvatarModule],
	templateUrl: './sidebar.html'
})
export class SidebarComponent implements OnInit {
	public layoutService = inject(LayoutService);

	ngOnInit() {
		// Only load if the menu is empty
		if (this.layoutService.menuItems().length === 0) {
			this.layoutService.loadMenu();
		}
	}
}
