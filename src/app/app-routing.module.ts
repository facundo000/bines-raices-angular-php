import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './features/inicio/inicio.component';
import { NosotrosComponent } from './features/nosotros/nosotros.component';
import { AnunciosComponent } from './features/anuncios/anuncios.component';
import { AnuncioComponent } from './features/anuncio/anuncio.component';
import { BlogComponent } from './features/blog/blog.component';
import { ContactoComponent } from './features/contacto/contacto.component';
import { EntradaComponent } from './features/entrada/entrada.component';
import { AdminComponent } from './features/admin/admin.component';
import { LoginComponent } from './login/login.component';
import { publicGuard, privateGuard } from './core/services/guards/index';

const routes: Routes = [
  { path: 'home', component: InicioComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'anuncios', component: AnunciosComponent },
  { path: 'anuncio', component: AnuncioComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'entrada', component: EntradaComponent },
  { 
    path: 'admin',
    canActivate: [privateGuard],
    loadChildren: () => import('./features/admin/admins.module').then(m => m.AdminsModule) 
  },
  { path: 'contacto', component: ContactoComponent },
  { 
    path: 'acceder',
    // canActivate: [publicGuard],
    component: LoginComponent 
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
