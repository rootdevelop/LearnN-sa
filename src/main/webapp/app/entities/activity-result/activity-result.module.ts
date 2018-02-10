import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LearnNSharedModule } from '../../shared';
import {
    ActivityResultService,
    ActivityResultPopupService,
    ActivityResultComponent,
    ActivityResultDetailComponent,
    ActivityResultDialogComponent,
    ActivityResultPopupComponent,
    ActivityResultDeletePopupComponent,
    ActivityResultDeleteDialogComponent,
    activityResultRoute,
    activityResultPopupRoute,
    ActivityResultResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...activityResultRoute,
    ...activityResultPopupRoute,
];

@NgModule({
    imports: [
        LearnNSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ActivityResultComponent,
        ActivityResultDetailComponent,
        ActivityResultDialogComponent,
        ActivityResultDeleteDialogComponent,
        ActivityResultPopupComponent,
        ActivityResultDeletePopupComponent,
    ],
    entryComponents: [
        ActivityResultComponent,
        ActivityResultDialogComponent,
        ActivityResultPopupComponent,
        ActivityResultDeleteDialogComponent,
        ActivityResultDeletePopupComponent,
    ],
    providers: [
        ActivityResultService,
        ActivityResultPopupService,
        ActivityResultResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LearnNActivityResultModule {}
