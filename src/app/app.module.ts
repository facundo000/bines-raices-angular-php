import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InicioComponent } from './features/inicio/inicio.component';
import { NosotrosComponent } from './features/nosotros/nosotros.component';
import { AnunciosComponent } from './features/anuncios/anuncios.component';
import { BlogComponent } from './features/blog/blog.component';
import { ContactoComponent } from './features/contacto/contacto.component';

import { HeaderComponent } from './core/shared/header/header.component';
import { FooterComponent } from './core/shared/footer/footer.component';

import { AnuncioComponent } from './features/anuncio/anuncio.component';
import { EntradaComponent } from './features/entrada/entrada.component';
import { CrearComponent } from './features/admin/crear/crear.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    InicioComponent,
    FooterComponent,
    NosotrosComponent,
    AnunciosComponent,
    BlogComponent,
    ContactoComponent,
    AnuncioComponent,
    EntradaComponent,
    CrearComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
