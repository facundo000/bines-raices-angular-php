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
    id: new FormControl<string>(''),
    slug: new FormControl<string>(''),
    titulo: new FormControl<string>('', { nonNullable: true }),
    precio: new FormControl<number>(0),
    habitaciones: new FormControl<number>(0, { nonNullable: true }),
    banio: new FormControl<number>(0, { nonNullable: true }),
    estacionamiento: new FormControl(''),
    imagen: new FormControl(''),
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
    if (this.propiedadForm.valid) {
      const formData = this.propiedadForm.value;
      console.log('Formulario completo a enviar:', {
        formIsValid: this.propiedadForm.value,
        formValues: formData,
        imageUrl: formData.imagen
      });

      // Aquí podrías llamar al servicio para crear la propiedad
      this.bienesRaicesBDService.createPropiedad(this.currentPropiedad)
        .subscribe({
          next: (response) => {
            console.log('Propiedad creada exitosamente:', response);
            // Aquí podrías agregar lógica adicional después de crear la propiedad
          },
          error: (error) => {
            console.error('Error al crear la propiedad:', error);
          }
        });
    } else {
      console.log('Formulario inválido:', {
        formIsValid: this.propiedadForm.valid,
        formErrors: this.propiedadForm.errors,
        formValues: this.propiedadForm.value
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

      // Crear preview de la imagen
      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(this.selectedFile)
      );

      // Subir la imagen usando el servicio
      this.uploadImage();
    } else {
      this.imagenError = 'Debes seleccionar una imagen';
      this.selectedFile = null;
      this.previewUrl = null;
    }
  }

  private uploadImage() {
    if (!this.selectedFile) return;

    this.bienesRaicesBDService.uploadPropiedadImage(this.selectedFile)
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta del servidor al subir imagen:', response);
          this.propiedadForm.patchValue({
            imagen: response.url
          });
        },
        error: (error) => {
          console.error('Error al subir la imagen:', error);
          this.imagenError = 'Error al subir la imagen';
        }
      });
  }
}
