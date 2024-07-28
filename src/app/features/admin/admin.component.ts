import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { BienesRaicesBDService } from 'src/app/core/services/bienes-raices-bd.service';
import { environment } from 'src/environmet';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{

  datos: any;
  imagenUrl: string | null = null;
  urlImg = environment.urlImg;

  constructor(private http: HttpClient, private bienesRaicesBDService: BienesRaicesBDService, private router: Router) {}

  // eliminarProp(id: string) {
  //   if(window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
  //     // console.log('Eliminando propiedad con id: ' + id);
  //     this.http.delete(`http://localhost:3031/deleteProp.php?id=${id}`).subscribe(() => {
  //           console.log('Propiedad eliminada con id: ' + id);
  //           // Aquí puedes agregar el código para actualizar la lista de propiedades después de eliminar
  //           this.getDataService.getData().subscribe(data => {
  //             this.datos = data;
  //           });
  //     });
  //   }
  // }

  ngOnInit(): void {
    this.bienesRaicesBDService.getData().subscribe(data => {
      this.datos = data;
      console.log(this.datos);

    });
  }
}