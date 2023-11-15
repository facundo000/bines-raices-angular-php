import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GetDataService } from 'src/app/core/services/getData/get-data.service';

interface Propiedad {
  titulo: string;
  precio: number;
  imagen: string;
  descripcion: string;
  habitaciones: number;
  wc: number;
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
  id: string | any;
  vendedores: any;
  imagenUrl: string | null = null;
  selectedFile: File | any;
  imagenError: string | null = null;

  constructor(private http: HttpClient, private getDataService: GetDataService, private router: Router, private route: ActivatedRoute) {
    this.form = new FormGroup({
      'titulo': new FormControl('', Validators.required),
      'precio': new FormControl('', [Validators.required, Validators.minLength(1)]),
      'descripcion': new FormControl('', [Validators.required, Validators.minLength(50)]),
      'habitaciones': new FormControl('', [Validators.required, Validators.min(1)]),
      'wc': new FormControl('', [Validators.required, Validators.min(1)]),
      'estacionamiento': new FormControl('', [Validators.required, Validators.min(1)]),
      'vendedores': new FormControl('', Validators.required)
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
  enviarForm() {
    if(this.form.valid) {
      let formData = new FormData();
        formData.append('titulo', this.form.get('titulo')?.value ?? '');
        formData.append('precio', this.form.get('precio')?.value ? this.form.get('precio')?.value.toString() : '');
        formData.append('descripcion', this.form.get('descripcion')?.value ?? '');
        formData.append('habitaciones', this.form.get('habitaciones')?.value ? this.form.get('habitaciones')?.value.toString() : '');
        formData.append('wc', this.form.get('wc')?.value ? this.form.get('wc')?.value.toString() : '');
        formData.append('estacionamiento', this.form.get('estacionamiento')?.value ? this.form.get('estacionamiento')?.value.toString() : '');
        formData.append('vendedores', this.form.get('vendedores')?.value ? this.form.get('vendedores')?.value.toString() : '');
        formData.append('id', this.id ? this.id.toString() : '');
        
        formData.append('imagen', this.selectedFile);
      this.http.post('http://localhost:3030/updateDatabase.php', formData, {responseType: 'text'})
      .subscribe(
        (response) => {
          console.log('éxito:', response);
          alert('Formulario actualizado con éxito!!'); // muestra un mensaje de éxito
          this.router.navigate(['/admin']); // Me lleva a otra ruta
        },
        (error) => {
          console.log('error:', error);
        }
      );

    } else {
      // if (!this.selectedFile) {
      //     this.imagenError = 'Debes seleccionar una imagen';
      // }
      if (!this.form.valid) {
          alert('Falta completar el formulario');
      }
    }
  }
  // Obtener datos de vendedores
  ngOnInit(): void {
    this.getDataService.getVendedores().subscribe(data => {
      this.vendedores = data;
    });

    this.id = this.route.snapshot.paramMap.get('id');
    // console.log('id: ' + this.id);

    this.http.get(`http://localhost:3031/getData.php?id=${this.id}`).subscribe(
      (response) => {
        
        // console.log(response);
        const propiedad = response as Propiedad;

        if(propiedad.imagen) {
            this.imagenUrl = 'http://localhost:3031/imagenes/' + propiedad.imagen;
            // console.log('imagen/' + propiedad.imagen);
        } else {
          this.imagenUrl = '../../../../assets/img/no-hay-foto.jpg';
        }
        this.form.patchValue({
          'titulo': propiedad.titulo,
          'precio': propiedad.precio,
          'descripcion': propiedad.descripcion,
          'habitaciones': propiedad.habitaciones,
          'wc': propiedad.wc,
          'estacionamiento': propiedad.estacionamiento,
          'vendedores': propiedad.vendedores_id
          
        });
      },
      (error) => {
        this.router.navigate(['/admin']);
      }
    )
  }
}
