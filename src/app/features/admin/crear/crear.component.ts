import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BienesRaicesBDService } from '../../../core/services/bienes-raices-bd.service';
import { Propiedades } from '../interfaces/propiedades.interfece';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent {
  public propiedadForm = new FormGroup({
    titulo: new FormControl<string>('', { nonNullable: true }),
    precio: new FormControl<number>(1),
    descripcion: new FormControl<string>('', { nonNullable: true }),
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
    private sanitizer: DomSanitizer
  ) {}

  get currentPropiedad(): Propiedades {
    return this.propiedadForm.value as Propiedades;
  }

  onSubmit() {
    if (this.propiedadForm.valid && this.selectedFile) {
      this.bienesRaicesBDService.uploadPropiedadImage(this.selectedFile)
        .subscribe({
          next: (response: any) => {
            console.log('Imagen subida exitosamente:', response);
            
            // Actualizamos el formulario con la URL de la imagen
            this.propiedadForm.patchValue({
              imagen: response.secureUrl
            });

            // Creamos un objeto nuevo sin el id y slug
            const nuevaPropiedad = {
              titulo: this.propiedadForm.value.titulo!,
              precio: Number(this.propiedadForm.value.precio),
              descripcion: this.propiedadForm.value.descripcion!,
              habitaciones: Number(this.propiedadForm.value.habitaciones),
              banio: Number(this.propiedadForm.value.banio),
              estacionamiento: Number(this.propiedadForm.value.estacionamiento),
              imagen: [this.propiedadForm.value.imagen!]
            };

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
