import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BaseService } from './base.service';
import { Etudiant } from '../models/etudiant.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService extends BaseService<Etudiant> {
  protected endpoint = 'etudiant';

  constructor(http: HttpClient) {
    super(http);
  }

  // Override base methods to match Spring Boot endpoints
  override getAll(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.baseUrl}/findAll`).pipe(
      catchError(this.handleError)
    );
  }

  override getById(id: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.baseUrl}/findById?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  override create(item: Etudiant): Observable<Etudiant> {
    return this.http.post<Etudiant>(`${this.baseUrl}/addOrUpdate`, item).pipe(
      catchError(this.handleError)
    );
  }

  override update(id: number, item: Etudiant): Observable<Etudiant> {
    // Ensure the ID is set in the item
    const updatedItem = { ...item, idEtudiant: id };
    return this.http.post<Etudiant>(`${this.baseUrl}/addOrUpdate`, updatedItem).pipe(
      catchError(this.handleError)
    );
  }

  override delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteById?id=${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Additional methods from the REST controller
  findByNom(nom: string): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.baseUrl}/selectJPQL?nom=${nom}`);
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
