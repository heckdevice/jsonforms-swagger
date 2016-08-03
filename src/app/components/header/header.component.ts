import { Component, EventEmitter, Input, Output } from '@angular/core';
import {AuthComponent} from "../auth/auth.component";
import {APIManagerService} from "../core/api-manager/api-manager.service";

@Component({
    selector: 'header',
    template: require('./header.html'),
    styles: [require('./header.css')],
    directives: [AuthComponent]
})
export class HeaderComponent {

    @Input() selectedProjectName: string;

    @Output() onProjectsListClicked = new EventEmitter<any>();

	constructor(private apiManagerService: APIManagerService) {
	}

    gotoProjects() {
        this.apiManagerService.resetService();
        this.onProjectsListClicked.emit(null);
    }

}