import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Universite } from '../models/universite.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniversiteService extends BaseService<Universite> {
  protected endpoint = 'universite';

  constructor(http: HttpClient) {
    super(http);
  }

  // Override base methods to match Spring Boot endpoints
  override getAll(): Observable<Universite[]> {
    return this.http.get<Universite[]>(`${this.baseUrl}/findAll`);
  }

  override getById(id: number): Observable<Universite> {
    return this.http.get<Universite>(`${this.baseUrl}/findById?id=${id}`);
  }

  override create(item: Universite): Observable<Universite> {
    return this.http.post<Universite>(`${this.baseUrl}/addOrUpdate`, item);
  }

  override update(id: number, item: Universite): Observable<Universite> {
    return this.http.post<Universite>(`${this.baseUrl}/addOrUpdate`, item);
  }

  override delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteById?id=${id}`);
  }

  // Additional methods from the backend service
  ajouterUniversiteEtSonFoyer(universite: Universite): Observable<Universite> {
    return this.http.post<Universite>(`${this.baseUrl}/ajouterUniversiteEtSonFoyer`, universite);
  }

  // Helper getter for base URL
  private get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }
}
