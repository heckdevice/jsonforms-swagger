import { Component, ViewChild, Input, OnDestroy, Pipe } from '@angular/core';

import { OverlayPanel} from 'primeng/primeng';
import Timer = NodeJS.Timer;
import { Subscription } from 'rxjs/Subscription';

import {APIManagerService } from '../core/api-manager/api-manager.service';

import { API } from '../core/model/api';
import { EntityType } from '../core/model/entity-type';
import { Action } from '../core/model/action';

// *ngIf="devMode || entityType.actions.length > 0"
@Pipe({
	name: "entityTypeShouldShow"
})
class EntityTypeShouldShow {
	transform(value: any, args?: any) {
		let [devMode] = args;
		return value.filter((entityType: EntityType) => {
			return entityType.actions.length > 0 || devMode;
		});
	}
}

@Component({
	selector: 'sidebar',
	template: require('./sidebar.html'),
	styles: [require('./sidebar.css'), require('../panel-menu.css')],
	pipes: [EntityTypeShouldShow],
	directives: [OverlayPanel]
})
export class SidebarComponent implements OnDestroy {

	@Input() api: API;

	@Input() devMode: boolean;

	@ViewChild('op') op:OverlayPanel;

	moreInfoActive:boolean = false;
	moreInfoTimeoutId:Timer = null;

	activeAction:Action;
	activeActionSubscription: Subscription;

	active:boolean[] = [];
	hover:boolean[] = [];

	constructor(private apiManagerService:APIManagerService) {
		this.activeActionSubscription = apiManagerService.activeAction.subscribe((activeAction:Action) => this.activeAction = activeAction);
	}

	selectAction(action:Action) {
		if (!this.isActionActive(action)) {
			this.apiManagerService.setActiveAction(action);
		}
	}

	isActionActive(action:Action):boolean {
		return action == this.activeAction;
	}

	addAction(entityType: EntityType, name: string) {
		if (name!== '' && entityType.addAction(name)) {
			let addedAction: Action = entityType.getActionByName(name);
			this.apiManagerService.setActiveAction(addedAction);
		}
	}

	removeAction(entityType: EntityType, action: Action) {
		if (entityType.removeAction(action)) {
			if (this.activeAction == action) {
				this.apiManagerService.setActiveAction(null);
			}
		}
	}

	descriptionHoverIn($event:any, infoTarget:any) {
		if(!this.op){
			return;
		}
		if (this.moreInfoActive) {
			if (this.moreInfoTimeoutId) {
				clearTimeout(this.moreInfoTimeoutId);
				this.moreInfoTimeoutId = null;
			}
		} else {
			this.op.show($event, infoTarget);
			this.moreInfoActive = true;
		}
	}

	descriptionHoverOut($event:any) {
		if(!this.op){
			return;
		}
		this.moreInfoTimeoutId = setTimeout(()=> {
			this.op.hide();
			this.moreInfoTimeoutId = null;
			this.moreInfoActive = false;
		}, 1000);
	}

	onClickMenu(menu: string) {
		this.active[menu] = !this.active[menu];
	}

	isActiveMenu(menu: string):boolean {
		return this.active[menu];
	}

	hoveringMenu(menu: string, state:boolean) {
		this.hover[menu] = state;
	}

	isHoverMenu(menu: string):boolean {
		return this.hover[menu];
	}

	ngOnDestroy() {
		this.activeActionSubscription.unsubscribe();
	}
}
