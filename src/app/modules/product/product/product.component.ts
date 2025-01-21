import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { NewProductComponent } from '../new-product/new-product.component';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';

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
        //element.category = element.category.name; //Asignando nombre de categoria desde el modelo //Se comenta para poder obtener todo el objeto categoria y no solo el nombre
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

    edit(id: number, name: string, price: number, quantity: number, category: any){
      const dialogRef = this.dialog.open(NewProductComponent  , {
        width: '450px', 
        data: {id: id, name: name, price: price, quantity: quantity, category: category} // Para precargar el formulario con informacion de BD
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        //Manejando el código de error que envía el ts de new product en el método onSave()
        if(result == 1){
  
          this.openSnackBar("Producto editado", "Exitoso"); //Abre un mensaje temporal con el método openSnackBar
          this.getProducts(); //Carga la lista de las categorías actualizadas
  
        } else if (result==2){
  
          this.openSnackBar("Se produjo un error al editar producto ", "Error"); //Abre un mensaje temporal con el método openSnackBar
        }
      });
    }

    delete(id: any){
      const dialogRef = this.dialog.open(ConfirmComponent , {
        width: '450px', 
        data: {id: id, module: "product"}
      });
  
      dialogRef.afterClosed().subscribe((result:any) => {
        
        if( result == 1){
          this.openSnackBar("Producto eliminado", "Exitoso");
          this.getProducts();
        } else if (result == 2) {
          this.openSnackBar("Se produjo un error al eliminar producto", "Error");
        }
      });
    }

    buscar(nombre:any){
      if(nombre.length==0){
        return this.getProducts();
      }
      this.productService.getProductByName(nombre)
      .subscribe((resp:any) =>{
        this.processProductResponse(resp);
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

