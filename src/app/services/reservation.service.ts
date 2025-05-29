import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Reservation } from '../models/reservation.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService extends BaseService<Reservation, string> {
  protected endpoint = 'reservation';

  constructor(http: HttpClient) {
    super(http);
  }

  // Override base methods to match Spring Boot endpoints
  override getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/findAll`);
  }

  override getById(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.baseUrl}/findById?id=${id}`);
  }

  override create(item: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/addOrUpdate`, item);
  }

  override update(id: string, item: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/addOrUpdate`, item);
  }

  override delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteById?id=${id}`);
  }

  // Helper getter for base URL
  private get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }
}
