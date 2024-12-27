import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { GetDataService } from 'src/app/core/services/getData/get-data.service';
import { environment } from 'src/environmet';
import { BienesRaicesBDService } from 'src/app/core/services/bienes-raices-bd.service';
import { Propiedades } from '../../../core/services/getData/propiedades.interface';


interface Propiedad {
  titulo: string;
  precio: string;
  imagen: string[];
  descripcion: string;
  habitaciones: number;
  banio: number;
  estacionamiento: number;
  vendedores_id: number;
}

@Component({
    selector: 'app-actualizar',
    templateUrl: './actualizar.component.html',
    styleUrls: ['./actualizar.component.scss']
  })
export class ActualizarComponent implements OnInit {
  form: FormGroup;
  descripcionLength = 0;
  datos: any;
  id: string | null = '';
  vendedores: string | any;
  imagenUrl: string | null = null;
  selectedFile: File | any;
  imagenError: string | null = null;

  private apiUrl = environment.apiUrl;
  private urlImg = environment.urlImg;
  

  constructor(
    private httpClient: HttpClient ,
     private router: Router, 
     private route: ActivatedRoute,
     private bienesRaicesBDService: BienesRaicesBDService
    ) {
      this.form = new FormGroup({
        'titulo': new FormControl('', Validators.required),
        'precio': new FormControl('', [Validators.required, Validators.minLength(1)]),
        'descripcion': new FormControl('', [Validators.required, Validators.minLength(50)]),
        'habitaciones': new FormControl('', [Validators.required, Validators.min(1)]),
        'wc': new FormControl('', [Validators.required, Validators.min(1)]),
        'estacionamiento': new FormControl('', [Validators.required, Validators.min(1)])
      });

    // Contador de carácteres
    this.form.get('descripcion')?.valueChanges.subscribe(value => {
      this.descripcionLength = value ? value.length : 0;
      const contador = document.querySelector('.char-counter');

      if( value && value.length > 50) {
        contador?.classList.add('min-car');
      } else {
        contador?.classList.remove('min-car');

      }

    });
  }

  // Restricciones para imagenes
  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
        this.selectedFile = fileInput.files[0];

      //MODIFICAR RUTA DE SUBIDA DE IMAGENES

      //http://localhost:3000/api/v1/files/propiedad
      // Verificar el tamañp del archivo
      const medida = 1000 * 1000; // = 1mb
      if(this.selectedFile.size > medida) {
        this.imagenError = 'Imagen demasido grande';
        this.selectedFile = null;
        return
      }
      this.imagenError = null;
    } else {
      this.imagenError = 'Debes seleccionar una imagen';
      this.selectedFile = null;
    }
  }
  enviarForm(): void {
    if(this.form.valid) {
      const propiedades: Propiedades = {
        id: this.form.get('id')?.value,
        slug: this.form.get('slug')?.value,
        titulo: this.form.get('titulo')?.value,
        precio: this.form.get('precio')?.value,
        descripcion: this.form.get('descripcion')?.value,
        habitaciones: this.form.get('habitaciones')?.value,
        banio: this.form.get('banio')?.value,
        estacionamiento: this.form.get('estacionamiento')?.value,
        imagem: this.form.get('imagen')?.value,
        vendedorId: this.form.get('vendedores')?.value
      };
      // const url = `${this.apiUrl}/${this.id}`;

      this.bienesRaicesBDService.updatePropiedades(propiedades, this.id).subscribe(
        (response) => {
          console.log('éxito:', response);
          alert('Formulario actualizado con éxito!!'); 
          this.router.navigate(['/admin']);
        },
        (error) => {
          console.log('error:', error);
        }
      );

    } else {
      if (!this.form.valid) {
          alert('Falta completar el formulario');
      }
    }
  }
  // Obtener datos de vendedores
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('id: ' + this.id);
    
    if (this.id) {
      this.httpClient.get<Propiedad>(`${this.apiUrl}/${this.id}`).subscribe(
        (response) => {
          const propiedad = response;
          console.log(propiedad);
          this.form.patchValue({
            'titulo': propiedad.titulo,
            'precio': propiedad.precio,
            'descripcion': propiedad.descripcion,
            'habitaciones': propiedad.habitaciones,
            'wc': propiedad.banio,
            'estacionamiento': propiedad.estacionamiento,
            'vendedores': propiedad.vendedores_id
          });

          if(propiedad.imagen && propiedad.imagen.length > 0) {
            this.imagenUrl = `${this.urlImg}${propiedad.imagen}`;
            console.log(this.imagenUrl);
          } else {
          this.imagenUrl = '../../../../assets/img/no-hay-foto.jpg';
          }
        },
        (error) => {
          console.error('Error al obtener los datos de la propiedad:', error);
          this.router.navigate(['/admin']);
        }
      );
      
    }

  }
}
