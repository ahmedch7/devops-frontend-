import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export abstract class BaseService<T, ID = number> {
  protected abstract endpoint: string;
  protected headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(protected http: HttpClient) {}

  protected handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${environment.apiUrl}/${this.endpoint}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getById(id: ID): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/${this.endpoint}/${id}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}/${this.endpoint}`, item, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  update(id: ID, item: T): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}/${this.endpoint}/${id}`, item, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  delete(id: ID): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${this.endpoint}/${id}`, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }
} 