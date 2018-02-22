import {Component, OnInit} from '@angular/core';
import {ChallengeService} from '../entities/challenge/challenge.service';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Challenge} from '../entities/challenge/challenge.model';
import {ActivityResultService} from '../entities/activity-result/activity-result.service';
import {ActivityResult} from "../entities/activity-result/activity-result.model";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Subscription} from "rxjs/Subscription";
import {TopicService} from "../entities/topic/topic.service";
import {Topic} from "../entities/topic/topic.model";
import {ActivatedRoute} from "@angular/router";
import {SERVER_API_URL} from "../app.constants";
import {DomSanitizer} from "@angular/platform-browser";

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
                private route: ActivatedRoute,
                private http: HttpClient,
                private sanitizer: DomSanitizer) {
    }

    topic: string;
    code: any;
    question: string;
    language: string;
    givenAnswer: string;

    success: boolean = false;
    lastQuestion: boolean = false;

    errorMsg: string;

    private answer: string;
    private id: string;

    questionNr: number = 1;
    totalQuestions: number = 1;

    private subscription: Subscription;
    private seconds;
    private timer;

    topicId: string;

    savedTime: number;

    private challenges;

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.getChallenges(params['id']);
        });

    }

    nextChallenge() {
        console.log(this.totalQuestions + "-" + this.questionNr);

        if (this.subscription) this.subscription.unsubscribe();
        if (this.subscription) this.subscription = null;
        if (this.timer) this.timer = null;

        this.timer = TimerObservable.create(1000, 1000);
        this.subscription = this.timer.subscribe(t => {
            this.seconds = t;
        });

        this.success = false;
        this.givenAnswer = "";
        this.clearErrorMsg();
        if (this.totalQuestions < this.questionNr) return;

        const challenge = this.challenges[this.questionNr - 1];

        if (!challenge.active) {
            this.questionNr++;
            this.nextChallenge();
            return;
        }

        this.id = challenge.id;
        this.code = challenge.snippet;
        console.log(this.code);
        this.question = challenge.question;
        this.language = challenge.language;
        this.answer = challenge.answer;
        this.topicId = challenge.topic;


        setTimeout(function () {
            hljs.highlightBlock(document.getElementById("snippet"));
            hljs.initLineNumbersOnLoad();
        }, 100);

        let uri = SERVER_API_URL + 'api/challenge-status/' + challenge.id;
        console.log(uri);

        this.http.get(uri).subscribe(data => { this.updateResult(data); });
    }

    updateResult(data) {
        console.log(data);
        if (data.challengeId == this.id && data.result) {

            this.givenAnswer = this.answer;
            this.savedTime = data.timeSpent;
            this.success = true;
        }
    }

    getChallenges(id: string) {

        this.topicService.find(id).subscribe((topicResponse: HttpResponse<Topic>) => {
            this.topic = topicResponse.body.name;
        });

        this.topicId = id;
        this.challengeService.search({
            query: this.topicId,
            page: 0,
            size: 100
        }).subscribe(
            (res: HttpResponse<Challenge[]>) => this.loadChallenge(res.body, res.headers),
            (res: HttpErrorResponse) => this.error(res.message)
        );
    }


    loadChallenge(body: any, headers: any) {

        if (body.length === 0) {
            console.log('no questions');
            return; // todo return to topic list
        }

        this.totalQuestions = body.length;
        this.challenges = body;

        this.nextChallenge();
    }

    clearErrorMsg() {
        this.errorMsg = "";
    }

    next() {
        this.questionNr++;
        this.nextChallenge();
    }

    previous() {
        this.questionNr--;
        this.nextChallenge();

    }

    submitAnswer() {

        if (this.givenAnswer == "") return;

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
