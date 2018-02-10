import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { TopicComponent } from './topic.component';
import { TopicDetailComponent } from './topic-detail.component';
import { TopicPopupComponent } from './topic-dialog.component';
import { TopicDeletePopupComponent } from './topic-delete-dialog.component';

@Injectable()
export class TopicResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const topicRoute: Routes = [
    {
        path: 'topic',
        component: TopicComponent,
        resolve: {
            'pagingParams': TopicResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.topic.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'topic/:id',
        component: TopicDetailComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.topic.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const topicPopupRoute: Routes = [
    {
        path: 'topic-new',
        component: TopicPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.topic.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'topic/:id/edit',
        component: TopicPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.topic.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'topic/:id/delete',
        component: TopicDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.topic.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
