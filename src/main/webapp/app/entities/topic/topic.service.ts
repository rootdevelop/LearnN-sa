import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Topic } from './topic.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Topic>;

@Injectable()
export class TopicService {

    private resourceUrl =  SERVER_API_URL + 'api/topics';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/topics';

    constructor(private http: HttpClient) { }

    create(topic: Topic): Observable<EntityResponseType> {
        const copy = this.convert(topic);
        return this.http.post<Topic>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(topic: Topic): Observable<EntityResponseType> {
        const copy = this.convert(topic);
        return this.http.put<Topic>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: string): Observable<EntityResponseType> {
        return this.http.get<Topic>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Topic[]>> {
        const options = createRequestOption(req);
        return this.http.get<Topic[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Topic[]>) => this.convertArrayResponse(res));
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Topic[]>> {
        const options = createRequestOption(req);
        return this.http.get<Topic[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Topic[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Topic = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Topic[]>): HttpResponse<Topic[]> {
        const jsonResponse: Topic[] = res.body;
        const body: Topic[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Topic.
     */
    private convertItemFromServer(topic: Topic): Topic {
        const copy: Topic = Object.assign({}, topic);
        return copy;
    }

    /**
     * Convert a Topic to a JSON which can be sent to the server.
     */
    private convert(topic: Topic): Topic {
        const copy: Topic = Object.assign({}, topic);
        return copy;
    }
}
