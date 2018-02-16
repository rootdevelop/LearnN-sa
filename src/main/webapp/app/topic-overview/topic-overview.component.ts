import {Component, OnDestroy, OnInit} from '@angular/core';
import {TopicService} from "../entities/topic/topic.service";
import {Topic} from "../entities/topic/topic.model";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {ITEMS_PER_PAGE} from "../shared/constants/pagination.constants";
import {JhiAlertService, JhiEventManager, JhiParseLinks} from "ng-jhipster";
import {ActivatedRoute, Router} from "@angular/router";
import {Principal} from "../shared/auth/principal.service";
import {Subscription} from "rxjs/Subscription";
import {ChallengeService} from "../entities/challenge/challenge.service";
import {SERVER_API_URL} from "../app.constants";

@Component({
    selector: 'jhi-topic-overview',
    templateUrl: './topic-overview.component.html',
    styles: []
})
export class TopicOverviewComponent implements OnInit, OnDestroy {

    currentAccount: any;
    topics: Topic[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any = 1;
    predicate: any;
    previousPage: any;
    reverse: any;

    constructor(private topicService: TopicService,
                private parseLinks: JhiParseLinks,
                private jhiAlertService: JhiAlertService,
                private principal: Principal,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private eventManager: JhiEventManager,
                private challengeService: ChallengeService,
                private http: HttpClient) {
        this.itemsPerPage = ITEMS_PER_PAGE;

        // this.routeData = this.activatedRoute.data.subscribe((data) => {
        //     console.log("d", data);
        //
        //     this.page = data.pagingParams.page;
        //     this.previousPage = data.pagingParams.page;
        //     this.reverse = data.pagingParams.ascending;
        //     this.predicate = data.pagingParams.predicate;
        // });
        // this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
        //     this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {

        this.topicService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()
        }).subscribe(
            (res: HttpResponse<Topic[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/topic'], {
            queryParams:
                {
                    page: this.page,
                    size: this.itemsPerPage,
                    search: this.currentSearch,
                    sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
                }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate(['/topic', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInTopics();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Topic) {
        return item.id;
    }

    registerChangeInTopics() {
        this.eventSubscriber = this.eventManager.subscribe('topicListModification', (response) => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        // this.page = pagingParams.page;
        this.topics = data;

        this.loadProgress();
    }

    private loadProgress() {

        for (let i = 0; i < this.topics.length; i++) {
            let uri = SERVER_API_URL + 'api/progress/' + this.topics[i].id;

            this.http.get(uri).subscribe(data => {
                this.updateTopicWithProgress(data);
            });
        }
    }

    private updateTopicWithProgress(progress: any) {
        for (let i = 0; i < this.topics.length; i++) {

            if (this.topics[i].id === progress.topic) {
                this.topics[i].progress = `${progress.success}/${progress.total}`;

            }
        }
    }

    onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
