import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MaterialModule } from './material.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SidenavComponent
  ],
  exports:[
    SidenavComponent // Para que el componente sea visible desde fuera de la carpeta
  ],
  imports: [
    CommonModule,
    RouterModule, // Para que el ruteo automatico pueda llegar al sidenav
    MaterialModule //Para utilizar todas las dependencias de Angular Material
  ]
})
export class SharedModule { }
