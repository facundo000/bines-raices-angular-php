import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Propiedades } from '../../features/admin/interfaces/propiedades.interfece';
import { environment } from 'src/environmet';

@Injectable({
  providedIn: 'root'
})
export class BienesRaicesBDService {
  private readonly baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/v1/propiedades`);
  }

  updatePropiedades(propiedades: Propiedades, id: string | null): Observable<Propiedades> {    
    return this.http.patch<Propiedades>(`${this.baseUrl}/api/v1/propiedades/${id}` , propiedades);
  }
 // Método para subir imagen
  uploadPropiedadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Authorization',`Bearer ${ token }`);

  return this.http.post(`${this.baseUrl}/api/v1/files/propiedad`, formData, { headers });
}
  // Método para crear propiedad
  createPropiedad(propiedad: Propiedades): Observable<Propiedades> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization',`Bearer ${ token }`);

    return this.http.post<Propiedades>(`${this.baseUrl}/api/v1/propiedades`, propiedad, { headers });
  }
}

