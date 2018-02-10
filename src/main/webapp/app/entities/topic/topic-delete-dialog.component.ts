import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Topic } from './topic.model';
import { TopicPopupService } from './topic-popup.service';
import { TopicService } from './topic.service';

@Component({
    selector: 'jhi-topic-delete-dialog',
    templateUrl: './topic-delete-dialog.component.html'
})
export class TopicDeleteDialogComponent {

    topic: Topic;

    constructor(
        private topicService: TopicService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: string) {
        this.topicService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'topicListModification',
                content: 'Deleted an topic'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-topic-delete-popup',
    template: ''
})
export class TopicDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private topicPopupService: TopicPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.topicPopupService
                .open(TopicDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
