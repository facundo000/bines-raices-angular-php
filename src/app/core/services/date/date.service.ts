import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(private http: HttpClient) { }

  obtenerDate(): Observable<string> {
    return  this.http.get<string>('http://localhost:3031/data.php');
  }
}
