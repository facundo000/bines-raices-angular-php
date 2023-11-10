import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetDataService } from 'src/app/core/services/getData/get-data.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  datos: any;

  constructor(private http: HttpClient, private getDataService: GetDataService) {}

  ngOnInit(): void {
    this.getDataService.getData().subscribe(data => {
      this.datos = data;
    });
   
  }
}
