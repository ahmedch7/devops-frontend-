import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Bloc } from '../models/bloc.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlocService extends BaseService<Bloc> {
  protected endpoint = 'bloc';

  constructor(http: HttpClient) {
    super(http);
  }

  // Override base methods to match Spring Boot endpoints
  override getAll(): Observable<Bloc[]> {
    return this.http.get<Bloc[]>(`${this.baseUrl}/findAll`);
  }

  override getById(id: number): Observable<Bloc> {
    return this.http.get<Bloc>(`${this.baseUrl}/findById?id=${id}`);
  }

  override create(item: Bloc): Observable<Bloc> {
    return this.http.post<Bloc>(`${this.baseUrl}/addOrUpdate`, item);
  }

  override update(id: number, item: Bloc): Observable<Bloc> {
    return this.http.post<Bloc>(`${this.baseUrl}/addOrUpdate`, item);
  }

  override delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteById?id=${id}`);
  }

  // Helper getter for base URL
  private get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }
}
