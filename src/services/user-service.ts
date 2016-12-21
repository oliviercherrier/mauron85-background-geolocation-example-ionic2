// https://www.barbarianmeetscoding.com/blog/2016/04/02/getting-started-with-angular-2-step-by-step-6-consuming-real-data-with-http/

import { Injectable, Component } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import {Config} from '../config/config'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { User } from '../models/User';


@Injectable()
export class UserService {
    private actionUrl: string;
    private headers: Headers;

    constructor(private _http: Http) {  
        this.actionUrl = Config.REST_API_ADDRESS + "/users";

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }
    
    public Add = (user: User): Observable<User> => {
        return this._http.post(this.actionUrl, JSON.stringify({User: user}), { headers: this.headers })
            .map((response: Response) => <User>response.json()).
            catch(this.handleError);
    }
    
    public getAll = (): Observable<User[]> => {
        let users$ = this._http
            .get(`${this.actionUrl}`, {headers: this.getHeaders()})
            .map((response: Response) => <User[]>response.json()).catch(this.handleError);
        return users$;
    }

    public get = (phone_uuid: String): Observable<User> => {
        let user$ = this._http
            .get(`${this.actionUrl}/${phone_uuid}`, {headers: this.getHeaders()})
            .map((response: Response) => {
                if (response.status != 204) {return <User>response.json()} else { return undefined}
            }).catch(this.handleError);
        return user$;
    }

    private getHeaders(){
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
    }

    private handleError(error: Response) {
        console.log(error);
        return Observable.throw(error);
    }

}