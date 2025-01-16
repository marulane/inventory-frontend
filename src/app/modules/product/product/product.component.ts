import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  //Inyectando dependencia de servicio al componente mediante variable privada
  private productService= inject(ProductService);

  ngOnInit(): void {
    this.getProducts(); //Cuando se carga el componente se llamará al método getProducts
  }
  displayedColumns: string[] = ['id','name','price','account','category','picture', 'actions']; //actions son las acciones de la tabla
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator

  getProducts(){
    this.productService.getProducts()
      .subscribe( (data:any) => {

        console.log("Respuesta de Productos ", data)
        this.processProductResponse(data)

      }, (error:any) => {

        console.log("Error en Productos ", error)
        
      })
  }

  processProductResponse(resp: any){
    const dateProduct: ProductElement[] = [];
    if(resp.metadata[0].code =="00"){
      let listCProduct = resp.product.products;

      listCProduct.forEach((element: ProductElement) =>{
        element.category = element.category.name; //Asignando nombre de categoria desde el modelo
        element.picture = 'data:image/jpeg;base64, '+element.picture; //se necesita el prefijo para procesar la foto como base64
        dateProduct.push(element);
      });

      //seteamos el dataSource
      this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
      this.dataSource.paginator = this.paginator;
    }
  }
}

//Fuera de la clase también se pueden crear interfaces
export interface ProductElement{
  //Todos estos nombres son iguales a los del modelo producto en SpringBoot
  id: number;
  name: string;
  price: number;
  account: number;
  category: any;
  picture: any;

}
