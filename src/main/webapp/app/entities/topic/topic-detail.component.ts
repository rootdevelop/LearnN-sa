import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Topic } from './topic.model';
import { TopicService } from './topic.service';

@Component({
    selector: 'jhi-topic-detail',
    templateUrl: './topic-detail.component.html'
})
export class TopicDetailComponent implements OnInit, OnDestroy {

    topic: Topic;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private topicService: TopicService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInTopics();
    }

    load(id) {
        this.topicService.find(id)
            .subscribe((topicResponse: HttpResponse<Topic>) => {
                this.topic = topicResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInTopics() {
        this.eventSubscriber = this.eventManager.subscribe(
            'topicListModification',
            (response) => this.load(this.topic.id)
        );
    }
}
