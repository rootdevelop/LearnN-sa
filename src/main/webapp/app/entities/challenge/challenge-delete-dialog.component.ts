import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Challenge } from './challenge.model';
import { ChallengePopupService } from './challenge-popup.service';
import { ChallengeService } from './challenge.service';

@Component({
    selector: 'jhi-challenge-delete-dialog',
    templateUrl: './challenge-delete-dialog.component.html'
})
export class ChallengeDeleteDialogComponent {

    challenge: Challenge;

    constructor(
        private challengeService: ChallengeService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.challengeService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'challengeListModification',
                content: 'Deleted an challenge'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-challenge-delete-popup',
    template: ''
})
export class ChallengeDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private challengePopupService: ChallengePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.challengePopupService
                .open(ChallengeDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
