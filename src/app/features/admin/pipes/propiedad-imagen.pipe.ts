import { Pipe, PipeTransform } from '@angular/core';
import { Propiedades } from '../interfaces/propiedades.interfece';

// import { noImagen } from '../../../../assets/img/no-hay-foto.jpg'

@Pipe({
  name: 'propiedadImagen'  
})
export class PropiedadImagenPipe implements PipeTransform {

  // noImagen : string = '../../../../assets/img/no-hay-foto.jpg';

  transform( propiedad: Propiedades): string {
    
    if( !propiedad.id && !propiedad.imagen ){
      return '../../../../assets/img/no-hay-foto.jpg'
    }

    if(propiedad.imagen) return propiedad.imagen[0];
    
    return ''
  }

}
