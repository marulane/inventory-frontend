import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { NewProductComponent } from '../new-product/new-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit{
  //Inyectando dependencia de servicio al componente mediante variable privada
  private productService= inject(ProductService);
    public dialog= inject(MatDialog);
    private snackBar = inject(MatSnackBar);
  

  ngOnInit(): void {
    console.log("Hola");
    this.getProducts(); //Cuando se carga el componente se llamará al método getProducts
  }
  displayedColumns: string[] = ['id','name','price','quantity','category','picture', 'actions']; //actions son las acciones de la tabla
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getProducts():void{
    console.log("Hola 2");
    this.productService.getProducts()
      .subscribe( (data:any) => {

        console.log("Respuesta de Productos ", data);
        this.processProductResponse(data);

      }, (error:any) => {

        console.log("Error en Productos ", error);
        
      })
  }

  processProductResponse(resp: any){
    const dateProduct: ProductElement[] = [];
    console.log(resp.data);
    if(resp.metadata[0].code =="00"){
      let listCProduct = resp.product.products;

      listCProduct.forEach((element: ProductElement) =>{
        element.category = element.category.name; //Asignando nombre de categoria desde el modelo
        element.picture = 'data:image/png;base64, '+element.picture; //se necesita el prefijo para procesar la foto como base64
        dateProduct.push(element);
      });

      //seteamos el dataSource
      this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
      this.dataSource.paginator = this.paginator;
    }else{
      console.log(resp.data);
    }
  }
  openProductDialog(){
    const dialogRef = this.dialog.open(NewProductComponent  , {
          width: '450px'
        });
    
        dialogRef.afterClosed().subscribe((result: any) => {
          //Manejando el código de error que envía el ts de new product en el método onSave()
          if(result == 1){
    
            this.openSnackBar("Producto agregado", "Exitoso"); //Abre un mensaje temporal con el método openSnackBar
            this.getProducts(); //Carga la lista de las categorías actualizadas
    
          } else if (result==2){
    
            this.openSnackBar("Se produjo un error al guardar producto ", "Error"); //Abre un mensaje temporal con el método openSnackBar
          }
        });
  }

  //* CONSTRUCCIÓN DE MENSAJE TEMPORAL */
  //Este método se puede mejorar si se agrega a la clase de servicio para que sea un método en común con los demás módulos
    openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar>{
      return this.snackBar.open(message, action, {
        duration: 2000
      })
    }
}

//Fuera de la clase también se pueden crear interfaces
export interface ProductElement{
  //Todos estos nombres son iguales a los del modelo producto en SpringBoot
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: any;
  picture: any;

}

