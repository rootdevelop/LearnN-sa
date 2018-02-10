import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ActivityResult } from './activity-result.model';
import { ActivityResultPopupService } from './activity-result-popup.service';
import { ActivityResultService } from './activity-result.service';

@Component({
    selector: 'jhi-activity-result-delete-dialog',
    templateUrl: './activity-result-delete-dialog.component.html'
})
export class ActivityResultDeleteDialogComponent {

    activityResult: ActivityResult;

    constructor(
        private activityResultService: ActivityResultService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.activityResultService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'activityResultListModification',
                content: 'Deleted an activityResult'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-activity-result-delete-popup',
    template: ''
})
export class ActivityResultDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private activityResultPopupService: ActivityResultPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.activityResultPopupService
                .open(ActivityResultDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
