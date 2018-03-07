import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/user/user.service';
import {User} from '../shared/user/user.model';

@Component({
    selector: 'jhi-dashboard',
    templateUrl: './dashboard.component.html',
    styles: []
})
export class DashboardComponent implements OnInit {

    users: User[];

    constructor(private userService: UserService,) {
    }

    ngOnInit() {
    }

}
