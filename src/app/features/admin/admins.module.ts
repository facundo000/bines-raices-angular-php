import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminsRoutingModule } from './admins-routing.module';
import { AdminComponent } from './admin.component';
import { ActualizarComponent } from './actualizar/actualizar.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminComponent,
    ActualizarComponent
  ],
  imports: [
    CommonModule,
    AdminsRoutingModule,
    ReactiveFormsModule
  ]
})
export class AdminsModule { }
