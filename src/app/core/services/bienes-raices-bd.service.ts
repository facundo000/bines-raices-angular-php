import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Propiedades } from './getData/propiedades.interface';
import { environment } from 'src/environmet';

@Injectable({
  providedIn: 'root'
})
export class BienesRaicesBDService {
  private apiUrl = environment.apiUrl;
  
  constructor(private HttpClient: HttpClient) { }

  getData(): Observable<any> {
    return this.HttpClient.get(`${this.apiUrl}/api/v1/propiedades`);
  }

  addPropiedades(propiedades: Propiedades): Observable<Propiedades> {
    return this.HttpClient.post<Propiedades>(`${this.apiUrl}/api/v1/propiedades`, propiedades);
  }
  updatePropiedades(propiedades: Propiedades, id: string | null): Observable<Propiedades> {    
    return this.HttpClient.patch<Propiedades>(`${this.apiUrl}/api/v1/propiedades/${id}` , propiedades);
  }

  deletePropiedades(id: string | null): Observable<boolean>{
    return this.HttpClient.delete(`${this.apiUrl}/api/v1/propiedades/${id}`)
    .pipe(
      catchError(err => of(false)),
      map(resp => true)
    );
  }
}

