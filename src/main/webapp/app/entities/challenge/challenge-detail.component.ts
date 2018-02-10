import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Challenge } from './challenge.model';
import { ChallengeService } from './challenge.service';

@Component({
    selector: 'jhi-challenge-detail',
    templateUrl: './challenge-detail.component.html'
})
export class ChallengeDetailComponent implements OnInit, OnDestroy {

    challenge: Challenge;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private challengeService: ChallengeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInChallenges();
    }

    load(id) {
        this.challengeService.find(id)
            .subscribe((challengeResponse: HttpResponse<Challenge>) => {
                this.challenge = challengeResponse.body;
            });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInChallenges() {
        this.eventSubscriber = this.eventManager.subscribe(
            'challengeListModification',
            (response) => this.load(this.challenge.id)
        );
    }
}
