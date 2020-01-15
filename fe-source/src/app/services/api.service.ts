import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const API = environment.apiUri;

const httpJsonOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  public fetch(payload: any): Observable<any> {
    return this.http.post(`${API}`, payload, httpJsonOptions).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(httpError: HttpErrorResponse) {
    console.error(httpError);
    return throwError(httpError ? httpError.error : httpError);
  }

}
