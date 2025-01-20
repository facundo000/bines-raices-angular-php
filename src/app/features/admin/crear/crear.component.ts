import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { BienesRaicesBDService } from '../../../core/services/bienes-raices-bd.service';
import { Propiedades } from '../interfaces/propiedades.interfece';
import { switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent {
  public propiedadForm = new FormGroup({
    titulo: new FormControl<string>('', { nonNullable: true }),
    precio: new FormControl<number>(0),
    descripcion: new FormControl<string>('', { nonNullable: true }),
    habitaciones: new FormControl<number>(0, { nonNullable: true }),
    banio: new FormControl<number>(0, { nonNullable: true }),
    estacionamiento: new FormControl<number>(0, { nonNullable: true }),
    imagen: new FormControl<string[]>([]),
  });

  previewUrl: SafeUrl | null = null;
  selectedFile: File | null = null;
  imagenError: string | null = null;
  private propiedadId: string | undefined;

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
      
      this.propiedadId = propiedad.id;
      
      const propiedadConImagenAjustada = {
        ...propiedad,
        imagen: propiedad.imagen ? 
          (Array.isArray(propiedad.imagen) ? propiedad.imagen : 
           typeof propiedad.imagen === 'object' ? [propiedad.imagen] : 
           [propiedad.imagen]) : [],
        banio: propiedad.banio || 1
      };

      // Mostrar la imagen existente
      if (propiedadConImagenAjustada.imagen.length > 0) {
          const formateo = propiedadConImagenAjustada.imagen[0].replace(/[{"}/]/g, '');

          this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(
            `${this.bienesRaicesBDService.baseUrl}/api/v1/files/propiedad/${formateo}`
          );        
      }

      // console.log('Propiedad ajustada:', propiedadConImagenAjustada);
      this.propiedadForm.reset(propiedadConImagenAjustada);
      return;
    })
  }

  onSubmit() {
    if (this.propiedadForm.valid) {
      if (this.selectedFile) {
        this.bienesRaicesBDService.uploadPropiedadImage(this.selectedFile)
          .subscribe({
            next: (response: any) => {
              this.procesarFormulario([response.secureUrl]);
            },
            error: (error) => {
              console.error('Error al subir la imagen:', error);
              this.imagenError = 'Error al subir la imagen';
            }
          });
      } else {
        // Si no hay nueva imagen, usamos la imagen existente
        const imagenActual = this.propiedadForm.get('imagen')?.value || [];
        this.procesarFormulario(imagenActual);
      }
    }
  }

  private procesarFormulario(imagenUrl: string[]) {
    const propiedad: Propiedades = {
      titulo: this.propiedadForm.value.titulo || '',
      precio: Number(this.propiedadForm.value.precio),
      habitaciones: Number(this.propiedadForm.value.habitaciones),
      banio: Number(this.propiedadForm.value.banio),
      estacionamiento: Number(this.propiedadForm.value.estacionamiento),
      descripcion: this.propiedadForm.value.descripcion || '',
      imagen: imagenUrl
    };

    if (this.router.url.includes('editar')) {
      // Modo edición
      if (!this.propiedadId) {
        Swal.fire('Error', 'No se encontró el ID de la propiedad', 'error');
        return;
      }

      this.bienesRaicesBDService.updatePropiedades(propiedad, this.propiedadId)
        .subscribe({
          next: (response) => {
            console.log('Propiedad actualizada:', response);
            Swal.fire('Éxito', 'Propiedad actualizada exitosamente', 'success');
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error al actualizar la propiedad:', error);
            Swal.fire('Error', 'Error al actualizar la propiedad', 'error');
          }
        });
    } else {
      // Modo creación
      this.bienesRaicesBDService.createPropiedad(propiedad)
        .subscribe({
          next: (response) => {
            console.log('Propiedad creada exitosamente:', response);
            Swal.fire('Éxito', 'Propiedad creada exitosamente', 'success');
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            console.error('Error al crear la propiedad:', error);
            Swal.fire('Error', 'Error al crear la propiedad', 'error');
          }
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
