import {Component, OnInit} from '@angular/core';
import {ChallengeService} from '../entities/challenge/challenge.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Challenge} from '../entities/challenge/challenge.model';
import {ActivityResultService} from '../entities/activity-result/activity-result.service';
import {ActivityResult} from "../entities/activity-result/activity-result.model";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Subscription} from "rxjs/Subscription";
import {TopicService} from "../entities/topic/topic.service";
import {Topic} from "../entities/topic/topic.model";
import {ActivatedRoute} from "@angular/router";

declare const hljs: any;

@Component({
    selector: 'jhi-execute',
    templateUrl: './execute.component.html',
    styles: []
})
export class ExecuteComponent implements OnInit {

    constructor(private challengeService: ChallengeService,
                private activityResultService: ActivityResultService,
                private topicService: TopicService,
                private route: ActivatedRoute) {
    }

    topic: string;
    code: string;
    question: string;
    language: string;
    givenAnswer: string;

    success: boolean = false;
    lastQuestion: boolean = false;

    errorMsg: string;

    private answer: string;
    private id: string;

    private questionNr: number = 0;
    private totalQuestions: number = 1;

    private subscription: Subscription;
    private seconds;
    private timer;

    topicId: string;

    savedTime: number;

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.nextChallenge(params['id']);
        });

    }

    nextChallenge(id: string) {
        console.log("topic:", id);
        this.topicId = id;
        this.timer = TimerObservable.create(1000, 1000);
        this.subscription = this.timer.subscribe(t => {
            this.seconds = t;
        });

        this.success = false;
        this.givenAnswer = "";
        this.clearErrorMsg();
        if (this.totalQuestions == this.questionNr) return;

        this.challengeService.search({
            query: this.topicId,
            page: this.questionNr,
            size: 1
        }).subscribe(
            (res: HttpResponse<Challenge[]>) => this.loadChallenge(res.body, res.headers),
            (res: HttpErrorResponse) => this.error(res.message)
        );
    }


    loadChallenge(body: any, headers: any) {

        if (body.length === 0) {
            console.log('no questions');
            return;
        }

        this.totalQuestions = headers.get('X-Total-Count');

        const challenge = body[0];

        if (!challenge.active) {
            this.questionNr++;
            this.nextChallenge(this.topicId);
            return;
        }

        this.id = challenge.id;
        this.code = challenge.snippet;
        this.question = challenge.question;
        this.language = challenge.language;
        this.answer = challenge.answer;
        this.topicId = challenge.topic;

        this.topicService.find(challenge.topic).subscribe((topicResponse: HttpResponse<Topic>) => {
            this.topic = topicResponse.body.name;
        });

        this.questionNr++;

        setTimeout(function () {
            hljs.highlightBlock(document.getElementById("snippet"));
            hljs.initLineNumbersOnLoad();
        }, 100);
    }

    clearErrorMsg() {
        this.errorMsg = "";
    }

    goHome() {
        // todo build implementation
    }

    submitAnswer() {

        console.log(this.totalQuestions + " " + this.questionNr);

        if (this.subscription) this.subscription.unsubscribe();
        if (this.subscription) this.subscription = null;
        if (this.timer) this.timer = null;
        this.savedTime = this.seconds;

        if (this.answer == this.givenAnswer) {

            this.activityResultService.create({
                challengeId: this.id,
                answer: this.givenAnswer,
                timeSpent: this.savedTime,
                result: "SUCCESS"
            }).subscribe((res: HttpResponse<ActivityResult>) =>
                console.log(res.body), (res: HttpErrorResponse) => console.log(res));

            if (this.questionNr == this.totalQuestions) {
                console.log("Finished");
                this.lastQuestion = true;
            } else {
                this.success = true;
            }
        } else {
            this.activityResultService.create({
                challengeId: this.id,
                answer: this.givenAnswer,
                timeSpent: this.savedTime,
                result: "FAIL"
            }).subscribe((res: HttpResponse<ActivityResult>) =>
                console.log(res.body), (res: HttpErrorResponse) => console.log(res));
            this.errorMsg = "Whoops, that is not the correct answer";
            this.success = false;
            this.timer = TimerObservable.create(500, 1000);
            this.subscription = this.timer.subscribe(t => {
                this.seconds = t;
            });

        }
    }

    error(error: any) {
        console.log(error);
    }

}
