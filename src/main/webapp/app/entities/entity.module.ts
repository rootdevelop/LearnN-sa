import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LearnNChallengeModule } from './challenge/challenge.module';
import { LearnNTopicModule } from './topic/topic.module';
import { LearnNActivityResultModule } from './activity-result/activity-result.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        LearnNChallengeModule,
        LearnNTopicModule,
        LearnNActivityResultModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LearnNEntityModule {}
