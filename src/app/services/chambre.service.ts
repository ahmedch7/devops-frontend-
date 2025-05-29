import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Chambre, TypeChambre } from '../models/chambre.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChambreService extends BaseService<Chambre> {
  protected endpoint = 'chambre';

  constructor(http: HttpClient) {
    super(http);
  }

  // Override base methods to match Spring Boot endpoints
  override getAll(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.baseUrl}/findAll`);
  }

  override getById(id: number): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.baseUrl}/findById?id=${id}`);
  }

  override create(item: Chambre): Observable<Chambre> {
    return this.http.post<Chambre>(`${this.baseUrl}/addOrUpdate`, item);
  }

  override update(id: number, item: Chambre): Observable<Chambre> {
    return this.http.post<Chambre>(`${this.baseUrl}/addOrUpdate`, item);
  }

  override delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteById?id=${id}`);
  }

  // Additional methods from the backend service
  getChambresParNomBloc(nomBloc: string): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.baseUrl}/getChambresParNomBloc?nomBloc=${nomBloc}`);
  }

  nbChambreParTypeEtBloc(type: TypeChambre, idBloc: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/nbChambreParTypeEtBloc?type=${type}&idBloc=${idBloc}`);
  }

  getChambresNonReserveParNomFoyerEtTypeChambre(nomFoyer: string, type: TypeChambre): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.baseUrl}/getChambresNonReserveParNomFoyerEtTypeChambre?nomFoyer=${nomFoyer}&type=${type}`);
  }

  // Helper getter for base URL
  private get baseUrl(): string {
    return `${environment.apiUrl}/${this.endpoint}`;
  }
}
