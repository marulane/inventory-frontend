import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmComponent } from './components/confirm/confirm.component';



@NgModule({
  declarations: [
    SidenavComponent,
    ConfirmComponent
  ],
  exports:[
    SidenavComponent // Para que el componente sea visible desde fuera de la carpeta
  ],
  imports: [
    CommonModule,
    RouterModule, // Para que el ruteo automatico pueda llegar al sidenav
    MaterialModule, //Para utilizar todas las dependencias de Angular Material
    HttpClientModule //Para utilizar métodos HTTP
  ]
})
export class SharedModule { }
