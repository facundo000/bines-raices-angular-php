import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BienesRaicesBDService } from 'src/app/core/services/bienes-raices-bd.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { environment } from 'src/environmet';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  datos: any;
  imagenUrl: string | null = null;
  url = environment.urlImg;
  isAdmin: boolean = false;
  currentUser: any = null;

  constructor(
    private http: HttpClient, 
    private bienesRaicesBDService: BienesRaicesBDService,
    private authService: AuthService
  ) {}

  eliminarPropiedad(id: string) {
    const mensaje = this.isAdmin ? 
      '¿Estás seguro? Como administrador, puedes eliminar cualquier propiedad.' : 
      '¿Estás seguro? No podrás revertir esta acción';
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: mensaje,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bienesRaicesBDService.deletePropiedad(id)
          .subscribe({
            next: (wasDeleted) => {
              if (wasDeleted) {
                Swal.fire(
                  '¡Eliminado!',
                  'La propiedad ha sido eliminada.',
                  'success'
                );
                // Actualizar la lista de propiedades
                this.cargarPropiedades();
              } else {
                Swal.fire(
                  'Error',
                  'No se pudo eliminar la propiedad',
                  'error'
                );
              }
            },
            error: (error) => {
              console.error('Error al eliminar:', error);
              Swal.fire(
                'Error',
                'Ocurrió un error al eliminar la propiedad',
                'error'
              );
            }
          });
      }
    });
  }

  private cargarPropiedades() {
    this.bienesRaicesBDService.getDataUser().subscribe({
      next: (response) => {
        this.datos = response.map((data: any) => ({
          ...data,
          imagen: data.imagen ? {
            id: data.imagen.id,
            url: this.processImageUrl(data.imagen.url)
          } : {
            id: null,
            url: ''
          }
        }));
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      }
    });
  }

  ngOnInit(): void {
    this.cargarPropiedades();
  }

  private processImageUrl(url: string): string {
    try {
      // if (!url) return 'no-image.jpg';
      
      // Si la URL contiene llaves y comillas, procesamos todo junto
      if (url.includes('{')) {
        return url.replace(/[{"}/]/g, ''); // Eliminamos llaves, comillas y barras
      }
      
      // Si es una URL normal, la retornamos tal cual
      return url;
    } catch (error) {
      console.error('Error procesando URL:', error);
      return 'no-image.jpg';
    }
  }
}