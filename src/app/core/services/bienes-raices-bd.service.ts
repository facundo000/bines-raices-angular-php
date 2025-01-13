import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  addPropiedades(propiedades: Propiedades): Observable<Propiedades> {
    return this.http.post<Propiedades>(`${this.baseUrl}/api/v1/propiedades`, propiedades);
  }
  updatePropiedades(propiedades: Propiedades, id: string | null): Observable<Propiedades> {    
    return this.http.patch<Propiedades>(`${this.baseUrl}/api/v1/propiedades/${id}` , propiedades);
  }
 // Método para subir imagen
 uploadPropiedadImage(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  
  return this.http.post(`${this.baseUrl}/files/propiedad`, formData);
}
  // Método para crear propiedad
  createPropiedad(propiedad: Propiedades): Observable<Propiedades> {
    return this.http.post<Propiedades>(`${this.baseUrl}/propiedades`, propiedad);
  }
}

