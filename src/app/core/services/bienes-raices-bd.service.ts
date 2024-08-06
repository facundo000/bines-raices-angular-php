import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Propiedades } from './getData/propiedades.interface';
import { environment } from 'src/environmet';

@Injectable({
  providedIn: 'root'
})
export class BienesRaicesBDService {
  private apiUrl = environment.apiUrl;
  
  constructor(private HttpClient: HttpClient) { }

  getData(): Observable<any> {
    return this.HttpClient.get('http://localhost:3000/api/v1/propiedades');
  }

  getDataVendedores(): Observable<any> {
    return this.HttpClient.get('http://localhost:3000/api/v1/vendedores');
  }

  addPropiedades(propiedades: Propiedades): Observable<Propiedades> {
    return this.HttpClient.post<Propiedades>(this.apiUrl, propiedades);
  }
  updatePropiedades(propiedades: Propiedades, id: string | null): Observable<Propiedades> {    
    return this.HttpClient.patch<Propiedades>(`${this.apiUrl}/${id}` , propiedades);
  }

}

