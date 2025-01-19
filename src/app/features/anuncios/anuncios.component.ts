import { Component, OnInit } from '@angular/core';
import { BienesRaicesBDService } from 'src/app/core/services/bienes-raices-bd.service';
import { environment } from 'src/environmet';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.component.html',
  styleUrls: ['./anuncios.component.scss']
})
export class AnunciosComponent implements OnInit {

  datos: any;
  imagenUrl: string | null = null;
  url = environment.urlImg;
  
  constructor(private bienesRaicesBDService: BienesRaicesBDService) {}

  private cargarPropiedades() {
    this.bienesRaicesBDService.getData().subscribe({
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
