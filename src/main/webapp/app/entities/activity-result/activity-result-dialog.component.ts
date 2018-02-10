import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ActivityResult } from './activity-result.model';
import { ActivityResultPopupService } from './activity-result-popup.service';
import { ActivityResultService } from './activity-result.service';

@Component({
    selector: 'jhi-activity-result-dialog',
    templateUrl: './activity-result-dialog.component.html'
})
export class ActivityResultDialogComponent implements OnInit {

    activityResult: ActivityResult;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private activityResultService: ActivityResultService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.activityResult.id !== undefined) {
            this.subscribeToSaveResponse(
                this.activityResultService.update(this.activityResult));
        } else {
            this.subscribeToSaveResponse(
                this.activityResultService.create(this.activityResult));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ActivityResult>>) {
        result.subscribe((res: HttpResponse<ActivityResult>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ActivityResult) {
        this.eventManager.broadcast({ name: 'activityResultListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-activity-result-popup',
    template: ''
})
export class ActivityResultPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private activityResultPopupService: ActivityResultPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.activityResultPopupService
                    .open(ActivityResultDialogComponent as Component, params['id']);
            } else {
                this.activityResultPopupService
                    .open(ActivityResultDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
