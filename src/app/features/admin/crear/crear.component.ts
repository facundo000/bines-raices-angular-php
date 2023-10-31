import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GetDataService } from 'src/app/core/services/getData/get-data.service';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit {
  form: FormGroup;
  descripcionLength = 0;
  venderdores: any;

  constructor(private http: HttpClient, private getDataService: GetDataService) {
    this.form = new FormGroup({
      'titulo': new FormControl('', Validators.required),
      'precio': new FormControl('', [Validators.required, Validators.minLength(1)]),
      'descripcion': new FormControl('', [Validators.required, Validators.minLength(50)]),
      'habitaciones': new FormControl('', [Validators.required, Validators.min(1)]),
      'wc': new FormControl('', [Validators.required, Validators.min(1)]),
      'estacionamiento': new FormControl('', [Validators.required, Validators.min(1)]),
      'vendedores': new FormControl('', Validators.required)
    });

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

  enviarForm() {
    if(this.form.valid) {
      const formData = new FormData();
      formData.append('titulo', this.form.get('titulo')?.value);
      formData.append('precio', this.form.get('precio')?.value);
      formData.append('descripcion', this.form.get('descripcion')?.value);
      formData.append('habitaciones', this.form.get('habitaciones')?.value);
      formData.append('wc', this.form.get('wc')?.value);
      formData.append('estacionamiento', this.form.get('estacionamiento')?.value);
      formData.append('vendedores', this.form.get('vendedores')?.value);

      this.http.post('http://localhost:3030/database.php', formData, {responseType: 'text'})
      .subscribe(
        (response) => {
          console.log('éxito:', response);
          this.form.reset(); // resetea el formulario
          alert('Formulario enviado con éxito!!'); // muestra un mensaje de éxito
        },
        (error) => {
          console.log('error:', error);
        }
      );

    }else {
      alert('Falta completar el formulario');
    }
  }

  ngOnInit(): void {
    this.getDataService.getVendedores().subscribe(data => {
      this.venderdores = data;
    });
  }
}
