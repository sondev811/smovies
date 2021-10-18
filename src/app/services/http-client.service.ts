import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_CONFIG } from '../constants/api.constant';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private http: HttpClient,
    private router: Router) { }

    getURL(url: string) {
      if (url) {
        url = `${API_CONFIG.BASE_URL}${url}?api_key=${environment.API_KEY}&language=en-US`;
      }
      return url;
    }

  getHeader() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return headers;
  }

  get(url?: string) {
    url = this.getURL(url);
    const headers = this.getHeader();
    return new Observable(subscriber => {
      this.http.get(url, { headers })
        .subscribe({
          next: (res: Object) => {
            subscriber.next(res);
          },
          error: (err) => {
            // this.handleError(err, subscriber, () => {
            //   this.get(url).subscribe(subscriber);
            // });
          }
        });
    });
  }

}