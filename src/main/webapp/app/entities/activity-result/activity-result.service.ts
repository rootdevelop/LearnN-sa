import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { ActivityResult } from './activity-result.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ActivityResult>;

@Injectable()
export class ActivityResultService {

    private resourceUrl =  SERVER_API_URL + 'api/activity-results';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/activity-results';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(activityResult: ActivityResult): Observable<EntityResponseType> {
        const copy = this.convert(activityResult);
        return this.http.post<ActivityResult>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(activityResult: ActivityResult): Observable<EntityResponseType> {
        const copy = this.convert(activityResult);
        return this.http.put<ActivityResult>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: string): Observable<EntityResponseType> {
        return this.http.get<ActivityResult>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ActivityResult[]>> {
        const options = createRequestOption(req);
        return this.http.get<ActivityResult[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ActivityResult[]>) => this.convertArrayResponse(res));
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ActivityResult[]>> {
        const options = createRequestOption(req);
        return this.http.get<ActivityResult[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ActivityResult[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ActivityResult = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ActivityResult[]>): HttpResponse<ActivityResult[]> {
        const jsonResponse: ActivityResult[] = res.body;
        const body: ActivityResult[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ActivityResult.
     */
    private convertItemFromServer(activityResult: ActivityResult): ActivityResult {
        const copy: ActivityResult = Object.assign({}, activityResult);
        copy.timestamp = this.dateUtils
            .convertDateTimeFromServer(activityResult.timestamp);
        return copy;
    }

    /**
     * Convert a ActivityResult to a JSON which can be sent to the server.
     */
    private convert(activityResult: ActivityResult): ActivityResult {
        const copy: ActivityResult = Object.assign({}, activityResult);

        copy.timestamp = this.dateUtils.toDate(activityResult.timestamp);
        return copy;
    }
}
