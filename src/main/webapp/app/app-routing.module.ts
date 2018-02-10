import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { errorRoute, navbarRoute } from './layouts';
import { DEBUG_INFO_ENABLED } from './app.constants';
import {UserRouteAccessService} from "./shared/auth/user-route-access-service";
import {ExecuteComponent} from "./execute/execute.component";
import {TopicOverviewComponent} from "./topic-overview/topic-overview.component";

const LAYOUT_ROUTES = [
    {
        path: 'execute/:id',
        component: ExecuteComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'learnNApp.challenge.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'topics',
        component: TopicOverviewComponent,
        data: {
            authorities: ['ROLE_USER', 'ROLE_ADMIN'],
            pageTitle: 'learnNApp.topic.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    navbarRoute,
    ...errorRoute
];

@NgModule({
    imports: [
        RouterModule.forRoot(LAYOUT_ROUTES, { useHash: true , enableTracing: DEBUG_INFO_ENABLED })
    ],
    exports: [
        RouterModule
    ]
})
export class LearnNAppRoutingModule {}
