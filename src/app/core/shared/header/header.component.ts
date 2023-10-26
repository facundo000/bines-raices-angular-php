import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DarkmodeService } from '../../services/dark-mode/darkmode.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  // Define un objeto para rastrear los estilos de cada ruta
  pageStyles: { [key: string]: boolean} = {
    isInicioPage: false,
    isAnunciosPage: false
    // Agrega aquí más propiedades para otras rutas
  };
  isVisible = false;
  isDarkMode = false;

  constructor(private router: Router, private darkmodeService: DarkmodeService) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      // Resetea todos los estilos a false
      for (let style in this.pageStyles) {
        this.pageStyles[style] = false;
      }

      // Activa el estilo correspondiente a la ruta actual
      switch (this.router.url) {
        case '/':
          this.pageStyles['isInicioPage'] = true;
          break;
        case '/anuncios':
          this.pageStyles['isAnunciosPage'] = true;
          break;
        // Agrega aquí más casos para otras rutas
      }
    });
    
  }

  //menu responsive
  toggleNav() {
    this.isVisible = !this.isVisible;

    const navegacion = document.querySelector('.navegacion');
    if(this.isVisible) {
      navegacion?.classList.add('mostrar');
    } else {
      navegacion?.classList.remove('mostrar');
    }
  }

  //dark-mode
  darkMode() {
    this.isDarkMode = !this.isDarkMode;

    this.darkmodeService.toggleDarkMode();
  }
}
