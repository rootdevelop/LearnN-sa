import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { Challenge } from './challenge.model';
import { ChallengePopupService } from './challenge-popup.service';
import { ChallengeService } from './challenge.service';
import {TopicService} from "../topic/topic.service";
import {Topic} from "../topic/topic.model";

@Component({
    selector: 'jhi-challenge-dialog',
    templateUrl: './challenge-dialog.component.html'
})
export class ChallengeDialogComponent implements OnInit {

    challenge: Challenge;
    isSaving: boolean;

    topics: Array<any>;

    constructor(
        public activeModal: NgbActiveModal,
        private dataUtils: JhiDataUtils,
        private challengeService: ChallengeService,
        private eventManager: JhiEventManager,
        private topicService: TopicService
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.topicService.query().subscribe(
            (res: HttpResponse<Topic[]>) => this.topicsSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.topicsError(res.message));
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.challenge.id !== undefined) {
            this.subscribeToSaveResponse(
                this.challengeService.update(this.challenge));
        } else {
            this.subscribeToSaveResponse(
                this.challengeService.create(this.challenge));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Challenge>>) {
        result.subscribe((res: HttpResponse<Challenge>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Challenge) {
        this.eventManager.broadcast({ name: 'challengeListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }


    topicsSuccess(body, headers) {
        console.log(body);
        this.topics = body;
    }

    topicsError(error) {
        console.error(error);
    }
}

@Component({
    selector: 'jhi-challenge-popup',
    template: ''
})
export class ChallengePopupComponent implements OnInit, OnDestroy {

    routeSub: any;
    topics: Array<any>;

    constructor(
        private route: ActivatedRoute,
        private challengePopupService: ChallengePopupService
    ) {}

    ngOnInit() {

        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.challengePopupService
                    .open(ChallengeDialogComponent as Component, params['id']);
            } else {
                this.challengePopupService
                    .open(ChallengeDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
