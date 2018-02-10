import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { ChallengeComponent } from './challenge.component';
import { ChallengeDetailComponent } from './challenge-detail.component';
import { ChallengePopupComponent } from './challenge-dialog.component';
import { ChallengeDeletePopupComponent } from './challenge-delete-dialog.component';

@Injectable()
export class ChallengeResolvePagingParams implements Resolve<any> {

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

export const challengeRoute: Routes = [
    {
        path: 'challenge',
        component: ChallengeComponent,
        resolve: {
            'pagingParams': ChallengeResolvePagingParams
        },
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.challenge.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'challenge/:id',
        component: ChallengeDetailComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.challenge.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const challengePopupRoute: Routes = [
    {
        path: 'challenge-new',
        component: ChallengePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.challenge.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'challenge/:id/edit',
        component: ChallengePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.challenge.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'challenge/:id/delete',
        component: ChallengeDeletePopupComponent,
        data: {
            authorities: ['ROLE_ADMIN'],
            pageTitle: 'learnNApp.challenge.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
