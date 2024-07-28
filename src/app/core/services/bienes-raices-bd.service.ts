import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BienesRaicesBDService {

  constructor(private HttpClient: HttpClient) { }

  getData(): Observable<any> {
    return this.HttpClient.get('http://localhost:3000/api/v1/propiedades');
  }

  getDataVendedores(): Observable<any> {
    return this.HttpClient.get('http://localhost:3000/api/v1/vendedores');
  }

}

