import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../shared/user/user.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {User} from '../shared/user/user.model';
import {ActivityResult} from '../entities/activity-result/activity-result.model';
import {SERVER_API_URL} from "../app.constants";

@Component({
    selector: 'jhi-user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styles: []
})
export class UserDashboardComponent implements OnInit {

    user: User = new User();

    results: any[] = [];

    constructor(private route: ActivatedRoute, private userService: UserService, private http: HttpClient) {
    }

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.userService.find(params['id']).subscribe((userResponse: HttpResponse<User>) => {
                this.user = userResponse.body;
                const uri = SERVER_API_URL + '/api/user-dashboard/' + this.user.login;
                this.http.get(uri).subscribe((data: any) => {
                    console.log(data);
                    this.results = data;
                });
            });
        });
    }

}
