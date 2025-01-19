import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BienesRaicesBDService } from 'src/app/core/services/bienes-raices-bd.service';
import { environment } from 'src/environmet';
import { switchMap } from 'rxjs';
import { Propiedades } from '../admin/interfaces/propiedades.interfece';

@Component({
  selector: 'app-anuncio',
  templateUrl: './anuncio.component.html',
  styleUrls: ['./anuncio.component.scss']
})
export class AnuncioComponent implements OnInit {
  
  propiedad?: Propiedades;
  url = environment.urlImg;

  constructor(
    private activatedRoute: ActivatedRoute,
    private bienesRaicesBDService: BienesRaicesBDService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.bienesRaicesBDService.getDataByid(id))
      )
      .subscribe(propiedad => {
        if(!propiedad) {
          return this.router.navigateByUrl('/anuncios');
        }

        this.propiedad = {
          ...propiedad,
          imagen: propiedad.imagen ? 
            (Array.isArray(propiedad.imagen) ? propiedad.imagen : 
             typeof propiedad.imagen === 'object' ? [propiedad.imagen] : 
             [propiedad.imagen]).map(img => this.processImageUrl(img)) : []
        };
        
        return;
      });
  }

  private processImageUrl(url: string): string {
    try {
      if (url.includes('{')) {
        return url.replace(/[{"}/]/g, '');
      }
      return url;
    } catch (error) {
      console.error('Error procesando URL:', error);
      return '';
    }
  }
}