import { Injectable, Component } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

 import { Path } from '../models/Path';


@Injectable()
export class PathService {
    private actionUrl: string;
    private headers: Headers;

    constructor(private _http: Http) {  
        // this.actionUrl = "http://vps342125.ovh.net:3000/path/";
        this.actionUrl = "http://192.168.0.14:3000/mauron85-bgeoloc-api/path";

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
    }
    
   public Open = (phone_uuid : string): Observable<Path> => {
        return this._http.post(`${this.actionUrl}/open`, JSON.stringify({Phone_uuid: phone_uuid}), { headers: this.headers })
            .map((response: Response) => <Path>response.json()).
            catch(this.handleError);
    }

    public Close = (phone_uuid : string): Observable<Path> => {
        return this._http.post(`${this.actionUrl}/close`, JSON.stringify({Phone_uuid: phone_uuid}), { headers: this.headers })
            .map((response: Response) => <Path>response.json()).
            catch(this.handleError);
    }
    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}