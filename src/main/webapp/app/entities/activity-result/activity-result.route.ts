import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { ActivityResultComponent } from './activity-result.component';
import { ActivityResultDetailComponent } from './activity-result-detail.component';
import { ActivityResultPopupComponent } from './activity-result-dialog.component';
import { ActivityResultDeletePopupComponent } from './activity-result-delete-dialog.component';

@Injectable()
export class ActivityResultResolvePagingParams implements Resolve<any> {

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

export const activityResultRoute: Routes = [
    {
        path: 'activity-result',
        component: ActivityResultComponent,
        resolve: {
            'pagingParams': ActivityResultResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.activityResult.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'activity-result/:id',
        component: ActivityResultDetailComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.activityResult.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const activityResultPopupRoute: Routes = [
    {
        path: 'activity-result-new',
        component: ActivityResultPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.activityResult.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'activity-result/:id/edit',
        component: ActivityResultPopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.activityResult.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'activity-result/:id/delete',
        component: ActivityResultDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.activityResult.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
