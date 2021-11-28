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
  loading = false;
  constructor(
    private http: HttpClient,
    private router: Router) { }

    getURL(url: string, params) {
      if (url) {
        const urlWithParams = this.handleParams(params);
        url = `${API_CONFIG.BASE_URL}${url}?api_key=${API_CONFIG.API_KEY}&language=en-US&append_to_response=external_ids${urlWithParams}`;
      }
      return url;
    }

  handleParams(params) {
    let urlWithParams = '';
    const keys = Object.keys(params);
    const values = Object.values(params);
    if (!keys || !keys.length || !values || !values.length) {
      return urlWithParams;
    }
    keys.forEach((item, index) => {
      urlWithParams += `&${item}=${values[index]}`;
    });
    return urlWithParams;
  }

  getHeader(isIMDB = false) {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (isIMDB) {
      headers['x-rapidapi-host'] = 'imdb8.p.rapidapi.com';
      headers['x-rapidapi-key'] = 'bbfdeb471emsh2b4cdfd3380f8e1p1f75fbjsn44bec000e75a';
    }
    return new HttpHeaders(headers);
  }

  get(url: string, params: any) {
    url = this.getURL(url, params);
    const headers = this.getHeader();
    this.loading = true;
    return new Observable(subscriber => {
      this.http.get(url, { headers })
        .subscribe({
          next: (res: Object) => {
            setTimeout(() => {
              this.loading = false;
            }, 200);
            subscriber.next(res);
          },
          error: (err) => {
            this.loading = false;
            // this.handleError(err, subscriber, () => {
            //   this.get(url).subscribe(subscriber);
            // });
          }
        });
    });
  }

  getVisitors(url: string) {
    this.loading = true;
    return new Observable(subscriber => {
      this.http.get(url, {})
        .subscribe({
          next: (res: Object) => {
            setTimeout(() => {
              this.loading = false;
            }, 200);
            subscriber.next(res);
          },
          error: (err) => {
            this.loading = false;
            // this.handleError(err, subscriber, () => {
            //   this.get(url).subscribe(subscriber);
            // });
          }
        });
    });
  }

  getIMDBDetail(imdbID: string) {
    const url = `https://imdb8.p.rapidapi.com/title/get-ratings?tconst=${imdbID}`;
    const headers = this.getHeader(true);
    this.loading = true;
    return new Observable(subscriber => {
      this.http.get(url, { headers })
        .subscribe({
          next: (res: Object) => {
            setTimeout(() => {
              this.loading = false;
            }, 200);
            subscriber.next(res);
          },
          error: (err) => {
            this.loading = false;
            // this.handleError(err, subscriber, () => {
            //   this.get(url).subscribe(subscriber);
            // });
          }
        });
    });
  }

}
