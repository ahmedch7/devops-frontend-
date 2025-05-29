import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BaseService } from './base.service';
import { Foyer } from '../models/foyer.model';
import { Universite } from '../models/universite.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoyerService extends BaseService<Foyer> {
  protected endpoint = 'foyer';

  constructor(http: HttpClient) {
    super(http);
  }

  // Override base methods to match Spring Boot endpoints
  override getAll(): Observable<Foyer[]> {
    return this.http.get<any>(`${this.baseUrl}/findAll`).pipe(
      map(response => {
        // Handle both array and object responses
        if (Array.isArray(response)) {
          return response;
        } else if (response && typeof response === 'object') {
          // If response is wrapped in an object, try to find the array
          const possibleArray = Object.values(response).find(val => Array.isArray(val));
          return possibleArray as Foyer[] || [];
        }
        return [];
      }),
      catchError(this.handleError)
    );
  }

  override getById(id: number): Observable<Foyer> {
    return this.http.get<Foyer>(`${this.baseUrl}/findById?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  override create(item: Foyer): Observable<Foyer> {
    return this.http.post<Foyer>(`${this.baseUrl}/addOrUpdate`, item).pipe(
      catchError(this.handleError)
    );
  }

  override update(id: number, item: Foyer): Observable<Foyer> {
    return this.http.post<Foyer>(`${this.baseUrl}/addOrUpdate`, item).pipe(
      catchError(this.handleError)
    );
  }

  override delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteById?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Additional methods from the backend service
  affecterFoyerAUniversite(idFoyer: number, nomUniversite: string): Observable<Universite> {
    return this.http.post<Universite>(`${this.baseUrl}/affecterFoyerAUniversite?idFoyer=${idFoyer}&nomUniversite=${nomUniversite}`, {});
  }

  ajouterFoyerEtAffecterAUniversite(foyer: Foyer, idUniversite: number): Observable<Foyer> {
    return this.http.post<Foyer>(`${this.baseUrl}/ajouterFoyerEtAffecterAUniversite?idUniversite=${idUniversite}`, foyer);
  }

  ajoutFoyerEtBlocs(foyer: Foyer): Observable<Foyer> {
    return this.http.post<Foyer>(`${this.baseUrl}/ajoutFoyerEtBlocs`, foyer);
  }

  affecterFoyerAUniversiteByIds(idFoyer: number, idUniversite: number): Observable<Universite> {
    return this.http.post<Universite>(`${this.baseUrl}/affecterFoyerAUniversiteByIds?idFoyer=${idFoyer}&idUniversite=${idUniversite}`, {});
  }

  desaffecterFoyerAUniversite(idUniversite: number): Observable<Universite> {
    return this.http.post<Universite>(`${this.baseUrl}/desaffecterFoyerAUniversite?idUniversite=${idUniversite}`, {});
  }

  getFoyersByUniversite(idUniversite: number): Observable<Foyer[]> {
    return this.http.get<Foyer[]>(`${this.baseUrl}/getFoyersByUniversite?idUniversite=${idUniversite}`).pipe(
      catchError(this.handleError)
    );
  }

  // Helper getter for base URL
  private get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }

  // Error handling
  protected override handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
