import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Challenge } from './challenge.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Challenge>;

@Injectable()
export class ChallengeService {

    private resourceUrl =  SERVER_API_URL + 'api/challenges';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/challenges';

    constructor(private http: HttpClient) { }

    create(challenge: Challenge): Observable<EntityResponseType> {
        const copy = this.convert(challenge);
        return this.http.post<Challenge>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(challenge: Challenge): Observable<EntityResponseType> {
        const copy = this.convert(challenge);
        return this.http.put<Challenge>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: string): Observable<EntityResponseType> {
        return this.http.get<Challenge>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<Challenge[]>> {
        const options = createRequestOption(req);
        return this.http.get<Challenge[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Challenge[]>) => this.convertArrayResponse(res));
    }

    delete(id: string): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<Challenge[]>> {
        const options = createRequestOption(req);
        return this.http.get<Challenge[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<Challenge[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Challenge = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Challenge[]>): HttpResponse<Challenge[]> {
        const jsonResponse: Challenge[] = res.body;
        const body: Challenge[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Challenge.
     */
    private convertItemFromServer(challenge: Challenge): Challenge {
        const copy: Challenge = Object.assign({}, challenge);
        return copy;
    }

    /**
     * Convert a Challenge to a JSON which can be sent to the server.
     */
    private convert(challenge: Challenge): Challenge {
        const copy: Challenge = Object.assign({}, challenge);
        return copy;
    }
}
