import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})


export class CategoryComponent implements OnInit{ //OnInit ahora se implementa manualmente si tienes angular 16 o superior

    //Inyectando dependencia de servicio al componente mediante variable privada
    private categoryService= inject(CategoryService);
    public dialog= inject(MatDialog);
    private snackBar = inject(MatSnackBar);

  ngOnInit(): void { //ngOnInit es parte del ciclo de vida de un componente, sin embargo hay mas como cuando se destruye o se crea
    this.getCategories(); //Cuando se carga el componente se llamará al método getCategories
  }

  displayedColumns: string[]=['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator
  //* OBTENER TODAS LAS CATEGORÍAS */
  getCategories():void{
    this.categoryService.getCategories()
      .subscribe((data:any) => {

        console.log("respuesta categories: ", data);
        this.processCategoriesResponse(data);

      }, (error: any) => {
        console.log("error: ", error);
      })
  }

  processCategoriesResponse(resp: any){
    const dataCategory: CategoryElement[] = [];

    if(resp.metadata[0].code == "00"){

      let listCategory = resp.categoryResponse.category;
      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      this.dataSource.paginator = this.paginator;
    }
  }

  //* ABRIR DIALOGO PARA NUEVA CATEGORÍA */
  openCategoryDialog(){ //Llama a el componente de nueva categoria
    const dialogRef = this.dialog.open(NewCategoryComponent  , {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      //Manejando el código de error que envía el ts de new category en el método onSave()
      if(result == 1){

        this.openSnackBar("Categoría Agregada", "Exitosa"); //Abre un mensaje temporal con el método openSnackBar
        this.getCategories(); //Carga la lista de las categorías actualizadas

      } else if (result==2){

        this.openSnackBar("Se produjo un error al guardar Categoría ", "Error"); //Abre un mensaje temporal con el método openSnackBar
      }
    });
  }

  //* BOTÓN DE EDITAR */
  edit(id: number, name: string, description: string){
    const dialogRef = this.dialog.open(NewCategoryComponent  , {
      width: '450px',
      data: {id: id, name: name, description: description} //Para pasar datos entre componentes (se les llama igual al nombre que tienen en los parámetros del método)
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      //Manejando el código de error que envía el ts de new category en el método onSave()
      if(result == 1){

        this.openSnackBar("Categoría Actualizada", "Exitosa"); //Abre un mensaje temporal con el método openSnackBar
        this.getCategories(); //Carga la lista de las categorías actualizadas

      } else if (result==2){

        this.openSnackBar("Se produjo un error al actualizar Categoría ", "Error"); //Abre un mensaje temporal con el método openSnackBar
      }
    });
  }

    //* BOTÓN DE ELIMINAR */
  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent  , { //Aqui se crea un componente de cuadro de dialogo para confirmacion de delete
      data: {id: id, module: "category"} //Para pasar datos entre componentes (se les llama igual al nombre que tienen en los parámetros del método) //bandera para definir que tipo de modulo se elimina
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      //Manejando el código de error que envía el ts de new category en el método onSave()
      if(result == 1){

        this.openSnackBar("Categoría Eliminada", "Exitosa"); //Abre un mensaje temporal con el método openSnackBar
        this.getCategories(); //Carga la lista de las categorías actualizadas

      } else if (result==2){

        this.openSnackBar("Se produjo un error al eliminar Categoría ", "Error"); //Abre un mensaje temporal con el método openSnackBar
      }
    });
  }

  buscar(termino: string){
    if(termino.length == 0){
      return this.getCategories();
    }else{
      this.categoryService.getCategoryById(termino)
      .subscribe((resp: any)=>{
        this.processCategoriesResponse(resp);
      })
    }
  }

  //* CONSTRUCCIÓN DE MENSAJE TEMPORAL */
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })
  }
}

//Fuera de la clase también se pueden crear interfaces

export interface CategoryElement{
  description: string;
  id: number;
  name: string;
}
