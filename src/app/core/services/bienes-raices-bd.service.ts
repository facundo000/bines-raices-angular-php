import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Propiedades } from '../../features/admin/interfaces/propiedades.interfece';
import { environment } from 'src/environmet';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BienesRaicesBDService {
  public readonly baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v1/propiedades`);
  }
  getDataUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${ token }`);
    
    return this.http.get(`${this.baseUrl}/api/v1/propiedades/mis-propiedades`, { headers });
  }

  getDataAdmin(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${ token }`);
    
    return this.http.get(`${this.baseUrl}/api/v1/propiedades/admin/todas`, { headers });
  }


  getDataByid(id: string): Observable<Propiedades|undefined>{
    return this.http.get<Propiedades>(`${this.baseUrl}/api/v1/propiedades/${ id }`)
    .pipe(
      catchError( error => of(undefined) )
    )
  }

  updatePropiedades(propiedades: Propiedades, id: string | null): Observable<Propiedades> {    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${ token }`);

    return this.http.patch<Propiedades>(`${this.baseUrl}/api/v1/propiedades/${id}` , propiedades, { headers });
  }
 // Método para subir imagen
  uploadPropiedadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${ token }`);

    return this.http.post(`${this.baseUrl}/api/v1/files/propiedad`, formData, { headers })
      .pipe(
        map((response: any) => {
          // Extraemos solo el nombre del archivo de la URL
          const fileName = response.secureUrl.split('/').pop();
          return {
            ...response,
            secureUrl: `/${fileName}`
          };
        })
      );
  }
  // Método para crear propiedad
  createPropiedad(propiedad: Propiedades): Observable<Propiedades> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${ token }`);

    return this.http.post<Propiedades>(`${this.baseUrl}/api/v1/propiedades`, propiedad, { headers });
  }

  deletePropiedad(id: string): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${ token }`);

    return this.http.delete<boolean>(`${this.baseUrl}/api/v1/propiedades/${id}`, { headers })
    .pipe(
      map( resp => true ),
      catchError( err => of(false) )
    );
  }
}

