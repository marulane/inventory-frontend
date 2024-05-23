import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})


export class CategoryComponent implements OnInit{ //OnInit ahora se implementa manualmente si tienes angular 16 o superior

    //Inyectando dependencia de servicio al componente mediante variable privada
    private categoryService= inject(CategoryService)

  ngOnInit(): void { //ngOnInit es parte del ciclo de vida de un componente, sin embargo hay mas como cuando se destruye o se crea
    this.getCategories(); //Cuando se carga el componente se llamará al método getCategories
  }

  displayedColumns: string[]=['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();


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
    }
  }
}

//Fuera de la clase también se pueden crear interfaces

export interface CategoryElement{
  description: string;
  id: number;
  name: string;
}
