import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ActivityResult } from './activity-result.model';
import { ActivityResultService } from './activity-result.service';

@Component({
    selector: 'jhi-activity-result-detail',
    templateUrl: './activity-result-detail.component.html'
})
export class ActivityResultDetailComponent implements OnInit, OnDestroy {

    activityResult: ActivityResult;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private activityResultService: ActivityResultService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInActivityResults();
    }

    load(id) {
        this.activityResultService.find(id)
            .subscribe((activityResultResponse: HttpResponse<ActivityResult>) => {
                this.activityResult = activityResultResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInActivityResults() {
        this.eventSubscriber = this.eventManager.subscribe(
            'activityResultListModification',
            (response) => this.load(this.activityResult.id)
        );
    }
}
