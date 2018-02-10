import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LearnNSharedModule } from '../../shared';
import {
    TopicService,
    TopicPopupService,
    TopicComponent,
    TopicDetailComponent,
    TopicDialogComponent,
    TopicPopupComponent,
    TopicDeletePopupComponent,
    TopicDeleteDialogComponent,
    topicRoute,
    topicPopupRoute,
    TopicResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...topicRoute,
    ...topicPopupRoute,
];

@NgModule({
    imports: [
        LearnNSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        TopicComponent,
        TopicDetailComponent,
        TopicDialogComponent,
        TopicDeleteDialogComponent,
        TopicPopupComponent,
        TopicDeletePopupComponent,
    ],
    entryComponents: [
        TopicComponent,
        TopicDialogComponent,
        TopicPopupComponent,
        TopicDeleteDialogComponent,
        TopicDeletePopupComponent,
    ],
    providers: [
        TopicService,
        TopicPopupService,
        TopicResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LearnNTopicModule {}
