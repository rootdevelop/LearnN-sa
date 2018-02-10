import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LearnNSharedModule } from '../../shared';
import {
    ChallengeService,
    ChallengePopupService,
    ChallengeComponent,
    ChallengeDetailComponent,
    ChallengeDialogComponent,
    ChallengePopupComponent,
    ChallengeDeletePopupComponent,
    ChallengeDeleteDialogComponent,
    challengeRoute,
    challengePopupRoute,
    ChallengeResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...challengeRoute,
    ...challengePopupRoute,
];

@NgModule({
    imports: [
        LearnNSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ChallengeComponent,
        ChallengeDetailComponent,
        ChallengeDialogComponent,
        ChallengeDeleteDialogComponent,
        ChallengePopupComponent,
        ChallengeDeletePopupComponent,
    ],
    entryComponents: [
        ChallengeComponent,
        ChallengeDialogComponent,
        ChallengePopupComponent,
        ChallengeDeleteDialogComponent,
        ChallengeDeletePopupComponent,
    ],
    providers: [
        ChallengeService,
        ChallengePopupService,
        ChallengeResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LearnNChallengeModule {}
