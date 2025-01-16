import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { BienesRaicesBDService } from '../../../core/services/bienes-raices-bd.service';
import { Propiedades } from '../interfaces/propiedades.interfece';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent {
  public propiedadForm = new FormGroup({
    titulo: new FormControl<string>('', { nonNullable: true }),
    precio: new FormControl<number>(1),
    descripcion: new FormControl<string>('prueba auto', { nonNullable: true }),
    habitaciones: new FormControl<number>(1, { nonNullable: true }),
    banio: new FormControl<number>(1, { nonNullable: true }),
    estacionamiento: new FormControl<number>(1, { nonNullable: true }),
    imagen: new FormControl<string>(''),
  });

  previewUrl: SafeUrl | null = null;
  selectedFile: File | null = null;
  imagenError: string | null = null;

  constructor(
    private bienesRaicesBDService: BienesRaicesBDService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  get currentPropiedad(): Propiedades {
    const proiedad = this.propiedadForm.value as Propiedades;
    return proiedad;

  }

  ngOnInit(): void {
    if(!this.router.url.includes('editar') ) return;

    this.activatedRoute.params
    .pipe(
      switchMap( ({id}) => this.bienesRaicesBDService.getDataByid(id) )
    ).subscribe( propiedad => {
      if(!propiedad){
        return this.router.navigateByUrl('/');
      }
      const propiedadConImagenAjustada = {
        ...propiedad,
        imagen: propiedad.imagen ? 
          (Array.isArray(propiedad.imagen) ? propiedad.imagen[0] : 
           typeof propiedad.imagen === 'object' ? propiedad.imagen : 
           propiedad.imagen) : '',
        banio: propiedad.banio || 1
      };

      console.log('Propiedad ajustada:', propiedadConImagenAjustada);
      this.propiedadForm.reset(propiedadConImagenAjustada);
      return;
    })
  }

  onSubmit() {
    if (this.propiedadForm.valid && this.selectedFile) {
      this.bienesRaicesBDService.uploadPropiedadImage(this.selectedFile)
        .subscribe({
          next: (response: any) => {
            console.log('Imagen subida exitosamente:', response);
            
            const fileName = response.secureUrl;
            
            const nuevaPropiedad: Propiedades = {
              titulo: this.propiedadForm.value.titulo!,
              precio: Number(this.propiedadForm.value.precio),
              descripcion: this.propiedadForm.value.descripcion!,
              habitaciones: Number(this.propiedadForm.value.habitaciones),
              banio: Number(this.propiedadForm.value.banio),
              estacionamiento: Number(this.propiedadForm.value.estacionamiento),
              imagen: [fileName]
            };

            console.log('Nueva propiedad a crear:', nuevaPropiedad);
            // Ahora sí creamos la propiedad con los datos correctos
            this.bienesRaicesBDService.createPropiedad(nuevaPropiedad)
              .subscribe({
                next: (response) => {
                  console.log('Propiedad creada exitosamente:', response);
                  // Aquí podrías agregar redirección o mensaje de éxito
                },
                error: (error) => {
                  console.error('Error al crear la propiedad:', error);
                  if (error.error?.message) {
                    console.log('Errores de validación:', error.error.message);
                  }
                }
              });
          },
          error: (error) => {
            console.error('Error al subir la imagen:', error);
            this.imagenError = 'Error al subir la imagen';
          }
        });
    } else {
      console.log('Formulario inválido:', {
        formIsValid: this.propiedadForm.valid,
        formErrors: this.propiedadForm.errors,
        formValues: this.propiedadForm.value,
        hasImage: !!this.selectedFile
      });
    }
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files) {
      this.selectedFile = fileInput.files[0];

      // Verificar el tamaño del archivo
      const medida = 1000 * 1000; // = 1mb
      if (this.selectedFile.size > medida) {
        this.imagenError = 'Imagen demasiado grande';
        this.selectedFile = null;
        this.previewUrl = null;
        return;
      }

      // Solo creamos la preview, pero no subimos la imagen todavía
      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(this.selectedFile)
      );
    } else {
      this.imagenError = 'Debes seleccionar una imagen';
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }
}
