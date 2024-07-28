import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeleteDataService {

  constructor(private http: HttpClient) { }
    deleteProp(): Observable<any> {
      return this.http.get('http://localhost:3031/deleteProp.php');
    }
}
