import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';

import { ProjectsManagerService } from './components/core/projects-manager/projects-manager.service';
import { AuthService } from './components/auth/auth.service';
import { APIManagerService } from './components/core/api-manager/api-manager.service';
import { APIGenerator } from './components/core/api-manager/api-generator';
import { APIValidator } from './components/core/api-manager/api-validator';
import { ErrorService } from './components/error/error.service';

import { HeaderComponent } from './components/header/header.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ErrorComponent } from './components/error/error.component';
import {UserManagementService} from './components/core/user-management/user-management.service';
import {FirebaseService} from './components/core/firebase/firebase.service';
import '../../public/css/styles.css';
import {Project} from "./components/core/model/project";


@Component({
	selector: 'app',
	moduleId: module.id,
	template: require('./app.html'),
	styles: [require('./app.css')],
	providers: [
		HTTP_PROVIDERS,
		ProjectsManagerService,
		AuthService,
		APIManagerService,
		APIGenerator,
		APIValidator,
		ErrorService,
		FirebaseService,
		UserManagementService
	],
	directives: [
		HeaderComponent,
		ProjectsListComponent,
		ProjectDetailComponent,
		ErrorComponent
	]
})
export class AppComponent {

	selectedProjectId:string;
	selectedDevMode:boolean;
	selectedProject: Project;
	projects: {[id: string] : Project} = {};
	errorMessage: string;

	constructor(private projectsManagerService: ProjectsManagerService){
	}

	ngOnInit() {
		this.subscribeToProjects();
	}

	private subscribeToProjects() {
		this.projectsManagerService.getProjects()
				.subscribe(
						(projects) => {
							this.projects = projects;
							if(this.selectedProjectId){
								this.selectedProject = this.projects[this.selectedProjectId];
							}
							if(!this.selectedProject){
								this.selectedProjectId = '';
							}
						},
						error => this.errorMessage = <any>error
				);
	}

	onProjectSelected({id, devMode}) {
		this.selectedProjectId = id;
		this.selectedDevMode = devMode;
		this.selectedProject = this.projects[id];
	}

	onProjectsListClicked() {
		this.selectedProjectId = '';
		this.selectedProject = null;
	}

}