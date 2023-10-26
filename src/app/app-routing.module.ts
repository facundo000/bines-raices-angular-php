import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './features/inicio/inicio.component';
import { NosotrosComponent } from './features/nosotros/nosotros.component';
import { AnunciosComponent } from './features/anuncios/anuncios.component';
import { AnuncioComponent } from './features/anuncio/anuncio.component';
import { BlogComponent } from './features/blog/blog.component';
import { ContactoComponent } from './features/contacto/contacto.component';
import { EntradaComponent } from './features/entrada/entrada.component';

const routes: Routes = [
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'anuncios', component: AnunciosComponent },
  { path: 'anuncio', component: AnuncioComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'entrada', component: EntradaComponent },
  { path: 'admin', loadChildren: () => import('./features/admin/admins.module').then(m => m.AdminsModule) },
  { path: 'contacto', component: ContactoComponent },
  { path: '**', component: InicioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
