import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SERVER_API_URL} from "../app.constants";

@Injectable()
export class TopicProgressService {

    private resourceUrl = SERVER_API_URL + 'api/progress';

    constructor(private httpClient: HttpClient) {
    }

    getProgressForTopic(topic: string) {


    }
}
