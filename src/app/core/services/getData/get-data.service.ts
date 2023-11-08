import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get('http://localhost:3031/getData.php');
  }

  getVendedores(): Observable<any> {
    return this.http.get('http://localhost:3031/getVendedores.php');
  }
}
